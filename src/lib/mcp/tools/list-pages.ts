import { defineTool } from "@lovable.dev/mcp-js";
import { SITE_PAGES, pageUrl } from "../site-data";

export default defineTool({
  name: "list_pages",
  title: "Listar páginas do site",
  description: "Lista todas as páginas públicas do site do IPMCONT com título, descrição e URL.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const pages = SITE_PAGES.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      url: pageUrl(p),
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(pages, null, 2) }],
      structuredContent: { pages },
    };
  },
});
