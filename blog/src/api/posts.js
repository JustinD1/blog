import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getAuthToken = () => {
  return localStorage.getItem("token");
}
export const fetchPosts = async ({limit, offset}) => {
  console.log("limit", limit);
  console.log("offset", offset);
  const res = await axios.get(`${API_URL}/posts`,
    {params: {limit, offset}})
  return res.data;
}

export const fetchPostsAdmin = async ({limit, offset}) => {
  const token = getAuthToken();

  const config = {
    headers: {Authorization: `Bearer ${token}`},
    params: {limit, offset}
  }
  const res = await axios.get(`${API_URL}/admin_view`, config);
  return res.data;
}

export const fetchPostByUuid = async ({uuid}) => {
  const res = await axios.get(`${API_URL}/post/${uuid}`,
    {params: {uuid}});
  return res.data;
}
