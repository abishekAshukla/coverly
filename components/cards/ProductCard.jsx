import React, { useState, useEffect } from "react";
import { addToWishlist2, removeFromWishList } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { AiFillHeart } from "react-icons/ai";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ProductCard({
  data: {
    brand,
    image_url,
    model,
    product_name,
    discounted_price,
    actual_price,
    product_link,
  },
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { accessToken } = useAuth();
  const currentProductId = product_link.split("/")[2];

  // get wishlisted items of current user from localstorage

  useEffect(() => {
    const wishListedItems = JSON.parse(localStorage.getItem("wishListItems"));
    if (wishListedItems && wishListedItems.includes(currentProductId)) {
      setIsWishlisted(true);
    }
  }, []);

  const toggleWishlist = async () => {
    try {
      let response;

      if (isWishlisted) {
        // Remove from wishlist
        response = await removeFromWishList(currentProductId, accessToken);
        toast.success("Item Removed from wishlist");
      } else {
        // Add to wishlist
        response = await addToWishlist2(accessToken, currentProductId);
        toast.success("Item added to wishlist");
      }

      // Update localStorage
      localStorage.setItem(
        "wishListItems",
        JSON.stringify(response.updatedWishListItems)
      );

      // Toggle icon
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      if (error.response.status === 401) {
        toast.error("Please login to add to wishlist");
      } else {
        toast.error("There was an error adding to wishlist");
      }
    }
  };

  return (
    <div className={`border mt-6 mx-2 md:max-w-[30%]`}>
      <div className="flex justify-between">
        <div className="bg-gray-500 text-white inline px-3 py-1 text-xs">
          {brand.toUpperCase()}
        </div>
        <motion.div
          className={`mt-1 mr-1 ${isWishlisted ? "heart-red" : ""}`}
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.6 }} // Immediate scaling animation on tap
          onClick={toggleWishlist}
        >
          <AiFillHeart
            className={`text-xl ${
              isWishlisted ? "text-red-500" : "text-gray-400"
            }`}
          />
        </motion.div>
      </div>
      <Link href={`/product/${currentProductId}`}>
        <Image
          src={image_url}
          width={350}
          height={300}
          alt="product image"
          className="mx-auto"
        />
      </Link>
      <p className="text-sm font-bold text-gray-600 mt-2 px-1">{model}</p>
      <p className="text-xs text-gray-600 px-1 pb-1">
        {product_name.length > 30
          ? `${product_name.substring(0, 55)}...`
          : product_name}
      </p>
      <div className="flex px-1">
        <p className="text-base font-bold">{`${discounted_price}`}</p>
        <p className="text--base text-gray-600 pl-2">
          <span className="line-through">{`${actual_price}`}</span>
        </p>
      </div>
    </div>
  );
}
