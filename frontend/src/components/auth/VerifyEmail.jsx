import axios from "axios";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const handleChange = (index, value) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
    // Move to the next input field if a digit is entered
    if (value !== "" && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://socialize-cpzw.onrender.com/api/user/verify-email",
        {
          verificationToken: verificationCode,
        }
      );
      if (response.data.success) {
        navigate("/");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isVerified) {
      navigate("/");
    }
  });

  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <div className='p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200'>
        <div className='text-center'>
          <h1 className='font-extrabold text-2xl'>Verify your email</h1>
          <p className='text-sm text-gray-600'>
            Enter the 6 digit code sent to your email address
          </p>
        </div>
        <form onSubmit={submitHandler}>
          <div className='flex justify-between'>
            {otp.map((letter, idx) => (
              <Input
                key={idx}
                ref={(element) => (inputRef.current[idx] = element)}
                type='text'
                maxLength={1}
                value={letter}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className='md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            ))}
          </div>
          <Button
            type='submit'
            disabled={loading}
            className='bg-orange-400 hover:bg-hoverOrange mt-6 w-full'
          >
            {loading ? <Loader2 className='animate-spin h-5 w-5 text-white' /> : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
