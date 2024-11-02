import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

function usePersist() {
  const [persist, setPersist] = useState(
    JSON.parse(secureLocalStorage.getItem("persist")) || true
  );

  useEffect(() => {
    secureLocalStorage.setItem("persist", JSON.parse(persist));
  }, [persist]);

  return [persist, setPersist];
}

export default usePersist;
