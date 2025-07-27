import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPostUser } from "@/redux/postSlice";
import axios from "axios";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.post("http://localhost:9000/post/allpost", {}, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPostUser(res.data.post));
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [dispatch]);
};


export default useGetAllPost;