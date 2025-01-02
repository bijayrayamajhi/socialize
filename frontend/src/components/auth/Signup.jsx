import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeClosed, Loader2, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Signup() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://socialize-cpzw.onrender.com/api/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate("/verify-email");
        toast.success(res.data.message);
        setInput({
          username: "",
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
      <form className='shadow-2xl flex flex-col gap-5 p-8' onSubmit={signupHandler}>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-center'>
            Signup to see photos & videos from your friends
          </p>
        </div>
        <div className='flex flex-col items-start'>
          <Label htmlFor='username' className='text-left text-md mb-1'>
            Username:
          </Label>
          <Input
            id='username'
            type='text'
            placeholder='Username'
            name='username'
            value={input.username}
            onChange={changeEventHandler}
          />
        </div>
        <div className='flex flex-col items-start relative'>
          <Label htmlFor='email' className='text-left text-md mb-1'>
            Email:
          </Label>
          <div className='relative w-full'>
            <Mail
              className={
                "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 "
              }
            />
            <Input
              id='email'
              type='email'
              placeholder='Email'
              name='email'
              value={input.email}
              onChange={changeEventHandler}
              className='pl-10' // Adjust to align the text with the icon
              // style={{ textIndent: input.email ? "1em" : "0" }}
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
          {loading ? <Loader2 className='animate-spin h-5 w-5 text-white' /> : "Signup"}
        </Button>
        <span className='text-center'>
          Already have an account? &nbsp;
          <Link to='/login' className='text-blue-700'>
            Login
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Signup;
