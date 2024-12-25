import axios from "axios";

export const fetchAnime = async () => {
  try {
    const response = await axios.get("https://api.jikan.moe/v4/anime");
    return response.data;
  } catch (error) {
    console.error("Error fetching anime:", error);
    throw error;
  }
};

export const filterAnime = async (params) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await axios.get(`https://api.jikan.moe/v4/anime?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error filtering anime:", error);
    throw error;
  }
};