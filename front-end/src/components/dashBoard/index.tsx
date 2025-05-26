import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import TasksContainer from "@/components/TasksContainer";
import AdminSidebar from "@/components/AdminSidebar/adminSidebar";
import Users from "../Users/Users";

interface DashBoardProps {
  user: any;
}

const DashBoard: React.FC<DashBoardProps> = ({ user }) => {
  const [activeComponent, setActiveComponent] = useState<"tasks" | "users">(
    "tasks"
  );

  const isAdmin = user?.role === "admin";

  const renderContent = () => {
    switch (activeComponent) {
      case "tasks":
        return <TasksContainer />;
      case "users":
        return <Users />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#393E46] text-white overflow-x-scroll">
      {/* Main Content */}
      <div className="flex-1 flex flex-col  gap-0">
        {/* Top NavBar */}
        <NavBar user={user} />
        {isAdmin && (
          <AdminSidebar
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
        )}

        {/* Page Content */}
        <div className="p-4 overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DashBoard;
