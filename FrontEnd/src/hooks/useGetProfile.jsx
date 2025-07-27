import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";

const useGetProfile = (user_id) => {
  const dispatch = useDispatch();

  useEffect(() => {
   
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/user/${user_id}/profile`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (err) {
        console.error("Error fetching suggested users:", err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, [user_id]);
};

export default useGetProfile;
