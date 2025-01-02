import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeClosed, Loader2, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/user/login", input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });

  return (
    <div className='flex items-center min-w-screen h-screen justify-center'>
      <form className='shadow-2xl flex flex-col gap-5 p-8' onSubmit={loginHandler}>
        <div className='my-4'>
          <h1 className='text-center italic font-bold text-xl text-blue-600'>
            SOCIALIZEE
          </h1>
          <p className='text-sm text-center'>
            Login to see photos & videos from your friends
          </p>
        </div>
        <div className='flex flex-col items-start relative'>
          <Label htmlFor='email' className='text-left text-md mb-1'>
            Email:
          </Label>
          <div className='relative w-full'>
            <Mail
              className={
                "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
              }
            />
            <Input
              id='email'
              type='email'
              placeholder='Email'
              name='email'
              value={input.email}
              onChange={changeEventHandler}
              className='pl-10'
            />
          </div>
        </div>
        <div className='flex flex-col items-start relative'>
          <Label htmlFor='password' className='text-left text-md mb-1'>
            Password:
          </Label>
          <div className='relative w-full'>
            <LockKeyhole className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm' />

            <Input
              id='password'
              type={isPasswordVisible ? "text" : "password"}
              placeholder='Password'
              name='password'
              value={input.password}
              onChange={changeEventHandler}
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
        <Button type='submit' disabled={loading}>
          {loading ? <Loader2 className='animate-spin h-5 w-5 text-white' /> : "Login"}
        </Button>
        <span className='text-center'>
          Donot have an account? &nbsp;
          <Link to='/signup' className='text-blue-700'>
            Signup
          </Link>
        </span>
        <span className='text-center'>
          <Link to='/forgot-password' className='text-blue-700'>
            Foogot password
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Login;
