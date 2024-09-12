import { Card } from "flowbite-react";
import React from "react";

export default function CardTranslate({ isEnglish, onClick }) {
  return (
    <div
      className="flex items-center justify-center gap-2 border-[1px] border-gray-300 rounded-md p-2 w-[120px] cursor-pointer"
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src={
          isEnglish
            ? "/flag/united-kingdom-flag.png"
            : "/flag/combodia-flag.png"
        }
        alt={isEnglish ? "united-kingdom-flag" : "cambodia-flag"}
        className="w-[30px] h-[20px]"
        draggable="false"
      />
      <p >{isEnglish ? "English" : "ភាសាខ្មែរ"}</p>
    </div>
  );
}
