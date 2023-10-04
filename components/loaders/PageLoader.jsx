import { useState, useEffect } from "react";
import Router from "next/router";
import LoadingBar from "react-top-loading-bar";

const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadingTimeout;

    const startLoader = () => {
      setProgress(10);

      loadingTimeout = setInterval(() => {
        setProgress((prevProgress) => {
          // Increase progress by a certain amount
          const increment = Math.random() * 10;
          const newProgress = prevProgress + increment;

          // If progress exceeds 90%, stop the timer and let it complete on routeChangeComplete
          if (newProgress >= 90) {
            clearInterval(loadingTimeout);
          }

          return newProgress;
        });
      }, 500);
    };

    const handleComplete = () => {
      // If the loading is still in progress, complete it to 100%
      if (progress < 100) {
        clearInterval(loadingTimeout);
        setProgress(100);
      }
    };

    Router.events.on("routeChangeStart", startLoader);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);

    return () => {
      Router.events.off("routeChangeStart", startLoader);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleComplete);
    };
  }, [progress]);

  return (
    <LoadingBar
      style={{ height: "5px" }}
      color="#ffd84d"
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
    />
  );
};

export default PageLoader;
