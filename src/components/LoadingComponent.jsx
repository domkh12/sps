import React from "react";

function LoadingComponent() {
  return (
    <div className="h-screen">
      <div className="flex justify-center items-center h-full relative">
        <div className="h-40 w-40 absolute border-[10px] border-primary border-opacity-70 loading-spin1"></div>
        <div className="w-36 h-36 absolute border-[6px] border-primary border-opacity-30 loading-spin2"></div>
        <img src="/images/logo.png" className="w-20 h-auto" alt="logo" />
      </div>
    </div>
  );
}

export default LoadingComponent;
