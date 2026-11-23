"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  MessageCircle,
  MessageSquareHeart,
  Phone,
  UserRound,
  Users,
} from "lucide-react";
import { wedding } from "@/config/wedding";
import { RSVP_LIMITS, validateRsvp, type RsvpErrors } from "@/lib/rsvp-validation";
import { Reveal } from "./ui/Reveal";
import { Ornament } from "./ui/Ornament";
import { DevBadge } from "./ui/Badges";
import { Curve } from "./ui/Curve";

const fieldBase =
  "w-full rounded-xl border bg-white/70 px-4 py-3.5 font-sans text-[0.95rem] text-ink placeholder:text-muted/70 shadow-[inset_0_1px_2px_rgba(80,55,30,0.06)] outline-none transition focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15";

function buildWhatsAppUrl(
  phone: string,
  data: { name: string; attending: boolean; guests: number; message: string },
) {
  const lines = [
    `Bună! Confirmare prezență nuntă ${wedding.couple.names} (${wedding.date.short}):`,
    `• Nume: ${data.name}`,
    `• Răspuns: ${data.attending ? "Particip" : "Nu particip"}`,
  ];
  if (data.attending) {
    lines.push(`• Număr persoane: ${data.guests}`);
  }
  if (data.message) {
    lines.push(`• Mesaj: ${data.message}`);
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function RSVPForm() {
  const { rsvp } = wedding;
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("1");
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const sendViaWhatsApp = (contact: (typeof rsvp.whatsapp)[number]) => {
    const payload = { name, guests: Number(guests), attending, message };
    const v = validateRsvp(payload);
    if (!v.ok) {
      setErrors(v.errors);
      setSentNotice(null);
      const first = Object.keys(v.errors)[0];
      document.getElementById(`rsvp-${first}`)?.focus();
      return;
    }
    setErrors({});
    const url = buildWhatsAppUrl(contact.phone, v.data);
    window.open(url, "_blank", "noopener,noreferrer");

    // Reset the form immediately so it stays ready for a new confirmation
    setName("");
    setGuests("1");
    setAttending("");
    setMessage("");
    setSentNotice(`Mulțumim, ${v.data.name}! Mesajul către ${contact.name} s-a deschis în WhatsApp.`);
  };

  return (
    <section
      id="rsvp"
      aria-labelledby="rsvp-title"
      className="relative isolate overflow-hidden bg-espresso px-4 py-28 sm:px-8 md:py-36"
    >
      <div className="absolute inset-0 -z-20">
        <Image src={rsvp.background} alt="" fill sizes="100vw" className="scale-105 object-cover blur-[2px]" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_50%_50%,rgba(26,18,13,0.35),rgba(20,13,9,0.88))]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ivory/0 via-transparent to-espresso" />
      <Curve fill="var(--color-ivory-2)" position="top" />

      <Reveal className="mx-auto max-w-2xl">
        <div className="relative rounded-[28px] border border-gold/40 bg-[linear-gradient(160deg,#fffaf2_0%,#f6eddd_55%,#efe2c9_100%)] px-6 py-12 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.8)] sm:px-12 sm:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-gold/25" />

          <div className="relative text-center">
            <p className="eyebrow text-gold-deep">RSVP · WhatsApp</p>
            <h2 id="rsvp-title" className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
              {rsvp.title}
            </h2>
            <Ornament className="mx-auto mt-4" />
            <p className="mx-auto mt-5 max-w-md font-serif text-lg text-muted">
              {rsvp.deadline ? (
                <>
                  Te rugăm să ne confirmi prezența pe WhatsApp până la{" "}
                  <strong className="font-semibold text-ink">{rsvp.deadline}</strong>.
                </>
              ) : (
                <>
                  Te rugăm să ne confirmi prezența cât mai curând.
                  <DevBadge label="Termen neconfirmat" />
                </>
              )}
            </p>
          </div>

          <AnimatePresence>
            {sentNotice && (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="relative mt-7 flex items-center justify-center gap-2.5 rounded-xl border border-gold/50 bg-white/80 px-4 py-3 text-center font-serif text-base text-ink shadow-sm"
              >
                <Check size={17} strokeWidth={1.8} className="shrink-0 text-gold-deep" aria-hidden="true" />
                <span>{sentNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              sendViaWhatsApp(rsvp.whatsapp[0]);
            }}
            className="relative mt-10 space-y-5"
          >
            <Field
              id="rsvp-name"
              label="Nume și prenume"
              icon={<UserRound size={17} strokeWidth={1.5} />}
              error={errors.name}
            >
              <input
                id="rsvp-name"
                name="name"
                autoComplete="name"
                required
                maxLength={RSVP_LIMITS.nameMax}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex. Maria Popescu"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "rsvp-name-error" : undefined}
                className={`${fieldBase} pl-11 ${errors.name ? "border-red-700/60" : "border-gold/35"}`}
              />
            </Field>

            <fieldset>
              <legend className="mb-2 block font-sans text-[0.72rem] font-medium uppercase tracking-[0.2em] text-gold-deep">
                Participare
              </legend>
              <div
                id="rsvp-attending"
                tabIndex={-1}
                className="grid grid-cols-2 gap-3 outline-none"
                aria-describedby={errors.attending ? "rsvp-attending-error" : undefined}
              >
                {(
                  [
                    ["yes", "Particip"],
                    ["no", "Nu particip"],
                  ] as const
                ).map(([val, label]) => (
                  <label
                    key={val}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3.5 font-sans text-[0.95rem] transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-gold/25 ${
                      attending === val
                        ? "border-gold bg-gradient-to-b from-[#f3e3c3] to-[#e6cf9f] text-ink shadow-[0_8px_20px_-12px_rgba(156,122,69,0.8)]"
                        : `${errors.attending ? "border-red-700/60" : "border-gold/35"} bg-white/60 text-muted hover:border-gold/70`
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value={val}
                      checked={attending === val}
                      onChange={() => setAttending(val)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                        attending === val ? "border-gold-deep" : "border-gold/60"
                      }`}
                    >
                      {attending === val && <span className="h-2 w-2 rounded-full bg-gold-deep" />}
                    </span>
                    {label}
                  </label>
                ))}
              </div>
              {errors.attending && (
                <p id="rsvp-attending-error" className="mt-1.5 flex items-center gap-1.5 font-sans text-sm text-red-800">
                  <AlertCircle size={14} aria-hidden="true" /> {errors.attending}
                </p>
              )}
            </fieldset>

            <AnimatePresence initial={false}>
              {attending !== "no" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Field
                    id="rsvp-guests"
                    label="Număr de persoane"
                    icon={<Users size={17} strokeWidth={1.5} />}
                    error={errors.guests}
                  >
                    <select
                      id="rsvp-guests"
                      name="guests"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      aria-invalid={!!errors.guests}
                      aria-describedby={errors.guests ? "rsvp-guests-error" : undefined}
                      className={`${fieldBase} appearance-none pl-11 ${errors.guests ? "border-red-700/60" : "border-gold/35"}`}
                    >
                      {Array.from({ length: rsvp.maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "persoană" : "persoane"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gold-deep"
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            <Field
              id="rsvp-message"
              label="Mesaj (opțional)"
              icon={<MessageSquareHeart size={17} strokeWidth={1.5} />}
              error={errors.message}
              iconTop
            >
              <textarea
                id="rsvp-message"
                name="message"
                rows={3}
                maxLength={RSVP_LIMITS.messageMax}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Un gând pentru miri, alergii alimentare..."
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "rsvp-message-error" : undefined}
                className={`${fieldBase} resize-none pl-11 ${errors.message ? "border-red-700/60" : "border-gold/35"}`}
              />
            </Field>

            {/* WhatsApp confirm buttons for Alex & Bianca */}
            <div className="pt-3">
              <p className="mb-3 text-center font-sans text-[0.68rem] font-medium uppercase tracking-[0.22em] text-gold-deep">
                Trimite confirmarea pe WhatsApp către
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {rsvp.whatsapp.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => sendViaWhatsApp(contact)}
                    className="btn-gold w-full !px-5 !py-3.5"
                  >
                    <MessageCircle size={16} strokeWidth={1.7} aria-hidden="true" />
                    <span>WhatsApp · {contact.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct contact numbers */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-gold/25 pt-5 font-sans text-xs tracking-[0.08em] text-muted">
              {rsvp.whatsapp.map((contact) => (
                <a
                  key={contact.id}
                  href={`https://wa.me/${contact.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition hover:text-gold-deep"
                >
                  <Phone size={12} strokeWidth={1.6} className="text-gold-deep" aria-hidden="true" />
                  <span className="font-medium text-ink">{contact.name}:</span> {contact.display}
                </a>
              ))}
            </div>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

function Field({
  id,
  label,
  icon,
  error,
  children,
  iconTop = false,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  iconTop?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-sans text-[0.72rem] font-medium uppercase tracking-[0.2em] text-gold-deep"
      >
        {label}
      </label>
      <div className="relative">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-4 text-gold-deep/80 ${iconTop ? "top-4" : "top-1/2 -translate-y-1/2"}`}
        >
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 font-sans text-sm text-red-800">
          <AlertCircle size={14} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}
