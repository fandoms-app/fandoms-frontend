import { Link } from "react-router-dom";

interface QuickButtonProps {
  to: string;
  label: string;
}

export default function QuickButton({ to, label }: QuickButtonProps) {
  return (
    <Link
      to={to}
      className="px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition"
    >
      {label}
    </Link>
  );
}
