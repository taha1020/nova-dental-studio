"use client";

import { useRouter } from "next/navigation";

export default function StatusButtons({
  id,
}: {
  id: number;
}) {
  const router = useRouter();

  async function updateStatus(status: string) {
    await fetch("/api/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status,
      }),
    });

    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateStatus("Confirmed")}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
      >
        Accept
      </button>

      <button
        onClick={() => updateStatus("Rejected")}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
      >
        Reject
      </button>
    </div>
  );
}