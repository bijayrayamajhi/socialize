import { setMessages } from "@/components/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = () => {
  const { selectedUser } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        if (!selectedUser?._id) return;
        const res = await axios.get(
          `http://localhost:8080/api/message/all/${selectedUser?._id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessages();
  }, [selectedUser, dispatch]);
};

export default useGetAllMessages;
