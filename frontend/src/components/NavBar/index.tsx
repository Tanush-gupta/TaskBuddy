import React from "react";
import { LogOut, Notebook } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { baseURL } from "@/constants/constants";
import { toast } from "sonner";
interface SideBarProps {
  user: { username: string };
}

const SideBar: React.FC<SideBarProps> = ({ user }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.get(`${baseURL}/user/logout`);
      localStorage.removeItem("token");
      toast.success("Logged out");
      router.replace("/auth");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  };
  return (
    <div className={"flex bg-[#222831] items-center justify-between p-4"}>
      <div className="flex items-center gap-2 px-4 justify-center">
        <Notebook size={24} color="white" />
        <p className="font-semibold text-gray-100">TaskMate</p>
      </div>

      <button
        className="flex items-center cursor-pointer text-red-500 hover:text-red-600 justify-center mx-5 gap-2"
        onClick={handleLogout}>
        <LogOut />
        <p className="font-semibold hidden sm:block">Logout</p>
      </button>
    </div>
  );
};

export default SideBar;
