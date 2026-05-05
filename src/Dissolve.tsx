"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useEffect,
  useState,
} from "react";

export interface DissolveHandle {
  reset: () => void;
  dissolve: () => void;
  isAnimating: boolean;
  isVisible: boolean;
}

export interface DissolveSettings {
  /** Animation duration in ms */
  duration: number;
  /** Max displacement in UV space (higher = pixels scatter further) */
  maxDisplacement: number;
  /** Big noise frequency — controls scale of turbulence patterns */
  bigNoiseFreq: number;
  /** Component transfer slope — contrast of big noise */
  bigNoiseSlope: number;
  /** Component transfer intercept */
  bigNoiseIntercept: number;
  /** Fine noise frequency — controls detail grain */
  fineNoiseFreq: number;
  /** Mix ratio: 0 = only big noise, 1 = only fine noise */
  noiseMix: number;
  /** Progress value [0..1] at which opacity starts fading */
  opacityFadeStart: number;
  /** Easing exponent (1 = linear, 3 = ease-out cubic) */
  easingPower: number;
  /** Scale factor at end of animation (1.0 = no scale, 1.1 = 10% larger) */
  endScale: number;
}

export const DEFAULT_SETTINGS: DissolveSettings = {
  duration: 1150,
  maxDisplacement: 3.2,
  bigNoiseFreq: 0.004,
  bigNoiseSlope: 5.0,
  bigNoiseIntercept: -2.0,
  fineNoiseFreq: 2.7,
  noiseMix: 0.55,
  opacityFadeStart: 0.1,
  easingPower: 2.0,
  endScale: 1.05,
};

export interface DissolveProps {
  children: React.ReactNode;
  onComplete?: () => void;
  settings?: Partial<DissolveSettings>;
  className?: string;
  style?: React.CSSProperties;
}

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;
varying vec2 v_texCoord;
uniform sampler2D u_image;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_seed;
uniform vec4 u_elementRect;

// Tunable uniforms
uniform float u_maxDisplacement;
uniform float u_bigNoiseFreq;
uniform float u_bigNoiseSlope;
uniform float u_bigNoiseIntercept;
uniform float u_fineNoiseFreq;
uniform float u_noiseMix;
uniform float u_opacityFadeStart;
uniform float u_easingPower;
uniform float u_endScale;

// ---- Perlin noise ----
vec2 fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float hash2d(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 grad2(vec2 p) {
  float h = hash2d(p + u_seed);
  float angle = h * 6.283185307;
  return vec2(cos(angle), sin(angle));
}

float perlin(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 w = fade(f);

  float n00 = dot(grad2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
  float n10 = dot(grad2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float n01 = dot(grad2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float n11 = dot(grad2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

  return mix(mix(n00, n10, w.x), mix(n01, n11, w.x), w.y) * 0.5 + 0.5;
}

void main() {
  vec2 screenUV = v_texCoord;
  vec2 elemUV = (screenUV - u_elementRect.xy) / u_elementRect.zw;

  // Eased progress
  float p = 1.0 - pow(1.0 - u_progress, u_easingPower);

  // Scale: expand from center as it dissolves
  vec2 center = vec2(0.5, 0.5);
  float scale = 1.0 + (u_endScale - 1.0) * p;
  vec2 scaledUV = center + (elemUV - center) / scale;

  vec2 elemPixel = scaledUV * u_resolution;

  // 1. Big noise
  float bigR = perlin(elemPixel * u_bigNoiseFreq);
  float bigG = perlin(elemPixel * u_bigNoiseFreq + 100.0);

  // 2. Component transfer
  bigR = clamp(bigR * u_bigNoiseSlope + u_bigNoiseIntercept, 0.0, 1.0);
  bigG = clamp(bigG * u_bigNoiseSlope + u_bigNoiseIntercept, 0.0, 1.0);

  // 3. Fine noise
  float fineR = perlin(elemPixel * u_fineNoiseFreq + 300.0);
  float fineG = perlin(elemPixel * u_fineNoiseFreq + 500.0);

  // 4. Merge (u_noiseMix: 0 = all big, 1 = all fine)
  float mR = mix(bigR, fineR, u_noiseMix);
  float mG = mix(bigG, fineG, u_noiseMix);

  // 5. Displacement
  vec2 displacement = (vec2(mR, mG) - 0.5) * p * u_maxDisplacement;
  vec2 sourceUV = scaledUV - displacement;

  if (sourceUV.x < 0.0 || sourceUV.x > 1.0 ||
      sourceUV.y < 0.0 || sourceUV.y > 1.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec4 color = texture2D(u_image, sourceUV);

  // 6. Opacity fade
  float fadeRange = 1.0 - u_opacityFadeStart;
  float opacity = u_progress < u_opacityFadeStart
    ? 1.0
    : 1.0 - (u_progress - u_opacityFadeStart) / fadeRange;
  color.a *= clamp(opacity, 0.0, 1.0);

  gl_FragColor = color;
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createGLProgram(
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

const Dissolve = forwardRef<DissolveHandle, DissolveProps>(
  function Dissolve(
    { children, onComplete, settings: settingsOverride, className, style },
    ref,
  ) {
    const s = { ...DEFAULT_SETTINGS, ...settingsOverride };
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const glResourcesRef = useRef<{
      gl: WebGLRenderingContext;
      program: WebGLProgram;
      texture: WebGLTexture;
      positionBuffer: WebGLBuffer;
      texCoordBuffer: WebGLBuffer;
    } | null>(null);
    const settingsRef = useRef(s);
    settingsRef.current = s;

    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const cleanup = useCallback(() => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (glResourcesRef.current) {
        const { gl, program, texture, positionBuffer, texCoordBuffer } =
          glResourcesRef.current;
        gl.deleteTexture(texture);
        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(texCoordBuffer);
        gl.deleteProgram(program);
        glResourcesRef.current = null;
      }
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
    }, []);

    useEffect(() => () => cleanup(), [cleanup]);

    const dissolve = useCallback(async () => {
      if (!containerRef.current || isAnimating) return;
      setIsAnimating(true);

      const cfg = settingsRef.current;
      const element = containerRef.current;
      const rect = element.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const { toCanvas } = await import("html-to-image");
      const capturedCanvas = await toCanvas(element, {
        pixelRatio: dpr,
        backgroundColor: undefined,
      });

      element.style.visibility = "hidden";

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const canvas = document.createElement("canvas");
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      canvas.style.cssText = `position:fixed;left:0;top:0;width:${vw}px;height:${vh}px;pointer-events:none;z-index:9999`;
      document.body.appendChild(canvas);
      canvasRef.current = canvas;

      const gl = canvas.getContext("webgl", {
        premultipliedAlpha: false,
        alpha: true,
      });
      if (!gl) {
        cleanup();
        setIsAnimating(false);
        setIsVisible(false);
        onComplete?.();
        return;
      }

      const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
      if (!vs || !fs) {
        cleanup();
        setIsAnimating(false);
        setIsVisible(false);
        onComplete?.();
        return;
      }

      const program = createGLProgram(gl, vs, fs);
      if (!program) {
        cleanup();
        setIsAnimating(false);
        setIsVisible(false);
        onComplete?.();
        return;
      }
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.useProgram(program);

      // Quad
      const positionBuffer = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const posLoc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const texCoordBuffer = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
        gl.STATIC_DRAW,
      );
      const texLoc = gl.getAttribLocation(program, "a_texCoord");
      gl.enableVertexAttribArray(texLoc);
      gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

      // Texture
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        capturedCanvas,
      );

      glResourcesRef.current = {
        gl,
        program,
        texture,
        positionBuffer,
        texCoordBuffer,
      };

      // Uniforms
      const loc = (name: string) => gl.getUniformLocation(program, name);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.uniform4f(
        loc("u_elementRect"),
        rect.left / vw,
        rect.top / vh,
        rect.width / vw,
        rect.height / vh,
      );
      gl.uniform2f(loc("u_resolution"), rect.width, rect.height);
      gl.uniform1f(loc("u_seed"), Math.random() * 1000.0);
      gl.uniform1f(loc("u_maxDisplacement"), cfg.maxDisplacement);
      gl.uniform1f(loc("u_bigNoiseFreq"), cfg.bigNoiseFreq);
      gl.uniform1f(loc("u_bigNoiseSlope"), cfg.bigNoiseSlope);
      gl.uniform1f(loc("u_bigNoiseIntercept"), cfg.bigNoiseIntercept);
      gl.uniform1f(loc("u_fineNoiseFreq"), cfg.fineNoiseFreq);
      gl.uniform1f(loc("u_noiseMix"), cfg.noiseMix);
      gl.uniform1f(loc("u_opacityFadeStart"), cfg.opacityFadeStart);
      gl.uniform1f(loc("u_easingPower"), cfg.easingPower);
      gl.uniform1f(loc("u_endScale"), cfg.endScale);

      const progressLoc = loc("u_progress");
      const startTime = performance.now();

      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / cfg.duration, 1.0);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(progressLoc, progress);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (progress < 1.0) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          cleanup();
          setIsAnimating(false);
          setIsVisible(false);
          onComplete?.();
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }, [isAnimating, onComplete, cleanup]);

    const reset = useCallback(() => {
      cleanup();
      setIsAnimating(false);
      setIsVisible(true);
      if (containerRef.current) containerRef.current.style.visibility = "visible";
    }, [cleanup]);

    useImperativeHandle(
      ref,
      () => ({
        reset,
        dissolve,
        get isAnimating() {
          return isAnimating;
        },
        get isVisible() {
          return isVisible;
        },
      }),
      [reset, dissolve, isAnimating, isVisible],
    );

    return (
      <div ref={containerRef} className={className} style={style}>
        {children}
      </div>
    );
  },
);

export default Dissolve;
