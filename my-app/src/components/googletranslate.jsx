import React, { useEffect } from "react";

export function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!document.querySelector('.goog-te-combo')) {
        new window.google.translate.TranslateElement(
          { 
            pageLanguage: "en", 
            includedLanguages: "en,es,fr,vi", // Add or remove language codes here
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE 
          },
          "google_translate_element"
        );
      }
    };

    if (!document.querySelector("#google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.id = "google-translate-script";
      addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      addScript.async = true;
      document.body.appendChild(addScript);
    }
  }, []);

  return (
  <div id="google_translate_element" style={{ minWidth: '150px', minHeight: '30px' }}></div>
  );
}