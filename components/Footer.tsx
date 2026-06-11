export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-shiro/95 px-6 pt-16 pb-10 text-sumi">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div className="space-y-4">
          <p className="font-display text-2xl uppercase tracking-[0.25em] text-sumi">KATACHI</p>
          <p className="max-w-sm text-sm leading-7 text-sumi/80">
            A quiet Japanese-inspired homeware label for considered interiors, made with calm precision and natural materiality.
          </p>
        </div>

        <div className="space-y-4">
          <p className="font-display text-sm uppercase tracking-[0.25em] text-sumi/90">Navigation</p>
          <ul className="space-y-3 text-sm leading-7 text-sumi/80">
            <li><a href="/collectie" className="transition hover:text-mori">Collection</a></li>
            <li><a href="/filosofie" className="transition hover:text-mori">Philosophy</a></li>
            <li><a href="/journal" className="transition hover:text-mori">Journal</a></li>
            <li><a href="/contact" className="transition hover:text-mori">Contact</a></li>
          </ul>
          <ul className="space-y-3 pt-2 text-sm leading-7 text-sumi/60">
            <li><a href="/verzending-retour" className="transition hover:text-mori">Shipping &amp; Returns</a></li>
            <li><a href="/privacy" className="transition hover:text-mori">Privacy Policy</a></li>
            <li><a href="/voorwaarden" className="transition hover:text-mori">Terms &amp; Conditions</a></li>
          </ul>
        </div>

        <div className="space-y-4 text-sm leading-7 text-sumi/80">
          <p className="font-display text-sm uppercase tracking-[0.25em] text-sumi/90">Contact</p>
          <p>hello@KATACHI.store</p>
          <p>Prinsengracht 245</p>
          <p>Amsterdam, NL</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-200/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(44,44,44,0.35)",
          }}
        >
          PayPal · iDEAL · Bancontact · Visa · Mastercard
        </p>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "rgba(44,44,44,0.3)",
          }}
        >
          © {new Date().getFullYear()} KATACHI
        </p>
      </div>
    </footer>
  );
}
