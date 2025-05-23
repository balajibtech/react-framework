import { useContext, useEffect, useState } from "react";
import { LangugeContext } from "@/languages/Language.context";
import hiIN from "antd/lib/locale/hi_IN";
import enUS from "antd/lib/locale/en_US";
import { Locale } from "antd/lib/locale";
import { useTranslation } from "react-i18next";
import { localStorageAccessor } from "@/utils/browserStorage"; // Custom hook for handling browser storage

// Custom hook for managing the language settings for both Ant Design and React i18n
const useLang = () => {
  // State for maintaining the Ant Design language provider
  const [antdLangProvider, setAntdLangProvider] = useState<Locale>(enUS);

  // Language context to get and change the current app language
  const { lang, changeLang } : any = useContext(LangugeContext);

  // i18n hook to manage translations
  const { i18n } = useTranslation();

  /* Localstorage language value & handlers */
  // Using localStorageAccessor to get and set language in localStorage
  const [LgetLang] = localStorageAccessor<string>("lang");
  const Llanguage = LgetLang(); // Get the stored language from localStorage

  // When the app initializes, set the initial language based on the stored language or fallback to the default from the config
  useEffect(() => {    
    // const initialLang = Llanguage ? Llanguage : CFG?.systemSettings?.site?.language?.default as any; // Get stored or default language            
    changeLang(); // Set the language context with the initial language value
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Effect hook to maintain language states for both Ant Design and i18n
  useEffect(() => {    
    if (lang) {
      // Switch the Ant Design language provider based on the selected language
      switch (lang) {
        case "en-US":
          setAntdLangProvider(enUS); // Set English language for Ant Design
          break;
        case "hi-IN":          
          setAntdLangProvider(hiIN); // Set Hindi language for Ant Design
          break;
        default:
          console.info("language not yet implemented"); // For unsupported languages
      }

      // Change the language in the i18n library (React i18next)
      if (i18n.changeLanguage) {        
        i18n.changeLanguage(lang); // Update the i18n language
      }

      // // If the current language is different from the stored one, update localStorage
      // if (Llanguage !== lang) {
      //   LsetLang(lang); // Set the selected language in localStorage
      // }      
    }
  }, [lang, i18n, Llanguage]); // Run this effect when the `lang`, `i18n`, or `Llanguage` changes

  // Return current language, function to change the language, and Ant Design language provider for usage in components
  return { lang, changeLang, antdLangProvider };
};

export { useLang };
