import { ToolForm } from "@/components/admin/tool-form";

export default function NewToolPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Add New Tool</h1>
      <ToolForm />
    </div>
  );
}
