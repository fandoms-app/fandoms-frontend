import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white p-8 rounded-2xl shadow-lg w-full max-w-md ${className}`}
    >
      {children}
    </div>
  );
}
