"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface RemoveFromListButtonProps {
  listId: string;
  toolId: string;
}

export function RemoveFromListButton({ listId, toolId }: RemoveFromListButtonProps) {
  const router = useRouter();

  const handleRemove = async () => {
    const res = await fetch(`/api/lists/${listId}/tools/${toolId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleRemove}
      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm border"
      title="Remove from list"
    >
      <X size={14} />
    </button>
  );
}
