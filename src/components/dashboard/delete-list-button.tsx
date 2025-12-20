"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteListButtonProps {
  listId: string;
  listName: string;
}

export function DeleteListButton({ listId, listName }: DeleteListButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/dashboard/lists");
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Delete "{listName}"?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          className="px-3 py-1.5 border text-sm rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete list"
    >
      <Trash2 size={18} />
    </button>
  );
}
