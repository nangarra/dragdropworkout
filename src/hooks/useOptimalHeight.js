import { useState, useEffect } from "react";

const useOptimalModalHeight = (offset = 0) => {
  const [optimalHeight, setOptimalHeight] = useState("70vh"); // Initial height

  useEffect(() => {
    const calculateOptimalHeight = () => {
      const availableHeight = window.innerHeight;

      const contentPadding = 176;
      const idealContentHeight = availableHeight - contentPadding + offset;

      setOptimalHeight(`${idealContentHeight}px`); // Set the height in pixels
    };

    window.addEventListener("resize", calculateOptimalHeight);

    calculateOptimalHeight(); // Calculate on initial render

    return () => {
      window.removeEventListener("resize", calculateOptimalHeight);
    };
  }, []);

  return optimalHeight;
};

export default useOptimalModalHeight;
