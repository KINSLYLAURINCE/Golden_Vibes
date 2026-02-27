import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

const subjects = ["Candidature", "Partenariat", "Information", "Réclamation", "Autre"];

const Contact = () => {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="py-20 bg-background min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
            <Send size={32} className="text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl text-foreground mb-2">Message envoyé !</h2>
          <p className="text-muted-foreground mb-6">Nous vous répondrons dans les plus brefs délais.</p>
          <button onClick={() => setSent(false)} className="gold-gradient text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider">
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
        <p className="text-center text-muted-foreground mb-12">Contactez l'équipe Golden Vibes Events</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Form */}
          <motion.form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="space-y-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Nom *</label>
                <input required className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Prénom *</label>
                <input required className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Votre prénom" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email *</label>
              <input required type="email" className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="votre@email.com" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Téléphone *</label>
              <input required type="tel" className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="6XX XXX XXX" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Objet *</label>
              <select required className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Sélectionnez...</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Message *</label>
              <textarea required rows={5} className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="Votre message..." />
            </div>
            <button type="submit" className="w-full gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
              <Send size={18} /> Envoyer
            </button>
          </motion.form>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-display text-xl text-foreground">Informations</h3>
              {[
                { icon: MapPin, text: "Dschang, Cameroun" },
                { icon: Phone, text: "652 430 272 / 599 159 058" },
                { icon: Mail, text: "contact@goldenvibes-events.com" },
                { icon: Clock, text: "Lun - Sam : 8h00 - 18h00" },
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
                  { icon: Facebook, label: "Facebook" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: MessageCircle, label: "WhatsApp" },
                ].map((s) => (
                  <a key={s.label} href="#" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors" title={s.label}>
                    <s.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31838.89!2d10.05!3d5.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjYnMjQuMCJOIDEwwrAwMycwMC4wIkU!5e0!3m2!1sfr!2scm!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
