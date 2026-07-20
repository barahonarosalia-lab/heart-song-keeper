import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type AuthOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

function oauthClient(): AuthOAuth {
  // The auth.oauth namespace is beta; type it locally.
  return (supabase.auth as unknown as { oauth: AuthOAuth }).oauth;
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Missing authorization_id.");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      try {
        const { data, error } = await oauthClient().getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) return setError(error.message ?? "Could not load authorization.");
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load authorization.");
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    try {
      const { data, error } = approve
        ? await oauthClient().approveAuthorization(authorizationId)
        : await oauthClient().denyAuthorization(authorizationId);
      if (error) {
        setBusy(false);
        return setError(error.message ?? "Could not complete this request.");
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setBusy(false);
        return setError("No redirect returned by the authorization server.");
      }
      window.location.href = target;
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Could not complete this request.");
    }
  }

  if (error) {
    return (
      <main className="min-h-dvh bg-cream flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="label-eyebrow text-gold mb-4">Connection request</p>
          <h1 className="font-serif text-3xl text-navy mb-4">We couldn't load this request</h1>
          <p className="text-navy/70">{error}</p>
        </div>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="min-h-dvh bg-cream flex items-center justify-center">
        <p className="text-navy/60 italic">Loading…</p>
      </main>
    );
  }

  const clientName = details.client?.name ?? "an app";

  return (
    <main className="min-h-dvh bg-cream flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-card border border-gold/20 rounded-2xl shadow-card p-8 space-y-6">
        <div className="text-center">
          <p className="label-eyebrow text-gold mb-3">Connection request</p>
          <h1 className="font-serif text-3xl text-navy leading-tight">
            Connect <span className="italic text-rose">{clientName}</span> to your Key of Hearts account
          </h1>
        </div>
        <p className="text-navy/70 text-sm leading-relaxed text-center">
          {clientName} will be able to call this app's enabled tools while you're signed in.
          This doesn't bypass Key of Hearts's permissions or backend policies.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            variant="gold"
            size="lg"
            className="w-full font-serif"
            disabled={busy}
            onClick={() => decide(true)}
          >
            Approve
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            disabled={busy}
            onClick={() => decide(false)}
          >
            Cancel connection
          </Button>
        </div>
      </div>
    </main>
  );
}
