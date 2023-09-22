import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
});

export const removeFromWishList = async (productId, accessToken) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const requestData = {
      productId: productId,
    };

    const response = await api.delete("/users/wishlist", {
      data: requestData,
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function addToWishlist2(accessToken, productId) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      productId: productId,
    };

    const response = await api.post("/users/wishlist", data, { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export const addToCart = async (accessToken, productId, quantity) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      productId: productId,
      quantity: quantity,
    };

    const response = await api.post("/users/cart", data, { headers });
    toast.success(
      `${quantity} ${quantity > 1 ? "items" : "item"} added to cart`
    );

    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      toast.error("Please login to add to cart");
    } else {
      toast.error("There was an error adding to cart");
    }
    throw error;
  }
};

export const updateCartQuantity = async (accessToken, productId, quantity) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      productId: productId,
      quantity: quantity,
    };

    const response = await api.put("/users/cart", data, { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCartItems = async (accessToken) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await api.get("/users/cart", { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (accessToken, productId) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      productId: productId,
    };

    const response = await api.delete("/users/cart", { data, headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
