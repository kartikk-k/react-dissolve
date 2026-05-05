import { CopyIcon } from "./icons";
import { CodeBlock } from "./CodeBlock";

const CODE_EXAMPLE = `import { useRef } from "react";
import { Dissolve, type DissolveHandle } from "dissolve-react";

function App() {
  const ref = useRef<DissolveHandle>(null);

  return (
    <>
      <Dissolve
        ref={ref}
        onComplete={() => console.log("done!")}
        settings={{ duration: 2000 }}
      >
        <div>Your content here</div>
      </Dissolve>

      <button onClick={() => ref.current?.dissolve()}>
        Dissolve
      </button>
      <button onClick={() => ref.current?.reset()}>
        Reset
      </button>
    </>
  );
}`;

const INSTALL_COMMANDS = `# npm
npm install dissolve-react

# yarn
yarn add dissolve-react

# pnpm
pnpm add dissolve-react

# bun
bun add dissolve-react`;

const PROPS_DATA = [
  { name: "children", type: "ReactNode", desc: "The content to wrap" },
  { name: "onComplete", type: "() => void", desc: "Callback fired when animation finishes" },
  { name: "settings", type: "Partial<DissolveSettings>", desc: "Override default animation settings" },
  { name: "className", type: "string", desc: "Class name for the wrapper div" },
  { name: "style", type: "CSSProperties", desc: "Inline styles for the wrapper div" },
  { name: "ref", type: "DissolveHandle", desc: "Imperative handle for controlling the animation" },
];

const SETTINGS_DATA = [
  { name: "duration", type: "number", default: "1150", desc: "Animation duration in milliseconds" },
  { name: "maxDisplacement", type: "number", default: "3.2", desc: "How far pixels scatter in UV space" },
  { name: "bigNoiseFreq", type: "number", default: "0.004", desc: "Scale of turbulence patterns" },
  { name: "bigNoiseSlope", type: "number", default: "5.0", desc: "Contrast of big noise" },
  { name: "bigNoiseIntercept", type: "number", default: "-2.0", desc: "Component transfer intercept" },
  { name: "fineNoiseFreq", type: "number", default: "2.7", desc: "Detail grain frequency" },
  { name: "noiseMix", type: "number", default: "0.55", desc: "0 = only big noise, 1 = only fine noise" },
  { name: "opacityFadeStart", type: "number", default: "0.1", desc: "Progress [0..1] at which opacity starts fading" },
  { name: "easingPower", type: "number", default: "2.0", desc: "Easing exponent (1 = linear)" },
  { name: "endScale", type: "number", default: "1.05", desc: "Scale factor at end of animation" },
];

export async function DocsSection() {
  return (
    <>
      {/* Docs arrow */}
      <div className="flex flex-col items-center gap-[18px] pb-12 sm:pb-20">
        <div className="flex flex-col items-center gap-1 text-black/20">
          <svg width="31" height="39" viewBox="0 0 31 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 28.3643 3.54541)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 24.8184 7.09088)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 21.2725 10.6364)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 17.7275 14.1818)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 14.1816 17.7273)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 10.6367 14.1818)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 7.09082 10.6364)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 3.5459 7.09088)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 0 3.54541)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 28.3643 0)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 24.8184 3.54541)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 21.2725 7.09088)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 17.7275 10.6364)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 14.1816 14.1818)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 10.6367 10.6364)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 7.09082 7.09088)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 3.5459 3.54541)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 0 0)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 28.3643 22.4547)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 24.8184 26.0001)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 21.2725 29.5455)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 17.7275 33.091)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 14.1816 36.6365)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 10.6367 33.091)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 7.09082 29.5455)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 3.5459 26.0001)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 0 22.4547)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 28.3643 18.9092)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 24.8184 22.4547)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 21.2725 26.0001)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 17.7275 29.5455)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 14.1816 33.091)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 10.6367 29.5455)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 7.09082 26.0001)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 3.5459 22.4547)" fill="black" fillOpacity="0.2" />
            <rect width="2.36364" height="2.36364" transform="matrix(0 1 1 1.31134e-07 0 18.9092)" fill="black" fillOpacity="0.2" />
          </svg>
        </div>
        <p className="text-[12px] font-medium text-[#5c5c5c]/50 uppercase tracking-wider">
          DOCS
        </p>
      </div>

      {/* Docs content */}
      <div className="w-full flex flex-col gap-7 pb-20">
        {/* Installation */}
        <div className="flex flex-col gap-[14px]">
          <div className="px-[10px]">
            <p className="text-[16px] font-medium text-[#363636]/80">
              Installation
            </p>
          </div>
          <CodeBlock code={INSTALL_COMMANDS} lang="bash" />
        </div>

        {/* Quick start */}
        <div className="flex flex-col gap-[14px]">
          <div className="flex items-center gap-[7px] px-[10px]">
            <p className="text-[16px] font-medium text-[#363636]/80">
              Quick start
            </p>
            <span className="opacity-40">
              <CopyIcon className="text-[#363636]" />
            </span>
          </div>
          <CodeBlock code={CODE_EXAMPLE} lang="tsx" />
        </div>

        {/* Props */}
        <div className="flex flex-col gap-[14px]">
          <div className="px-[10px]">
            <p className="text-[16px] font-medium text-[#363636]/80">Props</p>
          </div>
          <div className="bg-[#f0f0f0] rounded-[24px] overflow-hidden overflow-x-auto">
            <table className="w-full text-[13px] min-w-[500px]">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="text-left font-medium text-[#5c5c5c]/60 p-4 w-[160px]">
                    Prop
                  </th>
                  <th className="text-left font-medium text-[#5c5c5c]/60 p-4 w-[200px]">
                    Type
                  </th>
                  <th className="text-left font-medium text-[#5c5c5c]/60 p-4">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {PROPS_DATA.map(({ name, type, desc }) => (
                  <tr
                    key={name}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="p-4 font-mono font-medium text-[#363636]/80">
                      {name}
                    </td>
                    <td className="p-4 font-mono text-[#5c5c5c]/70">
                      {type}
                    </td>
                    <td className="p-4 text-[#5c5c5c]/80">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-[14px]">
          <div className="px-[10px]">
            <p className="text-[16px] font-medium text-[#363636]/80">Settings</p>
          </div>
          <div className="bg-[#f0f0f0] rounded-[24px] overflow-hidden overflow-x-auto">
            <table className="w-full text-[13px] min-w-[600px]">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="text-left font-medium text-[#5c5c5c]/60 p-4 w-[160px]">
                    Property
                  </th>
                  <th className="text-left font-medium text-[#5c5c5c]/60 p-4 w-[80px]">
                    Type
                  </th>
                  <th className="text-left font-medium text-[#5c5c5c]/60 p-4 w-[80px]">
                    Default
                  </th>
                  <th className="text-left font-medium text-[#5c5c5c]/60 p-4">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {SETTINGS_DATA.map(({ name, type, default: def, desc }) => (
                  <tr
                    key={name}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="p-4 font-mono font-medium text-[#363636]/80">
                      {name}
                    </td>
                    <td className="p-4 font-mono text-[#5c5c5c]/70">
                      {type}
                    </td>
                    <td className="p-4 font-mono text-[#5c5c5c]/70">
                      {def}
                    </td>
                    <td className="p-4 text-[#5c5c5c]/80">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
