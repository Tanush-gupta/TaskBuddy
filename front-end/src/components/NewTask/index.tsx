import React, { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import axios from "axios";
import { baseURL, backendURL } from "@/constants/constants";
import { toast } from "sonner";
import Link from "next/link";

interface NewTaskProps {
  setShowNewTask: React.Dispatch<React.SetStateAction<boolean>>;
  taskToEdit?: any;
  setEditTask?: React.Dispatch<React.SetStateAction<any>>;
  setTriggerApiCall?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewTask: React.FC<NewTaskProps> = ({
  setShowNewTask,
  taskToEdit,
  setEditTask,
  setTriggerApiCall,
}) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
    priority: "medium",
    assignedTo: "",
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const fetchUsersAndCurrent = async () => {
      const token = localStorage.getItem("token");
      const currentRes = await axios.get(`${baseURL}/user/getUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(currentRes.data);

      if (!taskToEdit && currentRes.data?.role !== "admin") {
        setTask((prev) => ({ ...prev, assignedTo: currentRes.data._id }));
      }
      if (currentRes.data?.role === "admin") {
        const usersRes = await axios.get(`${baseURL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data.users);
      }
    };

    fetchUsersAndCurrent();
  }, [taskToEdit]);

  useEffect(() => {
    if (taskToEdit) {
      setTask({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: taskToEdit.dueDate?.split("T")[0],
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        assignedTo: taskToEdit.assignedTo,
      });
      setExistingFiles(taskToEdit.documents || []);
    }
  }, [taskToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const validNewFiles = Array.from(selectedFiles).filter((file) => {
      if (file.type !== "application/pdf") {
        toast.error(`Only PDF files are allowed: ${file.name}`);
        return false;
      }
      return true;
    });

    const totalFiles =
      documents.length + existingFiles.length + validNewFiles.length;
    if (totalFiles > 3) {
      toast.error("You can upload a maximum of 3 PDF documents.");
      return;
    }

    setDocuments((prev) => [...prev, ...validNewFiles]);
  };

  const handleFileDelete = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExistingFileDelete = async (fileId: string) => {
    // try {
    //   const token = localStorage.getItem("token");
    //   await axios.delete(`${baseURL}/task/delete-file/${fileId}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   toast.success("File deleted successfully");
    //   setExistingFiles((prev) => prev.filter((f) => f._id !== fileId));
    // } catch (error: any) {
    //   toast.error(error?.response?.data?.message || "Failed to delete file");
    // }
    setExistingFiles((prev) => prev.filter((f) => f._id !== fileId));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentDate = new Date();
      if (new Date(task.dueDate) < currentDate) {
        toast.error("Due date should be in the future.");
        return;
      }

      const formData = new FormData();
      for (const key in task) {
        if (key === "assignedTo" && !isAdmin) {
          continue;
        }
        formData.append(key, (task as any)[key]);
      }

      documents.forEach((doc) => {
        formData.append("taskFile", doc);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (taskToEdit) {
        await axios.put(`${baseURL}/task/${taskToEdit._id}`, formData, config);
        toast.success("Task Updated Successfully");
      } else {
        await axios.post(`${baseURL}/task`, formData, config);
        toast.success("Task Created Successfully");
      }
      setShowNewTask(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log("Error:", error);
    } finally {
      if (setTriggerApiCall) {
        setTriggerApiCall((prev) => !prev);
      }
      handleClose();
    }
  };
  const handleClose = () => {
    setShowNewTask(false);
    setTask({
      title: "",
      description: "",
      dueDate: "",
      status: "pending",
      priority: "medium",
      assignedTo: "",
    });
    setDocuments([]);
    setExistingFiles([]);
    setEditTask && setEditTask(null);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 overflow-x-scroll">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg flex flex-col gap-4 shadow-md relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={handleClose}>
          <X size={24} color="red" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900">
          {taskToEdit ? "Edit Task" : "Create a Task"}
        </h2>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Enter the title of the task"
            className="p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Enter the description of the task"
            className="p-2 h-24 border border-gray-300 rounded-md resize-none text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md text-gray-900">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md text-gray-900">
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Assigned To */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Assigned To</label>
          <select
            name="assignedTo"
            value={task.assignedTo}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md text-gray-900"
            disabled={!isAdmin}>
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">
            Attach Documents (PDF, max 3)
          </label>
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            className="p-2 border border-gray-300 rounded-md text-gray-900"
          />

          {(existingFiles.length > 0 || documents.length > 0) && (
            <ul className="mt-2 space-y-1">
              {existingFiles.map((file) => (
                <li
                  key={file._id}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                  <Link
                    href={`${backendURL}/${file.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:underline text-sm truncate max-w-[80%]">
                    {file.fileName}
                  </Link>
                  <button
                    onClick={() => handleExistingFileDelete(file._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete">
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
              {documents.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                  <a
                    href={URL.createObjectURL(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:underline text-sm truncate max-w-[80%]">
                    {file.name}
                  </a>
                  <button
                    onClick={() => handleFileDelete(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete">
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-[#FFD369] text-white font-medium rounded-lg p-2 hover:bg-[#d8ad49] transition">
          {taskToEdit ? "Update Task" : "Create Task"}
        </button>
      </div>
    </div>
  );
};

export default NewTask;
