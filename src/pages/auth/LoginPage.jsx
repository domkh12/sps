import React, { useState } from "react";
import LoginForm from "../../components/login/LoginForm.jsx";
import CardTranslate from "../../components/util/CardTranslate.jsx";
import Meta from "../../components/seo/Meta.jsx";

export default function LoginPage() {
  return (
    <>
      <Meta
        title="Login"
        description="Login to your account"
        keywords="login, account, SPS, NPIC University"
        author="NPIC University"
        ogTitle="Login"
        ogDescription="Login to your account"
        ogType="website"
        ogUrl="https://sps-nine.vercel.app/login"
        ogImage="/logo/logo.png"
      />
      <main className="relative h-screen">

        <div className="absolute top-5 right-5">
          <CardTranslate />
        </div>

        <div className="flex h-full justify-center items-center gap-10 lg:gap-5">
          <div className="sm:hidden w-1/3 lg:w-1/2">
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
    </>
  );
}
