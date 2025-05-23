import React from "react";
import { Task } from "@/types/task.type";
import { Trash2, Edit2 } from "lucide-react";
import axios from "axios";
import { baseURL, backendURL } from "@/constants/constants";
import { toast } from "sonner";
import Link from "next/link";

interface TaskCardProps {
  task: Task;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit: (task: Task) => void; // Pass task to edit
}

const TaskCard: React.FC<TaskCardProps> = ({ task, setTrigger, onEdit }) => {
  const isDue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/task/${task._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Task deleted successfully");
      setTrigger((prev) => !prev);
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  return (
    <div className="bg-[#2d313a] rounded-2xl shadow-lg p-6 col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 flex flex-col justify-between text-white transition-transform hover:scale-[1.01]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold mb-2">{task.title}</h3>
          {isDue && (
            <span className="text-red-400 text-sm font-semibold">
              ⚠️ Overdue
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Edit Task">
            <Edit2 size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Delete Task">
            <Trash2 size={20} className="text-red-500" />
          </button>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      <div className="text-sm text-gray-400 flex flex-col gap-1 mb-4">
        <p>
          <span className="font-semibold text-white">Due:</span>{" "}
          {new Date(task.dueDate).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p>
          <span className="font-semibold text-white">Priority:</span>{" "}
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </p>
        <p>
          <span className="font-semibold text-white">Status:</span>{" "}
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </p>
      </div>

      {task.documents && task.documents.length > 0 && (
        <div className="bg-white/5 rounded-lg p-2 text-sm text-gray-300">
          <p className="font-semibold mb-1 text-white">Documents:</p>
          <ul className="list-disc ml-5 space-y-1">
            {task.documents.map((doc) => (
              <li key={doc._id}>
                <Link
                  href={`${backendURL}/${doc.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-400">
                  {doc.fileName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
