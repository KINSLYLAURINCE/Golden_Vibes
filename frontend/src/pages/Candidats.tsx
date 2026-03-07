/**
 * Page Candidats (publique)
 * -----------------------------------------
 * Grille de candidats style référence (dark card).
 * Filtre miss/master, recherche, tri.
 * Bouton "Voir" → page détail (2 images + vidéo).
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Crown, Eye, Heart, ChevronLeft, ChevronRight, Play, Loader2, ArrowUpDown } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";
const STORAGE_URL = "http://localhost:8000/storage";

const getPhotoUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  return `${STORAGE_URL}/${photo}`;
};

const Candidats = () => {
  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("votes_desc"); // Changé pour votes_desc par défaut

  /* Charger les candidats */
  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "tous") params.append("categorie", filter);
      if (search) params.append("search", search);
      
      // Configuration du tri
      if (sortBy === "votes_desc") {
        params.append("sort", "votes_count");
        params.append("order", "desc");
      } else if (sortBy === "votes_asc") {
        params.append("sort", "votes_count");
        params.append("order", "asc");
      } else if (sortBy === "numero_asc") {
        params.append("sort", "numero");
        params.append("order", "asc");
      } else if (sortBy === "numero_desc") {
        params.append("sort", "numero");
        params.append("order", "desc");
      } else if (sortBy === "nom_asc") {
        params.append("sort", "nom");
        params.append("order", "asc");
      } else if (sortBy === "nom_desc") {
        params.append("sort", "nom");
        params.append("order", "desc");
      }

      const response = await axios.get(`${API_URL}/candidats?${params.toString()}`);
      setCandidats(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur chargement candidats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidats();
  }, [filter, sortBy]);

  /* Recherche avec debounce */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCandidats();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl gold-text text-center mb-2">Nos Candidats</h1>
        <p className="text-center text-muted-foreground mb-8">
          Soutenez vos favoris · Miss & Mister Golden Vibes 2026
        </p>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 items-center justify-center mb-6">
          {["tous", "miss", "master"].map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f
                  ? "gold-gradient text-primary-foreground shadow-lg"
                  : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {f === "tous" ? "TOUS" : f === "miss" ? "MISS" : "MASTER"}
            </motion.button>
          ))}
        </div>

        {/* Recherche + tri */}
        <div className="flex flex-wrap gap-3 items-center justify-center mb-8">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-[200px] md:w-[250px]"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="votes_desc">Plus de votes (↓)</option>
              <option value="votes_asc">Moins de votes (↑)</option>
              <option value="numero_asc">Numéro (↑)</option>
              <option value="numero_desc">Numéro (↓)</option>
              <option value="nom_asc">Nom (A-Z)</option>
              <option value="nom_desc">Nom (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Nombre de résultats */}
        {!loading && candidats.length > 0 && (
          <p className="text-center text-xs text-muted-foreground mb-4">
            {candidats.length} candidat(s) trouvé(s)
          </p>
        )}

        {/* Chargement */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 size={40} className="text-primary" />
            </motion.div>
          </div>
        ) : candidats.length === 0 ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-10"
          >
            Aucun candidat trouvé.
          </motion.p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {candidats.map((c, i) => (
              <CandidatCard key={c.id} candidat={c} delay={i * 0.05} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ===== Card Candidat avec défilement automatique des images ===== */
const CandidatCard = ({ candidat: c, delay }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Construction des photos depuis la BDD (photo1 + photo2)
  const photos = [c.photo1, c.photo2]
    .filter(Boolean)
    .map((p) => getPhotoUrl(p));

  const totalImages = photos.length;

  /* Défilement automatique */
  useEffect(() => {
    if (!isPaused && totalImages > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, totalImages]);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <motion.div
      className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {/* Images */}
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${c.nom} - photo ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
            Aucune photo
          </div>
        )}

        {/* Indicateurs */}
        {totalImages > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => goToImage(i)}
                className={`transition-all ${
                  i === currentImageIndex
                    ? "w-3 h-1.5 bg-yellow-400 rounded-full"
                    : "w-1.5 h-1.5 bg-white/70 rounded-full hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {/* Flèches */}
        {totalImages > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
            >
              <ChevronLeft size={14} className="text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
            >
              <ChevronRight size={14} className="text-white" />
            </button>
          </>
        )}

        {/* Badge catégorie */}
        <div className="absolute top-2 left-2 z-10">
          <span className="gold-gradient text-primary-foreground text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase flex items-center gap-1">
            <Crown size={10} className="md:w-3 md:h-3" />
            {c.categorie === "miss" ? "MISS" : "MASTER"}
          </span>
        </div>

        {/* Badge votes */}
        <div className="absolute top-2 right-2 z-10">
          <motion.span 
            animate={{ 
              boxShadow: ["0 0 0 0 rgba(245,158,11,0.4)", "0 0 0 10px rgba(245,158,11,0)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-background/80 backdrop-blur-sm text-foreground text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full flex items-center gap-1"
          >
            <Heart size={10} className="text-yellow-400 md:w-3 md:h-3" />
            {Number(c.votes_count ?? 0).toLocaleString()}
          </motion.span>
        </div>

        {/* Badge vidéo */}
        {c.video && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
              <Play size={10} /> Vidéo
            </span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="p-2 md:p-4">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-display text-sm md:text-lg text-foreground leading-tight">{c.nom}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
              {c.votes_count || 0} vote(s)
            </p>
          </div>
          <span className="text-[10px] md:text-xs font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
            #{c.numero}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex border-t border-border">
        <Link
          to={`/candidats/${c.id}`}
          className="flex-1 flex items-center justify-center gap-1 py-2 md:py-3 text-[10px] md:text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border-r border-border hover:bg-secondary/50"
        >
          <Eye size={12} className="md:w-4 md:h-4" /> Profil
        </Link>
        <Link
          to={`/vote?candidat=${c.id}`}
          className="flex-1 flex items-center justify-center gap-1 py-2 md:py-3 gold-gradient text-primary-foreground text-[10px] md:text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <Heart size={12} className="md:w-4 md:h-4" /> Voter
        </Link>
      </div>
    </motion.div>
  );
};

export default Candidats;