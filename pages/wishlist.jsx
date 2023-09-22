import { useState, useEffect } from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import ProductList from "@/components/lists/ProductList";
import GlobalLoader from "@/components/loaders/GlobalLoader";
import api from "@/config/api";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [producDataState, setProducDataState] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Please login to continue");
        return;
      }
      const response = await api.get("/users/wishlist", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProducDataState(response.data.wishListItems);
      setLoading(false);

      if (response.status === 200) {
      }
    } catch (error) {
      setLoading(false);
      if (error?.response?.status === 401) {
        toast.error("User not found. Please check your credentials.");
      } else {
        toast.error("There was an error. Please try again later");
      }
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  return (
    <div className="flex justify-center my-6">
      <div className="w-[90%] sm:w-[75%]">
        <BreadCrumb />
        <ProductList productData={producDataState} />
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
