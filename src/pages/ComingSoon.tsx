import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: insertError } = await supabase
      .from("waitlist_emails")
      .insert({ email: trimmed });
    setLoading(false);
    if (insertError) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <main
      className="min-h-dvh w-full flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: "#1A2744" }}
    >
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <h1
          className="font-serif font-semibold leading-none tracking-tight text-[3.25rem] sm:text-6xl md:text-7xl"
          style={{ color: "#C9A84C" }}
        >
          Key of Hearts
        </h1>

        <p
          className="font-serif italic mt-6 text-lg sm:text-xl"
          style={{ color: "#FFFEF7" }}
        >
          Something worth keeping.
        </p>

        <div className="w-full mt-12">
          {submitted ? (
            <p
              className="font-serif italic text-lg"
              style={{ color: "#FFFEF7" }}
            >
              We'll see you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Your email address"
                className="w-full h-12 px-4 rounded-full font-serif text-base outline-none focus:ring-2 focus:ring-[#C9A84C]"
                style={{ backgroundColor: "#FFFEF7", color: "#1A2744" }}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full font-serif text-base font-semibold transition-opacity disabled:opacity-60"
                style={{ backgroundColor: "#C9A84C", color: "#1A2744" }}
              >
                {loading ? "Sending…" : "Be the first to know"}
              </button>
              {error && (
                <p
                  className="font-serif text-sm mt-1"
                  style={{ color: "#FFFEF7" }}
                >
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        <p
          className="font-serif text-xs sm:text-sm mt-12 tracking-wide"
          style={{ color: "rgba(255, 254, 247, 0.4)" }}
        >
          Launching soon · keyofhearts.com
        </p>
      </div>
    </main>
  );
};

export default ComingSoon;
