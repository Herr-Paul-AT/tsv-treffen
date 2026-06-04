import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { rawRows } from '@/lib/db/raw';
import { duesInvoices, duesPeriods, members } from '@/lib/db/schema';

export type DuesRow = {
  invoiceId: string;
  memberId: string;
  memberName: string;
  memberEmail: string | null;
  initials: string;
  avatarTone: string;
  category: string;
  amountCents: number;
  paidCents: number;
  status: 'paid' | 'open' | 'partial' | 'waived';
  dueDate: Date;
  invoiceNumber: string | null;
  remindedAt: Date | null;
  paidAt: Date | null;
  daysOverdue: number;
};

export async function listInvoicesForYear(year: number): Promise<DuesRow[]> {
  const rows = await db
    .select({
      invoice: duesInvoices,
      member: members,
      period: duesPeriods,
    })
    .from(duesInvoices)
    .innerJoin(members, eq(members.id, duesInvoices.memberId))
    .innerJoin(duesPeriods, eq(duesPeriods.id, duesInvoices.duesPeriodId))
    .where(eq(duesPeriods.year, year))
    .orderBy(asc(duesInvoices.status), asc(members.lastName));

  const today = new Date();
  return rows.map((r) => {
    const due = new Date(r.invoice.dueDate);
    const daysOverdue = Math.max(0, Math.floor((today.getTime() - due.getTime()) / 86_400_000));
    return {
      invoiceId: r.invoice.id,
      memberId: r.member.id,
      memberName: `${r.member.firstName} ${r.member.lastName}`,
      memberEmail: r.member.email,
      initials: r.member.initials,
      avatarTone: r.member.avatarTone,
      category: r.period.category,
      amountCents: r.invoice.amountCents,
      paidCents: r.invoice.paidCents,
      status: r.invoice.status,
      dueDate: due,
      invoiceNumber: r.invoice.invoiceNumber,
      remindedAt: r.invoice.remindedAt,
      paidAt: r.invoice.paidAt,
      daysOverdue,
    };
  });
}

export type DuesStats = {
  totalCents: number;
  paidCents: number;
  openCents: number;
  invoicesPaid: number;
  invoicesOpen: number;
  invoicesPartial: number;
  collectionRate: number; // 0..1
};

export async function getDuesStats(year: number): Promise<DuesStats> {
  const rows = await rawRows<{
    total_cents: number;
    paid_cents: number;
    open_cents: number;
    paid: number;
    open: number;
    partial: number;
  }>(sql`
    SELECT
      COALESCE(SUM(i.amount_cents), 0)::int AS total_cents,
      COALESCE(SUM(i.paid_cents), 0)::int AS paid_cents,
      COALESCE(SUM(i.amount_cents - i.paid_cents) FILTER (WHERE i.status IN ('open','partial')), 0)::int AS open_cents,
      COUNT(*) FILTER (WHERE i.status = 'paid')::int AS paid,
      COUNT(*) FILTER (WHERE i.status = 'open')::int AS open,
      COUNT(*) FILTER (WHERE i.status = 'partial')::int AS partial
    FROM dues_invoices i
    JOIN dues_periods p ON p.id = i.dues_period_id
    WHERE p.year = ${year}
  `);
  const r = rows[0] ?? { total_cents: 0, paid_cents: 0, open_cents: 0, paid: 0, open: 0, partial: 0 };
  return {
    totalCents: r.total_cents,
    paidCents: r.paid_cents,
    openCents: r.open_cents,
    invoicesPaid: r.paid,
    invoicesOpen: r.open,
    invoicesPartial: r.partial,
    collectionRate: r.total_cents > 0 ? r.paid_cents / r.total_cents : 0,
  };
}

export async function getInvoicesForMember(memberId: string): Promise<DuesRow[]> {
  const rows = await db
    .select({
      invoice: duesInvoices,
      member: members,
      period: duesPeriods,
    })
    .from(duesInvoices)
    .innerJoin(members, eq(members.id, duesInvoices.memberId))
    .innerJoin(duesPeriods, eq(duesPeriods.id, duesInvoices.duesPeriodId))
    .where(eq(duesInvoices.memberId, memberId))
    .orderBy(asc(duesPeriods.year));

  const today = new Date();
  return rows.map((r) => {
    const due = new Date(r.invoice.dueDate);
    const daysOverdue = Math.max(0, Math.floor((today.getTime() - due.getTime()) / 86_400_000));
    return {
      invoiceId: r.invoice.id,
      memberId: r.member.id,
      memberName: `${r.member.firstName} ${r.member.lastName}`,
      memberEmail: r.member.email,
      initials: r.member.initials,
      avatarTone: r.member.avatarTone,
      category: r.period.category,
      amountCents: r.invoice.amountCents,
      paidCents: r.invoice.paidCents,
      status: r.invoice.status,
      dueDate: due,
      invoiceNumber: r.invoice.invoiceNumber,
      remindedAt: r.invoice.remindedAt,
      paidAt: r.invoice.paidAt,
      daysOverdue,
    };
  });
}
