import { useState } from "react";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function DeleteContactButton({ contactId, onDeleted }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!contactId || loading) return;

    if (!confirm("Are you sure you want to delete this contact?")) return;

    setLoading(true);
    try {
      const res = await fetch(`https://contacts-manager-y75i.onrender.com/${contactId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to delete');
      }

      toast.success("Contact deleted successfully!");
      onDeleted?.(contactId);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700 disabled:opacity-60"
      aria-label="Remove contact"
      title="Remove contact"
    >
      <Trash size={18} />
      {loading ? "Removing..." : "Remove Contact"}
    </button>
  );
}

