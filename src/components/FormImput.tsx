import type { InputHTMLAttributes } from "react";

export default function FormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 ${props.className ?? ""}`}
    />
  );
}
