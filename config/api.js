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

export const clearCart = async (accessToken) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await api.delete("/users/clearcart", { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (accessToken, amount) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      amount: amount,
    };

    const response = await api.post("/payment/orders", data, { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyPayment = async (accessToken, orderData) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await api.post("/payment/verify", orderData, { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveOrder = async (accessToken, orderData) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await api.post("/payment/saveorder", orderData, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllOrdersOfUser = async (accessToken) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await api.get("/users/orders", { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBrandNames = async () => {
  try {
    const response = await api.get("/brands");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllModelNames = async () => {
  try {
    const response = await api.get("/brands/models");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProductIds = async () => {
  try {
    const response = await api.get("/products/all-products-ids");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductDataByBrandId = async (BrandId) => {
  try {
    const response = await api.get(`/products/brand/${BrandId}?page=1`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductDataByBrandIdAndModelId = async (BrandId, ModelId) => {
  try {
    const response = await api.get(
      `/products/model/${BrandId}/${ModelId}?page=1`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await api.get(`/products/search?query=${query}&page=1`);
    return response.data.products;
  } catch (error) {
    throw error;
  }
};

export default api;
