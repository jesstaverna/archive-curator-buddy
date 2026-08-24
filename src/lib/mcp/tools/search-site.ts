import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SITE_PAGES, pageUrl } from "../site-data";

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default defineTool({
  name: "search_site",
  title: "Buscar páginas por assunto",
  description:
    "Busca páginas do site do IPMCONT por palavra-chave em títulos, descrições e tópicos, retornando as mais relevantes.",
  inputSchema: {
    query: z.string().trim().min(2).describe("Termo de busca, ex.: 'cursos', 'associação', 'história'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const results = SITE_PAGES.map((page) => {
      const haystack = normalize(
        [page.title, page.description, page.topics.join(" "), page.slug].join(" "),
      );
      const score = terms.reduce((sum, term) => (haystack.includes(term) ? sum + 1 : sum), 0);
      return { page, score };
    })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ page, score }) => ({
        slug: page.slug,
        title: page.title,
        description: page.description,
        url: pageUrl(page),
        score,
      }));

    return {
      content: [
        {
          type: "text",
          text: results.length
            ? JSON.stringify(results, null, 2)
            : `Nenhuma página encontrada para "${query}".`,
        },
      ],
      structuredContent: { results },
    };
  },
});
