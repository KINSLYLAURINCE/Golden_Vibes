import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Phone, Mail, Clock, Send, Facebook, Instagram,
  Twitter, MessageCircle, CheckCircle, Loader2, AlertCircle
} from "lucide-react";

import { API_URL } from "@/services/api";


const subjects = [
  { label: "Candidature", value: "candidature" },
  { label: "Partenariat", value: "partenariat" },
  { label: "Information", value: "info"         },
  { label: "Réclamation", value: "reclamation" },
  { label: "Autre",       value: "autre"        },
];

interface FormState {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  objet: string;
  message: string;
}

const defaultForm: FormState = {
  nom: "", prenom: "", email: "", telephone: "", objet: "", message: "",
};

const PHONE_PREFIX = "+237";

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const inputCls =
  "w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm";

const Contact = () => {
  const [form, setForm]       = useState<FormState>(defaultForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  // Keep only digits after the prefix, prevent the user from deleting the prefix
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Strip everything except digits
    const digits = raw.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, telephone: digits }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    // Always submit with the +237 prefix
    const fullPhone = `${PHONE_PREFIX}${form.telephone}`.trim();

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nom:       `${form.prenom} ${form.nom}`.trim(),
          email:     form.email,
          telephone: fullPhone,
          objet:     form.objet,
          message:   form.message,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          const first = Object.values(json.errors as Record<string, string[]>)[0][0];
          throw new Error(first);
        }
        throw new Error(json.message ?? `Erreur ${res.status}`);
      }

      setSent(true);
      setForm(defaultForm);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="py-20 bg-background min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle size={32} className="text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl text-foreground mb-2">Message envoyé !</h2>
          <p className="text-muted-foreground mb-6">
            Nous vous répondrons dans les plus brefs délais.
          </p>
          <button
            onClick={() => setSent(false)}
            className="gold-gradient text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Envoyer un autre message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl gold-text text-center mb-2">Contact</h1>
        <p className="text-center text-muted-foreground mb-12">
          Contactez l'équipe Golden Vibes Events
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* ── Formulaire ── */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Prénom *</label>
                <input
                  required name="prenom" value={form.prenom} onChange={handleChange}
                  className={inputCls} placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Nom *</label>
                <input
                  required name="nom" value={form.nom} onChange={handleChange}
                  className={inputCls} placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email *</label>
              <input
                required type="email" name="email" value={form.email} onChange={handleChange}
                className={inputCls} placeholder="votre@email.com"
              />
            </div>

            {/* Phone with fixed +237 prefix */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Téléphone *</label>
              <div className="flex">
                {/* Prefix badge */}
                <span className="flex items-center px-3 bg-secondary border border-r-0 border-border rounded-l-lg text-sm text-foreground font-medium select-none whitespace-nowrap">
                  🇨🇲 +237
                </span>
                <input
                  required
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handlePhoneChange}
                  inputMode="numeric"
                  maxLength={9}
                  className="flex-1 px-4 py-3 bg-secondary border border-border rounded-r-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                  placeholder="6XX XXX XXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Objet *</label>
              <select
                required name="objet" value={form.objet} onChange={handleChange}
                className={inputCls}
              >
                <option value="">Sélectionnez...</option>
                {subjects.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Message *</label>
              <textarea
                required name="message" value={form.message} onChange={handleChange}
                rows={5} className={`${inputCls} resize-none`}
                placeholder="Votre message..."
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={sending}
              whileHover={!sending ? { scale: 1.01 } : {}}
              whileTap={!sending ? { scale: 0.99 } : {}}
              className="w-full gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity"
            >
              <AnimatePresence mode="wait">
                {sending ? (
                  <motion.span key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Envoi en cours…
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <Send size={18} /> Envoyer
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>

          {/* ── Infos + Carte ── */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            transition={{ delay: 0.15 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-display text-xl text-foreground">Informations</h3>
              {[
                { icon: MapPin, text: "Dschang, Cameroun"              },
                { icon: Phone,  text: "652 430 272 / 599 159 058"      },
                { icon: Mail,   text: "contact@goldenvibes-event.com"  },
                { icon: Clock,  text: "Lun - Sam : 8h00 - 18h00"      },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <item.icon size={18} className="text-primary shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-foreground mb-4">Réseaux sociaux</h3>
              <div className="flex gap-3">
                {[
                  { icon: Facebook,      label: "Facebook",  href: "#" },
                  { icon: Instagram,     label: "Instagram", href: "#" },
                  { icon: Twitter,       label: "Twitter",   href: "#" },
                  { icon: MessageCircle, label: "WhatsApp",  href: "#" },
                ].map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    title={s.label}
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <s.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31838.89!2d10.05!3d5.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjYnMjQuMCJOIDEwwrAwMycwMC4wIkU!5e0!3m2!1sfr!2scm!4v1"
                width="100%" height="100%"
                style={{ border: 0 }} allowFullScreen loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;