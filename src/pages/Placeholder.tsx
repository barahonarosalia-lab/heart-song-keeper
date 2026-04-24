import { Link } from "react-router-dom";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

interface PlaceholderProps {
  eyebrow: string;
  title: string;
  body?: string;
}

export const Placeholder = ({ eyebrow, title, body }: PlaceholderProps) => (
  <div className="min-h-screen bg-cream flex flex-col">
    <Navigation />
    <main className="flex-1 pt-32 pb-24">
      <section className="container max-w-2xl text-center">
        <p className="label-eyebrow text-gold mb-6">{eyebrow}</p>
        <h1 className="font-serif text-4xl md:text-6xl text-navy mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-navy/70 text-lg italic mb-10">
          {body ?? "We're putting the finishing touches on this page. Check back soon."}
        </p>
        <Button variant="gold" size="lg" asChild>
          <Link to="/">Back home</Link>
        </Button>
      </section>
    </main>
    <Footer />
  </div>
);

export default Placeholder;
