import { useState, useEffect } from "react";
import axios from "axios";
import BreadCrumb from "@/components/common/BreadCrumb";
import { addToWishlist2, removeFromWishList, addToCart } from "@/config/api";
import Image from "next/image";
import QuantityInput from "@/components/widgets/QuantityInput";
import { AiOutlineShoppingCart, AiFillHeart } from "react-icons/ai";
import MainButton from "@/components/widgets/MainButton";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

const ProductID = ({
  productData: {
    brand,
    model,
    product_name,
    discounted_price,
    actual_price,
    image_url,
    product_link,
  },
}) => {
  const currentProductId = product_link.split("/")[2];
  const { accessToken } = useAuth();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // calculate percenate discount
  const parsedDiscountedPrice = parseInt(discounted_price.replace("₹", ""), 10);
  const parsedActualPrice = parseInt(actual_price.replace("₹", ""), 10);
  const percentageOff =
    Math.round(
      ((parsedActualPrice - parsedDiscountedPrice) / parsedActualPrice) * 100
    ) || 0;

  // Handle the selected quantity change
  const handleQuantityChange = (newQuantity) => {
    setSelectedQuantity(newQuantity);
  };

  // check is current product is in wishlist
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

  const addItemToCart = async () => {
    await addToCart(accessToken, currentProductId, selectedQuantity);
  };

  return (
    <div className="flex justify-center my-6">
      <div className="w-[90%] md:w-[60%]">
        <BreadCrumb />
        <div className="flex flex-col md:flex-row justify-cente mt-6">
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <Image
              src={image_url}
              width={450}
              height={450}
              alt="phone_cover_image"
            />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-xl text-gray-600 font-medium">
              {`${brand} ${model}`}
            </p>
            <p className="text-lg text-gray-500 mt-1">{product_name}</p>
            <div className="flex text-2xl mt-2">
              <p className="">{discounted_price}</p>
              <p className="ml-2 line-through">{actual_price}</p>
              <p className="ml-2 text-green-500">{percentageOff}% OFF</p>
            </div>
            <p className="text-gray-500 text">inclusive of all taxes</p>
            <QuantityInput onChange={handleQuantityChange} />
            <MainButton
              icon={<AiOutlineShoppingCart className="text-lg mr-2" />}
              text="ADD TO BAG"
              bgColor="mainYellow"
              textColor="black"
              onClickFunc={addItemToCart}
            />

            <MainButton
              icon={
                <AiFillHeart
                  className={`text-lg mr-2 ${
                    isWishlisted ? "text-red-500" : "text-white"
                  }`}
                />
              }
              text={`${isWishlisted ? "REMOVE FROM" : "ADD TO"} WISHLIST`}
              bgColor="white"
              textColor="black"
              onClickFunc={toggleWishlist}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductID;

export async function getStaticPaths() {
  const apiUrl = process.env.API_BASE_URL;
  try {
    const response = await axios.get(`${apiUrl}/api/products/all-products-ids`);
    const productIds = response.data.allProductLinks;

    const paths = productIds.map((product) => ({
      params: { ProductId: product },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  const { ProductId } = params;
  const apiUrl = process.env.API_BASE_URL;

  try {
    const response = await axios.get(
      `${apiUrl}/api/products/product/${ProductId}`
    );
    const productData = response.data.product;

    return {
      props: {
        productData: productData,
      },
    };
  } catch (error) {
    return {
      props: {
        productData: [],
      },
    };
  }
}
