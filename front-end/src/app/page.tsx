"use client";
import React, { useEffect } from "react";
import DashBoard from "@/components/dashBoard";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user === null) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  if (loading) return <Loader />;
  return <>{user ? <DashBoard user={user} /> : <Loader />}</>;
}
