// this hook provides a state which tells when user reaches to bottom of the page
import { useEffect, useState } from "react";

const useBottomReached = (threshold = 10) => {
  const [bottomReached, setBottomReached] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
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
