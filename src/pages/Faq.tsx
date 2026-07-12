import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type QA = { q: string; a: string };
type FaqSection = { title: string; items: QA[] };

const sections: FaqSection[] = [
  {
    title: "Blankets",
    items: [
      {
        q: "How do I care for my Key of Hearts blanket?",
        a: "Machine wash cold, gentle cycle. Tumble dry low or lay flat to dry. Do not iron directly over the QR codes. With proper care your blanket will stay soft and beautiful for years.",
      },
      {
        q: "Will the QR codes still work after washing?",
        a: "Your blanket includes four QR codes — one in each corner — so your song stays scannable even with regular use. Over time, repeated washing may gradually affect print quality. Your Keepsake Card holds the same QR code on archival-quality card stock and never washes away. Your song lives at a permanent URL — it does not expire.",
      },
      {
        q: "Will the colors fade over time?",
        a: "Sublimation printing is designed to be colorfast and durable. Washing in cold water and avoiding high heat will keep your blanket looking its best. Some natural softening of colors may occur with heavy use over many years — this is normal for any sublimated textile.",
      },
    ],
  },
  {
    title: "Jewelry",
    items: [
      {
        q: "How do I care for my Key of Hearts jewelry?",
        a: "Store your piece in the included pouch or a soft cloth when not wearing it. Avoid prolonged exposure to water, lotions, perfumes, and harsh chemicals. Remove before swimming or showering. With proper care your piece will stay beautiful for years.",
      },
      {
        q: "Will my jewelry tarnish or discolor?",
        a: "Our silver-finish pieces are made with durable stainless steel and are designed to resist tarnishing under normal wear conditions. Exposure to harsh chemicals, saltwater, chlorine, or extended moisture can affect any metal finish over time. Following our care instructions will keep your piece looking its best.",
      },
      {
        q: "What if my jewelry arrives damaged?",
        a: "If your piece arrives damaged or defective, please contact hello@keyofhearts.com within 30 days of delivery with a photo. We will make it right.",
      },
    ],
  },
  {
    title: "Orders & Delivery",
    items: [
      {
        q: "When will my order arrive?",
        a: "Digital downloads are delivered instantly after checkout. Physical products ship within 5-7 business days. Preserve orders ship within 5-7 business days — your QR code activates within 48 business hours of your audio being received and approved.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Because every Key of Hearts is made to order and production begins immediately, we are unable to cancel or modify orders once placed. Please review your order carefully before checkout.",
      },
      {
        q: "What if I am not happy with my Story song?",
        a: "You can regenerate it for free, as many times as you'd like, within 30 days of purchase — just use the link in your delivery email. After 30 days, reach out to hello@keyofhearts.com and we'll help.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes. US shipping is always free. International shipping is calculated at checkout based on your destination — typically $18-45. The exact amount is displayed before payment is collected.",
      },
    ],
  },
  {
    title: "The Key",
    items: [
      {
        q: "What is a Key of Hearts?",
        a: "A Key of Hearts is a personalized gift with a song, a voice, or a story preserved behind a QR code — printed on something they will hold forever. Scan the QR code to hear it anytime, anywhere.",
      },
      {
        q: "Does the QR code ever expire?",
        a: "Never. Your song lives at a permanent URL. It does not expire, and it does not require an app to scan.",
      },
      {
        q: "What is the difference between Story, Voice, and Memory?",
        a: "Story is an original song written for your occasion from what you share about them — words, moments, the little details that make them who they are. Voice takes your own audio recording — a message, a laugh, a lullaby — and wraps it in an original instrumental score composed for your moment. Memory does the same with your own video. No one else has your Key. No one ever will.",
      },
    ],
  },
];

const Faq = () => {
  return (
    <main className="min-h-screen bg-cream text-navy">
      <Navigation />

      {/* Header */}
      <section className="bg-navy text-cream pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-30 pointer-events-none" />
        <div className="container relative text-center max-w-3xl mx-auto space-y-5">
          <p className="label-eyebrow text-gold">Support</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream text-balance leading-[1.05]">
            Frequently asked questions
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-cream/75">
            Everything you need to know — and how to reach us if you don't.
          </p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container max-w-3xl space-y-16 md:space-y-20">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="label-eyebrow text-gold mb-3">{section.title}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-navy mb-8">
                {section.title}
              </h2>
              <Accordion
                type="single"
                collapsible
                className="border-t border-navy/10"
              >
                {section.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${section.title}-${i}`}
                    className="border-b border-navy/10"
                  >
                    <AccordionTrigger className="font-serif text-lg md:text-xl text-navy text-left hover:no-underline py-5 gap-6">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-6 pr-2">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-navy text-cream py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 starfield opacity-25 pointer-events-none" />
        <div className="container relative text-center max-w-2xl space-y-5">
          <p className="label-eyebrow text-gold">Still have a question?</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream text-balance">
            We read every message.
          </h2>
          <p className="font-serif italic text-cream/75">
            <a
              href="mailto:hello@keyofhearts.com"
              className="text-gold hover:text-gold-soft transition-colors"
            >
              hello@keyofhearts.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Faq;
