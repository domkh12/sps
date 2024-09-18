import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLanguage } from "../../redux/feature/translate/languageSlice.js";

export default function CardTranslate() {
  const dispatch = useDispatch(); 

  const [isEnglish, setIsEnglish] = useState(false);

  const handleLanguageToggle = () => {
    setIsEnglish(!isEnglish);
    dispatch(setLanguage(isEnglish ? "en" : "kh"));
  };

  return (
    <div
      className="flex items-center justify-center gap-2 p-[5px] w-[55px] cursor-pointer h-[40px] rounded-lg"
      onClick={handleLanguageToggle}
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src={
          isEnglish
            ? "/flag/united-kingdom-flag.png"
            : "/flag/combodia-flag.png"
        }
        alt={isEnglish ? "united-kingdom-flag" : "cambodia-flag"}
        className="w-auto h-[30px] rounded-[5px]"
        draggable="false"
      />
    </div>
  );
}
