import { useState, useEffect } from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import ProductList from "@/components/lists/ProductList";
import GlobalLoader from "@/components/loaders/GlobalLoader";
import api from "@/config/api";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

const Wishlist = () => {
  const { accessToken, isAuthenticated } = useAuth();
  const [producDataState, setProducDataState] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlistItems = async () => {
    try {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const response = await api.get("/users/wishlist", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProducDataState(response.data.wishListItems);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error?.response?.status !== 401) {
        toast.error("There was an error. Please try again later");
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchWishlistItems();
  }, [accessToken]);

  return (
    <div className="flex justify-center my-6">
      <div className="w-[90%] sm:w-[75%]">
        <BreadCrumb />

        {isAuthenticated && (
          <div
            style={{ display: producDataState.length < 1 ? "" : "none" }}
            className="w-full flex justify-center items-center"
          >
            <p className="text-center text-xl">No items in the wishlist</p>
          </div>
        )}

        {isAuthenticated && (
          <ProductList
            productData={producDataState}
            fetchWishlistItems={fetchWishlistItems}
          />
        )}
        {!isAuthenticated && (
          <div className="flex justify-center items-center text-center h-[400px]">
            <h1 className="text-2xl font-bold text-gray-500">
              Please login to see your wishlist
            </h1>
          </div>
        )}
        {loading && (
          <GlobalLoader
            tag="Fetching Wishlist items....."
            color="black"
            size={60}
            width={6}
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
