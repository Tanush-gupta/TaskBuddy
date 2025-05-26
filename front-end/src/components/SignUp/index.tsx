import React, { useState } from "react";
import { EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { baseURL } from "../../constants/constants";
import { toast } from "sonner";
interface SignUpProps {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}
const SignUp: React.FC<SignUpProps> = ({ setLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/user/register`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      toast.success("Sign Up Successful");
      router.replace("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className=" p-8 bg-white rounded-lg shadow gap-8 flex flex-col w-96 ">
      <p className="text-center font-bold text-xl">Create an Account</p>
      <form onSubmit={handleSubmit}>
        <div className="gap-6 flex flex-col">
          <div className="flex flex-col gap-4">
            <p className="font-semibold">Email Address</p>
            <input
              type="text"
              value={email}
              placeholder="abc@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="align-center justify-center flex p-2 bg-slate-50 text-sm"
            />
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-semibold">Password</p>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*****"
                className="align-center justify-center flex p-2 bg-slate-50 text-sm w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}>
                <EyeOff size={16} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#FFD369] text-[#EEEEEE] p-2 rounded-lg font-semibold"
            onClick={handleSubmit}>
            Sign Up
          </button>
        </div>
      </form>

      <div>
        <p className="text-center text-sm font-medium">
          Already have an account?{" "}
          <a
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => {
              setLogin(true);
            }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
