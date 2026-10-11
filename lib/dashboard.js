// Aggregates real data for the admin Overview page (app/(admin)/admin/page.jsx).
import { prisma } from "@/lib/db";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// One hue, shades from dark to light — not four unrelated brand colors with
// no meaning behind which class gets which.
const ENROLLMENT_COLORS = ["#c8102e", "#dd4a63", "#e88a99", "#f2bcc4"];

export async function getDashboardData() {
  const now = new Date();
  const today0 = startOfDay(now);
  const today1 = endOfDay(now);
  const yesterday0 = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  const yesterday1 = endOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(thisMonthStart.getTime() - 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    trialsToday,
    trialsYesterday,
    pendingAdmissions,
    feesDueAgg,
    feesOverdueAgg,
    monthlyRevenueAgg,
    lastMonthRevenueAgg,
    activeStudents,
    recentAdmissions,
    upcomingTrials,
    activeStudentsWithClass,
    paidFeesLast6Months,
  ] = await Promise.all([
    prisma.trialBooking.count({ where: { preferredDateTime: { gte: today0, lte: today1 } } }),
    prisma.trialBooking.count({
      where: { preferredDateTime: { gte: yesterday0, lte: yesterday1 } },
    }),
    prisma.admission.count({ where: { status: "PENDING" } }),
    prisma.fee.aggregate({ where: { status: "PENDING" }, _sum: { amount: true }, _count: true }),
    prisma.fee.aggregate({ where: { status: "OVERDUE" }, _sum: { amount: true }, _count: true }),
    prisma.fee.aggregate({
      where: { status: "PAID", paidAt: { gte: thisMonthStart } },
      _sum: { amount: true },
    }),
    prisma.fee.aggregate({
      where: { status: "PAID", paidAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      _sum: { amount: true },
    }),
    prisma.student.count({ where: { active: true } }),
    prisma.admission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.trialBooking.findMany({
      where: { preferredDateTime: { gte: today0 } },
      orderBy: { preferredDateTime: "asc" },
      take: 5,
    }),
    prisma.student.findMany({ where: { active: true }, select: { className: true } }),
    prisma.fee.findMany({
      where: { status: "PAID", paidAt: { gte: sixMonthsAgo } },
      select: { amount: true, paidAt: true },
    }),
  ]);

  const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const revenue = paidFeesLast6Months
      .filter(
        (f) => f.paidAt.getFullYear() === d.getFullYear() && f.paidAt.getMonth() === d.getMonth()
      )
      .reduce((sum, f) => sum + f.amount, 0);
    return { month: d.toLocaleString("en-US", { month: "short" }), revenue };
  });

  const classCounts = {};
  for (const s of activeStudentsWithClass) {
    const key = s.className || "Unassigned";
    classCounts[key] = (classCounts[key] || 0) + 1;
  }
  const totalWithClass = activeStudentsWithClass.length || 1;
  const enrollmentByStyle = Object.entries(classCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([style, count], i) => ({
      style,
      percent: Math.round((count / totalWithClass) * 100),
      color: ENROLLMENT_COLORS[i % ENROLLMENT_COLORS.length],
    }));

  const monthlyRevenue = monthlyRevenueAgg._sum.amount || 0;
  const lastMonthRevenue = lastMonthRevenueAgg._sum.amount || 0;
  const revenueTrendPercent =
    lastMonthRevenue > 0
      ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : null;

  return {
    stats: {
      trialsToday,
      trialsTodayDelta: trialsToday - trialsYesterday,
      pendingAdmissions,
      feesDue: feesDueAgg._sum.amount || 0,
      feesDueCount: feesDueAgg._count,
      feesOverdue: feesOverdueAgg._sum.amount || 0,
      feesOverdueCount: feesOverdueAgg._count,
      monthlyRevenue,
      revenueTrendPercent,
      activeStudents,
    },
    revenueByMonth,
    enrollmentByStyle,
    recentAdmissions: recentAdmissions.map((a) => ({
      id: a.id,
      name: a.studentName,
      className: a.classInterest || "—",
      status: a.status,
    })),
    upcomingTrials: upcomingTrials.map((t) => ({
      id: t.id,
      name: t.name,
      interest: t.interests[0] || "—",
      preferredDateTime: t.preferredDateTime,
    })),
  };
}
