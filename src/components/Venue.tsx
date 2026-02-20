import { memo, useState, useCallback } from "react";
import { motion } from "motion/react";
import { MapPin, ArrowSquareOut } from "@phosphor-icons/react";

/* ── constants ── */
const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2064.035454362578!2d77.26552669895906!3d28.543937690565414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3df117f72e1%3A0xee9fb8a33afeb4a!2sBanarsidas%20Chandiwala%20Institute%20of%20Information%20Technology%2C%20BCIIT!5e0!3m2!1sen!2sin!4v1771573452352!5m2!1sen!2sin";

const MAP_TITLE =
  "Banarasidas Chandiwala Institute of Information Technology Location";

const DIRECTIONS_URL = "https://maps.google.com/?q=BCIIT+New+Delhi";

/* ── component ── */
const Venue = memo(function Venue() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  return (
    <section aria-label="Venue" className="relative py-24 md:py-32">
      {/* ambient glow — one, subtle, centered */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2
                   -translate-x-1/2 -translate-y-1/2
                   h-[500px] w-[500px] rounded-full opacity-[0.05]
                   bg-[radial-gradient(circle,hsl(var(--primary))_0%,transparent_70%)]"
      />

      <div className="relative z-10 max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* ────────────────────────────── HEADER ── */}
        <motion.div
          className="mb-14 md:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="block mb-5 label-mono text-primary">Venue</span>

          <h2 className="headline-lg font-display text-foreground">
            <span className="text-gradient">Two minutes</span>
            <br />
            from the metro.
          </h2>

          <p className="max-w-lg mt-6 body-text">
            Step out of Govindpuri Metro&nbsp;— Violet Line, Gate&nbsp;1.
            <br className="hidden sm:block" />
            200&nbsp;metres Walk. You've arrived.
          </p>
        </motion.div>

        {/* ────────────────────── JOURNEY · DESKTOP ── */}
        <motion.div
          className="items-center hidden gap-5 mb-12 md:flex"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* metro node */}
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full bg-violet-500
                         shadow-[0_0_12px_rgba(139,92,246,0.5)]"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Govindpuri
              </p>
              <p className="text-xs text-muted-foreground">
                Violet Line · Gate 1
              </p>
            </div>
          </div>

          {/* path */}
          <div className="flex items-center flex-1 gap-3">
            <div className="flex-1 h-px border-t border-dashed border-foreground" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-foreground shrink-0">
              200M WALK
            </span>
            <div className="flex-1 h-px border-t border-dashed border-muted-foreground" />
          </div>

          {/* venue node */}
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full bg-primary
                         shadow-[0_0_12px_rgba(59,130,246,0.5)]"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">BCIIT</p>
              <p className="text-xs text-muted-foreground">
                Chandiwala Estate, New Delhi
              </p>
            </div>
          </div>
        </motion.div>

        {/* ────────────────────── JOURNEY · MOBILE ── */}
        <motion.div
          className="mb-10 md:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* metro stop */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className="h-3 w-3 shrink-0 rounded-full bg-violet-500
                           shadow-[0_0_10px_rgba(139,92,246,0.5)]"
              />
              <div className="flex-1 w-px my-2 border-l border-dashed border-muted-foreground/20" />
            </div>
            <div className="-mt-0.5 pb-2">
              <p className="text-sm font-semibold text-foreground">
                Govindpuri Metro
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Violet Line · Gate 1
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-[0.15em] text-muted-foreground/40">
                200M WALK
              </p>
            </div>
          </div>

          {/* venue stop */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className="h-3 w-3 shrink-0 rounded-full bg-primary
                           shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              />
            </div>
            <div className="-mt-0.5">
              <p className="text-sm font-semibold text-foreground">BCIIT</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Kalkaji, New Delhi
              </p>
            </div>
          </div>
        </motion.div>

        {/* ──────────────────────────────── MAP ── */}
        <motion.div
          className="relative overflow-hidden rounded-2xl ring-1 ring-border"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="relative aspect-[4/3] w-full bg-card sm:aspect-video lg:aspect-[2.2/1]">
            {/* ── loading state ── */}
            {!loaded && !error && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="relative flex items-center justify-center w-10 h-10">
                  <span className="absolute w-full h-full rounded-full animate-ping bg-primary/20" />
                  <MapPin
                    size={20}
                    weight="duotone"
                    className="relative text-primary"
                  />
                </div>
              </div>
            )}

            {/* ── error fallback ── */}
            {error && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 p-6">
                <p className="text-sm text-muted-foreground">
                  Couldn't load the map
                </p>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary
                             underline underline-offset-4 transition-colors hover:text-accent"
                >
                  Open in Google Maps
                  <ArrowSquareOut size={13} weight="bold" />
                </a>
              </div>
            )}

            {/* ── iframe ── */}
            {!error && (
              <iframe
                src={MAP_SRC}
                className={`absolute inset-0 h-full w-full border-0
                            transition-opacity duration-700
                            ${loaded ? "opacity-100" : "opacity-0"}`}
                allow="fullscreen"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={MAP_TITLE}
                onLoad={handleLoad}
                onError={handleError}
              />
            )}
          </div>

          {/* top blend — fades map into the page */}
          <div className="absolute inset-x-0 top-0 z-10 h-20 pointer-events-none bg-gradient-to-b from-background/50 to-transparent" />

          {/* bottom blend — grounds the floating button */}
          <div className="absolute inset-x-0 bottom-0 z-10 h-24 pointer-events-none bg-gradient-to-t from-background/60 to-transparent" />

          {/* directions button */}
          <div className="absolute z-20 bottom-4 right-4">
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary
                         px-5 py-2.5 text-sm font-semibold text-white
                         shadow-glow-blue transition-all duration-300
                         hover:-translate-y-0.5
                         hover:shadow-[0_12px_36px_rgba(59,130,246,0.45)]"
            >
              Get Directions
              <ArrowSquareOut size={14} weight="bold" />
            </a>
          </div>

          {/* inner depth ring */}
          <div
            className="pointer-events-none absolute inset-0 z-20
                       rounded-2xl ring-1 ring-inset ring-white/[0.04]"
          />
        </motion.div>

        {/* ─────────────────────── ADDRESS FOOTER ── */}
        <motion.address
          className="mt-5 not-italic text-[13px] leading-relaxed text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          Banarsidas Chandiwala Institute of Information Technology{" "}
          <span className="mx-1.5 text-border">·</span>
          Chandiwala Estate, Ma Anandmayee Marg, Kalkaji, New Delhi 110020
        </motion.address>
      </div>
    </section>
  );
});

export default Venue;
