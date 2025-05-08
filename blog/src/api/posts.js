import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const fetchPosts = async ({limit, offset}) => {
  const res = await axios.get(`${API_URL}/posts`,
    {params: {limit, offset}})
  return res.data;
}

export const fetchPostByUuid = async ({uuid}) => {
  const res = await axios.get(`${API_URL}/post/${uuid}`,
    {params: {uuid}});
  return res.data;
}
