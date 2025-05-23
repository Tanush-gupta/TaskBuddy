import React from "react";

interface AdminOptionsProps {
  activeComponent: "tasks" | "users";
  setActiveComponent: (component: "tasks" | "users") => void;
}

const AdminOptions: React.FC<AdminOptionsProps> = ({
  activeComponent,
  setActiveComponent,
}) => {
  return (
    <div className="flex w-full pl-10 flex-col gap-4 mt-6">
      <p className=" font-medium">Welcome back Admin!</p>
      <div className="flex w-full gap-6 items-center">
        <button
          className={`px-6 py-2 rounded font-semibold transition ${
            activeComponent === "tasks"
              ? "bg-emerald-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setActiveComponent("tasks")}>
          Tasks
        </button>
        <button
          className={`px-6 py-2 rounded font-semibold transition ${
            activeComponent === "users"
              ? "bg-emerald-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setActiveComponent("users")}>
          Users
        </button>
      </div>
    </div>
  );
};

export default AdminOptions;
