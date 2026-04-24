import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Globe } from "lucide-react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "gb" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "et" },
  { code: "om", name: "Afaan Oromo", nativeName: "Afaan Oromo", flag: "et" },
  { code: "ti", name: "Tigrinya", nativeName: "ትግርኛ", flag: "et" },
  { code: "so", name: "Somali", nativeName: "Soomaali", flag: "so" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "in" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "sa" },
  { code: "zh-CN", name: "Chinese", nativeName: "中文", flag: "cn" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "de" },
  { code: "fr", name: "French", nativeName: "Français", flag: "fr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "es" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "it" },
];

const GoogleTranslate: React.FC<{ transparent?: boolean; align?: "left" | "right" }> = ({
  transparent = false,
  align = "right"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initialize language from cookie
    const getLanguageFromCookie = () => {
      const match = document.cookie.match(/googtrans=\/auto\/([^;]+)/);
      if (match && match[1]) {
        return match[1];
      }
      return "en";
    };

    const initialLang = getLanguageFromCookie();
    setCurrentLang(initialLang);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    if (langCode === currentLang) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    setCurrentLang(langCode);

    // 1. Set the cookie as a fallback/persistent method
    document.cookie = `googtrans=/auto/${langCode}; path=/`;
    document.cookie = `googtrans=/auto/${langCode}; path=/; domain=${window.location.hostname}`;

    // 2. Find internal Google Translate combo box and trigger change
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;

    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change", { bubbles: true }));

      // Some versions of Google Translate require a second event or a slight delay
      setTimeout(() => {
        combo.dispatchEvent(new Event("change", { bubbles: true }));
      }, 100);
    } else {
      console.warn("Google Translate combo not found, relying on cookie");
      // If the combo isn't there, a reload is usually required for the cookie to take effect
      window.location.reload();
    }
  };

  const currentLanguage =
    languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-200 group ${transparent
            ? "text-white/90 hover:bg-white/10"
            : "text-slate-700 bg-slate-50 border border-border hover:border-primary"
          }`}
        aria-label="Select Language"
      >
        <div className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform ${transparent ? "border border-white/20" : "border border-border"
          }`}>
          <img
            src={`https://flagcdn.com/w40/${currentLanguage.flag}.png`}
            alt={currentLanguage.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className={`hidden md:inline-block text-[11px] sm:text-[12px] font-bold uppercase tracking-wider ${transparent ? "text-white/80" : "text-slate-600"
          }`}>
          {currentLanguage.name}
        </span>
        <ChevronDown
          size={12}
          className={`sm:w-3.5 sm:h-3.5 transition-all duration-300 ${transparent ? "text-white/60 group-hover:text-white" : "text-slate-400 group-hover:text-primary"
            } ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === "left" ? "left-0" : "right-0"} mt-2 w-56 sm:w-60 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-border py-2 z-[200] animate-in fade-in slide-in-from-top-1 duration-200 origin-top shadow-2xl`}
          style={{ maxWidth: 'calc(100vw - 32px)' }}
        >
          <div className="px-4 sm:px-5 py-2 sm:py-3 border-b border-slate-50 mb-1 flex items-center gap-2">
            <Globe size={14} className="text-primary" />
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Select Language
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto custom-scrollbar py-1 px-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group
                  ${currentLang === lang.code ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-primary"}
                `}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-border flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={`https://flagcdn.com/w80/${lang.flag}.png`}
                    alt={lang.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="text-[13px] font-bold tracking-tight">
                    {lang.nativeName}
                  </span>
                  {lang.name !== lang.nativeName && (
                    <span
                      className={`text-[10px] font-medium uppercase tracking-widest ${currentLang === lang.code ? "text-primary/70" : "text-slate-400"}`}
                    >
                      {lang.name}
                    </span>
                  )}
                </div>
                {currentLang === lang.code && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleTranslate;
