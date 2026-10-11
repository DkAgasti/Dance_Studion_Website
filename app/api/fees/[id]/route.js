// PATCH /api/fees/[id] — mark a fee as paid (admin only).
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const fee = await prisma.fee.update({
      where: { id },
      data: { status: "PAID", paidAt: new Date() },
      include: { student: { select: { name: true, className: true } } },
    });

    return Response.json({ fee });
  } catch (error) {
    console.error("Failed to mark fee as paid:", error);
    return Response.json({ error: "Failed to mark fee as paid" }, { status: 500 });
  }
}
