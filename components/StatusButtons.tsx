"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";

type StatusButtonsProps = {
  id: number;
};

type PendingAction = "Confirmed" | "Rejected" | null;

export default function StatusButtons({
  id,
}: StatusButtonsProps) {
  const router = useRouter();

  const [loadingStatus, setLoadingStatus] =
    useState<PendingAction>(null);

  const [confirmReject, setConfirmReject] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function updateStatus(
    status: "Confirmed" | "Rejected"
  ) {
    if (loadingStatus) return;

    try {
      setError(null);
      setLoadingStatus(status);

      const response = await fetch(
        "/api/update-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            status,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to update appointment status."
        );
      }

      setConfirmReject(false);

      router.refresh();
    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update appointment status."
      );
    } finally {
      setLoadingStatus(null);
    }
  }

  return (
    <div className="relative">
      {/* ================= MAIN ACTIONS ================= */}

      {!confirmReject ? (
        <div className="flex items-center gap-2">
          {/* ACCEPT */}

          <button
            type="button"
            disabled={Boolean(loadingStatus)}
            onClick={() =>
              updateStatus("Confirmed")
            }
            className="
              inline-flex
              min-w-[92px]
              items-center
              justify-center
              gap-1.5
              rounded-xl
              bg-emerald-600
              px-3.5
              py-2.5
              text-xs
              font-bold
              text-white
              shadow-sm
              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:bg-emerald-700
              hover:shadow-md

              active:translate-y-0

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loadingStatus === "Confirmed" ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Saving
              </>
            ) : (
              <>
                <Check size={14} />
                Accept
              </>
            )}
          </button>

          {/* REJECT */}

          <button
            type="button"
            disabled={Boolean(loadingStatus)}
            onClick={() =>
              setConfirmReject(true)
            }
            className="
              inline-flex
              min-w-[88px]
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              border-rose-200
              bg-rose-50
              px-3.5
              py-2.5
              text-xs
              font-bold
              text-rose-700
              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:border-rose-300
              hover:bg-rose-100

              active:translate-y-0

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <X size={14} />
            Reject
          </button>
        </div>
      ) : (
        /* ================= REJECT CONFIRMATION ================= */

        <div
          className="
            min-w-[250px]
            rounded-2xl
            border
            border-rose-200
            bg-white
            p-3
            shadow-[0_16px_40px_rgba(15,23,42,0.14)]
          "
        >
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle size={16} />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900">
                Reject this request?
              </p>

              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                The appointment will be marked as
                rejected.
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={Boolean(loadingStatus)}
              onClick={() =>
                setConfirmReject(false)
              }
              className="
                rounded-lg
                px-3
                py-2
                text-[11px]
                font-bold
                text-slate-600
                transition
                hover:bg-slate-100
              "
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={Boolean(loadingStatus)}
              onClick={() =>
                updateStatus("Rejected")
              }
              className="
                inline-flex
                min-w-[105px]
                items-center
                justify-center
                gap-1.5
                rounded-lg
                bg-rose-600
                px-3
                py-2
                text-[11px]
                font-bold
                text-white
                transition
                hover:bg-rose-700

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loadingStatus === "Rejected" ? (
                <>
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                  Rejecting
                </>
              ) : (
                <>
                  <X size={13} />
                  Yes, Reject
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mt-2 max-w-[250px] rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
          <p className="text-[11px] font-medium leading-4 text-rose-700">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}