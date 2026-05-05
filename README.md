# dissolve-react

A WebGL-powered dissolve animation component for React. Wraps any element and dissolves it with a Perlin noise-based particle effect.

## Install

```bash
npm install dissolve-react
# or
yarn add dissolve-react
# or
pnpm add dissolve-react
# or
bun add dissolve-react
```

## Usage

```tsx
import { useRef } from "react";
import { Dissolve, type DissolveHandle } from "dissolve-react";

function App() {
  const ref = useRef<DissolveHandle>(null);

  return (
    <>
      <Dissolve ref={ref} onComplete={() => console.log("done!")}>
        <div>This will dissolve</div>
      </Dissolve>
      <button onClick={() => ref.current?.dissolve()}>Dissolve</button>
      <button onClick={() => ref.current?.reset()}>Reset</button>
    </>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Content to wrap |
| `onComplete` | `() => void` | Called when the dissolve animation finishes |
| `settings` | `Partial<DissolveSettings>` | Override default animation settings |
| `className` | `string` | Class name for the wrapper div |
| `style` | `CSSProperties` | Inline styles for the wrapper div |

## Ref Handle (`DissolveHandle`)

| Method / Property | Type | Description |
|-------------------|------|-------------|
| `dissolve()` | `() => void` | Start the dissolve animation |
| `reset()` | `() => void` | Reset to original state |
| `isAnimating` | `boolean` | Whether animation is in progress |
| `isVisible` | `boolean` | Whether the content is visible |

## Settings

Pass a partial `DissolveSettings` object to customize the animation:

```tsx
<Dissolve settings={{ duration: 2000, maxDisplacement: 5.0 }}>
  <div>Custom dissolve</div>
</Dissolve>
```

| Setting | Default | Description |
|---------|---------|-------------|
| `duration` | `1150` | Animation duration in ms |
| `maxDisplacement` | `3.2` | How far pixels scatter (UV space) |
| `bigNoiseFreq` | `0.004` | Scale of turbulence patterns |
| `bigNoiseSlope` | `5.0` | Contrast of big noise |
| `bigNoiseIntercept` | `-2.0` | Component transfer intercept |
| `fineNoiseFreq` | `2.7` | Detail grain frequency |
| `noiseMix` | `0.55` | 0 = only big noise, 1 = only fine noise |
| `opacityFadeStart` | `0.1` | Progress [0..1] at which opacity starts fading |
| `easingPower` | `2.0` | Easing exponent (1 = linear) |
| `endScale` | `1.05` | Scale at end (1.0 = no scale) |

## Peer Dependencies

- `react` >= 17
- `react-dom` >= 17

## License

MIT
