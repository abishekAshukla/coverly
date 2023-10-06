import { useState, useEffect } from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import GlobalLoader from "@/components/loaders/GlobalLoader";
import Heading from "@/components/widgets/Heading";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  getAllCartItems,
  updateCartQuantity,
  removeFromCart,
  createOrder,
  verifyPayment,
  saveOrder,
  clearCart,
} from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/router";

const Cart = () => {
  const { accessToken, isAuthenticated, updateNoOfItemsInCart } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingUpdatedCart, setLoadingUpdatedCart] = useState(false);
  const [productData, setProductData] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedItemIdForRemoval, setSelectedItemIdForRemoval] =
    useState(null);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await getAllCartItems(accessToken);
      setProductData(response.cartItems);
      updateNoOfItemsInCart(
        response.cartItems.reduce(
          (total, product) => total + product.quantity,
          0
        )
      );
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

  const handleRemoveFromCart = async () => {
    try {
      setLoadingUpdatedCart(true);
      await removeFromCart(accessToken, selectedItemIdForRemoval);
      fetchCartItems();
      setLoadingUpdatedCart(false);
    } catch (error) {
      setLoadingUpdatedCart(false);
      toast.error("Failed to remove item from the cart. Please try again.");
    }
  };

  const initPayment = (data) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
      amount: data.amount,
      currency: data.currency,
      name: "Coverly",
      image: "https://avatars.githubusercontent.com/u/90856267?v=4",
      order_id: data.id,
      handler: async (response) => {
        try {
          // verify payment
          const data = await verifyPayment(accessToken, response);
          const orderData = {
            orderId: data.orderId,
            paymentId: data.paymentId,
            totalAmount: totalAmount,
            totalItems: totalItems,
            orderInformation: productData.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
            })),
          };
          // save order in database
          await saveOrder(accessToken, orderData);
          toast.success("Payment successfull");
          // clear cart
          await clearCart(accessToken);
          router.push("/orders");
        } catch (error) {
          toast.error("Payment failed. Please try again.");
        }
      },
      prefill: {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
      },
      theme: {
        color: "#ffd84d",
      },
      modal: {
        animation: true,
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      const { data } = await createOrder(accessToken, totalAmount);
      initPayment(data);
    } catch (error) {
      toast.error(
        "There was an error in initiating the payment. Please try again."
      );
    }
  };

  const handleRemoveFromCartClicked = (productId) => {
    setSelectedItemIdForRemoval(productId);
    setIsConfirmationModalOpen(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
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
      <ConfirmModal
        isOpen={isConfirmationModalOpen}
        message="Are you sure you want to remove this item from the cart?"
        onConfirm={() => {
          handleRemoveFromCart();
          setIsConfirmationModalOpen(false);
        }}
        onCancel={() => {
          setSelectedItemIdForRemoval(null);
          setIsConfirmationModalOpen(false);
        }}
      />
      <div className="w-[90%]">
        <BreadCrumb />
        <Heading text="Cart" />
        {!isAuthenticated && (
          <div className="flex justify-center items-center text-center h-[400px]">
            <h1 className="text-2xl font-bold text-gray-500">
              Please login to see your cart
            </h1>
          </div>
        )}
        {isAuthenticated && (
          <div className="flex flex-col md:flex-row mt-4">
            {/* No items message */}
            <div
              style={{ display: productData.length < 1 ? "" : "none" }}
              className="w-full md:w-4/5 md:mr-3"
            >
              <p className="text-center text-xl">No items in the cart</p>
            </div>
            {/* cart items */}
            <div
              style={{ display: productData.length < 1 ? "none" : "" }}
              className="w-full md:w-4/5 md:mr-3"
            >
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
                      onClick={() =>
                        handleRemoveFromCartClicked(product.productId)
                      }
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
                    handlePayment();
                  }}
                  className="bg-mainYellow text-black px-4 py-2 rounded-full mt-4"
                >
                  Checkout
                </button>
              </div>
              <div className="mt-4">
                <h2>You can test the payment with following details:</h2>
                <p>
                  Card No: 5267 3181 8797 5449
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      const tempInput = document.createElement("input");
                      tempInput.value = "5267 3181 8797 5449";
                      document.body.appendChild(tempInput);
                      tempInput.select();
                      document.execCommand("copy");
                      document.body.removeChild(tempInput);

                      toast.success("Card number copied to clipboard");
                    }}
                  >
                    📋{" "}
                  </span>
                </p>
                <p>Expiry: 10/25</p>
                <p>CVV: 123</p>
              </div>
            </div>
          </div>
        )}
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
