/**
 * Syneolab data access layer (MongoDB Atlas).
 *
 * Collections:
 *   users, sessions, records (kind: projects|tasks|leads|meetings|announcements),
 *   clocks, acknowledgements, jobs, login_attempts, meta
 *
 * The client is cached on globalThis so serverless invocations on Vercel
 * reuse one connection pool per warm instance.
 */

import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import dns from 'dns';
import { promisify } from 'util';

// Ensure fast, reliable SRV DNS resolution for mongodb+srv:// even when local router DNS lags
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {}

const pbkdf2 = promisify(crypto.pbkdf2);
const PBKDF2_ITERATIONS = 210000;
const SESSION_DAYS = 7;
export const KINDS = ['projects', 'tasks', 'leads', 'meetings', 'announcements', 'standups', 'goals'];
const TASK_STATUSES = ['To do', 'In progress', 'In review', 'Done'];
const LEAD_STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const g = globalThis;

export function resetDatabaseCache() {
  // Only used if client is completely disconnected
}

async function database() {
  if (!g.__syneolab_db) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not configured');
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      retryReads: true,
      retryWrites: true
    });
    g.__syneolab_db = client.connect().then(async c => {
      const db = c.db(process.env.MONGODB_DB || 'syneolab');
      await ensureIndexes(db);
      return db;
    });
    // Allow a retry on the next request if the first connection fails.
    g.__syneolab_db.catch(() => { g.__syneolab_db = null; });
  }
  return g.__syneolab_db;
}

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection('sessions').createIndex({ user_id: 1 }),
    db.collection('records').createIndex({ kind: 1, created: -1 }),
    db.collection('clocks').createIndex({ start: -1 }),
    // At most one running clock per employee.
    db.collection('clocks').createIndex({ user_id: 1 }, { unique: true, partialFilterExpression: { active: true }, name: 'one_active_clock' }),
    db.collection('acknowledgements').createIndex({ record_id: 1, user_id: 1 }, { unique: true }),
    db.collection('jobs').createIndex({ status: 1, created: 1 }),
    db.collection('login_attempts').createIndex({ at: 1 }, { expireAfterSeconds: 600 }),
    db.collection('login_attempts').createIndex({ key: 1 })
  ]);
}

const now = () => new Date().toISOString();
const uid = () => crypto.randomBytes(12).toString('hex');
const sha256 = v => crypto.createHash('sha256').update(v).digest('hex');
const str = (v, max = 5000) => (v == null ? '' : String(v)).slice(0, max);

export function resolveAppUrl() {
  const raw = (process.env.APP_URL || '').trim().replace(/\/$/, '');
  if (raw && (!process.env.VERCEL || !raw.includes('localhost'))) return raw;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return raw;
}

async function hashPassword(password, salt = crypto.randomBytes(16).toString('hex'), iterations = PBKDF2_ITERATIONS) {
  const hash = (await pbkdf2(password, salt, iterations, 32, 'sha256')).toString('hex');
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

async function checkPassword(password, stored) {
  if (typeof password !== 'string' || !stored) return false;
  const [, iterations, salt, hash] = stored.split('$');
  if (!hash) return false;
  const candidate = await hashPassword(password, salt, Number(iterations));
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(stored));
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 12) throw new HttpError(400, 'Use a password of at least 12 characters');
  if (password.length > 256) throw new HttpError(400, 'Password is too long');
}

function validEmail(email) {
  const clean = str(email, 254).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) throw new HttpError(400, 'Enter a valid email address');
  return clean;
}

const VALID_ACCENTS = ['#145c40', '#285a80', '#644780', '#9b512d', '#b84b76', '#d4688e'];
const VALID_CURRENCIES = ['USD', 'NPR', 'INR', 'EUR', 'GBP'];
const VALID_WEEK_STARTS = ['Sunday', 'Monday'];

export function cleanUser(u) {
  if (!u) return null;
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    preferences: u.preferences || {}
  };
}

// --- Users & auth ---

export async function userCount() {
  const db = await database();
  return db.collection('users').countDocuments({}, { limit: 1 });
}

// Accounts created through "Request access" stay pending until an admin approves them.
// Older accounts have no status field and count as active.
const ACTIVE = { status: { $ne: 'pending' } };
const PENDING = { status: 'pending' };
export const DEFAULT_MEMBER_LIMIT = 20;

export async function getWorkspaceDefaults() {
  const db = await database();
  const s = await db.collection('meta').findOne({ _id: 'settings' });
  return {
    defaultAccent: VALID_ACCENTS.includes(s?.defaultAccent) ? s.defaultAccent : '#145c40',
    defaultWeekStart: VALID_WEEK_STARTS.includes(s?.defaultWeekStart) ? s.defaultWeekStart : 'Sunday',
    defaultCurrency: VALID_CURRENCIES.includes(s?.defaultCurrency) ? s.defaultCurrency : 'USD'
  };
}

export async function getSettings() {
  const db = await database();
  const s = await db.collection('meta').findOne({ _id: 'settings' });
  return {
    memberLimit: s?.memberLimit ?? DEFAULT_MEMBER_LIMIT,
    defaultAccent: VALID_ACCENTS.includes(s?.defaultAccent) ? s.defaultAccent : '#145c40',
    defaultWeekStart: VALID_WEEK_STARTS.includes(s?.defaultWeekStart) ? s.defaultWeekStart : 'Sunday',
    defaultCurrency: VALID_CURRENCIES.includes(s?.defaultCurrency) ? s.defaultCurrency : 'USD'
  };
}

/**
 * Updates a user's personal preferences (accent, weekStart, currency).
 * - For Admins: also updates the Workspace Default theme/preferences enforced across the platform.
 * - For Employees (members): saves strictly to their own user account (never modifies the workspace default).
 */
export async function updateUserPreferences(actor, input = {}) {
  const db = await database();
  if (input.resetToDefault) {
    await db.collection('users').updateOne({ _id: actor.id }, { $set: { preferences: {} } });
    const defaults = await getWorkspaceDefaults();
    return { preferences: {}, workspaceDefaults: defaults };
  }

  const currentDoc = await db.collection('users').findOne({ _id: actor.id });
  const nextPrefs = { ...(currentDoc?.preferences || {}) };

  if (input.accent !== undefined) {
    if (!VALID_ACCENTS.includes(input.accent)) throw new HttpError(400, 'Invalid theme color');
    nextPrefs.accent = input.accent;
  }
  if (input.weekStart !== undefined) {
    if (!VALID_WEEK_STARTS.includes(input.weekStart)) throw new HttpError(400, 'Invalid week start day');
    nextPrefs.weekStart = input.weekStart;
  }
  if (input.currency !== undefined) {
    if (!VALID_CURRENCIES.includes(input.currency)) throw new HttpError(400, 'Invalid currency');
    nextPrefs.currency = input.currency;
  }

  await db.collection('users').updateOne({ _id: actor.id }, { $set: { preferences: nextPrefs } });

  // When an Admin updates preferences, also enforce them as the Workspace Default for the platform
  if (actor.role === 'admin' && input.setAsWorkspaceDefault !== false) {
    const metaUpdate = {};
    if (nextPrefs.accent) metaUpdate.defaultAccent = nextPrefs.accent;
    if (nextPrefs.weekStart) metaUpdate.defaultWeekStart = nextPrefs.weekStart;
    if (nextPrefs.currency) metaUpdate.defaultCurrency = nextPrefs.currency;
    if (Object.keys(metaUpdate).length > 0) {
      await db.collection('meta').updateOne({ _id: 'settings' }, { $set: metaUpdate }, { upsert: true });
    }
  }

  const defaults = await getWorkspaceDefaults();
  return { preferences: nextPrefs, workspaceDefaults: defaults };
}

/** Team size limit: maximum number of accounts (admins + members, including pending requests). 0 closes sign-ups. */
export async function setMemberLimit(value) {
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 0 || limit > 10000) throw new HttpError(400, 'Enter a whole number between 0 and 10000');
  const db = await database();
  await db.collection('meta').updateOne({ _id: 'settings' }, { $set: { memberLimit: limit } }, { upsert: true });
}

async function seatUsage(db) {
  const [active, pending] = await Promise.all([
    db.collection('users').countDocuments(ACTIVE),
    db.collection('users').countDocuments(PENDING)
  ]);
  return { active, pending };
}

/** Whether the public "Request access" form accepts new requests. */
export async function signupOpen() {
  const db = await database();
  if (!(await userCount())) return false;
  const [{ memberLimit }, { active, pending }] = await Promise.all([getSettings(), seatUsage(db)]);
  return active + pending < memberLimit;
}

/** Employee self-registration: always a member, always pending until an admin approves. */
export async function requestAccess(payload) {
  const db = await database();
  if (!(await userCount())) throw new HttpError(409, 'This workspace has not been set up yet');
  if (!(await signupOpen())) throw new HttpError(403, 'Sign-ups are closed: this workspace has reached its team size limit. Please contact your administrator.');
  return insertUser(db, payload, 'member', 'pending');
}

export async function approveRequest(userId) {
  const db = await database();
  const target = await db.collection('users').findOne({ _id: str(userId, 64), ...PENDING });
  if (!target) throw new HttpError(404, 'This request no longer exists');
  const [{ memberLimit }, { active }] = await Promise.all([getSettings(), seatUsage(db)]);
  if (active >= memberLimit) throw new HttpError(409, `The team is full (${active} of ${memberLimit}). Raise the team size limit to approve more people.`);
  await db.collection('users').updateOne({ _id: target._id }, { $set: { status: 'active', approved: now() } });
}

export async function rejectRequest(userId) {
  const db = await database();
  const res = await db.collection('users').deleteOne({ _id: str(userId, 64), ...PENDING });
  if (!res.deletedCount) throw new HttpError(404, 'This request no longer exists');
}

async function insertUser(db, payload, role, status = 'active') {
  const name = str(payload?.name, 120).trim();
  if (!name) throw new HttpError(400, 'Name is required');
  if (!['admin', 'member'].includes(role)) throw new HttpError(400, 'Invalid role');
  validatePassword(payload.password);
  const user = {
    _id: uid(),
    name,
    email: validEmail(payload.email),
    password: await hashPassword(payload.password),
    role,
    department: str(payload.department, 80).trim() || 'Management',
    status,
    created: now()
  };
  try {
    await db.collection('users').insertOne(user);
  } catch (e) {
    if (e.code === 11000) throw new HttpError(409, 'This email is already registered');
    throw e;
  }
  return cleanUser(user);
}

/** First-run setup. A unique marker document makes this succeed exactly once. */
export async function setupWorkspace(payload) {
  const db = await database();
  if (await userCount()) throw new HttpError(409, 'Workspace already configured');
  try {
    await db.collection('meta').insertOne({ _id: 'setup', at: now() });
  } catch (e) {
    if (e.code === 11000) throw new HttpError(409, 'Workspace already configured');
    throw e;
  }
  try {
    return await insertUser(db, payload, 'admin');
  } catch (e) {
    await db.collection('meta').deleteOne({ _id: 'setup' });
    throw e;
  }
}

/** Admin "Add member": active immediately, but still within the team size limit. */
export async function createUser(payload, role) {
  const db = await database();
  const [{ memberLimit }, { active }] = await Promise.all([getSettings(), seatUsage(db)]);
  if (active >= memberLimit) throw new HttpError(409, `The team is full (${active} of ${memberLimit}). Raise the team size limit first.`);
  return insertUser(db, payload, role || 'member');
}

export async function verifyCredentials(email, password) {
  const db = await database();
  const u = await db.collection('users').findOne({ email: str(email, 254).trim().toLowerCase() });
  if (!u || !(await checkPassword(password, u.password))) return null;
  if (u.status === 'pending') throw new HttpError(403, 'Your access request is waiting for administrator approval.');
  return cleanUser(u);
}

export async function updatePassword(userId, newPassword) {
  validatePassword(newPassword);
  const db = await database();
  const res = await db.collection('users').updateOne({ _id: userId }, { $set: { password: await hashPassword(newPassword) } });
  if (!res.matchedCount) throw new HttpError(404, 'Account not found');
  await db.collection('sessions').deleteMany({ user_id: userId });
}

export async function updateMember(actor, userId, changes) {
  const db = await database();
  const target = await db.collection('users').findOne({ _id: str(userId, 64) });
  if (!target) throw new HttpError(404, 'Account not found');
  const set = {};
  if (changes.name !== undefined) set.name = str(changes.name, 120).trim() || target.name;
  if (changes.email !== undefined && str(changes.email).trim().toLowerCase() !== target.email) set.email = validEmail(changes.email);
  if (changes.department !== undefined) set.department = str(changes.department, 80).trim() || target.department;
  if (changes.role !== undefined) {
    if (!['admin', 'member'].includes(changes.role)) throw new HttpError(400, 'Invalid role');
    if (target._id === actor.id && changes.role !== 'admin') throw new HttpError(400, 'You cannot remove your own administrator access');
    set.role = changes.role;
  }
  if (Object.keys(set).length) {
    try {
      await db.collection('users').updateOne({ _id: target._id }, { $set: set });
    } catch (e) {
      if (e.code === 11000) throw new HttpError(409, 'This email is already registered');
      throw e;
    }
  }
  if (changes.password) await updatePassword(target._id, changes.password);
}

/** Removes an employee's login. Their past time entries and records remain for reporting. */
export async function removeUser(actor, userId) {
  const db = await database();
  if (userId === actor.id) throw new HttpError(400, 'You cannot remove your own account');
  const target = await db.collection('users').findOne({ _id: str(userId, 64) });
  if (!target) throw new HttpError(404, 'Account not found');
  await db.collection('users').deleteOne({ _id: target._id });
  await db.collection('sessions').deleteMany({ user_id: target._id });
  await db.collection('clocks').updateMany(
    { user_id: target._id, active: true },
    { $set: { end: Date.now() / 1000, break_start: null }, $unset: { active: '' } }
  );
}

// --- Login throttling (shared across serverless instances) ---

export async function assertNotThrottled(key) {
  const db = await database();
  const since = new Date(Date.now() - 10 * 60 * 1000);
  const attempts = await db.collection('login_attempts').countDocuments({ key, at: { $gt: since } });
  if (attempts >= 15) throw new HttpError(429, 'Too many attempts. Try again in ten minutes.');
}

export async function recordFailedLogin(key) {
  const db = await database();
  await db.collection('login_attempts').insertOne({ key, at: new Date() });
}

// --- Sessions (only a SHA-256 of the token is stored) ---

export async function createSession(userId) {
  const db = await database();
  const token = crypto.randomBytes(32).toString('base64url');
  await db.collection('sessions').insertOne({
    _id: sha256(token),
    user_id: userId,
    expiresAt: new Date(Date.now() + SESSION_DAYS * 86400 * 1000)
  });
  return token;
}

export async function getSessionUser(token) {
  if (!token) return null;
  const db = await database();
  const session = await db.collection('sessions').findOne({ _id: sha256(token), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  return cleanUser(await db.collection('users').findOne({ _id: session.user_id, ...ACTIVE }));
}

export async function deleteSession(token) {
  const db = await database();
  await db.collection('sessions').deleteOne({ _id: sha256(token) });
}

// --- Workspace state & 24/7 Zero-Storage-Growth MongoDB Beacon ---

export async function pingDatabaseBeacon(source = 'auto') {
  const t0 = Date.now();
  const db = await database();
  const timestamp = now();

  // 1. Ping server + update a single fixed ~110-byte document in-place (0 bytes net storage growth forever)
  await Promise.all([
    db.command({ ping: 1 }),
    db.collection('meta').updateOne(
      { _id: 'beacon' },
      {
        $set: { lastPing: timestamp, lastSource: str(source, 40), status: 'awake' },
        $inc: { totalPings: 1 }
      },
      { upsert: true }
    ),
    // 2. Actively reclaim storage space by purging expired sessions & old login attempts
    db.collection('sessions').deleteMany({ expiresAt: { $lte: new Date() } }),
    db.collection('login_attempts').deleteMany({ at: { $lte: new Date(Date.now() - 600 * 1000) } })
  ]);

  // 3. Keep 'jobs' collection lean (prune old 'sent' delivery logs beyond the newest 50 so 500MB DB never bloats)
  const oldSentJobs = await db
    .collection('jobs')
    .find({ status: 'sent' }, { projection: { _id: 1 } })
    .sort({ created: -1 })
    .skip(50)
    .limit(100)
    .toArray();
  if (oldSentJobs.length > 0) {
    await db.collection('jobs').deleteMany({ _id: { $in: oldSentJobs.map(j => j._id) } });
  }

  const latencyMs = Date.now() - t0;
  const doc = await db.collection('meta').findOne({ _id: 'beacon' });
  return {
    ok: true,
    status: 'awake',
    lastPing: doc?.lastPing || timestamp,
    lastSource: doc?.lastSource || source,
    totalPings: doc?.totalPings || 1,
    latencyMs,
    netGrowthBytes: 0
  };
}

export function integrationStatus() {
  return {
    gmail: Boolean(process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '')),
    sheets: Boolean(process.env.GOOGLE_SHEETS_URL?.trim() && process.env.GOOGLE_SHEETS_SECRET?.trim()),
    calendar: Boolean(process.env.GOOGLE_CALENDAR_URL?.trim())
  };
}

export async function getWorkspaceState(currentUser) {
  const db = await database();
  const isAdmin = currentUser.role === 'admin';
  const [records, users, clocks, acknowledgements, jobs, requests, settings, workspaceDefaults, beaconDoc] = await Promise.all([
    db.collection('records').find({}).sort({ created: -1 }).toArray(),
    db.collection('users').find(ACTIVE, { projection: { password: 0 } }).sort({ name: 1 }).toArray(),
    db.collection('clocks').find({}).sort({ start: -1 }).limit(3000).toArray(),
    db.collection('acknowledgements').find({}, { projection: { _id: 0 } }).toArray(),
    isAdmin ? db.collection('jobs').find({}, { projection: { body: 0 } }).sort({ created: -1 }).limit(30).toArray() : [],
    isAdmin ? db.collection('users').find(PENDING, { projection: { password: 0 } }).sort({ created: 1 }).toArray() : [],
    isAdmin ? getSettings() : null,
    getWorkspaceDefaults(),
    db.collection('meta').findOne({ _id: 'beacon' })
  ]);
  const state = Object.fromEntries(KINDS.map(k => [k, []]));
  for (const r of records) {
    if (!state[r.kind]) continue;
    // Least-privilege record visibility for non-admin employees:
    if (!isAdmin) {
      if (r.kind === 'leads' && r.body.owner !== currentUser.id && r.body.assignee !== currentUser.id) {
        continue;
      }
      if (
        r.kind === 'meetings' &&
        Array.isArray(r.body.attendees) &&
        r.body.attendees.length > 0 &&
        !r.body.attendees.includes(currentUser.id) &&
        r.body.owner !== currentUser.id
      ) {
        continue;
      }
      if (r.kind === 'projects') {
        const { budget, ...publicProject } = r.body;
        state.projects.push({ ...publicProject, id: r._id, created: r.created });
        continue;
      }
    }
    state[r.kind].push({ ...r.body, id: r._id, created: r.created });
  }

  // Least-privilege timesheet visibility: employees get their own full history + redacted live presence for teammates
  const visibleClocks = isAdmin
    ? clocks.map(({ _id, active, ...c }) => ({ id: _id, ...c }))
    : clocks
        .filter(c => c.user_id === currentUser.id || !c.end)
        .map(({ _id, active, ...c }) =>
          c.user_id === currentUser.id
            ? { id: _id, ...c }
            : { id: _id, user_id: c.user_id, start: c.start, end: c.end, break_start: c.break_start, break_seconds: c.break_seconds || 0, project: c.project || '', note: '' }
        );

  return {
    ...state,
    users: users.map(cleanUser),
    clocks: visibleClocks,
    acknowledgements,
    integrations: integrationStatus(),
    jobs: jobs.map(({ _id, ...j }) => ({ id: _id, ...j })),
    requests: requests.map(u => ({ ...cleanUser(u), created: u.created })),
    settings,
    workspaceDefaults,
    beacon: {
      status: 'awake',
      lastPing: beaconDoc?.lastPing || now(),
      totalPings: beaconDoc?.totalPings || 1,
      netGrowthBytes: 0
    }
  };
}

// --- Records ---

function validateRecord(kind, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new HttpError(400, 'Invalid record');
  const body = {};
  const transientKeys = ['id', 'owner', 'created', 'notifyEmail', 'notifyEveryone', 'sendToEveryone', 'autoRoom'];
  for (const [k, v] of Object.entries(input)) {
    if (transientKeys.includes(k) || k.startsWith('$') || k.includes('.')) continue;
    if (Array.isArray(v)) {
      body[k] = v.slice(0, 200).map(x => {
        if (x && typeof x === 'object' && !Array.isArray(x)) {
          const cleanObj = {};
          for (const [ok, ov] of Object.entries(x)) {
            if (ok.startsWith('$') || ok.includes('.')) continue;
            cleanObj[ok] = typeof ov === 'boolean' || typeof ov === 'number' ? ov : str(ov, 1000);
          }
          return cleanObj;
        }
        return str(x, 200);
      });
    } else if (typeof v === 'number' || typeof v === 'boolean') body[k] = v;
    else body[k] = str(v);
  }
  body.title = str(body.title, 200).trim();
  if (!body.title) throw new HttpError(400, 'A title is required');
  if (kind === 'tasks' && !TASK_STATUSES.includes(body.status)) throw new HttpError(400, 'Invalid task status');
  if (kind === 'leads' && !LEAD_STAGES.includes(body.stage)) throw new HttpError(400, 'Invalid lead stage');
  if (kind === 'meetings') {
    const start = Date.parse(body.start), end = Date.parse(body.end);
    if (Number.isNaN(start) || Number.isNaN(end)) throw new HttpError(400, 'Enter a valid meeting time');
    if (end <= start) throw new HttpError(400, 'Meeting end must follow its start');
    if (body.link && !/^https?:\/\//i.test(body.link)) throw new HttpError(400, 'Use a valid meeting URL');
  }
  if (kind === 'tasks' && body.deliverableUrl && !/^https?:\/\//i.test(body.deliverableUrl)) {
    throw new HttpError(400, 'Use a valid deliverable URL');
  }
  return body;
}

export async function generateGoogleMeetRoom(input = {}, currentUser) {
  if (currentUser?.role !== 'admin') throw new HttpError(403, 'Administrator access required');
  const calWebhook = (process.env.GOOGLE_CALENDAR_URL || '').trim();
  if (!calWebhook) {
    throw new HttpError(400, 'Google Calendar webhook is not configured in .env.local');
  }
  const secret = (process.env.GOOGLE_CALENDAR_SECRET || process.env.GOOGLE_SHEETS_SECRET || '').trim();
  const startIso = input.start && !Number.isNaN(Date.parse(input.start)) ? new Date(input.start).toISOString() : new Date(Date.now() + 3600000).toISOString();
  const endIso = input.end && !Number.isNaN(Date.parse(input.end)) ? new Date(input.end).toISOString() : new Date(Date.parse(startIso) + 1800000).toISOString();
  const res = await fetch(calWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      action: 'createMeeting',
      id: uid(),
      title: str(input.title || 'Syneolab Meeting', 200),
      start: startIso,
      end: endIso,
      description: str(input.description || '', 1500),
      location: 'Google Meet',
      attendees: []
    }),
    signal: AbortSignal.timeout(15000)
  });
  const data = await res.json();
  if (!data?.ok || !data?.meetLink) {
    throw new HttpError(502, data?.error || 'Could not generate a Google Meet link from Google Calendar');
  }
  return { meetLink: data.meetLink, eventUrl: data.eventUrl || '' };
}

export async function saveRecord(kind, id, input, currentUser) {
  if (!KINDS.includes(kind)) throw new HttpError(400, 'Invalid collection');
  const isAdmin = currentUser.role === 'admin';
  if (!isAdmin && ['projects', 'meetings', 'announcements', 'goals'].includes(kind)) throw new HttpError(403, 'Administrator access required');
  const wantEmail = isAdmin && Boolean(input?.notifyEmail && input.notifyEmail !== 'false');
  const wantEveryone = isAdmin && Boolean(
    (input?.notifyEveryone && input.notifyEveryone !== 'false') ||
    (input?.sendToEveryone && input.sendToEveryone !== 'false')
  );
  const wantAutoRoom = Boolean(input?.autoRoom && input.autoRoom !== 'false');
  const body = validateRecord(kind, input);
  const db = await database();
  const rid = id ? str(id, 64) : uid();
  const existing = await db.collection('records').findOne({ _id: rid });
  if (existing && existing.kind !== kind) throw new HttpError(400, 'Record collection cannot be changed');
  if (!isAdmin && existing && existing.body.owner !== currentUser.id && existing.body.assignee !== currentUser.id) {
    throw new HttpError(403, 'You can only change your own records');
  }
  body.owner = existing ? existing.body.owner : currentUser.id;
  if (!isAdmin && (kind === 'tasks' || kind === 'leads')) {
    if (!existing) {
      body.assignee = currentUser.id;
    } else if (existing.body.owner !== currentUser.id) {
      // Employees updating an admin-assigned record cannot reassign it to someone else
      body.assignee = existing.body.assignee;
    } else if (!body.assignee) {
      body.assignee = currentUser.id;
    }
  }

  let meetingRecipients = [];
  if (kind === 'meetings') {
    const allActiveUsers = await db.collection('users').find(ACTIVE, { projection: { email: 1, name: 1 } }).toArray();
    if (wantEveryone) {
      body.attendees = allActiveUsers.map(u => u._id);
      meetingRecipients = allActiveUsers;
    } else {
      const selectedIds = new Set(body.attendees || []);
      meetingRecipients = allActiveUsers.filter(u => selectedIds.has(u._id));
    }

    // Parse optional comma-separated external guest emails
    const extraEmails = String(body.extraEmails || '')
      .split(/[,;\s]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    const allEmails = [...new Set([...meetingRecipients.map(u => u.email).filter(Boolean), ...extraEmails])];

    // Optional Google Calendar + Google Meet auto-creation webhook
    const calWebhook = (process.env.GOOGLE_CALENDAR_URL || '').trim();
    const alreadySyncedMeet = Boolean(body.link && body.link.includes('meet.google.com') && body.calendarEventUrl);
    if (calWebhook && !alreadySyncedMeet) {
      try {
        const secret = (process.env.GOOGLE_CALENDAR_SECRET || process.env.GOOGLE_SHEETS_SECRET || '').trim();
        const calRes = await fetch(calWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret,
            action: 'createMeeting',
            id: rid,
            title: body.title,
            start: body.start,
            end: body.end,
            description: body.description || '',
            location: body.location || 'Google Meet',
            attendees: allEmails
          }),
          signal: AbortSignal.timeout(12000)
        });
        const calData = await calRes.json();
        if (calData?.meetLink && (!body.link || (wantAutoRoom && body.link.includes('meet.jit.si')))) {
          body.link = calData.meetLink;
          if (!body.location || body.location === 'Online' || body.location === 'Video Room') {
            body.location = 'Google Meet';
          }
        }
        if (calData?.eventUrl) body.calendarEventUrl = calData.eventUrl;
      } catch (err) {
        console.warn('Google Calendar webhook skipped:', err.message);
      }
    }

    // Fallback instant Jitsi video room if user requested auto-room and no link was set
    if (!body.link && wantAutoRoom) {
      const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'sync';
      body.link = `https://meet.jit.si/Syneolab-${slug}-${rid.slice(0, 6)}`;
    }

    if (allEmails.length) {
      const appUrl = resolveAppUrl();
      await queueJob(db, 'email', {
        type: 'meeting',
        meetingId: rid,
        to: allEmails,
        organizerName: currentUser.name || 'Syneolab Workspace',
        organizerEmail: currentUser.email || process.env.GMAIL_USER || '',
        attendeeNames: meetingRecipients.map(u => u.name).filter(Boolean),
        title: body.title,
        start: body.start,
        end: body.end,
        location: body.location || 'Online',
        link: body.link || '',
        description: body.description || '',
        text: `${body.title}\nWhen: ${body.start} to ${body.end} (UTC)\nLocation: ${body.location || 'Online'}\nJoin: ${body.link || ''}\n\n${body.description || ''}${appUrl ? `\n\nWorkspace: ${appUrl}` : ''}`
      });
    }
  }

  if (existing) {
    await db.collection('records').updateOne({ _id: rid }, { $set: { body, updated: now() } });
  } else {
    await db.collection('records').insertOne({ _id: rid, kind, body, created: now() });
  }

  if (kind === 'leads') await queueJob(db, 'sheets', { id: rid });
  if (kind === 'tasks' && (wantEmail || wantEveryone)) {
    let to = [];
    if (wantEveryone) {
      const activeUsers = await db.collection('users').find(ACTIVE, { projection: { email: 1 } }).toArray();
      to = activeUsers.map(u => u.email).filter(Boolean);
    } else if (body.assignee) {
      const assignee = await db.collection('users').findOne({ _id: body.assignee, ...ACTIVE }, { projection: { email: 1, name: 1 } });
      if (assignee?.email) to = [assignee.email];
    }
    if (to.length) {
      const appUrl = resolveAppUrl();
      await queueJob(db, 'email', {
        type: 'task_assigned',
        to,
        title: `Task Assigned: ${body.title}`,
        priority: body.priority || 'Medium',
        status: body.status || 'To do',
        due: body.due || '',
        description: body.description || '',
        link: body.deliverableUrl || appUrl,
        text: `Task Assigned: ${body.title}\nPriority: ${body.priority || 'Medium'}\nStatus: ${body.status || 'To do'}${body.due ? `\nDue: ${body.due}` : ''}\n\n${body.description || ''}${appUrl ? `\n\nWorkspace: ${appUrl}` : ''}`
      });
    }
  }
  if (kind === 'announcements' && (wantEmail || wantEveryone)) {
    const activeUsers = await db.collection('users').find(ACTIVE, { projection: { email: 1 } }).toArray();
    const to = activeUsers.map(u => u.email).filter(Boolean);
    if (to.length) {
      const appUrl = resolveAppUrl();
      await queueJob(db, 'email', {
        type: 'announcement',
        to,
        title: `Announcement: ${body.title}`,
        priority: body.priority || 'Update',
        description: body.description || '',
        link: appUrl,
        text: `${body.title} (${body.priority || 'Update'})\n\n${body.description || ''}${appUrl ? `\n\nWorkspace: ${appUrl}` : ''}`
      });
    }
  }
  return rid;
}

/** Admins delete anything; members may delete tasks, leads, and standups they created. */
export async function deleteRecord(id, currentUser) {
  const db = await database();
  const record = await db.collection('records').findOne({ _id: str(id, 64) });
  if (!record) throw new HttpError(404, 'This record no longer exists');
  if (currentUser.role !== 'admin' && !(['tasks', 'leads', 'standups'].includes(record.kind) && record.body.owner === currentUser.id)) {
    throw new HttpError(403, 'You can only delete tasks and leads you created');
  }
  await db.collection('records').deleteOne({ _id: str(id, 64) });
  await db.collection('acknowledgements').deleteMany({ record_id: str(id, 64) });
}

export async function acknowledge(recordId, userId) {
  const db = await database();
  await db.collection('acknowledgements').updateOne(
    { record_id: str(recordId, 64), user_id: userId },
    { $setOnInsert: { record_id: str(recordId, 64), user_id: userId } },
    { upsert: true }
  );
}

// --- Time clock ---

export async function clockAction(action, userId, payload = {}) {
  const db = await database();
  const clocks = db.collection('clocks');
  const t = Date.now() / 1000;
  if (action === 'start') {
    try {
      await clocks.insertOne({
        _id: uid(), user_id: userId, project: str(payload.project, 64), task: str(payload.task, 64),
        start: t, end: null, break_start: null, break_seconds: 0, note: str(payload.note, 1000), active: true
      });
    } catch (e) {
      if (e.code === 11000) throw new HttpError(400, 'You are already clocked in');
      throw e;
    }
    return;
  }
  const active = await clocks.findOne({ user_id: userId, active: true });
  if (!active) throw new HttpError(400, 'Clock in first');
  if (action === 'break') {
    const res = await clocks.updateOne({ _id: active._id, break_start: null }, { $set: { break_start: t } });
    if (!res.modifiedCount) throw new HttpError(400, 'Break already running');
  } else if (action === 'switch') {
    const updates = {};
    if (payload.project !== undefined) updates.project = str(payload.project, 64);
    if (payload.task !== undefined) updates.task = str(payload.task, 64);
    if (payload.note !== undefined) updates.note = str(payload.note, 1000);
    await clocks.updateOne({ _id: active._id, active: true }, { $set: updates });
  } else if (action === 'resume' || action === 'stop') {
    const extra = active.break_start ? t - active.break_start : 0;
    if (action === 'resume' && !active.break_start) throw new HttpError(400, 'Not on a break');
    const update = { $inc: { break_seconds: extra }, $set: { break_start: null } };
    if (action === 'stop') {
      update.$set.end = t;
      if (payload.note !== undefined) update.$set.note = str(payload.note, 1000);
      update.$unset = { active: '' };
    }
    await clocks.updateOne({ _id: active._id, active: true }, update);
  } else {
    throw new HttpError(400, 'Invalid clock action');
  }
}

/** Admin corrections to anyone's time entries: stop a forgotten clock, fix times, or delete an entry. */
export async function manageTimeEntry(action, id, changes = {}) {
  const db = await database();
  const clocks = db.collection('clocks');
  const entry = await clocks.findOne({ _id: str(id, 64) });
  if (!entry) throw new HttpError(404, 'Time entry not found');
  if (action === 'delete') {
    await clocks.deleteOne({ _id: entry._id });
  } else if (action === 'stop') {
    if (!entry.active) throw new HttpError(400, 'This session has already ended');
    const t = Date.now() / 1000;
    const extra = entry.break_start ? t - entry.break_start : 0;
    await clocks.updateOne({ _id: entry._id }, { $inc: { break_seconds: extra }, $set: { end: t, break_start: null }, $unset: { active: '' } });
  } else if (action === 'update') {
    const start = Number(changes.start), end = Number(changes.end);
    const breakSeconds = Math.max(0, Number(changes.break_seconds) || 0);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new HttpError(400, 'Clock-out must be after clock-in');
    if (end > Date.now() / 1000 + 60) throw new HttpError(400, 'Clock-out cannot be in the future');
    if (breakSeconds >= end - start) throw new HttpError(400, 'Break time must be shorter than the session');
    await clocks.updateOne(
      { _id: entry._id },
      { $set: { start, end, break_seconds: breakSeconds, break_start: null, note: str(changes.note ?? entry.note, 1000), project: str(changes.project ?? entry.project, 64) }, $unset: { active: '' } }
    );
  } else {
    throw new HttpError(400, 'Invalid action');
  }
}

// --- Outbound delivery queue (Gmail, Google Sheets) ---

async function queueJob(db, kind, body) {
  await db.collection('jobs').insertOne({ _id: uid(), kind, body, status: 'pending', attempts: 0, error: '', created: now() });
}

export async function pendingJobs(limit = 10) {
  const db = await database();
  return db.collection('jobs').find({ status: 'pending', attempts: { $lt: 3 } }).sort({ created: 1 }).limit(limit).toArray();
}

export async function finishJob(id, status, error = '') {
  const db = await database();
  await db.collection('jobs').updateOne({ _id: id }, { $set: { status, error }, $inc: { attempts: 1 } });
}

export async function getLead(id) {
  const db = await database();
  const r = await db.collection('records').findOne({ _id: id, kind: 'leads' });
  return r ? { ...r.body, id: r._id } : null;
}

export async function retryJobs() {
  const db = await database();
  await db.collection('jobs').updateMany({ status: { $in: ['failed', 'waiting'] } }, { $set: { status: 'pending', attempts: 0, error: '' } });
}
