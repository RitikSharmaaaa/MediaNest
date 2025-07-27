import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";

const useGetSuggestedUser = () => {
  const dispatch = useDispatch();
  const suggestedUsers = useSelector((state) => state.auth.suggestedUsers || []);

  useEffect(() => {
    if (suggestedUsers.length > 0) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:9000/user/suggested", {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.user));
        }
      } catch (err) {
        console.error("Error fetching suggested users:", err.response?.data || err.message);
      }
    };

    fetchUsers();
  }, [dispatch, suggestedUsers]);
};

export default useGetSuggestedUser;
