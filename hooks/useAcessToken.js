// this hooks provides accessToken of current user from localStorage
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState(null); // Initialize as null

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You need to login first");
        return;
      }
      setAccessToken(token);
    };

    fetchAccessToken();
  }, []);

  return {
    accessToken,
  };
};
