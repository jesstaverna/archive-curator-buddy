import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type OAuthDetails = {
  client?: { name?: string; client_name?: string; redirect_uri?: string };
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthDetails | null; error: Error | null }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthDetails | null; error: Error | null }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthDetails | null; error: Error | null }>;
};

function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  head: () => ({
    meta: [
      { title: "Autorizar acesso | IPMCONT" },
      {
        name: "description",
        content: "Autorize um aplicativo externo a acessar as ferramentas do IPMCONT em seu nome.",
      },
      { property: "og:title", content: "Autorizar acesso | IPMCONT" },
      {
        property: "og:description",
        content: "Tela de autorização de aplicativos conectados ao IPMCONT.",
      },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Requisição de autorização inválida.");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login", search: { next: location.pathname + location.searchStr } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    const { data: session } = await supabase.auth.getUser();
    return { details: data, email: session.user?.email ?? null };
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center px-4">
      <p className="max-w-md text-center text-sm text-muted-foreground">
        Não foi possível carregar este pedido de autorização:{" "}
        {String((error as Error)?.message ?? error)}
      </p>
    </main>
  ),
});

function Consent() {
  const { details, email } = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "um aplicativo";
  const scopes = (details?.scope ?? "").split(/\s+/).filter(Boolean);

  const scopeLabel = (scope: string) => {
    if (scope === "openid" || scope === "profile") return "Compartilhar seu perfil básico";
    if (scope === "email") return "Compartilhar seu endereço de e-mail";
    return `Permissão adicional solicitada: ${scope}`;
  };

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const api = oauthApi();
    const { data, error } = approve
      ? await api.approveAuthorization(authorization_id)
      : await api.denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("O servidor de autorização não retornou um endereço de retorno.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">
          Conectar {clientName} ao IPMCONT
        </h1>
        {email && (
          <p className="mt-1 text-sm text-muted-foreground">Conectado como {email}</p>
        )}
        <p className="mt-4 text-sm text-foreground">
          Isso permite que {clientName} use as ferramentas deste app como você.
        </p>
        {details?.client?.redirect_uri && (
          <p className="mt-2 break-all text-xs text-muted-foreground">
            Retorno: {details.client.redirect_uri}
          </p>
        )}

        {scopes.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            {scopes.map((s) => (
              <li key={s}>• {scopeLabel(s)}</li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Isso não ignora as permissões nem as políticas de segurança deste app.
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-2">
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? "Aguarde…" : "Autorizar"}
          </button>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
          >
            Cancelar conexão
          </button>
        </div>
      </div>
    </main>
  );
}
