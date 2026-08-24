import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SITE_PAGES, pageUrl } from "../site-data";

function htmlToText(html: string): string {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  return main
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default defineTool({
  name: "get_page_content",
  title: "Ler conteúdo de uma página",
  description:
    "Retorna o texto principal de uma página pública do site do IPMCONT, identificada pelo slug (ex.: sobre, beneficios, contato).",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Slug da página, conforme retornado por list_pages."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const page = SITE_PAGES.find((p) => p.slug === slug.toLowerCase());
    if (!page) {
      throw new ToolError(
        `Página "${slug}" não encontrada. Slugs válidos: ${SITE_PAGES.map((p) => p.slug).join(", ")}.`,
      );
    }
    const url = pageUrl(page);
    const res = await fetch(url, { headers: { accept: "text/html" } });
    if (!res.ok) {
      throw new ToolError(`Não foi possível carregar ${url} (HTTP ${res.status}).`);
    }
    const text = htmlToText(await res.text()).slice(0, 20000);
    return {
      content: [{ type: "text", text }],
      structuredContent: { slug: page.slug, title: page.title, url, text },
    };
  },
});
