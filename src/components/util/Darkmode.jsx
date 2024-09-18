import React, { useEffect, useState } from "react";
function Darkmode() {

  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    localStorage.setItem("isDark", !isDark);
  };

  useEffect(() => {
    const isDark = localStorage.getItem("isDark");
    if (isDark) {
      setIsDark(isDark);
    }
  }, []);

  return (
    <div className="cursor-pointer  p-[5px] w-[40px] h-[40px] flex items-center justify-center rounded-lg"
    onClick={toggleDarkMode}
    onContextMenu={(e) => e.preventDefault()}>
      {isDark ? (
        <img src="/icons/sun.svg" alt="sun" className="w-auto h-[25px]" />
      ) : (
        <img src="/icons/moon.svg" alt="moon" className="w-auto h-[25px]" />
      )}
    </div>
  );
}

export default Darkmode;
