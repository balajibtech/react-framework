import { createContext, FC, ReactNode, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18 from "./i18"; // Importing the i18next configuration
import CFG from "../../src/config/config.json"; // Importing the default configuration


// Creating a context for language management which holds the current language and a method to change the language
export const LangugeContext:any = createContext({
  lang:  CFG?.site?.language?.default, // Default language from the configuration
  changeLang: (_lang: string) => {}, // Method to change language (initially an empty function)
});

// Interface for the children prop in the LanguageProvider component
interface ChildInterface {
  children: ReactNode;
}

// LanguageProvider component that provides language context and i18next functionality
export const LanguageProvider: FC<ChildInterface> = ({ children }) => {
  // State to hold the current language
  const [lang, setLang] = useState<string>(CFG?.site?.language?.default ?? "");

  /**
   * Method to change the current language.
   * It updates the lang state and ensures the new language is different from the current one.
   * @param newLang - The new language to set.
   */
  const changeLang = (newLang: string) => {
    
    if (newLang && newLang !== lang) {
      setLang(newLang); // Update the state with the new language
    }
  };

  

  return (
    /* Wrapping the children with the I18nextProvider to enable internationalization */
    <I18nextProvider i18n={i18}>
      {/* The LangugeContext.Provider is used to provide the current language and changeLang function */}
      <LangugeContext.Provider value={{ lang: lang, changeLang }}>
        {children}
      </LangugeContext.Provider>
    </I18nextProvider>
  );
};
