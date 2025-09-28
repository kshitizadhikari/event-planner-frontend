import axios from "axios";

const API_URL = "http://localhost:3000/tags";

export const getAllTags = async () => {
  return await axios.get(`${API_URL}/`);
};
