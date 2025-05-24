import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/constants/constants";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/utils/common";

interface User {
  _id: string;
  email: string;
  role: "user" | "admin";
}

const UserManagementPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addingUser, setAddingUser] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseURL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      await axios.put(`${baseURL}/admin/users/${editingUser._id}`, formState, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch {
      toast.error("Error updating user");
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post(`${baseURL}/user/register`, formState);
      toast.success("User added successfully");
      setAddingUser(false);
      setFormState({ email: "", password: "", role: "user" });
      fetchUsers();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (userId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;
    try {
      await axios.delete(`${baseURL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={() => setAddingUser(true)}>Add User</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="rounded-xl shadow-md p-4 bg-white dark:bg-[#2c2f36] text-black dark:text-white gap-4">
            <p className="font-semibold text-md">{user.email}</p>
            <p className="text-xs text-gray-500">Role: {user.role}</p>
            <div className="flex gap-2 mt-1">
              <Button
                className="text-sm text-white"
                onClick={() => {
                  setEditingUser(user);
                  setFormState({
                    email: user.email,
                    password: "",
                    role: user.role,
                  });
                }}>
                Edit
              </Button>
              <Button
                className="bg-red-400 hover:bg-red-600 text-white text-sm"
                onClick={() => handleDelete(user._id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingUser}
        onClose={() => {
          setEditingUser(null);
          setFormState({ email: "", password: "", role: "user" });
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Email"
              value={formState.email}
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
            />
            <Input
              placeholder="Password (leave blank to keep unchanged)"
              type="password"
              value={formState.password}
              onChange={(e) =>
                setFormState({ ...formState, password: e.target.value })
              }
            />
            <select
              value={formState.role}
              onChange={(e) =>
                setFormState({ ...formState, role: e.target.value })
              }
              className="p-2 border rounded-md dark:bg-[#1f1f1f]">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog
        open={addingUser}
        onClose={() => {
          setAddingUser(false);
          setFormState({ email: "", password: "", role: "user" });
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Email"
              value={formState.email}
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
            />
            <Input
              placeholder="Password"
              type="password"
              value={formState.password}
              onChange={(e) =>
                setFormState({ ...formState, password: e.target.value })
              }
            />
            <select
              value={formState.role}
              onChange={(e) =>
                setFormState({ ...formState, role: e.target.value })
              }
              className="p-2 border rounded-md dark:bg-[#1f1f1f]">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPanel;
