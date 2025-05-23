import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#222831] gap-4">
      <p className="text-white font-semibold text-2xl">Loading...</p>
      <div
        className={`w-12 h-12 border-4 text-blue-500 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default Loader;
