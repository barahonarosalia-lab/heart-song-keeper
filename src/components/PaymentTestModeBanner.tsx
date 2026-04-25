const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

export function PaymentTestModeBanner() {
  if (!clientToken?.startsWith("pk_test_")) return null;
  return (
    <div className="w-full bg-gold/20 border-b border-gold/40 px-4 py-2 text-center text-xs md:text-sm text-navy">
      All payments in this preview are in test mode. Use card{" "}
      <span className="font-mono font-medium">4242 4242 4242 4242</span>.{" "}
      <a
        href="https://docs.lovable.dev/features/payments#test-and-live-environments"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium hover:text-gold-deep"
      >
        Read more
      </a>
    </div>
  );
}
