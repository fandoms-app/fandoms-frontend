import type { ReactNode } from "react";

interface ListPreviewProps<T> {
  items: T[];
  emptyMessage: string;
  render: (item: T) => ReactNode;
}

export default function ListPreview<T>({
  items,
  emptyMessage,
  render
}: ListPreviewProps<T>) {
  if (items.length === 0) {
    return <p className="text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="min-w-[220px] max-w-[240px] shrink-0"
        >
          {render(item)}
        </div>
      ))}
    </div>
  );
}
