import { useSelector } from "react-redux";

const useTranslation = () => {
  const { language, translations } = useSelector((state) => state.language);

  const translate = (key) => {
    return translations[language][key] || key;
  };

  return { translate };
};

export default useTranslation;