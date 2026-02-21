/**
 * Composant de défilement continu des partenaires
 * -----------------------------------------
 * Les logos défilent en boucle infinie (marquee).
 */

import { motion } from "framer-motion";
import leGuide from "@/assets/partners/le-guide.png";
import kdmSono from "@/assets/partners/kdm-sono.png";
import trecyClean from "@/assets/partners/trecy-clean.png";
import noirFier from "@/assets/partners/noir-et-fier.png";
import tia from "@/assets/partners/3ia.png";
import tiaLogo from "@/assets/partners/3ia-logo.png";

const partners = [
  { nom: "3iA", logo: tia },
  { nom: "3iA Logo", logo: tiaLogo },
  { nom: "KDM Sono", logo: kdmSono },
  { nom: "Noir & Fier", logo: noirFier },
  { nom: "Le Guide", logo: leGuide },
  { nom: "Trecy Clean", logo: trecyClean },
];

/* On duplique pour boucle infinie */
const allPartners = [...partners, ...partners];

const MarqueePartenaires = () => (
  <div className="overflow-hidden py-8">
    <motion.div
      className="flex gap-12 items-center"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {allPartners.map((p, i) => (
        <div key={i} className="flex-shrink-0 w-24 h-24 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
          <img src={p.logo} alt={p.nom} className="max-w-full max-h-full object-contain" />
        </div>
      ))}
    </motion.div>
  </div>
);

export default MarqueePartenaires;
