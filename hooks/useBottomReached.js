import { useEffect, useState } from "react";

const useBottomReached = (threshold = 200) => {
  const [bottomReached, setBottomReached] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight + threshold >= scrollHeight) {
        setBottomReached(true);
      } else {
        setBottomReached(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line
  }, []);

  return bottomReached;
};

export default useBottomReached;
