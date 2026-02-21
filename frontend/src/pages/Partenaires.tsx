import { motion } from "framer-motion";
import leGuide from "@/assets/partners/le-guide.png";
import kdmSono from "@/assets/partners/kdm-sono.png";
import trecyClean from "@/assets/partners/trecy-clean.png";
import noirFier from "@/assets/partners/noir-et-fier.png";
import tia from "@/assets/partners/3ia.png";
import tiaLogo from "@/assets/partners/3ia-logo.png";

const partners = [
  { nom: "3iA", logo: tia, categorie: "Platine", description: "Institut Ingénierie Informatique Appliquée", site: "#" },
  { nom: "3iA", logo: tiaLogo, categorie: "Or", description: "Institut Ingénierie Informatique Appliquée", site: "#" },
  { nom: "KDM Sono", logo: kdmSono, categorie: "Or", description: "Sonorisation & Événementiel", site: "#" },
  { nom: "Noir & Fier", logo: noirFier, categorie: "Argent", description: "Deluxe Version / Street Wear", site: "#" },
  { nom: "Le Guide", logo: leGuide, categorie: "Argent", description: "Centre d'étude et de la réflexion juridique", site: "#" },
  { nom: "Trecy Clean Express", logo: trecyClean, categorie: "Bronze", description: "Services de nettoyage professionnel", site: "#" },
];

const categoryOrder = ["Platine", "Or", "Argent", "Bronze"];
const categoryColors: Record<string, string> = {
  Platine: "text-foreground",
  Or: "text-primary",
  Argent: "text-muted-foreground",
  Bronze: "text-muted-foreground",
};

const Partenaires = () => (
  <div className="py-12 bg-background min-h-screen">
    <div className="container mx-auto px-4">
      <h1 className="font-display text-4xl gold-text text-center mb-2">Nos Partenaires</h1>
      <p className="text-center text-muted-foreground mb-12">Ils soutiennent Golden Vibes Events</p>

      {categoryOrder.map((cat) => {
        const items = partners.filter((p) => p.categorie === cat);
        if (!items.length) return null;
        return (
          <div key={cat} className="mb-12">
            <h2 className={`font-display text-2xl mb-6 ${categoryColors[cat]}`}>
              {cat === "Platine" ? "💎" : cat === "Or" ? "🥇" : cat === "Argent" ? "🥈" : "🥉"} Partenaire {cat}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p, i) => (
                <motion.div
                  key={i}
                  className="bg-card rounded-xl border border-border p-6 flex flex-col items-center text-center hover:border-primary/50 transition-all gold-glow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-32 h-32 flex items-center justify-center mb-4">
                    <img src={p.logo} alt={p.nom} className="max-w-full max-h-full object-contain" />
                  </div>
                  <h3 className="font-display text-lg text-foreground">{p.nom}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                  <span className="mt-3 text-xs text-primary uppercase tracking-wider font-medium">{p.categorie}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Devenir partenaire */}
      <div className="mt-16 text-center bg-card border border-border rounded-xl p-10 max-w-2xl mx-auto gold-glow">
        <h2 className="font-display text-2xl gold-text mb-4">Devenir Partenaire</h2>
        <p className="text-muted-foreground mb-6">
          Associez votre marque au prestige de Golden Vibes Events. Contactez-nous pour découvrir nos offres de partenariat.
        </p>
        <a href="/contact" className="gold-gradient text-primary-foreground px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider inline-block">
          Nous Contacter
        </a>
      </div>
    </div>
  </div>
);

export default Partenaires;
