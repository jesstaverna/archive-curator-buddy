import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listPages from "./tools/list-pages";
import getPage from "./tools/get-page";
import searchSite from "./tools/search-site";
import getOrganization from "./tools/get-organization";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "ipmcont-site",
  title: "IPMCONT SITE",
  version: "0.1.0",
  instructions:
    "Ferramentas do site do IPMCONT (Instituto Paranaense da Mulher Contabilista). Use list_pages para descobrir páginas, get_page_content para ler o conteúdo de uma página, search_site para localizar assuntos e get_organization_info para dados institucionais e de contato.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listPages, getPage, searchSite, getOrganization],
});
