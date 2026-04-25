import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="pt-32 pb-24">
        <section className="container max-w-3xl">
          <p className="label-eyebrow text-gold mb-6">TERMS</p>
          <h1 className="font-serif text-4xl md:text-6xl text-navy mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-navy/50 italic mb-12">
            Last updated: April 25, 2026
          </p>

          <div className="space-y-10 text-navy/80 leading-relaxed">
            <section>
              <h2 className="font-serif text-2xl text-navy mb-3">Overview</h2>
              <p>
                These Terms of Service govern your use of Key of Hearts, a product of
                Life With Art Co. By placing an order, you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-navy mb-3">Orders & Fulfillment</h2>
              <p>
                Every Key of Hearts is made to order and personalized for one person.
                Because production begins immediately after payment, we are unable to offer
                refunds or cancellations once your order is placed.
              </p>
              <p>
                If your order arrives damaged or defective, please contact{" "}
                <a
                  href="mailto:hello@keyofhearts.com"
                  className="text-gold hover:text-gold-deep underline-offset-4 hover:underline"
                >
                  hello@keyofhearts.com
                </a>{" "}
                within 30 days of delivery with a photo of the issue. We will make it right —
                either a replacement or a resolution, at our discretion.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-navy mb-3">Blanket Care & QR Codes</h2>
              <p>
                Your blanket includes four QR codes — one in each corner — so your song
                remains scannable even with regular use and washing. Over time, repeated
                washing may affect print quality, including the QR codes. We recommend
                gentle machine wash, cold water, tumble dry low.
              </p>
              <p>
                Every Key of Hearts order includes a Keepsake Card with your QR code
                printed on archival-quality card stock. Your song is always accessible
                through your card, regardless of blanket wear. The audio behind your Key
                lives at a permanent URL — it does not expire.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-navy mb-3">Audio Upload Terms</h2>
              <p>
                By uploading audio to Key of Hearts, you confirm you have the right to
                use and share this recording. Key of Hearts will use your audio solely
                to fulfill your order.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-navy mb-3">Intellectual Property</h2>
              <p>
                The Key of Hearts brand, design, and original artwork are the property
                of Life With Art Co. Your personalized Key remains yours — made once,
                for one person, forever.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-navy mb-3">Contact</h2>
              <p>
                Questions about these terms? Reach us at{" "}
                <a
                  href="mailto:hello@keyofhearts.com"
                  className="text-gold hover:text-gold-deep underline-offset-4 hover:underline"
                >
                  hello@keyofhearts.com
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
