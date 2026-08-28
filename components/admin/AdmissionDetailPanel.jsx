"use client";

import { Check, XCircle } from "lucide-react";
import DetailPanel from "@/components/admin/DetailPanel";
import { statusMeta, statusToKey } from "@/components/admin/admissionsData";

// "Applicant Details" panel — shown when a row is selected in the
// admissions table. Approve/Reject PATCH /api/admissions/[id].
export default function AdmissionDetailPanel({ applicant, onClose, onApprove, onReject }) {
  if (!applicant) return null;
  const meta = statusMeta[statusToKey[applicant.status]];

  return (
    <DetailPanel
      title="Applicant Details"
      onClose={onClose}
      avatarGradient="from-brand-mid/25 via-surface to-brand-start/15"
      name={applicant.studentName}
      subtitleLines={[applicant.email, applicant.phone].filter(Boolean)}
      badge={meta}
      actions={[
        {
          label: applicant.status === "APPROVED" ? "Approved" : "Approve Admission",
          onClick: onApprove,
          disabled: applicant.status === "APPROVED",
          icon: Check,
        },
        {
          label: applicant.status === "REJECTED" ? "Rejected" : "Reject",
          onClick: onReject,
          disabled: applicant.status === "REJECTED",
          variant: "outline",
          icon: XCircle,
        },
      ]}
    >
      {applicant.guardianName ? (
        <div className="mt-6 border-t border-border pt-5">
          <p className="eyebrow !text-[10px]">Guardian</p>
          <p className="mt-2 font-medium">
            {applicant.guardianName}
            {applicant.guardianRelationship ? ` (${applicant.guardianRelationship})` : ""}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {[applicant.guardianPhone, applicant.guardianEmail].filter(Boolean).join(" • ")}
          </p>
        </div>
      ) : null}

      {applicant.address ? (
        <div className="mt-5 border-t border-border pt-5">
          <p className="eyebrow !text-[10px]">Address</p>
          <p className="mt-2 text-sm text-muted-foreground">{applicant.address}</p>
        </div>
      ) : null}

      {applicant.notes ? (
        <div className="mt-5 border-t border-border pt-5">
          <p className="eyebrow !text-[10px]">Notes</p>
          <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
            {applicant.notes}
          </p>
        </div>
      ) : null}
    </DetailPanel>
  );
}
