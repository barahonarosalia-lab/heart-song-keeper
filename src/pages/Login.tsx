import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function sanitizeNext(raw: string | null): string {
  if (!raw) return "/";
  // Same-origin relative path only.
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export default function Login() {
  const [params] = useSearchParams();
  const next = sanitizeNext(params.get("next"));
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    // If already signed in, honour `next`.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace(next);
    });
  }, [next]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.replace(next);
      } else {
        const emailRedirectTo = window.location.origin + next;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo },
        });
        if (error) throw error;
        setInfo("Check your email to confirm your account, then return to this page.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/login?next=" + encodeURIComponent(next),
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      window.location.replace(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-card border border-gold/20 rounded-2xl shadow-card p-8 space-y-6">
        <div className="text-center">
          <p className="label-eyebrow text-gold mb-3">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </p>
          <h1 className="font-serif text-3xl text-navy leading-tight">
            Key of Hearts
          </h1>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          disabled={busy}
          onClick={handleGoogle}
        >
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-xs text-navy/40 uppercase tracking-wider">
          <div className="flex-1 h-px bg-gold/20" />
          or
          <div className="flex-1 h-px bg-gold/20" />
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-rose">{error}</p>}
          {info && <p className="text-sm text-navy/70">{info}</p>}
          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full font-serif"
            disabled={busy}
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-navy/60">
          {mode === "signin" ? "New to Key of Hearts?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-gold hover:underline"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setInfo(null);
            }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}
