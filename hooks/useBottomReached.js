import { useEffect, useState } from "react";

const useBottomReached = (threshold = 200) => {
  const [bottomReached, setBottomReached] = useState(false);

  // The useEffect hook is used to add a scroll event listener to the window.
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

    //The event listener invokes the handleScroll function whenever the user scrolls.
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line
  }, []);

  return bottomReached;
};

export default useBottomReached;
