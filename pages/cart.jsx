import { useState, useEffect } from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import GlobalLoader from "@/components/loaders/GlobalLoader";
import Heading from "@/components/widgets/Heading";
import {
  getAllCartItems,
  updateCartQuantity,
  removeFromCart,
} from "@/config/api";
import { useAccessToken } from "@/hooks/useAcessToken";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";

const Cart = () => {
  const { accessToken } = useAccessToken();
  const [loading, setLoading] = useState(false);
  const [loadingUpdatedCart, setLoadingUpdatedCart] = useState(false);
  const [productData, setProductData] = useState([]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await getAllCartItems(accessToken);
      setProductData(response.cartItems);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error?.response?.status === 401) {
        toast.error("User not found. Please check your credentials.");
      } else {
        toast.error("There was an error. Please try again later");
      }
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      setLoadingUpdatedCart(true);
      await updateCartQuantity(accessToken, productId, newQuantity);
      fetchCartItems();
      setLoadingUpdatedCart(false);
    } catch (error) {
      setLoadingUpdatedCart(false);
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      setLoadingUpdatedCart(true);
      await removeFromCart(accessToken, productId);
      fetchCartItems();
      setLoadingUpdatedCart(false);
    } catch (error) {
      setLoadingUpdatedCart(false);
      toast.error("Failed to remove item from the cart. Please try again.");
    }
  };

  const handleCheckout = async (amount) => {
    const {
      data: { key },
    } = await axios.get("http://localhost:5000/api/checkout/getkey");

    const {
      data: { order },
    } = await axios.post("http://localhost:5000/api/checkout", {
      amount: amount,
    });

    const options = {
      key: key,
      amount: order.amount.toString(),
      name: "Coverly",
      order_id: order.id,
      callback_url: "http://localhost:5000/api/checkout/paymentverification/",
      prefill: {
        name: "Gaurav Kumar", //your customer's name
        email: "gaurav.kumar@example.com",
        contact: "9000090000", //Provide the customer's phone number for better conversion rates
        coupon_code: "COUPON50", // any valid coupon code that gets auto-applied once magic opens
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  useEffect(() => {
    if (accessToken !== null) {
      fetchCartItems();
    }
  }, [accessToken]);

  // Calculate total amount and number of items in the cart
  const totalAmount = productData.reduce((total, product) => {
    const price = parseFloat(
      product.product.discounted_price.replace("₹", "").replace(",", "")
    );
    return total + price * product.quantity;
  }, 0);

  const totalItems = productData.reduce(
    (total, product) => total + product.quantity,
    0
  );

  return (
    <div className="flex justify-center my-6">
      <div className="w-[90%]">
        <BreadCrumb />
        <Heading text="Cart" />
        <div className="flex flex-col md:flex-row mt-4">
          {/* cart items */}
          <div className="w-full md:w-4/5 md:mr-3">
            {productData.map((product, index) => (
              <div
                key={index}
                className="flex border my-4 justify-between px-1 py-1"
              >
                <div className="flex pr-[2px]">
                  <Image
                    src={product.product.image_url}
                    alt={product.product.product_name}
                    width={100}
                    height={100}
                  />
                  <div className="mt-2 text-sm md:text-base">
                    <p>{product.product.product_name}</p>
                    <p>Price: {product.product.discounted_price}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-around items-center py-1 text-sm md:text-base text-center">
                  <p>Quantity: {product.quantity}</p>
                  <div>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          product.productId,
                          product.quantity + 1
                        )
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded-full mx-1"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          product.productId,
                          product.quantity - 1
                        )
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded-full mx-1"
                      disabled={product.quantity <= 1}
                    >
                      -
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(product.productId)}
                    className="bg-red-500 text-white text-sm px-2 py-1 rounded-full"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* checkout box  */}
          <div className="w-full md:w-1/5 mt-4">
            <div className="bg-gray-200 p-4">
              <p>Total Items: {totalItems}</p>
              <p>Total Amount: ₹{totalAmount.toFixed(2)}</p>
              <button
                onClick={() => {
                  handleCheckout(totalAmount);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-full mt-4"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
        {loading && (
          <GlobalLoader
            tag="Fetching Cart items....."
            color="black"
            size={60}
            width={6}
          />
        )}
        {loadingUpdatedCart && (
          <GlobalLoader
            tag="Updating Cart....."
            color="black"
            size={60}
            width={6}
          />
        )}
      </div>
    </div>
  );
};

export default Cart;
