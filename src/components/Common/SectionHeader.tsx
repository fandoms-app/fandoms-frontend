import { Link } from "react-router-dom";

interface Props {
  title: string;
  link?: string;
  linkLabel?: string;
}

export default function SectionHeader({ title, link, linkLabel }: Props) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-xl font-semibold text-purple-700">{title}</h2>

      {link && linkLabel && (
        <Link
          to={link}
          className="text-purple-600 hover:underline text-sm font-medium"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
