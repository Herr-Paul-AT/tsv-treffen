import { sql } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const avatarTone = pgEnum('avatar_tone', ['lake', 'sand', 'forest', 'stone']);
export const memberRole = pgEnum('member_role', [
  'member',
  'trainer',
  'jugendleiter',
  'obmann',
  'admin',
]);
export const memberStatus = pgEnum('member_status', ['active', 'probe', 'paused', 'inactive']);
export const paymentStatus = pgEnum('payment_status', ['paid', 'open', 'partial', 'waived']);

export const teamRole = pgEnum('team_role', ['player', 'captain', 'reserve']);

export const attendanceStatus = pgEnum('attendance_status', ['yes', 'maybe', 'no']);

export const imageKind = pgEnum('image_kind', ['sand', 'lake', 'forest', 'none']);

export const eventKind = pgEnum('event_kind', ['event', 'match', 'tournament', 'training']);

export const sponsorTier = pgEnum('sponsor_tier', ['gold', 'silver', 'bronze', 'standard']);

// intern = nur Mitgliederbereich · public = zusätzlich auf der öffentlichen Startseite
export const newsVisibility = pgEnum('news_visibility', ['internal', 'public']);

export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  initials: text('initials').notNull(),
  avatarTone: avatarTone('avatar_tone').notNull().default('lake'),
  avatarUrl: text('avatar_url'),
  role: memberRole('role').notNull().default('member'),
  status: memberStatus('status').notNull().default('active'),
  memberSince: date('member_since').notNull().defaultNow(),
  lkRating: numeric('lk_rating', { precision: 4, scale: 1 }),
  paymentStatus: paymentStatus('payment_status').notNull().default('paid'),
  paymentDueCents: integer('payment_due_cents').notNull().default(0),
  birthdate: date('birthdate'),
  phone: text('phone'),
  street: text('street'),
  postalCode: text('postal_code'),
  city: text('city'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  league: text('league').notNull(),
  trainerId: uuid('trainer_id').references(() => members.id, { onDelete: 'set null' }),
  active: boolean('active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  record: text('record'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const teamMembers = pgTable(
  'team_members',
  {
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    memberId: uuid('member_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
    role: teamRole('role').notNull().default('player'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.teamId, t.memberId] })],
);

export const trainings = pgTable('trainings', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  court: text('court'),
  trainerId: uuid('trainer_id').references(() => members.id, { onDelete: 'set null' }),
  maxAttendees: integer('max_attendees'),
  cancelled: boolean('cancelled').notNull().default(false),
  cancelReason: text('cancel_reason'),
  seriesKey: text('series_key'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const attendances = pgTable(
  'attendances',
  {
    trainingId: uuid('training_id')
      .notNull()
      .references(() => trainings.id, { onDelete: 'cascade' }),
    memberId: uuid('member_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
    status: attendanceStatus('status').notNull(),
    respondedAt: timestamp('responded_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.trainingId, t.memberId] })],
);

export const news = pgTable('news', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  eyebrow: text('eyebrow'),
  eyebrowTone: text('eyebrow_tone'),
  excerpt: text('excerpt').notNull(),
  body: text('body').notNull(),
  imageKind: imageKind('image_kind').notNull().default('none'),
  pinned: boolean('pinned').notNull().default(false),
  visibility: newsVisibility('visibility').notNull().default('public'),
  authorId: uuid('author_id').references(() => members.id, { onDelete: 'set null' }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const newsReactions = pgTable(
  'news_reactions',
  {
    newsId: uuid('news_id')
      .notNull()
      .references(() => news.id, { onDelete: 'cascade' }),
    memberId: uuid('member_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
    reaction: text('reaction').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.newsId, t.memberId, t.reaction] })],
);

// Lesebestätigungen — wer hat einen Beitrag gelesen (Vereinsplaner-Parität)
export const newsReads = pgTable(
  'news_reads',
  {
    newsId: uuid('news_id')
      .notNull()
      .references(() => news.id, { onDelete: 'cascade' }),
    memberId: uuid('member_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
    readAt: timestamp('read_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.newsId, t.memberId] })],
);

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  newsId: uuid('news_id').references(() => news.id, { onDelete: 'cascade' }),
  trainingId: uuid('training_id').references(() => trainings.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => members.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  kind: eventKind('kind').notNull().default('event'),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  allDay: boolean('all_day').notNull().default(false),
  description: text('description'),
  location: text('location'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sponsors = pgTable('sponsors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  website: text('website'),
  tier: sponsorTier('tier').notNull().default('standard'),
  sortOrder: integer('sort_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
});

export const courts = pgTable('courts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  number: integer('number').notNull().unique(),
  surface: text('surface').notNull().default('Sand'),
  floodlight: boolean('floodlight').notNull().default(false),
  active: boolean('active').notNull().default(true),
});

export const documentCategory = pgEnum('document_category', [
  'statuten',
  'beitraege',
  'protokoll',
  'spielregeln',
  'formular',
  'sonstiges',
]);

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  category: documentCategory('category').notNull().default('sonstiges'),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull().default('application/pdf'),
  fileSize: integer('file_size'),
  uploadedBy: uuid('uploaded_by').references(() => members.id, { onDelete: 'set null' }),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
  pinned: boolean('pinned').notNull().default(false),
  validFrom: date('valid_from'),
  validUntil: date('valid_until'),
});

export const newsletterStatus = pgEnum('newsletter_status', ['draft', 'queued', 'sent', 'failed']);
export const newsletterAudience = pgEnum('newsletter_audience', [
  'all',
  'active',
  'probe',
  'team',
  'custom',
]);

export const newsletters = pgTable('newsletters', {
  id: uuid('id').primaryKey().defaultRandom(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  audience: newsletterAudience('audience').notNull().default('active'),
  audienceTeamId: uuid('audience_team_id').references(() => teams.id, { onDelete: 'set null' }),
  status: newsletterStatus('status').notNull().default('draft'),
  authorId: uuid('author_id').references(() => members.id, { onDelete: 'set null' }),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  recipientCount: integer('recipient_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const duesPeriods = pgTable('dues_periods', {
  id: uuid('id').primaryKey().defaultRandom(),
  year: integer('year').notNull(),
  category: text('category').notNull(), // 'jugend', 'aktiv', 'familie', 'ehren'
  amountCents: integer('amount_cents').notNull(),
  dueDate: date('due_date').notNull(),
  active: boolean('active').notNull().default(true),
});

export const duesInvoices = pgTable('dues_invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id')
    .notNull()
    .references(() => members.id, { onDelete: 'cascade' }),
  duesPeriodId: uuid('dues_period_id')
    .notNull()
    .references(() => duesPeriods.id, { onDelete: 'restrict' }),
  amountCents: integer('amount_cents').notNull(),
  paidCents: integer('paid_cents').notNull().default(0),
  status: paymentStatus('status').notNull().default('open'),
  invoiceNumber: text('invoice_number'),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
  dueDate: date('due_date').notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  remindedAt: timestamp('reminded_at', { withTimezone: true }),
});

export type Document = typeof documents.$inferSelect;
export type Newsletter = typeof newsletters.$inferSelect;
export type DuesPeriod = typeof duesPeriods.$inferSelect;
export type DuesInvoice = typeof duesInvoices.$inferSelect;

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type Training = typeof trainings.$inferSelect;
export type News = typeof news.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Sponsor = typeof sponsors.$inferSelect;
export type Court = typeof courts.$inferSelect;

export const __schemaVersion = sql`'1'`;
