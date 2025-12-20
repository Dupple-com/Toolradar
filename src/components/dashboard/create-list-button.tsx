"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export function CreateListButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, public: isPublic }),
      });

      if (res.ok) {
        const list = await res.json();
        setIsOpen(false);
        setName("");
        setDescription("");
        setIsPublic(false);
        router.push(`/dashboard/lists/${list.id}`);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
      >
        <Plus size={16} />
        New List
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg">Create New List</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My awesome tools"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Description <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this list about?"
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Make this list public</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create List"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
