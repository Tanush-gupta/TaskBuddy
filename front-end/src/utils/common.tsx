import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const Button = ({ children, onClick, className, ...props }: ButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-[#FFD369] hover:bg-[#ffc94b] text-black font-semibold rounded ${className}`}
    {...props}>
    {children}
  </button>
);

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  placeholder?: string;
}

const Input = ({
  value,
  onChange,
  type = "text",
  className = "",
  placeholder = "",
  ...props
}: InputProps) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={` text-black w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-300 ${className}`}
    {...props}
  />
);

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Dialog = ({ open, onClose, children }: DialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

interface DialogHeaderProps {
  children: React.ReactNode;
}

const DialogHeader = ({ children }: DialogHeaderProps) => (
  <div className="border-b border-gray-200 pb-2 mb-4">{children}</div>
);

interface DialogTitleProps {
  children: React.ReactNode;
}

const DialogTitle = ({ children }: DialogTitleProps) => (
  <h2 className="text-xl font-semibold text-gray-800">{children}</h2>
);

interface DialogContentProps {
  children: React.ReactNode;
}

const DialogContent = ({ children }: DialogContentProps) => (
  <div className="space-y-4">{children}</div>
);

export { Button, Input, Dialog, DialogHeader, DialogTitle, DialogContent };
