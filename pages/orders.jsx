import { useState, useEffect } from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import GlobalLoader from "@/components/loaders/GlobalLoader";
import Heading from "@/components/widgets/Heading";
import { getAllOrdersOfUser } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const OrderCard = ({ orderData }) => {
  const router = useRouter();
  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };
  return (
    <div>
      <Heading text="Your Orders" />
      <ul className="space-y-4">
        {orderData.map((order) => (
          <li
            key={order._id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">
              Order ID: {order.orderId}
            </h2>
            <p className="text-lg">Total Amount: {order.totalAmount}</p>
            <p className="text-lg">Total Items: {order.totalItems}</p>
            <ul className="mt-2 space-y-1">
              {order.orderInformation.map((item) => (
                <div key={item._id} className="text-sm my-3">
                  <p>Product ID: {item.productId}</p>
                  <p> Quantity: {item.quantity}</p>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleProductClick(item.productId)}
                  >
                    View Product
                  </button>
                </div>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Orders = () => {
  const { accessToken, isAuthenticated } = useAuth();
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    try {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const response = await getAllOrdersOfUser(accessToken);
      setUserOrders(response.orders.reverse());
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
    fetchAllOrders();
  }, [accessToken]);

  return (
    <div className="flex justify-center my-6">
      <div className="w-[90%] sm:w-[75%]">
        <BreadCrumb />

        {!isAuthenticated && (
          <div className="flex justify-center items-center text-center h-[400px]">
            <h1 className="text-2xl font-bold text-gray-500">
              Please login to see your orders
            </h1>
          </div>
        )}

        {isAuthenticated && !loading && userOrders.length === 0 && (
          <div className="flex justify-center items-center text-center h-[400px]">
            <h1 className="text-2xl font-bold text-gray-500">
              You have no orders.
            </h1>
          </div>
        )}
        {isAuthenticated && userOrders.length > 0 && (
          <OrderCard orderData={userOrders} />
        )}

        {loading && (
          <GlobalLoader
            tag="Fetching Order items....."
            color="black"
            size={60}
            width={6}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
