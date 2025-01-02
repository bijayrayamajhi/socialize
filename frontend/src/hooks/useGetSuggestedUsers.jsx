import { setSuggestedUsers } from "@/components/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetsuggestedUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          "https://socialize-cpzw.onrender.com/api/user/suggested",
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.error("Failed to fetch suggested users:", error.message);
      }
    };

    fetchSuggestedUsers();
  }, [dispatch]);
};

export default useGetsuggestedUsers;
