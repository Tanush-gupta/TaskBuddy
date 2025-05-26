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
export type { Task };
