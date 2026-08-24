import { defineTool } from "@lovable.dev/mcp-js";
import { ORGANIZATION } from "../site-data";

export default defineTool({
  name: "get_organization_info",
  title: "Dados institucionais e de contato",
  description:
    "Retorna os dados institucionais do IPMCONT: nome, ano de fundação, e-mail, telefone, localização, horário de atendimento e link de associação.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(ORGANIZATION, null, 2) }],
      structuredContent: { organization: ORGANIZATION },
    };
  },
});
