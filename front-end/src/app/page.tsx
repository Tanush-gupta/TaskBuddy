"use client";
import React, { useEffect } from "react";
import axios from "axios";
import DashBoard from "@/components/dashBoard";
import { baseURL } from "../constants/constants.js";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
    }
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/getUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          setUser(response.data);
          console.log("User is authenticated");
        }
      } catch (error) {
        router.replace("/auth");
        console.log("error", error);
      }
    };
    fetchUser();
  }, []);

  return <>{user ? <DashBoard user={user} /> : <Loader />}</>;
}
