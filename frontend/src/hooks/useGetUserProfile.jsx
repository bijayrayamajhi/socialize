import { setUserProfile } from "@/components/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!userId) return;
    const fetchUserProfile = async () => {
      try {
        console.log(userId);
        const res = await axios.get(
          `https://socialize-cpzw.onrender.com/api/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId, dispatch]);
};

export default useGetUserProfile;
