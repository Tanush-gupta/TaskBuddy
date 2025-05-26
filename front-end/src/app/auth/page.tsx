"use client";
import { useState } from "react";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[#222831]">
      {isLogin ? (
        <Login setLogin={setIsLogin} />
      ) : (
        <SignUp setLogin={setIsLogin} />
      )}
    </div>
  );
};

export default Auth;
