import { codeToHtml } from "shiki";

export async function CodeBlock({
  code,
  lang,
}: {
  code: string;
  lang: string;
}) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-light",
  });

  return (
    <div
      className="bg-[#f0f0f0] rounded-[24px] overflow-hidden p-4 [&_pre]:!bg-transparent [&_pre]:overflow-x-auto [&_pre]:text-[12px] [&_pre]:sm:text-[14px] [&_pre]:leading-[20px] [&_code]:font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
