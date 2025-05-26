"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../TaskCard";
import { PlusIcon } from "lucide-react";
import NewTask from "../NewTask";
import { options } from "./tabOptions";
import { baseURL } from "@/constants/constants";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in progress" | "completed";
  priority: "low" | "medium" | "high";
  documents?: {
    fileName: string;
    fileUrl: string;
    _id: string;
    uploadDate: string;
  }[];
  assignedTo?: string;
}

const TasksContainer: React.FC = () => {
  const [showNewTask, setShowNewTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [triggerApiCall, setTriggerApiCall] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [tab, setTab] = useState<0 | 1 | 2 | 3>(0);

  const statusFilterMap = {
    0: "",
    1: "pending",
    2: "in progress",
    3: "completed",
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const params: any = {
          sort: sortField,
          order: sortOrder,
          status: statusFilterMap[tab] || undefined,
          priority: priorityFilter || undefined,
          page: 1,
          limit: 1000,
        };
        if (!params.status) delete params.status;
        if (!params.priority) delete params.priority;

        const { data } = await axios.get(`${baseURL}/task`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        setTasks(data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, [showNewTask, triggerApiCall, tab, priorityFilter, sortField, sortOrder]);

  return (
    <div className="bg-[#222831] rounded-lg gap-8 flex flex-col  m-4 p-2 lg:p-8 flex-grow">
      {(showNewTask || editTask) && (
        <NewTask
          setShowNewTask={setShowNewTask}
          taskToEdit={editTask}
          setEditTask={setEditTask}
          setTriggerApiCall={setTriggerApiCall}
        />
      )}

      <div className="flex flex-wrap gap-4 mt-4 items-center text-gray-300">
        <div>
          <label htmlFor="statusFilter" className="mr-2 font-semibold">
            Status:
          </label>
          <select
            id="statusFilter"
            value={tab}
            onChange={(e) => setTab(Number(e.target.value) as 0 | 1 | 2 | 3)}
            className="rounded px-2 py-1 text-black">
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="priorityFilter" className="mr-2 font-semibold">
            Priority:
          </label>
          <select
            id="priorityFilter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded px-2 py-1 text-black">
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortField" className="mr-2 font-semibold">
            Sort By:
          </label>
          <select
            id="sortField"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="rounded px-2 py-1 text-black">
            <option value="createdAt">Created At</option>
            <option value="dueDate">Due Date</option>
            {/* <option value="priority">Priority</option> */}
            {/* <option value="status">Status</option> */}
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className="mr-2 font-semibold">
            Order:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value === "asc" ? "asc" : "desc")
            }
            className="rounded px-2 py-1 text-black">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="gap-4 grid grid-cols-12">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            setTrigger={setTriggerApiCall}
            onEdit={setEditTask}
          />
        ))}

        <div
          className="bg-[#72757b] gap-4 cursor-pointer rounded-lg justify-center items-center p-4 flex flex-col shadow-md col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 min-h-[256px] text-gray-300 font-semibold"
          onClick={() => setShowNewTask(true)}>
          <PlusIcon size={32} />
          <p>Create a new Task</p>
        </div>
      </div>

      <button
        className="absolute bottom-16 right-16 bg-[#FFD369] hover:bg-[#ffd981] text-white font-bold rounded-full p-3"
        onClick={() => setShowNewTask(true)}
        aria-label="Add new task">
        <PlusIcon size={32} />
      </button>
    </div>
  );
};

export default TasksContainer;
