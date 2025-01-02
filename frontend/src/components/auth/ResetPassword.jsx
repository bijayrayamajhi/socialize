import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed, Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams(); // Get token from the URL
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `https://socialize-cpzw.onrender.com/api/user/reset-password/${token}`,
        { newPassword }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen w-full'>
      <form
        className='flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4'
        onSubmit={handleSubmit}
      >
        <div className='text-center'>
          <h1 className='font-extrabold text-2xl mb-2'>Reset Password</h1>
          <p className='text-sm text-gray-600'>
            Enter your new password to reset the old one
          </p>
        </div>
        <div className='flex flex-col items-start relative'>
          <div className='relative w-full'>
            <LockKeyhole className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm' />

            <Input
              id='password'
              type={isPasswordVisible ? "text" : "password"}
              placeholder='Enter new password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='pl-10 pr-10 w-full'
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
            >
              {isPasswordVisible ? (
                <Eye className='text-sm' />
              ) : (
                <EyeClosed className='text-sm' />
              )}
            </button>
          </div>
        </div>
        <Button
          type='submit'
          disabled={loading}
          className='bg-orange-400 hover:bg-hoverOrange mt-6 w-full'
        >
          {loading ? (
            <Loader2 className='animate-spin h-5 w-5 text-white' />
          ) : (
            "Reset password"
          )}
        </Button>
        <span className='text-center'>
          Back to{" "}
          <Link to='/login' className='text-blue-500'>
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default ResetPassword;
