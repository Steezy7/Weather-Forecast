import { useState, useRef, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchCities, NigerianCity } from "@/lib/weather-service";

interface CitySearchProps {
  currentCity: string;
  onSelectCity: (city: NigerianCity) => void;
}

const CitySearch = ({ currentCity, onSelectCity }: CitySearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NigerianCity[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setResults(searchCities(value));
    setIsOpen(true);
  };

  const handleSelect = (city: NigerianCity) => {
    onSelectCity(city);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="flex items-center gap-2 rounded-2xl bg-card/80 backdrop-blur-md border border-border px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <Search className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => { if (query) setIsOpen(true); }}
          placeholder={`Search Nigerian cities...`}
          className="bg-transparent text-foreground placeholder:text-muted-foreground text-sm w-full outline-none"
        />
      </div>

      <AnimatePresence>
        {isOpen && (results.length > 0 || query.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden z-50"
          >
            {results.length > 0 ? (
              results.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleSelect(city)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-secondary/60 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <span className="text-sm font-medium text-foreground">{city.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{city.state}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Searching for your city... Try "Abuja"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitySearch;
