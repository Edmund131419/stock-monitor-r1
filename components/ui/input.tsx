import React from "react";

export function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="border rounded-xl px-3 py-2 outline-none text-sm w-full"
    />
  );
}
