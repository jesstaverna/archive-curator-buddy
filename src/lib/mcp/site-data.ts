export interface SitePage {
  slug: string;
  path: string;
  title: string;
  description: string;
  topics: string[];
}

export const SITE_BASE_URL = "https://archive-curator-buddy.lovable.app";

export const SITE_PAGES: SitePage[] = [
  {
    slug: "home",
    path: "/index.html",
    title: "IPMCONT — Instituto Paranaense da Mulher Contabilista",
    description:
      "Networking, cursos, eventos e desenvolvimento profissional para mulheres contabilistas no Paraná há mais de 20 anos.",
    topics: ["instituto", "home", "apresentação", "podcast", "parceiros"],
  },
  {
    slug: "sobre",
    path: "/sobre.html",
    title: "Sobre o IPMCONT | Mulheres na Contabilidade no Paraná",
    description:
      "História, missão, visão e valores do IPMCONT, fundado em 2005, com linha do tempo institucional e protagonismo feminino na contabilidade.",
    topics: ["história", "missão", "visão", "valores", "linha do tempo", "fundação"],
  },
  {
    slug: "beneficios",
    path: "/beneficios.html",
    title: "Benefícios de ser associada ao IPMCONT",
    description:
      "Networking estratégico, cursos, eventos, mentorias e desenvolvimento profissional exclusivos para associadas.",
    topics: ["benefícios", "associação", "mentoria", "networking"],
  },
  {
    slug: "cursos-eventos",
    path: "/cursos-eventos.html",
    title: "Cursos, palestras e eventos para mulheres contabilistas",
    description:
      "Agenda de cursos, palestras, encontros e eventos do IPMCONT em Curitiba e em todo o Paraná, além das iniciativas do instituto.",
    topics: ["cursos", "eventos", "palestras", "agenda", "iniciativas"],
  },
  {
    slug: "noticias",
    path: "/noticias.html",
    title: "Notícias e conteúdos sobre contabilidade feminina",
    description:
      "Artigos, notícias e conteúdos editoriais sobre carreira, liderança e o universo da mulher contabilista no Paraná.",
    topics: ["notícias", "artigos", "blog", "conteúdo"],
  },
  {
    slug: "associadas",
    path: "/associadas.html",
    title: "Conheça as associadas do IPMCONT",
    description:
      "Rede de contadoras, auditoras, consultoras fiscais, tributaristas e empresárias contábeis associadas ao instituto.",
    topics: ["associadas", "rede", "membros", "comunidade"],
  },
  {
    slug: "contato",
    path: "/contato.html",
    title: "Entre em contato com o IPMCONT",
    description:
      "Canais de atendimento para associação, cursos, parcerias e imprensa, com formulário, FAQ e localização.",
    topics: ["contato", "associe-se", "faq", "imprensa", "parcerias"],
  },
];

export const ORGANIZATION = {
  name: "IPMCONT — Instituto Paranaense da Mulher Contabilista",
  shortName: "IPMCONT",
  foundedYear: 2005,
  description:
    "Instituto que conecta, capacita e impulsiona mulheres contabilistas no Paraná por meio de networking, eventos, cursos e desenvolvimento profissional.",
  email: "presidente@ipmcont.com.br",
  phone: "41 2018-2090",
  location: "Curitiba, Paraná — Brasil",
  hours: "Segunda a sexta-feira, em horário comercial",
  website: SITE_BASE_URL,
  joinUrl: `${SITE_BASE_URL}/contato.html#associar`,
};

export function pageUrl(page: SitePage): string {
  return `${SITE_BASE_URL}${page.path}`;
}
