import { setPosts } from "@/components/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get(
          "https://socialize-cpzw.onrender.com/api/post/allpost",
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPosts();
  }, [dispatch]);
};

export default useGetAllPosts;
