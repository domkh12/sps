import React, { useState } from "react";
import LoginForm from "../../components/login/LoginForm";
import CardTranslate from "../../components/util/CardTranslate";

export default function login() {
  const [isEnglish, setIsEnglish] = useState(false);

  const handleLanguageToggle = () => {
    setIsEnglish(!isEnglish);
  };

  return (
    <main className="relative">
      <div className="absolute top-5 right-5">
        <CardTranslate isEnglish={isEnglish} onClick={handleLanguageToggle} />
      </div>
      <div className="flex h-screen justify-center items-center gap-10 lg:gap-5 sm:mt-10">
        <div className="sm:hidden w-1/2">
          <img
            src="/banner/banner-login.svg"
            alt="banner"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
        <div className="">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
