import axios from "axios";

const API_URL = "http://localhost:3000"; // tu backend

export const getProducts = async () => {
  const res = await axios.get(`${API_URL}/public/products`);
  return res.data;
};
