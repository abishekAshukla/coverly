import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [noOfItemsInCart, setNoOfItemsInCart] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true); // Set to true when the token is available
    }

    // get number of items in the cart
    const noOfItemsInCart = localStorage.getItem("noOfItemsInCart");
    if (noOfItemsInCart) {
      setNoOfItemsInCart(noOfItemsInCart);
    }
  }, []);

  // Function to update accessToken and isAuthenticated
  const updateAccessToken = (token) => {
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const updateAcessTokenWhenLogout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  // function to remove number of items from local storage
  const removeNoOfItemsInCart = () => {
    setNoOfItemsInCart(0);
    localStorage.removeItem("noOfItemsInCart");
  };

  // Function to update number of items in cart
  const updateNoOfItemsInCart = (noOfItems) => {
    setNoOfItemsInCart(noOfItems);
    localStorage.setItem("noOfItemsInCart", noOfItems);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        updateAccessToken,
        updateAcessTokenWhenLogout,
        removeNoOfItemsInCart,
        updateNoOfItemsInCart,
        noOfItemsInCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
