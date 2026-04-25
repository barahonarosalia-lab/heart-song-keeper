import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="pt-32 pb-24">
        <section className="container max-w-3xl">
          <p className="label-eyebrow text-gold mb-6">PRIVACY</p>
          <h1 className="font-serif text-4xl md:text-6xl text-navy mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-navy/50 italic mb-12">
            Last updated: April 25, 2026
          </p>

          <div className="space-y-8 text-navy/80 leading-relaxed text-lg">
            <p>
              Key of Hearts collects only the information
              necessary to fulfill your order: your name, email, shipping address,
              and any content you voluntarily provide.
            </p>
            <p>
              We do not sell your data. We do not share your data with third parties
              except as required to fulfill your order.
            </p>
            <p>
              Questions? Reach us at{" "}
              <a
                href="mailto:hello@keyofhearts.com"
                className="text-gold hover:text-gold-deep underline-offset-4 hover:underline"
              >
                hello@keyofhearts.com
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
