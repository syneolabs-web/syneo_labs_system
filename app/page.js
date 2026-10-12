'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { themes, key, worked, breakDuration, series, completion, points } from '@/lib/metrics';

const paths = {
  dashboard: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  projects: 'M3 7h18v13H3z M3 7V4h7l3 3',
  tasks: 'M5 3h14v18H5z M8 8l1 1 2-2 M13 8h3 M8 14l1 1 2-2 M13 14h3',
  calendar: 'M3 5h18v16H3z M7 3v4 M17 3v4 M3 10h18',
  clock: 'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  team: 'M16 21v-3a4 4 0 0 0-8 0v3 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M19 11a3 3 0 0 1 3 3v4 M2 18v-4a3 3 0 0 1 3-3',
  leads: 'M4 4h16v13H8l-4 4z M8 8h8 M8 12h5',
  meetings: 'M3 6h12v12H3z M15 10l6-4v12l-6-4',
  announcements: 'M3 9v6h4l11 5V4L7 9z M7 15l2 6h3',
  analytics: 'M4 20V10 M10 20V4 M16 20v-7 M22 20H2',
  settings: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2',
  search: 'M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  plus: 'M12 5v14 M5 12h14',
  arrow: 'M6 18L18 6 M7 6h11v11',
  logout: 'M9 3H3v18h6 M9 12h12 M17 8l4 4-4 4',
  bell: 'M5 17h14l-2-4V8a5 5 0 0 0-10 0v5z M10 21h4',
  play: 'M8 5l11 7-11 7z',
  pause: 'M8 5v14 M16 5v14',
  stop: 'M6 6h12v12H6z',
  download: 'M12 3v12 M8 11l4 4 4-4 M4 17v4h16v-4',
  upload: 'M12 15V3 M8 7l4-4 4 4 M4 17v4h16v-4',
  pulse: 'M2 12h4l3-7 4 14 3-7h6',
  menu: 'M3 6h18 M3 12h18 M3 18h18',
  check: 'M5 12l4 4L19 6',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'
};

const Icon = ({ name, className = 'icon' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d={paths[name] || paths.projects} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SyneoLogo = ({ size = 30, idPrefix = 'syneo' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    aria-hidden="true"
    style={{ flexShrink: 0, display: 'inline-block', filter: 'drop-shadow(0 2px 6px rgba(91, 76, 245, 0.22))' }}
  >
    <defs>
      <linearGradient id={`${idPrefix}-tl`} x1="56" y1="12" x2="24" y2="65" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#05d5ff" />
        <stop offset="48%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b46ff" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-br`} x1="68" y1="36" x2="40" y2="88" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2b8aff" />
        <stop offset="52%" stopColor="#7c4dff" />
        <stop offset="100%" stopColor="#e016ff" />
      </linearGradient>
    </defs>
    <path
      d="M 46.6 13.2 Q 47.8 12 49 13.2 L 59.4 23.6 Q 60.6 24.8 59.4 26 L 36.2 49.2 Q 35 50.4 36.2 51.6 L 47.8 63.2 Q 48.6 64 47.4 64 L 32.5 64 Q 29.8 64 27.9 62.1 L 17.5 51.7 Q 14.5 48.7 17.5 45.7 Z"
      fill={`url(#${idPrefix}-tl)`}
    />
    <path
      d="M 53.4 86.8 Q 52.2 88 51 86.8 L 40.6 76.4 Q 39.4 75.2 40.6 74 L 63.8 50.8 Q 65 49.6 63.8 48.4 L 52.2 36.8 Q 51.4 36 52.6 36 L 67.5 36 Q 70.2 36 72.1 37.9 L 82.5 48.3 Q 85.5 51.3 82.5 54.3 Z"
      fill={`url(#${idPrefix}-br)`}
    />
  </svg>
);

const SyneoWordmark = ({ height = 17, color = 'currentColor' }) => (
  <svg
    height={height}
    viewBox="98 180 524 80"
    fill={color}
    aria-label="SYNEO LAB"
    style={{ display: 'inline-block', width: 'auto', flexShrink: 0 }}
  >
    {/* S */}
    <path d="M 164 205 C 164 191 151 184 134 184 C 116 184 104 192 104 204 C 104 216 115 221 133 224 C 146 226 151 229 151 235 C 151 241 144 245 133 245 C 121 245 114 240 113 232 L 101 232 C 102 247 114 256 133 256 C 152 256 164 247 164 234 C 164 221 153 216 135 213 C 122 211 116 208 116 203 C 116 198 123 194 133 194 C 144 194 151 198 152 205 Z" />
    {/* Y */}
    <path d="M 169 185 L 194 223 L 194 255 L 206 255 L 206 219 L 183 185 Z" />
    <path d="M 214 185 L 202 204 L 209 214 L 228 185 Z" />
    {/* N + E Connected Bottom Bar */}
    <path d="M 235 206 L 235 255 L 247 255 L 247 224 Z" />
    <path d="M 235 185 L 281 255 L 331 255 L 331 244 L 288 244 L 249 185 Z" />
    <rect x="284" y="185" width="47" height="11" />
    <rect x="284" y="214" width="43" height="11" />
    {/* O */}
    <path d="M 366 184 L 366 196 C 379 196 389 206 389 220 C 389 234 379 244 366 244 C 353 244 343 234 343 220 L 331 220 C 331 240 346 256 366 256 C 386 256 401 240 401 220 C 401 200 386 184 366 184 Z" />
    {/* L */}
    <path d="M 432 185 L 432 255 L 481 255 L 481 244 L 444 244 L 444 185 Z" />
    {/* A */}
    <path d="M 513 185 L 486 255 L 499 255 L 519 201 L 539 255 L 552 255 L 525 185 Z" />
    {/* B */}
    <path d="M 559 185 L 559 196 L 589 196 C 596 196 601 200 601 205 C 601 210 596 214 589 214 L 559 214 L 559 225 L 592 225 C 600 225 605 229 605 235 C 605 240 600 244 592 244 L 559 244 L 559 255 L 593 255 C 608 255 618 247 618 235 C 618 227 613 221 605 219 C 611 216 614 211 614 204 C 614 192 604 185 590 185 Z" />
  </svg>
);

const colors = ['#f1dcd5', '#d5e9d7', '#dedcf2', '#f6e8bf', '#d5e9ec'];
const initials = name => (name || '').split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();

const Avatar = ({ user, big = false }) => {
  const bg = colors[(user?.name || '').length % 5];
  return (
    <span className={`avatar ${big ? 'big' : ''}`} style={{ background: bg }}>
      {initials(user?.name || '?')}
    </span>
  );
};

const duration = n => {
  n = Math.max(0, Math.floor(n));
  return [Math.floor(n / 3600), Math.floor(n / 60) % 60, n % 60]
    .map(x => String(x).padStart(2, '0'))
    .join(':');
};

const fmtDate = v => (v ? new Date(v.length === 10 ? v + 'T12:00:00' : v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No due date');
// ISO/epoch → value for <input type="datetime-local"> in the viewer's own time zone
const toLocalInput = v => {
  if (v === undefined || v === null || v === '') return '';
  const d = new Date(typeof v === 'number' ? v * 1000 : v);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const fmtTime = v =>new Date(v).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export default function SyneolabApp() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [connError, setConnError] = useState('');
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup' | 'requested'
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const navigate = targetPage => {
    setPage(targetPage);
    setFilter('All');
    setSearch('');
    setSidebarOpen(false);
  };
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [toastMsg, setToastMsg] = useState('');
  const [modal, setModal] = useState(null); // { type, id, data }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workspaceDefaults, setWorkspaceDefaults] = useState({
    defaultAccent: '#145c40',
    defaultWeekStart: 'Sunday',
    defaultCurrency: 'USD'
  });
  const [accent, setAccent] = useState('#145c40');
  const [currency, setCurrency] = useState('USD');
  const [weekStart, setWeekStart] = useState('Sunday');
  const [analyticsDays, setAnalyticsDays] = useState(30);
  const [settingsTab, setSettingsTab] = useState('Profile');
  const [chatMessages, setChatMessages] = useState([]);
  const [timesheetPerson, setTimesheetPerson] = useState('all');
  const [timesheetLimit, setTimesheetLimit] = useState(50);
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);

  // Core State
  const [state, setState] = useState({
    projects: [],
    tasks: [],
    leads: [],
    meetings: [],
    announcements: [],
    standups: [],
    goals: [],
    users: [],
    clocks: [],
    acknowledgements: [],
    integrations: { gmail: false, sheets: false },
    jobs: [],
    beacon: { status: 'awake', lastPing: '', totalPings: 1, netGrowthBytes: 0 }
  });

  const toastTimerRef = useRef(null);
  const csvInputRef = useRef(null);
  const showToast = msg => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(''), 3500);
  };

  const applyTheme = (colorHex) => {
    if (typeof document === 'undefined') return themes['#145c40'];
    const palette = themes[colorHex] || themes['#145c40'];
    Object.entries(palette).forEach(([k, v]) => {
      if (k !== 'name') document.documentElement.style.setProperty('--' + k, v);
    });
    document.documentElement.dataset.theme = palette.name;
    return palette;
  };

  // Enforce Admin Workspace Default when logged out, and apply per-user preferences only after login
  const syncActivePreferences = (activeUser, defaults = workspaceDefaults) => {
    const defAccent = defaults?.defaultAccent || '#145c40';
    const defWeek = defaults?.defaultWeekStart || 'Sunday';
    const defCurr = defaults?.defaultCurrency || 'USD';

    if (!activeUser) {
      setAccent(defAccent);
      setWeekStart(defWeek);
      setCurrency(defCurr);
      applyTheme(defAccent);
      return;
    }

    const userPrefs = activeUser.preferences || {};
    const localAccent = typeof localStorage !== 'undefined' ? localStorage.getItem(`accent_${activeUser.id}`) : null;
    const localWeek = typeof localStorage !== 'undefined' ? localStorage.getItem(`weekStart_${activeUser.id}`) : null;
    const localCurr = typeof localStorage !== 'undefined' ? localStorage.getItem(`currency_${activeUser.id}`) : null;

    const resolvedAccent = userPrefs.accent || localAccent || defAccent;
    const resolvedWeek = userPrefs.weekStart || localWeek || defWeek;
    const resolvedCurr = userPrefs.currency || localCurr || defCurr;

    setAccent(resolvedAccent);
    setWeekStart(resolvedWeek);
    setCurrency(resolvedCurr);
    applyTheme(resolvedAccent);
  };

  useEffect(() => {
    setMounted(true);
    // Clean up legacy shared browser keys so an employee's color never leaks globally
    try {
      localStorage.removeItem('accent');
      localStorage.removeItem('weekStart');
      localStorage.removeItem('currency');
    } catch {}
    applyTheme('#145c40');
    fetchSession();
    // Trigger initial zero-growth MongoDB keep-alive beacon
    fetch('/api/beacon?source=app-boot', { method: 'POST' }).catch(() => {});
  }, []);

  useEffect(() => {
    if (mounted) {
      syncActivePreferences(user, workspaceDefaults);
    }
  }, [user, workspaceDefaults, mounted]);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/session');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to connect to workspace database');
      setConnError('');
      const defaults = data.workspaceDefaults || workspaceDefaults;
      setWorkspaceDefaults(defaults);
      setUser(data.user);
      syncActivePreferences(data.user, defaults);
      setNeedsSetup(data.needsSetup);
      setSignupOpen(Boolean(data.signupOpen));
      if (data.user) {
        await refreshState();
      }
    } catch (e) {
      console.error(e);
      setConnError(e.message || 'Unable to connect to workspace database');
    } finally {
      setLoading(false);
    }
  };

  const refreshState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
        if (data.workspaceDefaults) {
          setWorkspaceDefaults(data.workspaceDefaults);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Re-sync session or workspace state immediately when the tab regains focus or becomes visible.
  useEffect(() => {
    const onSync = () => {
      if (document.visibilityState === 'hidden') return;
      setCurrentTime(Date.now() / 1000);
      if (user) refreshState();
      else fetchSession();
    };
    window.addEventListener('focus', onSync);
    document.addEventListener('visibilitychange', onSync);
    return () => {
      window.removeEventListener('focus', onSync);
      document.removeEventListener('visibilitychange', onSync);
    };
  }, [user]);

  // Timer Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 30s Poll + 10m Zero-Growth MongoDB Beacon
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      refreshState();
    }, 30000);
    const beaconInterval = setInterval(() => {
      fetch('/api/beacon?source=active-session', { method: 'POST' }).catch(() => {});
    }, 10 * 60 * 1000);
    return () => {
      clearInterval(interval);
      clearInterval(beaconInterval);
    };
  }, [user]);

  // Global K shortcut
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') setModal(null);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeClock = state.clocks?.find(c => c.user_id === user?.id && !c.end);
  const activeClockSeconds = activeClock ? worked(activeClock, currentTime) : 0;
  const activeBreakSeconds = activeClock ? breakDuration(activeClock, currentTime) : 0;
  const isAdmin = user?.role === 'admin';
  // Mirrors the server rules: admins change anything; members change tasks/leads/standups they own or are assigned.
  const canEdit = (kind, record = {}) =>
    isAdmin || (['tasks', 'leads', 'standups'].includes(kind) && (!record.id || record.owner === user?.id || record.assignee === user?.id));
  const canDelete = (kind, record = {}) => isAdmin || (['tasks', 'leads', 'standups'].includes(kind) && record.owner === user?.id);

  const formatMoney = v =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0
    }).format(Number(v) || 0);

  const handleApi = async (url, body, method = 'POST') => {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  // Clock Actions
  const handleClock = async (action, extra = {}) => {
    try {
      await handleApi('/api/clock', { action, ...extra });
      await refreshState();
      showToast(
        action === 'stop'
          ? 'Clocked out. Work and break times saved.'
          : action === 'break'
          ? 'Break started — break timer is now running'
          : action === 'resume'
          ? 'Break ended — work timer resumed'
          : action === 'switch'
          ? 'Active focus switched'
          : 'Time tracker updated'
      );
    } catch (e) {
      showToast(e.message);
    }
  };

  // Export CSV (Least privilege: employees export only their own time entries / leads)
  const exportCSV = kind => {
    const dateStr = key(new Date());
    const visibleTimeRows = isAdmin ? state.clocks : state.clocks.filter(c => c.user_id === user.id);
    const rows =
      kind === 'leads'
        ? [
            ['Name', 'Company', 'Email', 'Phone', 'Value', 'Stage', 'Follow up', 'Source', 'Notes'],
            ...state.leads.map(l => [l.title, l.company, l.email, l.phone, l.value, l.stage, l.followup, l.source || '', l.description])
          ]
        : [
            ['Member', 'Project', 'Start UTC', 'End UTC', 'Work duration', 'Break duration', 'Break seconds', 'Focused hours', 'Note'],
            ...visibleTimeRows.map(c => [
              state.users.find(u => u.id === c.user_id)?.name || 'Unknown',
              state.projects.find(p => p.id === c.project)?.title || 'General work',
              new Date(c.start * 1000).toISOString(),
              c.end ? new Date(c.end * 1000).toISOString() : 'Active',
              duration(worked(c, currentTime)),
              duration(breakDuration(c, currentTime)),
              Math.round(breakDuration(c, currentTime)),
              (worked(c, currentTime) / 3600).toFixed(3),
              c.note
            ])
          ];
    const csvContent = rows
      .map(r => r.map(v => '"' + String(v ?? '').replace(/^[=+@-]/, "'$&").replace(/"/g, '""') + '"').join(','))
      .join('\r\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syneolab-${kind}-${dateStr}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Import Leads CSV
  const importLeadsCSV = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const lines = text.replace(/^\ufeff/, '').split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) throw new Error('CSV file must have a header row and at least one lead row');
      const parseRow = row => {
        const out = [];
        let cur = '', inQ = false;
        for (let i = 0; i < row.length; i++) {
          const ch = row[i];
          if (ch === '"') {
            if (inQ && row[i + 1] === '"') { cur += '"'; i++; }
            else inQ = !inQ;
          } else if (ch === ',' && !inQ) {
            out.push(cur.trim());
            cur = '';
          } else cur += ch;
        }
        out.push(cur.trim());
        return out;
      };
      const headers = parseRow(lines[0]).map(h => h.toLowerCase());
      const idx = name => headers.findIndex(h => h.includes(name));
      const validStages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
      let imported = 0;
      for (const line of lines.slice(1, 101)) {
        const cols = parseRow(line);
        const title = cols[idx('name') >= 0 ? idx('name') : 0] || '';
        if (!title) continue;
        const rawStage = cols[idx('stage')] || 'New';
        const stage = validStages.find(s => s.toLowerCase() === rawStage.toLowerCase()) || 'New';
        await handleApi('/api/record', {
          kind: 'leads',
          body: {
            title,
            company: cols[idx('company')] || '',
            email: cols[idx('email')] || '',
            phone: cols[idx('phone')] || '',
            value: Number(String(cols[idx('value')] || '0').replace(/[^\d.]/g, '')) || 0,
            stage,
            followup: cols[idx('follow')] || '',
            source: cols[idx('source')] || 'CSV Import',
            description: cols[idx('note')] || ''
          }
        });
        imported++;
      }
      await refreshState();
      showToast(`Imported ${imported} lead${imported === 1 ? '' : 's'} into MongoDB`);
    } catch (err) {
      showToast(err.message || 'Could not import CSV');
    } finally {
      e.target.value = '';
    }
  };

  // Natural Language Lead Capture
  const parseLeadText = text => {
    const get = k => {
      const m = text.match(new RegExp('(?:^|[;\\n])\\s*' + k + '\\s*:\\s*([^;\\n]+)', 'i'));
      return m ? m[1].trim() : '';
    };
    return {
      title: get('Name') || text.split(/[;\n]/)[0].replace(/^name:\s*/i, '').slice(0, 100),
      company: get('Company'),
      email: get('Email') || (text.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i) || [''])[0],
      phone: get('Phone'),
      value: get('Value').replace(/[^\d.]/g, '') || 0,
      description: get('Notes') || text,
      stage: 'New'
    };
  };

  // RENDER: Loading or Auth Page if not logged in
  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#f3f6f2' }} />;
  }

  if (!user) {
    return (
      <div className="auth">
        <div className="auth-art">
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <SyneoLogo size={56} idPrefix="auth" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <SyneoWordmark height={24} color="#ffffff" />
              <span style={{ fontSize: 9.5, letterSpacing: '0.19em', color: 'rgba(255,255,255,0.72)', fontWeight: 600 }}>
                “WHERE CREATIVITY MEETS INNOVATIONS”
              </span>
            </div>
          </div>
          <div className="eyebrow" style={{ marginLeft: 0, color: '#8fbfa0' }}>
            A little structure. A lot of possibility.
          </div>
          <h1>Great work.<br />Better, together.</h1>
          <p>One thoughtful space for your people, projects, and everything that moves your business forward.</p>
        </div>
        <div className="auth-form">
          {connError ? (
            <div style={{ maxWidth: 380 }}>
              <div className="eyebrow" style={{ marginLeft: 0 }}>CONNECTION STATUS</div>
              <h2>Unable to reach database</h2>
              <p className="sub" style={{ marginBottom: 20 }}>
                {connError}. If using MongoDB Atlas, ensure your current IP address (or <code>0.0.0.0/0</code>) is added under <b>Security → Network Access</b>.
              </p>
              <button className="primary" onClick={() => { setLoading(true); fetchSession(); }}>
                Retry connection <Icon name="arrow" />
              </button>
            </div>
          ) : authMode === 'requested' && !needsSetup ? (
            <div>
              <div className="eyebrow" style={{ marginLeft: 0 }}>REQUEST SENT</div>
              <h2>Thanks — you're on the list.</h2>
              <p className="sub" style={{ marginBottom: 20 }}>
                An administrator needs to approve your account. Once approved, sign in with the email and password you just chose.
              </p>
              <button className="primary" onClick={() => setAuthMode('signin')}>
                Back to sign in <Icon name="arrow" />
              </button>
            </div>
          ) : authMode === 'signup' && !needsSetup ? (
            <form
              onSubmit={async e => {
                e.preventDefault();
                const payload = Object.fromEntries(new FormData(e.target));
                if (payload.password !== payload.confirm) return alert('The two passwords do not match.');
                try {
                  await handleApi('/api/signup', payload);
                  setAuthMode('requested');
                  fetchSession();
                } catch (err) {
                  alert(err.message);
                  fetchSession();
                }
              }}
            >
              <div className="eyebrow" style={{ marginLeft: 0 }}>SYNEOLAB WORKSPACE</div>
              <h2>Request access</h2>
              <p className="sub">For employees. An administrator will review your request before you can sign in.</p>
              <div className="field">
                <label>Full name</label>
                <input name="name" type="text" required autoComplete="name" />
              </div>
              <div className="field">
                <label>Work email</label>
                <input name="email" type="email" required autoComplete="username" />
              </div>
              <div className="field">
                <label>Department</label>
                <select name="department" defaultValue="Engineering">
                  {['Engineering', 'Design', 'Marketing', 'Management'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Password (12+ characters)</label>
                  <input name="password" type="password" required minLength="12" autoComplete="new-password" />
                </div>
                <div className="field">
                  <label>Confirm password</label>
                  <input name="confirm" type="password" required minLength="12" autoComplete="new-password" />
                </div>
              </div>
              <button className="primary" style={{ marginTop: 15 }}>
                Send request <Icon name="arrow" />
              </button>
              <p className="sub" style={{ marginTop: 18 }}>
                Already approved?{' '}
                <button type="button" className="auth-link" onClick={() => setAuthMode('signin')}>
                  Sign in
                </button>
              </p>
            </form>
          ) : (
            <form
              onSubmit={async e => {
                e.preventDefault();
                const payload = Object.fromEntries(new FormData(e.target));
                try {
                  const res = await handleApi(needsSetup ? '/api/setup' : '/api/login', payload);
                  setUser(res.user);
                  await refreshState();
                } catch (err) {
                  // Someone already created the workspace (e.g. in another tab): switch to sign-in.
                  if (needsSetup && /already configured/i.test(err.message)) {
                    setNeedsSetup(false);
                    alert('This workspace already has an administrator. Please sign in.');
                  } else {
                    alert(err.message);
                  }
                }
              }}
            >
              <div className="eyebrow" style={{ marginLeft: 0 }}>SYNEOLAB WORKSPACE</div>
              <h2>{needsSetup ? 'Make space for great work.' : 'Welcome back.'}</h2>
              <p className="sub">
                {needsSetup ? 'Create the administrator account for your company.' : 'Sign in to pick up where your team left off.'}
              </p>
              {needsSetup && (
                <div className="field">
                  <label>Your name</label>
                  <input name="name" type="text" required placeholder="Administrator name" />
                </div>
              )}
              <div className="field">
                <label>Work email</label>
                <input name="email" type="email" required autoComplete="username" />
              </div>
              <div className="field">
                <label>Password</label>
                <input name="password" type="password" required minLength="12" autoComplete={needsSetup ? 'new-password' : 'current-password'} />
              </div>
              {needsSetup && <p className="sub">Use at least 12 characters. This account manages your team.</p>}
              <button className="primary" style={{ marginTop: 15 }}>
                {needsSetup ? 'Create workspace' : 'Sign in'} <Icon name="arrow" />
              </button>
              {!needsSetup && (
                <p className="sub" style={{ marginTop: 18 }}>
                  {signupOpen ? (
                    <>
                      New employee?{' '}
                      <button type="button" className="auth-link" onClick={() => setAuthMode('signup')}>
                        Request access
                      </button>
                    </>
                  ) : (
                    'New employee? Sign-ups are currently closed — ask your administrator to add you.'
                  )}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- VIEWS ---

  // 1. Dashboard View
  const renderDashboard = () => {
    const todayStr = key(new Date());
    const doneTasks = state.tasks.filter(t => t.status === 'Done').length;
    const blockedTasks = state.tasks.filter(t => t.blocked && t.status !== 'Done');
    const overdueTasks = state.tasks.filter(t => t.due && t.due < todayStr && t.status !== 'Done');
    const dueLeads = state.leads.filter(l => l.followup && l.followup <= todayStr && !['Won', 'Lost'].includes(l.stage));
    const todayStandups = (state.standups || []).filter(s => (s.created || '').slice(0, 10) === todayStr);
    const workingCount = state.clocks.filter(c => !c.end && !c.break_start).length;
    const breakCount = state.clocks.filter(c => !c.end && c.break_start).length;

    const nextMeeting = state.meetings
      .filter(m => new Date(m.end) > new Date())
      .sort((a, b) => a.start.localeCompare(b.start))[0];

    const maxTasks = Math.max(1, ...state.projects.map(p => state.tasks.filter(t => t.project === p.id).length));
    const comp = completion(state.tasks);

    return (
      <>
        <div className="page-head">
          <div>
            <h1>Dashboard</h1>
            <p className="sub">Everything your team is building, in one calm place.</p>
          </div>
          <div className="actions">
            <button onClick={() => setModal({ type: 'standups', data: {} })}>
              <Icon name="pulse" /> Daily check-in
            </button>
            {isAdmin && (
              <button className="primary" onClick={() => setModal({ type: 'projects', data: {} })}>
                <Icon name="plus" /> Add project
              </button>
            )}
          </div>
        </div>

        <div className="stats dashboard-stats">
          <div className="stat green">
            <span>Total projects</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{state.projects.length}</span>
            <span className="sub">Every idea has a home</span>
          </div>
          <div className="stat">
            <span>Ended projects</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{state.projects.filter(p => p.status === 'Completed').length}</span>
            <span className="sub">Completed and delivered</span>
          </div>
          <div className="stat">
            <span>Running projects</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{state.projects.filter(p => p.status === 'Active').length}</span>
            <span className="sub">Moving forward together</span>
          </div>
          <div className="stat">
            <span>Pending projects</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{state.projects.filter(p => p.status === 'Planning').length}</span>
            <span className="sub">Awaiting their next chapter</span>
          </div>
        </div>

        {/* Executive Alignment & Attention Bar */}
        <div className="attention-bar">
          <button
            type="button"
            className={`attention-pill ${blockedTasks.length ? 'alert' : ''}`}
            onClick={() => { navigate('tasks'); setFilter('Blocked'); }}
          >
            <i className="dot" style={{ background: blockedTasks.length ? '#c6463d' : 'var(--green)' }} />
            <span><b>{blockedTasks.length}</b> Blocked tasks</span>
          </button>
          <button
            type="button"
            className={`attention-pill ${overdueTasks.length ? 'warn' : ''}`}
            onClick={() => { navigate('tasks'); setFilter('Overdue'); }}
          >
            <i className="dot" style={{ background: overdueTasks.length ? '#d69e2e' : 'var(--green)' }} />
            <span><b>{overdueTasks.length}</b> Overdue tasks</span>
          </button>
          <button
            type="button"
            className={`attention-pill ${dueLeads.length ? 'warn' : ''}`}
            onClick={() => { navigate('leads'); setFilter('Follow-up due'); }}
          >
            <i className="dot" style={{ background: dueLeads.length ? '#d69e2e' : 'var(--green)' }} />
            <span><b>{dueLeads.length}</b> Lead follow-ups due</span>
          </button>
          <button
            type="button"
            className="attention-pill"
            onClick={() => navigate('clock')}
          >
            <i className="dot" />
            <span><b>{workingCount}</b> Working · <b>{breakCount}</b> On break</span>
          </button>
          <button
            type="button"
            className="attention-pill"
            onClick={() => navigate('pulse')}
          >
            <i className="dot" style={{ background: 'var(--mid)' }} />
            <span><b>{todayStandups.length}</b> Team check-ins today · <b>{(state.goals || []).length}</b> Goals</span>
          </button>
        </div>

        <div className="bento-grid">
          {/* Project Analytics Pillars */}
          <section className="card project-analytics">
            <div className="card-head">
              <div>
                <h3>Project analytics</h3>
                <p className="sub">Task volume and completion, at a glance.</p>
              </div>
              <span className="mini-label">Completion %</span>
            </div>
            <div className="project-bars">
              {(state.projects.length
                ? state.projects.slice(0, 7)
                : Array.from({ length: 7 }, (_, i) => ({ id: `empty-${i}`, title: 'No project', empty: true }))
              ).map((p, i) => {
                const pTasks = p.empty ? [] : state.tasks.filter(t => t.project === p.id);
                const c = completion(pTasks);
                const colorVars = ['mid', 'green', 'soft', 'deep', 'mid', 'soft', 'green'];
                const barHeight = c.total ? 50 + (50 * c.total) / maxTasks : 50;
                return (
                  <button
                    key={p.id}
                    className="project-bar-item"
                    style={{
                      '--bar-height': `${barHeight}%`,
                      '--bar-color': `var(--${colorVars[i % colorVars.length]})`
                    }}
                    onClick={() => {
                      if (!p.empty) setModal({ type: 'projects', id: p.id, data: p });
                      else if (isAdmin) setModal({ type: 'projects', data: {} });
                    }}
                    aria-label={`${p.title}: ${c.percent}% complete, ${c.done} of ${c.total} tasks`}
                  >
                    <span className="bar-tooltip" role="tooltip">
                      <strong>{p.title}</strong>
                      <b>{c.percent}% complete</b>
                      <small>{c.done} / {c.total} tasks finished</small>
                    </span>
                    <span className="pill-track">
                      <span className="pill-fill" style={{ height: `${c.percent}%` }}></span>
                    </span>
                    <span className="pill-label">
                      {p.empty ? '—' : p.title.split(' ').map(x => x[0]).join('').slice(0, 3).toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="chart-foot">
              <span><i className="dot"></i>Completed tasks</span>
              <span><i className="dot striped"></i>Remaining tasks</span>
            </div>
          </section>

          {/* Up Next Reminder */}
          <section className="card reminder">
            <div>
              <div className="card-head">
                <h3>Reminders</h3>
                <Icon name="calendar" />
              </div>
              <span className="mini-label">{nextMeeting ? fmtDate(nextMeeting.start) : 'Your next conversation'}</span>
              {nextMeeting ? (
                <>
                  <h2>{nextMeeting.title}</h2>
                  <p className="sub">Time: {fmtTime(nextMeeting.start)} – {fmtTime(nextMeeting.end)}</p>
                  <div className="avatar-stack">
                    {(nextMeeting.attendees || []).slice(0, 4).map(uid => (
                      <Avatar key={uid} user={state.users.find(u => u.id === uid)} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty">
                  <strong>A moment to focus</strong>Your next meeting will appear here.
                </div>
              )}
            </div>
            {nextMeeting?.link ? (
              <a className="primary meeting-join" target="_blank" rel="noopener noreferrer" href={nextMeeting.link}>
                <Icon name="meetings" /> Join meeting ↗
              </a>
            ) : (
              <button className="primary" onClick={() => navigate('meetings')}>
                <Icon name="meetings" /> View meetings
              </button>
            )}
          </section>

          {/* Projects List */}
          <section className="card dashboard-projects">
            <div className="card-head">
              <h3>Projects</h3>
              <button className="small" onClick={() => navigate('projects')}>View all ↗</button>
            </div>
            {state.projects.slice(0, 5).map((p, i) => {
              const pTasks = state.tasks.filter(t => t.project === p.id);
              const progressPct = pTasks.length ? Math.round((pTasks.filter(t => t.status === 'Done').length / pTasks.length) * 100) : 0;
              return (
                <div key={p.id} className="list-row" onClick={() => setModal({ type: 'projects', id: p.id, data: p })} style={{ cursor: 'pointer' }}>
                  <div className={`project-symbol project-symbol-${i % 4}`}>
                    {['◈', '✳', '▥', '◒'][i % 4]}
                  </div>
                  <div className="grow">
                    <strong>{p.title}</strong>
                    <span className="sub">{p.due ? `Due ${fmtDate(p.due)}` : 'No deadline set'}</span>
                  </div>
                  <span className="project-percent">{progressPct}%</span>
                </div>
              );
            })}
            {state.projects.length === 0 && (
              <div className="empty">
                <strong>Ideas start here</strong>Create your first project.
              </div>
            )}
          </section>

          {/* Team Collaboration */}
          <section className="card dashboard-team">
            <div className="card-head">
              <h3>Team collaboration</h3>
              <button className="small" onClick={() => navigate('team')}>View team ↗</button>
            </div>
            {state.users.slice(0, 4).map(u => {
              const activeTask = state.tasks.find(t => t.assignee === u.id && t.status !== 'Done');
              const uClock = state.clocks.find(c => c.user_id === u.id && !c.end);
              return (
                <div key={u.id} className="list-row" onClick={() => setModal({ type: 'person', id: u.id, data: u })} style={{ cursor: 'pointer' }}>
                  <Avatar user={u} />
                  <div className="grow">
                    <strong>{u.name}</strong>
                    <span className="sub">{activeTask?.title || u.department}</span>
                  </div>
                  <span className={`tag ${uClock ? (uClock.break_start ? 'yellow' : '') : activeTask ? 'yellow' : ''}`}>
                    {uClock ? (uClock.break_start ? 'On break' : 'Clocked in') : activeTask ? activeTask.status : 'Available'}
                  </span>
                </div>
              );
            })}
          </section>

          {/* Project Progress Gauge */}
          <section className="card dashboard-progress">
            <div className="card-head">
              <h3>Project progress</h3>
              <span className="mini-label">All tasks</span>
            </div>
            <div className="gauge-wrap">
              <svg className="semi-gauge" viewBox="0 0 260 150" role="img" aria-label={`${comp.percent}% tasks completed`}>
                <defs>
                  <pattern id="gauge-stripes" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
                    <rect width="5" height="5" fill="var(--bg)" />
                    <path d="M0 0V5" stroke="var(--stripe)" strokeWidth="2" />
                  </pattern>
                </defs>
                <path d="M28 126 A102 102 0 0 1 232 126" fill="none" stroke="url(#gauge-stripes)" strokeWidth="29" strokeLinecap="round" />
                {comp.done > 0 && (
                  <path
                    d="M28 126 A102 102 0 0 1 232 126"
                    pathLength="100"
                    fill="none"
                    stroke="var(--green)"
                    strokeWidth="29"
                    strokeDasharray={`${comp.doneShare * 100} 100`}
                    strokeLinecap="round"
                  />
                )}
                {comp.ongoing > 0 && (
                  <path
                    d="M28 126 A102 102 0 0 1 232 126"
                    pathLength="100"
                    fill="none"
                    stroke="var(--deep)"
                    strokeWidth="29"
                    strokeDasharray={`${comp.ongoingShare * 100} 100`}
                    strokeDashoffset={`-${comp.doneShare * 100}`}
                    strokeLinecap={comp.done ? 'butt' : 'round'}
                  />
                )}
              </svg>
              <div className="gauge-label">
                <b>{comp.percent}%</b>
                <span>Tasks completed</span>
              </div>
            </div>
            <div className="gauge-legend">
              <span><i className="dot"></i>Completed <b>{comp.done}</b></span>
              <span><i className="dot deep"></i>In progress <b>{comp.ongoing}</b></span>
              <span><i className="dot striped"></i>Pending <b>{comp.pending}</b></span>
            </div>
          </section>

          {/* Time Tracker Card */}
          <section className={`card timer-card ${activeClock?.break_start ? 'is-on-break' : ''}`}>
            <div className="card-head">
              <h3>Time tracker</h3>
              <span className="timer-state">
                <i></i>{activeClock ? (activeClock.break_start ? 'On break' : 'Tracking') : 'Ready'}
              </span>
            </div>
            <p className="sub timer-project">
              {activeClock
                ? `${state.projects.find(p => p.id === activeClock.project)?.title || 'Focused work'} · In at ${fmtTime(activeClock.start * 1000)}`
                : 'Make a little space for focused work.'}
            </p>
            <div className="time-digits">{duration(activeClock?.break_start ? activeBreakSeconds : activeClockSeconds)}</div>
            {activeClock && (
              <div className="timer-metrics">
                <div className={`timer-metric ${!activeClock.break_start ? 'active' : ''}`}>
                  <span>Work time</span>
                  <b>{duration(activeClockSeconds)}</b>
                </div>
                <div className={`timer-metric ${activeClock.break_start ? 'active break' : ''}`}>
                  <span>Break time</span>
                  <b>{duration(activeBreakSeconds)}</b>
                </div>
              </div>
            )}
            <div className="timer-controls">
              {activeClock ? (
                <>
                  <button
                    onClick={() => handleClock(activeClock.break_start ? 'resume' : 'break')}
                    className="break-button"
                  >
                    <Icon name={activeClock.break_start ? 'play' : 'pause'} />
                    {activeClock.break_start ? 'Resume work' : 'Start break'}
                  </button>
                  <button className="stop" onClick={() => handleClock('stop')}>
                    <Icon name="stop" /> Clock out
                  </button>
                </>
              ) : (
                <>
                  <button className="start-button" onClick={() => setModal({ type: 'clock', data: {} })}>
                    <Icon name="play" /> Clock in
                  </button>
                  <button className="break-button" disabled title="Clock in to take a break">
                    <Icon name="pause" /> Break
                  </button>
                </>
              )}
            </div>
            <div className="timer-caption">
              {activeClock?.break_start
                ? 'Break timer is running on server. Work timer is paused until you resume or clock out.'
                : activeClock
                ? 'Runs on server even if you close this tab — stops only when you clock out.'
                : 'Your timer keeps running on the server when you close this tab.'}
            </div>
          </section>
        </div>
      </>
    );
  };

  // 2. Tasks Kanban Board
  const renderTasks = () => {
    const todayStr = key(new Date());
    let filtered = state.tasks.filter(t => {
      if (filter === 'All') return true;
      if (filter === 'My tasks') return t.assignee === user.id;
      if (filter === 'High priority') return t.priority === 'High';
      if (filter === 'Blocked') return Boolean(t.blocked) && t.status !== 'Done';
      if (filter === 'Overdue') return Boolean(t.due && t.due < todayStr && t.status !== 'Done');
      if (filter === 'Due this week') {
        if (!t.due) return false;
        const d = new Date(t.due);
        const start = new Date(new Date().setHours(0, 0, 0, 0));
        return d >= start && d < new Date(Date.now() + 7 * 864e5);
      }
      return true;
    });

    const columns = ['To do', 'In progress', 'In review', 'Done'];
    const dots = ['#819281', '#d6b86a', '#9983bd', '#328264'];

    const onDropTask = async (e, targetStatus) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      const task = state.tasks.find(t => t.id === taskId);
      if (task && task.status !== targetStatus) {
        try {
          await handleApi('/api/record', {
            kind: 'tasks',
            id: task.id,
            body: { ...task, status: targetStatus }
          });
          await refreshState();
        } catch (err) {
          showToast(err.message);
        }
      }
    };

    return (
      <>
        <div className="page-head">
          <div>
            <h1>Tasks</h1>
            <p className="sub">A little clarity for every next step. Drag cards to move work forward.</p>
          </div>
          <div className="actions">
            <button className="primary" onClick={() => setModal({ type: 'tasks', data: {} })}>
              <Icon name="plus" /> New task
            </button>
          </div>
        </div>

        <div className="tabs">
          {['All', 'My tasks', 'High priority', 'Blocked', 'Overdue', 'Due this week'].map(tab => (
            <button key={tab} className={filter === tab ? 'active' : ''} onClick={() => setFilter(tab)}>
              {tab}
            </button>
          ))}
        </div>

        <div className="board">
          {columns.map((col, idx) => {
            const colTasks = filtered.filter(t => t.status === col);
            return (
              <section
                key={col}
                className="column"
                onDragOver={e => e.preventDefault()}
                onDrop={e => onDropTask(e, col)}
              >
                <div className="column-head">
                  <span>
                    <i className="dot" style={{ background: dots[idx] }}></i>
                    {col}
                  </span>
                  <span className="muted">{colTasks.length}</span>
                </div>
                {colTasks.map(t => {
                  const subtasks = Array.isArray(t.subtasks) ? t.subtasks : [];
                  const subDone = subtasks.filter(s => s.done).length;
                  const comments = Array.isArray(t.comments) ? t.comments : [];
                  const taskHours = state.clocks
                    .filter(c => c.task === t.id)
                    .reduce((n, c) => n + worked(c, currentTime) / 3600, 0);
                  const isOverdue = t.due && t.due < todayStr && t.status !== 'Done';
                  const proj = state.projects.find(p => p.id === t.project);

                  return (
                    <article
                      key={t.id}
                      className={`task ${t.blocked && t.status !== 'Done' ? 'is-blocked' : ''}`}
                      draggable={canEdit('tasks', t)}
                      onDragStart={e => e.dataTransfer.setData('text/plain', t.id)}
                      style={canEdit('tasks', t) ? undefined : { cursor: 'pointer' }}
                      onClick={() => setModal({ type: 'tasks', id: t.id, data: t })}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span className={`tag ${t.department === 'Design' ? 'purple' : ''}`}>
                          {t.department || 'General'}
                        </span>
                        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                          {t.blocked && t.status !== 'Done' && <span className="tag red">⚑ Blocked</span>}
                          <span className="sub">
                            {t.priority === 'High' ? '↗ ' : ''}
                            {t.priority || 'Medium'}
                          </span>
                        </div>
                      </div>
                      <h4>{t.title}</h4>
                      {proj && <div className="sub" style={{ marginTop: -8, marginBottom: 8 }}>◈ {proj.title}</div>}
                      {t.blocked && t.blockerNote && t.status !== 'Done' && (
                        <div className="task-blocker-note">⚠ {t.blockerNote}</div>
                      )}
                      {subtasks.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>
                            <span>Checklist</span>
                            <b>{subDone}/{subtasks.length}</b>
                          </div>
                          <div className="progress">
                            <i style={{ width: `${Math.round((subDone / subtasks.length) * 100)}%` }}></i>
                          </div>
                        </div>
                      )}
                      {col === 'Done' && subtasks.length === 0 && (
                        <div className="progress"><i style={{ width: '100%' }}></i></div>
                      )}
                      {(taskHours > 0 || Number(t.estimateHours) > 0 || comments.length > 0 || t.deliverableUrl) && (
                        <div className="task-badges">
                          {(taskHours > 0 || Number(t.estimateHours) > 0) && (
                            <span className="sub">
                              ⏱ {taskHours.toFixed(1)}h{Number(t.estimateHours) > 0 ? ` / ${t.estimateHours}h` : ''}
                            </span>
                          )}
                          {comments.length > 0 && <span className="sub">💬 {comments.length}</span>}
                          {t.deliverableUrl && <span className="sub">🔗 Link</span>}
                        </div>
                      )}
                      <div className="task-meta">
                        <span style={isOverdue ? { color: '#b53833', fontWeight: 600 } : undefined}>
                          <Icon name="calendar" /> {fmtDate(t.due)}{isOverdue ? ' · Overdue' : ''}
                        </span>
                        <Avatar user={state.users.find(u => u.id === t.assignee)} />
                      </div>
                    </article>
                  );
                })}
                {colTasks.length === 0 && (
                  <div className="empty">A clear space for what’s next.</div>
                )}
              </section>
            );
          })}
        </div>
      </>
    );
  };

  // 3. Projects View
  const renderProjects = () => {
    const todayStr = key(new Date());
    const list = state.projects.filter(p => filter === 'All' || p.status === filter);
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Projects</h1>
            <p className="sub">From the first idea to the final detail.</p>
          </div>
          <div className="actions">
            {isAdmin && (
              <button className="primary" onClick={() => setModal({ type: 'projects', data: {} })}>
                <Icon name="plus" /> Add project
              </button>
            )}
          </div>
        </div>

        <div className="tabs">
          {['All', 'Active', 'Planning', 'Completed'].map(t => (
            <button key={t} className={filter === t ? 'active' : ''} onClick={() => setFilter(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className="project-grid">
          {list.map(p => {
            const pTasks = state.tasks.filter(t => t.project === p.id);
            const pct = pTasks.length ? Math.round((pTasks.filter(t => t.status === 'Done').length / pTasks.length) * 100) : 0;
            const loggedHours = state.clocks
              .filter(c => c.project === p.id)
              .reduce((n, c) => n + worked(c, currentTime) / 3600, 0);
            const blockedCount = pTasks.filter(t => t.blocked && t.status !== 'Done').length;
            const isOverdue = p.due && p.due < todayStr && p.status !== 'Completed';
            const milestones = Array.isArray(p.milestones) ? p.milestones : [];
            const mDone = milestones.filter(m => m.done).length;
            const leadUser = state.users.find(u => u.id === (p.lead || p.owner));

            const health =
              p.status === 'Completed'
                ? { label: 'Delivered', cls: '' }
                : blockedCount > 0
                ? { label: `${blockedCount} Blocked`, cls: 'red' }
                : isOverdue
                ? { label: 'Overdue', cls: 'red' }
                : Number(p.targetHours) > 0 && loggedHours > Number(p.targetHours)
                ? { label: 'Over hours', cls: 'yellow' }
                : { label: 'On track', cls: '' };

            return (
              <article key={p.id} className="card">
                <div className="card-head">
                  <div className="project-symbol">✳</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className={`tag ${health.cls}`}>{health.label}</span>
                    <span className="tag">{p.status}</span>
                  </div>
                </div>
                <h3>{p.title}</h3>
                {p.client && <div className="sub" style={{ marginTop: 4, fontWeight: 600 }}>Client: {p.client}</div>}
                <p className="sub" style={{ margin: '10px 0 18px' }}>
                  {p.description || 'Your next big thing.'}
                </p>
                <div className="project-metrics-row">
                  <div>
                    <span className="sub">Tasks</span>
                    <b>{pTasks.filter(t => t.status === 'Done').length}/{pTasks.length} ({pct}%)</b>
                  </div>
                  <div>
                    <span className="sub">Hours logged</span>
                    <b>{loggedHours.toFixed(1)}h{Number(p.targetHours) > 0 ? ` / ${p.targetHours}h` : ''}</b>
                  </div>
                  {milestones.length > 0 && (
                    <div>
                      <span className="sub">Milestones</span>
                      <b>{mDone}/{milestones.length}</b>
                    </div>
                  )}
                </div>
                <div className="progress" style={{ marginTop: 10 }}>
                  <i style={{ width: `${pct}%` }}></i>
                </div>
                <div className="list-row" style={{ marginTop: 15 }}>
                  <div className="grow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {leadUser && <Avatar user={leadUser} />}
                    <div>
                      <span className="sub">Due {fmtDate(p.due)}</span>
                      {isAdmin && Number(p.budget) > 0 && <span className="sub"> · {formatMoney(p.budget)}</span>}
                    </div>
                  </div>
                  <button className="small" onClick={() => setModal({ type: 'projects', id: p.id, data: p })}>
                    {isAdmin ? 'Edit project' : 'View project'}
                  </button>
                </div>
              </article>
            );
          })}
          {list.length === 0 && (
            <div className="card empty" style={{ gridColumn: '1 / -1' }}>
              <strong>Room for your next idea</strong>Create your first project to get started.
            </div>
          )}
        </div>
      </>
    );
  };

  // 4. Calendar View
  const renderCalendar = () => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const offset = weekStart === 'Monday' ? 1 : 0;
    const start = new Date(y, m, 1);
    const pad = (start.getDay() - offset + 7) % 7;
    const days = Array.from({ length: 42 }, (_, i) => new Date(y, m, 1 - pad + i));

    const EVENT_PALETTES = [
      { bg: '#e8f1fd', border: '#c3dafc', accent: '#2563eb', text: '#1d4ed8', tagBg: '#dbeafe' },
      { bg: '#f1ecfe', border: '#d8c9fb', accent: '#7c3aed', text: '#5b21b6', tagBg: '#ede9fe' },
      { bg: '#e6f4ec', border: '#bce3cc', accent: '#16794d', text: '#115e3b', tagBg: '#d1fae5' },
      { bg: '#fdeeed', border: '#f7c7c5', accent: '#dc3d43', text: '#9f2325', tagBg: '#fee2e2' },
      { bg: '#e3f6f8', border: '#b4e4ea', accent: '#087f8c', text: '#0b5c66', tagBg: '#cffafe' },
      { bg: '#fef3dc', border: '#f5da9c', accent: '#ca7a08', text: '#925405', tagBg: '#fef0c7' }
    ];

    const hashPaletteIndex = (ev, idx = 0) => {
      const seed = String(ev?.id || ev?.title || idx);
      let h = 0;
      for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
      return ev?.type === 'tasks' ? 5 : h % EVENT_PALETTES.length;
    };

    const eventsOn = dStr => {
      const raw = [
        ...state.meetings.filter(ev => key(new Date(ev.start)) === dStr).map(x => ({ ...x, type: 'meetings' })),
        ...state.tasks.filter(t => t.due === dStr).map(x => ({ ...x, type: 'tasks' }))
      ];
      const used = new Set();
      return raw.map((ev, idx) => {
        let pIdx = hashPaletteIndex(ev, idx);
        while (used.has(pIdx) && used.size < EVENT_PALETTES.length) {
          pIdx = (pIdx + 1) % EVENT_PALETTES.length;
        }
        used.add(pIdx);
        return { ...ev, palette: EVENT_PALETTES[pIdx] };
      });
    };

    const selectedKey = key(selectedDay);
    const dayEvents = eventsOn(selectedKey);
    const upcomingMeetings = state.meetings
      .filter(ev => new Date(ev.start) > new Date())
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, 5);

    return (
      <>
        <div className="page-head">
          <div>
            <h1>Calendar</h1>
            <p className="sub">Meetings, milestones, and a little breathing room.</p>
          </div>
          <div className="actions">
            <button onClick={() => { setMonth(new Date()); setSelectedDay(new Date()); }}>
              <Icon name="calendar" /> Today
            </button>
            {isAdmin && (
              <button className="primary" onClick={() => setModal({ type: 'meetings', data: {} })}>
                <Icon name="plus" /> New event
              </button>
            )}
          </div>
        </div>

        <div className="calendar-layout">
          <section className="card">
            <div className="calendar-head">
              <h2>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
              <div className="actions">
                <button
                  className="small"
                  aria-label="Previous month"
                  onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                >
                  ‹
                </button>
                <button
                  className="small"
                  aria-label="Next month"
                  onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                >
                  ›
                </button>
              </div>
            </div>
            <div className="calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <div key={d} className="weekday">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(i + offset) % 7]}
                </div>
              ))}
              {days.map((d, i) => {
                const dKey = key(d);
                const evs = eventsOn(dKey);
                const isSelected = dKey === selectedKey;
                const isToday = dKey === key(new Date());
                const isOutside = d.getMonth() !== m;
                return (
                  <button
                    key={i}
                    className={`day ${isOutside ? 'outside' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => setSelectedDay(d)}
                  >
                    <span className="daynum">{d.getDate()}</span>
                    {evs.slice(0, 3).map((e, ei) => (
                      <span
                        key={ei}
                        className={`event-pill ${e.type === 'tasks' ? 'task-event' : ''}`}
                        style={{
                          background: e.palette.bg,
                          color: e.palette.text,
                          borderColor: e.palette.border,
                          borderLeftColor: e.palette.accent
                        }}
                      >
                        {e.title}
                      </span>
                    ))}
                    {evs.length > 3 && <span className="sub">More…</span>}
                  </button>
                );
              })}
            </div>
            <div className="legend">
              <span><i className="dot"></i>Meeting</span>
              <span><i className="dot" style={{ background: '#ca7a08' }}></i>Task deadline</span>
            </div>
          </section>

          <aside className="agenda">
            <section className="card">
              <p className="eyebrow" style={{ margin: '0 0 8px' }}>
                {selectedDay.toLocaleDateString(undefined, { weekday: 'long' })}
              </p>
              <h2 style={{ margin: '0 0 20px', fontSize: 24 }}>
                {selectedDay.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
              </h2>
              {dayEvents.length > 0 ? (
                dayEvents.map((e, idx) => (
                  <div
                    key={idx}
                    className="agenda-event"
                    onClick={() => setModal({ type: e.type, id: e.id, data: e })}
                    style={{
                      cursor: 'pointer',
                      background: e.palette.bg,
                      borderColor: e.palette.border,
                      borderLeftColor: e.palette.accent
                    }}
                  >
                    <span className="sub" style={{ color: e.palette.text, opacity: 0.8 }}>
                      {e.start ? fmtTime(e.start) : 'Task deadline'}
                    </span>
                    <strong style={{ color: e.palette.text }}>{e.title}</strong>
                    <span
                      className="tag"
                      style={{
                        background: e.palette.tagBg,
                        color: e.palette.text,
                        border: `1px solid ${e.palette.border}`
                      }}
                    >
                      {e.type === 'tasks' ? 'Task' : 'Meeting'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty">
                  <strong>Your day, open</strong>No meetings or deadlines scheduled.
                </div>
              )}
            </section>
            <section className="card">
              <h3>Coming up</h3>
              {upcomingMeetings.map((e, idx) => {
                const pal = EVENT_PALETTES[hashPaletteIndex(e, idx)];
                return (
                  <div
                    key={e.id}
                    className="list-row"
                    onClick={() => setModal({ type: 'meetings', id: e.id, data: e })}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className="meeting-time"
                      style={{
                        background: pal.bg,
                        color: pal.text,
                        border: `1px solid ${pal.border}`
                      }}
                    >
                      <span>{new Date(e.start).toLocaleDateString(undefined, { month: 'short' })}</span>
                      <b>{new Date(e.start).getDate()}</b>
                    </div>
                    <div>
                      <strong>{e.title}</strong>
                      <span className="sub">{fmtTime(e.start)}</span>
                    </div>
                  </div>
                );
              })}
              {upcomingMeetings.length === 0 && (
                <div className="empty">
                  <strong>Nothing around the corner</strong>New meetings will show up here.
                </div>
              )}
            </section>
          </aside>
        </div>
      </>
    );
  };

  // 5. Time Tracking View
  const renderClock = () => {
    const person = isAdmin ? (timesheetPerson === 'me' ? user.id : timesheetPerson) : user.id;
    const allRows = state.clocks.filter(c => (isAdmin && person === 'all') || c.user_id === person);
    const rows = allRows.slice(0, timesheetLimit);
    const manageEntry = async (action, c) => {
      const name = state.users.find(u => u.id === c.user_id)?.name || 'this person';
      if (!confirm(`Clock out ${name} now?`)) return;
      try {
        await handleApi('/api/timesheet', { action, id: c.id });
        await refreshState();
        showToast(`${name} was clocked out`);
      } catch (err) {
        showToast(err.message);
      }
    };
    const todayStr = key(new Date());
    const todayClocks = state.clocks.filter(c => key(new Date(c.start * 1000)) === todayStr);

    // Last 7 days attendance matrix
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        key: key(d),
        label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        isToday: i === 6
      };
    });

    return (
      <>
        <div className="page-head">
          <div>
            <h1>Time tracking</h1>
            <p className="sub">Make every focused hour count.</p>
          </div>
          <div className="actions">
            <button onClick={() => exportCSV('time')}>
              <Icon name="download" /> {isAdmin ? 'Export CSV' : 'Export my CSV'}
            </button>
            {!activeClock && (
              <button className="primary" onClick={() => setModal({ type: 'clock', data: {} })}>
                ＋ Clock in
              </button>
            )}
          </div>
        </div>

        <div className="stats">
          <div className="stat green">
            <span>Working now</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{state.clocks.filter(c => !c.end && !c.break_start).length}</span>
            <span className="sub">People in their flow</span>
          </div>
          <div className="stat">
            <span>On a break</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{state.clocks.filter(c => !c.end && c.break_start).length}</span>
            <span className="sub">Rest is part of good work</span>
          </div>
          <div className="stat">
            <span>{isAdmin ? 'Hours today' : 'My sessions'}</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">
              {isAdmin
                ? (todayClocks.reduce((n, c) => n + worked(c, currentTime) / 3600, 0)).toFixed(1)
                : state.clocks.filter(c => c.user_id === user.id).length}
            </span>
            <span className="sub">
              {isAdmin
                ? `Break today: ${duration(todayClocks.reduce((n, c) => n + breakDuration(c, currentTime), 0))}`
                : 'Total sessions logged'}
            </span>
          </div>
          <div className="stat">
            <span>Your hours today</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">
              {(todayClocks.filter(c => c.user_id === user.id).reduce((n, c) => n + worked(c, currentTime) / 3600, 0)).toFixed(1)}
            </span>
            <span className="sub">
              Break today: {duration(todayClocks.filter(c => c.user_id === user.id).reduce((n, c) => n + breakDuration(c, currentTime), 0))}
            </span>
          </div>
        </div>

        <div className="two-col">
          <section className="card">
            <div className="card-head" style={{ alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h3>{isAdmin ? 'Timesheet' : 'My timesheet'}</h3>
              {isAdmin ? (
                <select
                  aria-label="Show time for"
                  value={timesheetPerson}
                  onChange={e => { setTimesheetPerson(e.target.value); setTimesheetLimit(50); }}
                  style={{ maxWidth: 220 }}
                >
                  <option value="all">Everyone</option>
                  <option value="me">My time</option>
                  {state.users.filter(u => u.id !== user.id).map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              ) : (
                <span className="tag">Personal log · Least privilege</span>
              )}
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Team member</th>
                    <th>Project / date</th>
                    <th>In → out</th>
                    <th>Focused time</th>
                    <th>Break time</th>
                    <th>Status</th>
                    {isAdmin && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(c => {
                    const isLongActive = !c.end && currentTime - c.start > 36000;
                    const taskObj = c.task ? state.tasks.find(t => t.id === c.task) : null;
                    return (
                      <tr key={c.id}>
                        <td>{state.users.find(u => u.id === c.user_id)?.name || 'Unknown'}</td>
                        <td>
                          {state.projects.find(p => p.id === c.project)?.title || 'General work'}
                          {taskObj ? ` · ${taskObj.title}` : ''}
                          <br />
                          <span className="sub">
                            {fmtDate(new Date(c.start * 1000).toISOString())}
                            {c.note ? ` · ${c.note}` : ''}
                          </span>
                        </td>
                        <td>
                          {fmtTime(c.start * 1000)} → {c.end ? fmtTime(c.end * 1000) : '—'}
                        </td>
                        <td>{duration(worked(c, currentTime))}</td>
                        <td>{duration(breakDuration(c, currentTime))}</td>
                        <td>
                          <span className={`tag ${c.break_start ? 'yellow' : ''}`}>
                            {c.end ? 'Completed' : c.break_start ? 'Break' : 'Working'}
                          </span>
                          {isLongActive && (
                            <span className="tag red" style={{ marginLeft: 6 }} title="Session running over 10 hours">
                              ⚠ 10h+
                            </span>
                          )}
                        </td>
                        {isAdmin && (
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {!c.end && (
                              <button className="small" onClick={() => manageEntry('stop', c)}>Clock out</button>
                            )}{' '}
                            <button className="small" onClick={() => setModal({ type: 'timeEntry', id: c.id, data: c })}>Edit</button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr><td colSpan={isAdmin ? 7 : 6}><div className="empty">No time recorded yet.</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {allRows.length > rows.length && (
              <div className="actions" style={{ justifyContent: 'center', marginTop: 15 }}>
                <button className="small" onClick={() => setTimesheetLimit(n => n + 50)}>
                  Show more ({allRows.length - rows.length} older)
                </button>
              </div>
            )}
          </section>

          <div>
            <section className={`card timer-card ${activeClock?.break_start ? 'is-on-break' : ''}`}>
              <div className="card-head">
                <h3>Time tracker</h3>
                <span className="timer-state">
                  <i></i>{activeClock ? (activeClock.break_start ? 'On break' : 'Tracking') : 'Ready'}
                </span>
              </div>
              <p className="sub timer-project">
                {activeClock
                  ? `${state.projects.find(p => p.id === activeClock.project)?.title || 'Focused work'} · In at ${fmtTime(activeClock.start * 1000)}`
                  : 'Ready when you are.'}
              </p>
              <div className="time-digits">{duration(activeClock?.break_start ? activeBreakSeconds : activeClockSeconds)}</div>
              {activeClock && (
                <>
                  <div className="timer-metrics">
                    <div className={`timer-metric ${!activeClock.break_start ? 'active' : ''}`}>
                      <span>Work time</span>
                      <b>{duration(activeClockSeconds)}</b>
                    </div>
                    <div className={`timer-metric ${activeClock.break_start ? 'active break' : ''}`}>
                      <span>Break time</span>
                      <b>{duration(activeBreakSeconds)}</b>
                    </div>
                  </div>
                  <div className="timer-switch-box">
                    <label className="sub" style={{ display: 'block', marginBottom: 6, fontSize: 11 }}>
                      Switch active focus (without clocking out)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <select
                        aria-label="Switch active project"
                        value={activeClock.project || ''}
                        onChange={e => handleClock('switch', { project: e.target.value, task: activeClock.task || '', note: activeClock.note || '' })}
                      >
                        <option value="">General work</option>
                        {state.projects.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                      <select
                        aria-label="Switch active task"
                        value={activeClock.task || ''}
                        onChange={e => handleClock('switch', { project: activeClock.project || '', task: e.target.value, note: activeClock.note || '' })}
                      >
                        <option value="">No specific task</option>
                        {state.tasks.filter(t => t.status !== 'Done').map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
              <div className="timer-controls">
                {activeClock ? (
                  <>
                    <button
                      onClick={() => handleClock(activeClock.break_start ? 'resume' : 'break')}
                      className="break-button"
                    >
                      <Icon name={activeClock.break_start ? 'play' : 'pause'} />
                      {activeClock.break_start ? 'Resume work' : 'Start break'}
                    </button>
                    <button className="stop" onClick={() => handleClock('stop')}>
                      <Icon name="stop" /> Clock out
                    </button>
                  </>
                ) : (
                  <button className="start-button" onClick={() => setModal({ type: 'clock', data: {} })}>
                    <Icon name="play" /> Clock in
                  </button>
                )}
              </div>
            </section>
            <div className="note" style={{ marginTop: 15 }}>
              Both work time and break time run on the server — even if you close this tab or sign out, your session continues until you clock out.
            </div>
          </div>
        </div>

        {/* 7-Day Attendance & Capacity Matrix */}
        <section className="card" style={{ marginTop: 22 }}>
          <div className="card-head">
            <div>
              <h3>{isAdmin ? 'Weekly team attendance & capacity (Last 7 days)' : 'My 7-day attendance & focus (Last 7 days)'}</h3>
              <p className="sub" style={{ marginTop: 4 }}>
                {isAdmin
                  ? 'Daily focused hours per team member vs. 40h weekly benchmark.'
                  : 'Your daily focused hours and break balance vs. 40h weekly benchmark.'}
              </p>
            </div>
            <span className="tag">40h weekly target</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Team member</th>
                  {last7Days.map(d => (
                    <th key={d.key} style={{ textAlign: 'center', fontWeight: d.isToday ? 700 : 500 }}>
                      {d.label}
                    </th>
                  ))}
                  <th>7d Work</th>
                  <th>7d Break</th>
                  <th>Capacity</th>
                </tr>
              </thead>
              <tbody>
                {(isAdmin ? state.users : state.users.filter(u => u.id === user.id)).map(u => {
                  const uClocks = state.clocks.filter(c => c.user_id === u.id);
                  let weekWorkSec = 0;
                  let weekBreakSec = 0;
                  const dayHours = last7Days.map(d => {
                    const dayClocks = uClocks.filter(c => key(new Date(c.start * 1000)) === d.key);
                    const wSec = dayClocks.reduce((n, c) => n + worked(c, currentTime), 0);
                    const bSec = dayClocks.reduce((n, c) => n + breakDuration(c, currentTime), 0);
                    weekWorkSec += wSec;
                    weekBreakSec += bSec;
                    return wSec / 3600;
                  });
                  const weekHours = weekWorkSec / 3600;
                  const utilPct = Math.min(100, Math.round((weekHours / 40) * 100));
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Avatar user={u} />
                          <div>
                            <strong>{u.name}</strong>
                            <div className="sub">{u.department}</div>
                          </div>
                        </div>
                      </td>
                      {dayHours.map((hrs, idx) => (
                        <td key={last7Days[idx].key} style={{ textAlign: 'center' }}>
                          {hrs > 0 ? (
                            <span className={`tag ${hrs >= 7.5 ? 'green' : hrs >= 4 ? '' : 'yellow'}`}>
                              {hrs.toFixed(1)}h
                            </span>
                          ) : (
                            <span className="sub">—</span>
                          )}
                        </td>
                      ))}
                      <td><strong>{weekHours.toFixed(1)}h</strong></td>
                      <td className="sub">{duration(weekBreakSec)}</td>
                      <td style={{ minWidth: 120 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress" style={{ flex: 1, margin: 0 }}>
                            <i style={{ width: `${utilPct}%` }}></i>
                          </div>
                          <span className="sub" style={{ minWidth: 34 }}>{utilPct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  };

  // 6. Team View
  const renderTeam = () => {
    const list = state.users.filter(u => filter === 'All' || u.department === filter);
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Team</h1>
            <p className="sub">The people behind the progress.</p>
          </div>
          <div className="actions">
            {isAdmin && (
              <button className="primary" onClick={() => setModal({ type: 'users', data: {} })}>
                <Icon name="plus" /> Add member
              </button>
            )}
          </div>
        </div>

        {isAdmin && state.settings && (() => {
          const limit = state.settings.memberLimit;
          const requests = state.requests || [];
          const used = state.users.length;
          const full = used + requests.length >= limit;
          const decide = async (action, r) => {
            if (action === 'reject' && !confirm(`Reject ${r.name}'s request? Their pending account will be deleted.`)) return;
            try {
              await handleApi('/api/users', { action, id: r.id });
              await refreshState();
              showToast(action === 'approve' ? `${r.name} can now sign in` : 'Request rejected');
            } catch (err) {
              alert(err.message);
            }
          };
          return (
            <div className="two-col" style={{ marginBottom: 22, alignItems: 'start' }}>
              <section className="card">
                <div className="card-head">
                  <h3>Access requests</h3>
                  <span className={`tag ${requests.length ? 'yellow' : ''}`}>{requests.length} pending</span>
                </div>
                {requests.map(r => (
                  <div key={r.id} className="list-row">
                    <Avatar user={r} />
                    <div className="grow">
                      <strong>{r.name}</strong>
                      <span className="sub">{r.email} · {r.department} · {new Date(r.created).toLocaleDateString()}</span>
                    </div>
                    <div className="actions">
                      <button className="small primary" onClick={() => decide('approve', r)}>Approve</button>
                      <button className="small" onClick={() => decide('reject', r)}>Reject</button>
                    </div>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="empty">No requests waiting. Employees can ask to join from the sign-in page with “Request access”.</div>
                )}
              </section>
              <section className="card">
                <h3>Team size limit</h3>
                <p className="sub" style={{ margin: '8px 0 14px' }}>
                  {used} active{requests.length ? ` + ${requests.length} pending` : ''} of {limit} seats.{' '}
                  {full ? 'Sign-up requests are closed.' : 'Sign-up requests are open.'}
                </p>
                <div className="progress" style={{ marginBottom: 16 }}>
                  <i style={{ width: `${Math.min(100, limit ? ((used + requests.length) / limit) * 100 : 100)}%` }}></i>
                </div>
                <form
                  style={{ display: 'flex', gap: 10, alignItems: 'end' }}
                  onSubmit={async e => {
                    e.preventDefault();
                    try {
                      await handleApi('/api/users', { action: 'limit', memberLimit: Number(new FormData(e.target).get('memberLimit')) });
                      await refreshState();
                      showToast('Team size limit saved');
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                >
                  <div className="field" style={{ margin: 0, flex: 1 }}>
                    <label>Maximum accounts (0 = no sign-ups)</label>
                    <input key={limit} name="memberLimit" type="number" min="0" max="10000" required defaultValue={limit} />
                  </div>
                  <button className="primary">Save</button>
                </form>
              </section>
            </div>
          );
        })()}

        <div className="tabs">
          {['All', 'Engineering', 'Design', 'Marketing', 'Management'].map(d => (
            <button key={d} className={filter === d ? 'active' : ''} onClick={() => setFilter(d)}>
              {d}
            </button>
          ))}
        </div>

        <div className="team-grid">
          {list.map(u => {
            const uTasks = state.tasks.filter(t => t.assignee === u.id);
            const openTasks = uTasks.filter(t => t.status !== 'Done');
            const blockedCount = openTasks.filter(t => t.blocked).length;
            const overdueCount = openTasks.filter(t => t.due && new Date(t.due) < new Date()).length;
            const onTimeRate = uTasks.length
              ? Math.round(((uTasks.length - overdueCount) / uTasks.length) * 100)
              : 100;
            const liveClock = state.clocks.find(c => c.user_id === u.id && !c.end);
            const liveProject = liveClock?.project ? state.projects.find(p => p.id === liveClock.project)?.title : null;
            const totalHours = state.clocks
              .filter(c => c.user_id === u.id)
              .reduce((n, c) => n + worked(c, currentTime) / 3600, 0);

            return (
              <article key={u.id} className="card person">
                <Avatar user={u} big />
                <h3>{u.name}</h3>
                <p className="sub">{u.email}</p>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                  <span className="tag">{u.department}</span>
                  {u.role === 'admin' && <span className="tag purple">Admin</span>}
                  <span className={`tag ${onTimeRate >= 85 ? 'green' : 'yellow'}`} title="On-time task rate">
                    {onTimeRate}% on-time
                  </span>
                  {blockedCount > 0 && <span className="tag red">{blockedCount} blocked</span>}
                </div>
                {liveClock && (
                  <div className="sub" style={{ marginTop: 8, fontSize: 12 }}>
                    {liveClock.break_start ? '☕ On break' : `⚡ Working on ${liveProject || 'General work'}`}
                  </div>
                )}
                <div className="person-stats">
                  <div>
                    <b>{openTasks.length}</b>
                    <span className="sub">Open tasks</span>
                  </div>
                  <div>
                    <b>{uTasks.filter(t => t.status === 'Done').length}</b>
                    <span className="sub">Completed</span>
                  </div>
                  <div>
                    <b>{totalHours.toFixed(1)}</b>
                    <span className="sub">Hours tracked</span>
                  </div>
                </div>
                <div className="progress">
                  <i style={{ width: `${uTasks.length ? (uTasks.filter(t => t.status === 'Done').length / uTasks.length) * 100 : 0}%` }}></i>
                </div>
                <div className="actions">
                  <span className={`tag ${liveClock?.break_start ? 'yellow' : ''}`}>
                    {liveClock ? (liveClock.break_start ? 'On break' : 'Clocked in') : 'Offline'}
                  </span>
                  <button className="small" onClick={() => setModal({ type: 'person', id: u.id, data: u })}>
                    View profile ↗
                  </button>
                </div>
              </article>
            );
          })}
          {list.length === 0 && (
            <div className="card empty" style={{ gridColumn: '1 / -1' }}>
              <strong>No people in this department</strong>
            </div>
          )}
        </div>
      </>
    );
  };

  // 7. Leads View
  const renderLeads = () => {
    const todayStr = key(new Date());
    const list = state.leads.filter(l => {
      if (filter === 'All') return true;
      if (filter === 'Follow-up due') {
        return !['Won', 'Lost'].includes(l.stage) && l.followup && l.followup <= todayStr;
      }
      return l.stage === filter;
    });
    const pipelineVal = state.leads
      .filter(l => !['Won', 'Lost'].includes(l.stage))
      .reduce((n, l) => n + Number(l.value || 0), 0);

    const updateLeadStage = async (lead, stage) => {
      try {
        await handleApi('/api/record', {
          kind: 'leads',
          id: lead.id,
          body: { ...lead, stage }
        });
        await refreshState();
        showToast(`Lead moved to ${stage}`);
      } catch (err) {
        showToast(err.message);
      }
    };

    const convertLeadToProject = lead => {
      setModal({
        type: 'projects',
        data: {
          title: lead.company ? `${lead.company} — ${lead.title}` : lead.title,
          client: lead.company || lead.title,
          status: 'Planning',
          progress: 10,
          budget: Number(lead.value || 0),
          lead: lead.assignee || user.id,
          description: `Converted from Won lead (${lead.title}${lead.email ? ` · ${lead.email}` : ''}).\n${lead.notes || ''}`.trim()
        }
      });
    };

    return (
      <>
        <div className="page-head">
          <div>
            <h1>Leads</h1>
            <p className="sub">{isAdmin ? 'Good conversations. New possibilities.' : 'Your assigned & captured opportunities.'}</p>
          </div>
          <div className="actions">
            {isAdmin && (
              <>
                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  style={{ display: 'none' }}
                  onChange={importLeadsCSV}
                />
                <button onClick={() => csvInputRef.current?.click()}>
                  <Icon name="upload" /> Import CSV
                </button>
              </>
            )}
            <button className="primary" onClick={() => setModal({ type: 'leads', data: {} })}>
              <Icon name="plus" /> Add lead
            </button>
          </div>
        </div>

        <div className="stats">
          <div className="stat green">
            <span>{isAdmin ? 'Total leads' : 'My leads'}</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{state.leads.length}</span>
            <span className="sub">{isAdmin ? 'Every connection counts' : 'Assigned or captured by you'}</span>
          </div>
          <div className="stat">
            <span>{isAdmin ? 'Pipeline value' : 'My pipeline'}</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{formatMoney(pipelineVal)}</span>
            <span className="sub">Open opportunities</span>
          </div>
          <div className="stat">
            <span>Won</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{state.leads.filter(l => l.stage === 'Won').length}</span>
            <span className="sub">New partnerships</span>
          </div>
          <div className="stat">
            <span>{state.integrations.sheets ? 'Sheets sync' : 'Lead storage'}</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{state.integrations.sheets ? 'Ready' : 'Active'}</span>
            <span className="sub">{state.integrations.sheets ? 'Synced with Google Sheets' : 'Saved in MongoDB · CSV ready'}</span>
          </div>
        </div>

        <div className="chat-layout">
          <section>
            <div className="actions" style={{ justifyContent: 'space-between', marginBottom: 15 }}>
              <div className="tabs">
                {['All', 'Follow-up due', 'New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'].map(s => (
                  <button key={s} className={filter === s ? 'active' : ''} onClick={() => setFilter(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <button className="small" onClick={() => exportCSV('leads')}>
                <Icon name="download" /> Export CSV
              </button>
            </div>
            <div className="card table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Lead / company</th>
                    <th>Contact</th>
                    <th>Value</th>
                    <th>Stage</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(l => {
                    const isFollowupOverdue = !['Won', 'Lost'].includes(l.stage) && l.followup && l.followup <= todayStr;
                    const owner = l.assignee ? state.users.find(u => u.id === l.assignee) : null;
                    return (
                      <tr key={l.id}>
                        <td>
                          <strong>{l.title}</strong>
                          {l.source && <span className="tag" style={{ marginLeft: 6 }}>{l.source}</span>}
                          <br />
                          <span className="sub">
                            {l.company || 'Independent'}
                            {owner ? ` · Owner: ${owner.name.split(' ')[0]}` : ''}
                            {l.followup ? ` · Follow up ${fmtDate(l.followup)}` : ''}
                          </span>
                          {isFollowupOverdue && (
                            <span className="tag red" style={{ marginLeft: 6 }}>Follow-up due</span>
                          )}
                        </td>
                        <td>{l.email || l.phone || '—'}</td>
                        <td>
                          {formatMoney(l.value)}
                          {Number(l.probability) > 0 && (
                            <div className="sub">{l.probability}% prob.</div>
                          )}
                        </td>
                        <td>
                          {canEdit('leads', l) ? (
                            <select
                              aria-label={`Stage for ${l.title}`}
                              value={l.stage}
                              onChange={e => updateLeadStage(l, e.target.value)}
                              style={{ padding: '5px 8px', fontSize: 11, width: 'auto', minWidth: 110 }}
                            >
                              {['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="tag">{l.stage}</span>
                          )}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {isAdmin && l.stage === 'Won' && (
                            <button
                              className="small primary"
                              style={{ marginRight: 6 }}
                              onClick={() => convertLeadToProject(l)}
                              title="Create a new project pre-filled from this Won lead"
                            >
                              → Project
                            </button>
                          )}
                          <button className="small" onClick={() => setModal({ type: 'leads', id: l.id, data: l })}>
                            {canEdit('leads', l) ? 'Open ↗' : 'View ↗'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {list.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty">
                          <strong>Your next opportunity starts here</strong>Add a lead or start a conversation in the capture panel.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Lead Assistant Chat Capture */}
          <section className="card chat">
            <div className="card-head">
              <div>
                <h3>Lead assistant <span className="tag">Capture</span></h3>
                <p className="sub" style={{ marginTop: 6 }}>From a quick note to a clear next step.</p>
              </div>
              <Icon name="leads" />
            </div>
            <div className="chat-log">
              <div className="bubble">
                Tell me about your new lead. I’ll organize the details into a card for you to review.<br /><br />
                Try: <b>Name: Maya Shah; Company: Acme; Email: maya@example.com; Value: 5000; Notes: Website redesign</b><br />
                <span className="sub">Structured capture · Instant preview</span>
              </div>
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`bubble ${m.user ? 'user' : ''}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                const text = new FormData(e.target).get('message');
                if (!text) return;
                setChatMessages(prev => [
                  ...prev,
                  { text, user: true },
                  { text: 'Your lead draft is ready. Review the details, then save it to your pipeline.' }
                ]);
                e.target.reset();
                const draft = parseLeadText(text);
                setModal({ type: 'leads', data: draft });
              }}
            >
              <textarea name="message" required placeholder="Add a name, company, contact details…" />
              <button className="primary" style={{ width: '100%', marginTop: 10 }}>
                Create lead draft ↗
              </button>
            </form>
          </section>
        </div>
      </>
    );
  };

  // 8. Meetings View
  const renderMeetings = () => {
    const isPast = filter === 'Past';
    const activeTab = isPast ? 'Past' : 'Upcoming';
    const list = state.meetings
      .filter(m => (isPast ? new Date(m.end) < new Date() : new Date(m.end) >= new Date()))
      .sort((a, b) => a.start.localeCompare(b.start));

    const toGCalUrl = m => {
      const fmt = iso => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: m.title || 'Syneolab Meeting',
        dates: `${fmt(m.start)}/${fmt(m.end)}`,
        details: [m.description || '', m.link ? `\nJoin meeting: ${m.link}` : ''].join('').trim(),
        location: m.link || m.location || 'Google Meet'
      });
      return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    return (
      <>
        <div className="page-head">
          <div>
            <h1>Meetings</h1>
            <p className="sub">{isAdmin ? 'Bring the right people into the same conversation.' : 'Your invited meetings & team sessions.'}</p>
          </div>
          {isAdmin && (
            <div className="actions">
              <a
                className="link-gen-btn"
                href="https://meet.google.com/new"
                target="_blank"
                rel="noopener noreferrer"
                style={{ height: 36, padding: '0 14px' }}
              >
                <Icon name="meetings" /> New Google Meet ↗
              </a>
              <button
                className="primary"
                onClick={() =>
                  setModal({
                    type: 'meetings',
                    data: {
                      attendees: state.users.map(u => u.id),
                      sendToEveryone: true,
                      autoRoom: true,
                      location: 'Google Meet'
                    }
                  })
                }
              >
                <Icon name="plus" /> Schedule meeting
              </button>
            </div>
          )}
        </div>

        <div className="tabs">
          {['Upcoming', 'Past'].map(t => (
            <button key={t} className={activeTab === t ? 'active' : ''} onClick={() => setFilter(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className="two-col">
          <section>
            {list.map(m => {
              const invitedAll = state.users.length > 0 && (m.attendees || []).length >= state.users.length;
              return (
                <article key={m.id} className="card meeting" style={{ marginBottom: 15 }}>
                  <div className="list-row">
                    <div className="meeting-time">
                      <span>{new Date(m.start).toLocaleDateString(undefined, { month: 'short' })}</span>
                      <b>{new Date(m.start).getDate()}</b>
                    </div>
                    <div className="grow">
                      <h3>{m.title}</h3>
                      <p className="sub">
                        {fmtDate(m.start)} · {fmtTime(m.start)} – {fmtTime(m.end)} · {m.location || 'Online'}
                      </p>
                    </div>
                    {invitedAll && <span className="tag purple">Everyone</span>}
                    <span className="tag">
                      {new Date(m.start) > new Date() ? 'Upcoming' : new Date(m.end) > new Date() ? 'Happening now' : 'Past'}
                    </span>
                  </div>
                  <p className="sub" style={{ marginTop: 20 }}>{m.description || 'A moment to connect and move forward.'}</p>
                  <div className="actions" style={{ justifyContent: 'space-between', marginTop: 15, flexWrap: 'wrap', gap: 10 }}>
                    <div className="avatar-stack">
                      {(m.attendees || []).map(uid => (
                        <Avatar key={uid} user={state.users.find(u => u.id === uid)} />
                      ))}
                    </div>
                    <div className="actions">
                      <a
                        className="link-gen-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={m.calendarEventUrl || toGCalUrl(m)}
                      >
                        <Icon name="calendar" /> {m.calendarEventUrl ? 'Open in Calendar ↗' : '+ Google Calendar'}
                      </a>
                      <button className="small" onClick={() => setModal({ type: 'meetings', id: m.id, data: m })}>
                        Details
                      </button>
                      {m.link && (
                        <a className="link" target="_blank" rel="noopener noreferrer" href={m.link}>
                          Join meeting ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
            {list.length === 0 && (
              <div className="empty">
                <strong>Your schedule has breathing room</strong>Meetings appear here as soon as they are scheduled.
              </div>
            )}
          </section>

          <section className="card" style={{ alignSelf: 'start' }}>
            <h3>Automatic calendar & Meet sync</h3>
            <p className="sub" style={{ marginTop: 12 }}>
              Every scheduled meeting sends an executive HTML card plus a native <b>Google Calendar (.ics REQUEST)</b> invite so it automatically appears on everyone’s calendar with RSVP controls.
            </p>
            <div className="note" style={{ margin: '15px 0' }}>
              <div>Gmail + .ics Calendar Invite: <b>{state.integrations.gmail ? 'Active' : 'Setup needed'}</b></div>
              <div style={{ marginTop: 4 }}>
                Auto Google Meet API Webhook: <b>{state.integrations.calendar ? 'Connected' : 'Ready in Settings → Integrations'}</b>
              </div>
            </div>
            <div className="actions" style={{ flexWrap: 'wrap' }}>
              <button onClick={() => navigate('calendar')}>
                <Icon name="calendar" /> Open calendar
              </button>
              {isAdmin && (
                <button className="small" onClick={() => { setSettingsTab('Integrations'); navigate('settings'); }}>
                  Calendar sync setup ↗
                </button>
              )}
            </div>
          </section>
        </div>
      </>
    );
  };

  // 9. Announcements View
  const renderAnnouncements = () => {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Announcements</h1>
            <p className="sub">A shared place for the things everyone should know.</p>
          </div>
          <div className="actions">
            {isAdmin && (
              <button className="primary" onClick={() => setModal({ type: 'announcements', data: {} })}>
                <Icon name="plus" /> Post announcement
              </button>
            )}
          </div>
        </div>

        {state.announcements.map(a => {
          const isAcked = state.acknowledgements.some(x => x.record_id === a.id && x.user_id === user.id);
          const ackCount = state.acknowledgements.filter(x => x.record_id === a.id).length;
          const author = state.users.find(u => u.id === a.owner);

          return (
            <article key={a.id} className="card announcement" style={{ marginBottom: 15 }}>
              <div className="card-head">
                <div className="profile">
                  <Avatar user={author} />
                  <div>
                    <h3>{a.title}</h3>
                    <span className="sub">{author?.name} · {fmtDate(a.created)}</span>
                  </div>
                </div>
                <span className={`tag ${a.priority === 'Important' ? 'yellow' : ''}`}>
                  {a.priority || 'Update'}
                </span>
              </div>
              <p style={{ margin: '15px 0', whiteSpace: 'pre-wrap' }}>{a.description}</p>
              <div className="actions">
                <button
                  className={`small ${isAcked ? '' : 'primary'}`}
                  disabled={isAcked}
                  onClick={async () => {
                    try {
                      await handleApi('/api/ack', { id: a.id });
                      await refreshState();
                      showToast('Thanks for staying in the loop');
                    } catch (err) {
                      showToast(err.message);
                    }
                  }}
                >
                  <Icon name="check" /> {isAcked ? 'Seen, thank you' : 'Mark as read'}
                </button>
                <span className="sub">{ackCount} acknowledged</span>
                {isAdmin && (
                  <button className="small" onClick={() => setModal({ type: 'announcements', id: a.id, data: a })}>
                    Edit
                  </button>
                )}
              </div>
            </article>
          );
        })}
        {state.announcements.length === 0 && (
          <div className="card empty">
            <strong>Everyone on the same page</strong>Company updates will appear here.
          </div>
        )}
      </>
    );
  };

  // 10. Analytics View
  const renderAnalytics = () => {
    const daysData = series(state.clocks, analyticsDays, currentTime);
    const prevData = series(state.clocks, analyticsDays, currentTime, analyticsDays);

    const sum = (xs, k) => xs.reduce((n, d) => n + d[k], 0);
    const hours = sum(daysData, 'hours');
    const oldHours = sum(prevData, 'hours');

    const trend = (curr, prev) => {
      if (!prev) return curr ? 'New activity this period' : 'No change from previous period';
      const pct = Math.round(((curr - prev) / prev) * 100);
      return `${pct >= 0 ? '↗' : '↘'} ${Math.abs(pct)}% vs previous ${analyticsDays} days`;
    };

    // Filter clocks for period
    const periodClocks = state.clocks.filter(
      c => key(new Date(c.start * 1000)) >= daysData[0].date && key(new Date(c.start * 1000)) <= daysData.at(-1).date
    );

    const sparkPts = (vals) => {
      const pts = points(vals, 240, 50, 3);
      const line = pts.map(p => p.join(',')).join(' ');
      return (
        <svg className="sparkline" viewBox="0 0 240 50" preserveAspectRatio="none" aria-hidden="true">
          <polygon points={`3,50 ${line} 237,50`} fill="var(--light)" />
          <polyline points={line} fill="none" stroke="var(--mid)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
        </svg>
      );
    };

    // Donut data
    const projectGroups = [...state.projects, { id: '', title: 'General work' }]
      .map(p => ({
        title: p.title,
        hours: periodClocks.filter(c => c.project === p.id).reduce((n, c) => n + worked(c, currentTime) / 3600, 0)
      }))
      .filter(p => p.hours > 0)
      .sort((a, b) => b.hours - a.hours);

    const knownProjectIds = new Set([...state.projects.map(p => p.id), '']);
    const otherHours = periodClocks
      .filter(c => !knownProjectIds.has(c.project || ''))
      .reduce((n, c) => n + worked(c, currentTime) / 3600, 0);
    if (otherHours > 0) projectGroups.push({ title: 'Archived / other', hours: otherHours });

    const totalDonutHours = projectGroups.reduce((n, p) => n + p.hours, 0);
    let donutOffset = 0;
    const shades = ['green', 'mid', 'soft', 'deep', 'stripe'];

    // 12-week Heatmap (84 days)
    const heatData = series(state.clocks, 84, currentTime);
    const maxHeat = Math.max(1, ...heatData.map(d => d.hours));

    // Contributors
    const contributors = state.users
      .map(u => ({
        ...u,
        hours: periodClocks.filter(c => c.user_id === u.id).reduce((n, c) => n + worked(c, currentTime) / 3600, 0),
        tasks: state.tasks.filter(t => t.assignee === u.id && t.status === 'Done').length
      }))
      .sort((a, b) => b.hours - a.hours);

    const comp = completion(state.tasks);

    // Focus chart
    const maxFocus = Math.max(1, ...daysData.map(d => d.hours), ...prevData.map(d => d.hours));
    const currPts = points(daysData.map(d => d.hours), 720, 240, 24, maxFocus);
    const prevPts = points(prevData.map(d => d.hours), 720, 240, 24, maxFocus);

    return (
      <>
        <div className="page-head">
          <div>
            <h1>Analytics</h1>
            <p className="sub">How the team is shaping up, and where the time goes.</p>
          </div>
          <div className="actions">
            <div className="period-switch">
              {[7, 30, 90].map(n => (
                <button
                  key={n}
                  className={analyticsDays === n ? 'active' : ''}
                  onClick={() => setAnalyticsDays(n)}
                >
                  {n}D
                </button>
              ))}
            </div>
            <button onClick={() => exportCSV('time')}>
              <Icon name="download" /> Export CSV
            </button>
          </div>
        </div>

        <div className="stats analytics-stats">
          <section className="stat metric-card">
            <div className="metric-title">Hours tracked<span className="metric-dot"></span></div>
            <span className="value">{hours.toFixed(1)}</span>
            <span className="sub">{trend(hours, oldHours)}</span>
            {sparkPts(daysData.map(d => d.hours))}
          </section>
          <section className="stat metric-card">
            <div className="metric-title">Work sessions<span className="metric-dot"></span></div>
            <span className="value">{sum(daysData, 'sessions')}</span>
            <span className="sub">{trend(sum(daysData, 'sessions'), sum(prevData, 'sessions'))}</span>
            {sparkPts(daysData.map(d => d.sessions))}
          </section>
          <section className="stat metric-card">
            <div className="metric-title">Active contributors<span className="metric-dot"></span></div>
            <span className="value">{new Set(periodClocks.map(c => c.user_id)).size}</span>
            <span className="sub">of {state.users.length} team members this period</span>
            {sparkPts(daysData.map(d => d.people))}
          </section>
          <section className="stat metric-card">
            <div className="metric-title">Average session<span className="metric-dot"></span></div>
            <span className="value">
              {periodClocks.length ? (hours / periodClocks.length).toFixed(1) : '0.0'}<small> h</small>
            </span>
            <span className="sub">Focused time, excluding breaks</span>
            {sparkPts(daysData.map(d => (d.sessions ? d.hours / d.sessions : 0)))}
          </section>
        </div>

        <div className="analytics-layout">
          {/* Daily Focus Trend Chart */}
          <section className="card throughput-card">
            <div className="card-head">
              <div>
                <h3>Focus trend</h3>
                <p className="sub">Daily focused hours · sessions grouped by clock-in date</p>
              </div>
              <div className="line-legend">
                <span><i></i>This period</span>
                <span><i></i>Previous</span>
              </div>
            </div>
            <div className="focus-chart">
              <svg viewBox="0 0 720 265" preserveAspectRatio="none" role="img" aria-label={`Daily focused hours over the last ${analyticsDays} days`}>
                <defs>
                  <linearGradient id="focus-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--mid)" stopOpacity=".38" />
                    <stop offset="1" stopColor="var(--mid)" stopOpacity=".015" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map(i => (
                  <React.Fragment key={i}>
                    <line x1="24" y1={24 + i * 64} x2="696" y2={24 + i * 64} stroke="var(--line)" strokeDasharray="3 5" />
                    <text x="0" y={28 + i * 64} fill="var(--muted)" fontSize="9">
                      {((maxFocus * (3 - i)) / 3).toFixed(0)}
                    </text>
                  </React.Fragment>
                ))}
                <polygon points={`24,216 ${currPts.map(p => p.join(',')).join(' ')} 696,216`} fill="url(#focus-fill)" />
                <polyline points={prevPts.map(p => p.join(',')).join(' ')} fill="none" stroke="var(--stripe)" strokeWidth="1.8" strokeDasharray="5 5" />
                <polyline points={currPts.map(p => p.join(',')).join(' ')} fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinejoin="round" />
                {[0, Math.floor(daysData.length / 3), Math.floor((daysData.length * 2) / 3), daysData.length - 1].map(i => (
                  <text
                    key={i}
                    x={currPts[i][0]}
                    y="253"
                    textAnchor={i === 0 ? 'start' : i === daysData.length - 1 ? 'end' : 'middle'}
                    fontSize="10"
                    fill="var(--muted)"
                  >
                    {fmtDate(daysData[i].date)}
                  </text>
                ))}
              </svg>
              <div className="chart-hotspots">
                {daysData.map(d => (
                  <button
                    key={d.date}
                    type="button"
                    className="chart-hotspot"
                    aria-label={`${fmtDate(d.date)}: ${d.hours.toFixed(1)} focused hours`}
                  >
                    <span>
                      {fmtDate(d.date)}
                      <b>{d.hours.toFixed(1)} h</b>
                      <small>{d.sessions} sessions · {d.people} people</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="trend-footer">
              <span><b>{hours.toFixed(1)} h</b> of focused teamwork</span>
              <span className="tag">{trend(hours, oldHours)}</span>
            </div>
          </section>

          {/* Time by Project Donut */}
          <section className="card time-project-card">
            <div className="card-head">
              <h3>Time by project</h3>
              <span className="mini-label">{analyticsDays} days</span>
            </div>
            <div className="donut-wrap">
              <svg viewBox="0 0 220 220" role="img" aria-label={`${totalDonutHours.toFixed(1)} focused hours by project`}>
                <circle cx="110" cy="110" r="82" fill="none" stroke="var(--light)" strokeWidth="27" />
                {projectGroups.map((g, i) => {
                  const startAngle = donutOffset;
                  const share = (g.hours / (totalDonutHours || 1)) * 100;
                  donutOffset += share;
                  return (
                    <circle
                      key={g.title}
                      cx="110"
                      cy="110"
                      r="82"
                      pathLength="100"
                      fill="none"
                      stroke={`var(--${shades[i % 5]})`}
                      strokeWidth="27"
                      strokeDasharray={`${Math.max(0.15, share - 1.3)} ${100 - Math.max(0.15, share - 1.3)}`}
                      strokeDashoffset={`-${startAngle}`}
                      transform="rotate(-90 110 110)"
                    >
                      <title>{`${g.title}: ${g.hours.toFixed(1)} hours (${Math.round(share)}%)`}</title>
                    </circle>
                  );
                })}
              </svg>
              <div className="donut-label">
                <b>{totalDonutHours.toFixed(1)}<small>h</small></b>
                <span>last {analyticsDays} days</span>
              </div>
            </div>
            <div className="donut-legend">
              {projectGroups.map((g, i) => (
                <div key={g.title}>
                  <span><i style={{ background: `var(--${shades[i % 5]})` }}></i>{g.title}</span>
                  <b>{g.hours.toFixed(1)}h</b>
                </div>
              ))}
              {projectGroups.length === 0 && (
                <p className="sub">Clock some focused time to see the breakdown.</p>
              )}
            </div>
          </section>

          {/* Heatmap & Contribution */}
          <section className="card heatmap-card">
            <div className="card-head">
              <div>
                <h3>Team activity</h3>
                <p className="sub">A rhythm of small steps. Last 12 weeks.</p>
              </div>
              <div className="heat-legend">
                Less {[0, 1, 2, 3, 4].map(i => <i key={i} className={`heat-cell level-${i}`}></i>)} More
              </div>
            </div>
            <div className="heatmap">
              {heatData.map((d, i) => {
                const lvl = d.hours ? Math.min(4, Math.max(1, Math.ceil((d.hours / maxHeat) * 4))) : 0;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`heat-cell level-${lvl}`}
                    aria-label={`${fmtDate(d.date)}: ${d.hours.toFixed(1)} hours`}
                  >
                    <span>{fmtDate(d.date)}<b>{d.hours.toFixed(1)} focused hours</b></span>
                  </button>
                );
              })}
            </div>
            <div className="chart-foot">
              <span>{fmtDate(heatData[0].date)}</span>
              <span>{fmtDate(heatData.at(-1).date)}</span>
            </div>
            <div className="completion-strip" style={{ marginTop: 20 }}>
              <div><b>{comp.done}</b><span>Tasks completed <small>all time</small></span></div>
              <div><b>{comp.percent}%</b><span>Completion rate <small>all time</small></span></div>
              <div><b>{comp.ongoing}</b><span>Tasks in motion <small>right now</small></span></div>
            </div>
          </section>

          {/* Top Contributors */}
          <section className="card contributors-card">
            <div className="card-head">
              <h3>Top contributors</h3>
              <span className="mini-label">Focused hours</span>
            </div>
            {contributors.slice(0, 5).map((u, i) => (
              <div key={u.id} className="contributor">
                <span className="rank">{String(i + 1).padStart(2, '0')}</span>
                <Avatar user={u} />
                <div className="grow">
                  <strong>{u.name}</strong>
                  <div className="progress">
                    <i style={{ width: `${contributors[0]?.hours ? (u.hours / contributors[0].hours) * 100 : 0}%` }}></i>
                  </div>
                </div>
                <b>{u.hours.toFixed(1)}<small> h</small></b>
              </div>
            ))}
          </section>
        </div>
      </>
    );
  };

  // 11. Settings View
  const renderSettings = () => {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Settings</h1>
            <p className="sub">A workspace that feels like yours.</p>
          </div>
        </div>

        <div className="settings-grid">
          <div className="settings-tabs">
            {(isAdmin ? ['Profile', 'Appearance', 'Integrations'] : ['Profile', 'Appearance']).map(t => (
              <button
                key={t}
                className={settingsTab === t ? 'primary' : ''}
                onClick={() => setSettingsTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <section className="card">
            {settingsTab === 'Profile' && (
              <div>
                <h3>Your profile</h3>
                <div className="list-row" style={{ marginTop: 15 }}>
                  <Avatar user={user} big />
                  <div>
                    <strong>{user.name}</strong>
                    <span className="sub">{user.email} · {isAdmin ? 'Admin (Full Workspace Access)' : 'Employee (Least-Privilege Access)'}</span>
                  </div>
                </div>
                <div className="note" style={{ marginTop: 18 }}>
                  <strong>Role &amp; Access Scope ({isAdmin ? 'Admin' : 'Employee'})</strong>
                  <div className="sub" style={{ marginTop: 6, lineHeight: 1.6 }}>
                    {isAdmin
                      ? 'Full executive permissions: manage projects & client budgets, assign work across the team, schedule meetings & calendar syncs, post announcements, view all timesheets, and administer workspace members & integrations.'
                      : 'Least-privilege employee scope: manage your own assigned tasks & personal tasks, capture & manage your own leads, clock in/out and view your own timesheet, post daily standups, and view active projects (budgets hidden), invited meetings, and team announcements.'}
                  </div>
                </div>
                <h3 style={{ margin: '25px 0 18px' }}>Change password</h3>
                <form
                  style={{ maxWidth: 400 }}
                  onSubmit={async e => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    try {
                      await handleApi('/api/password', Object.fromEntries(fd));
                      setUser(null);
                      showToast('Password changed. Please sign in again.');
                    } catch (err) {
                      showToast(err.message);
                    }
                  }}
                >
                  <div className="field">
                    <label>Current password</label>
                    <input name="current" type="password" required />
                  </div>
                  <div className="field">
                    <label>New password (12+ characters)</label>
                    <input name="password" type="password" required minLength="12" />
                  </div>
                  <button className="primary" style={{ marginTop: 10 }}>Update password</button>
                </form>
              </div>
            )}

            {settingsTab === 'Appearance' && (
              <div>
                <div className="actions" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div>
                    <h3>Make yourself at home</h3>
                    <p className="sub" style={{ margin: '8px 0 18px' }}>
                      {isAdmin
                        ? 'Your selection sets the enforced Workspace Default theme (on Sign-In & for new employees) as well as your Admin view.'
                        : `Personal post-login preference — applies only to your account after signing in (Workspace Default: ${themes[workspaceDefaults.defaultAccent]?.name || 'Forest'}).`}
                    </p>
                  </div>
                  {!isAdmin && (
                    <button
                      type="button"
                      className="small"
                      onClick={async () => {
                        try {
                          localStorage.removeItem(`accent_${user.id}`);
                          localStorage.removeItem(`weekStart_${user.id}`);
                          localStorage.removeItem(`currency_${user.id}`);
                          const res = await handleApi('/api/preferences', { resetToDefault: true });
                          const updatedUser = { ...user, preferences: {} };
                          setUser(updatedUser);
                          if (res.workspaceDefaults) setWorkspaceDefaults(res.workspaceDefaults);
                          syncActivePreferences(updatedUser, res.workspaceDefaults || workspaceDefaults);
                          showToast('Reset to Admin Workspace Default theme');
                        } catch (err) {
                          showToast(err.message);
                        }
                      }}
                    >
                      Reset to Admin Default
                    </button>
                  )}
                </div>

                <div className="eyebrow" style={{ marginLeft: 0 }}>
                  {isAdmin ? 'Workspace Default & Admin Accent Color' : 'Your Personal Accent Color (Post-Login)'}
                </div>
                <div className="swatches">
                  {[
                    ['Forest', '#145c40'],
                    ['Ocean', '#285a80'],
                    ['Plum', '#644780'],
                    ['Ember', '#9b512d'],
                    ['Rose', '#b84b76'],
                    ['Sakura', '#d4688e']
                  ].map(([name, hex]) => (
                    <button
                      key={hex}
                      className="swatch"
                      aria-pressed={accent === hex}
                      onClick={async () => {
                        setAccent(hex);
                        localStorage.setItem(`accent_${user.id}`, hex);
                        const p = applyTheme(hex);
                        try {
                          const res = await handleApi('/api/preferences', { accent: hex });
                          setUser(prev => (prev ? { ...prev, preferences: res.preferences } : prev));
                          if (res.workspaceDefaults) setWorkspaceDefaults(res.workspaceDefaults);
                          showToast(
                            isAdmin
                              ? `${p.name} set as Workspace Default & Admin theme`
                              : `${p.name} saved to your personal profile`
                          );
                        } catch {
                          showToast(`${p.name} theme applied`);
                        }
                      }}
                    >
                      <i style={{ '--swatch': hex }}></i>
                      {name}
                      {workspaceDefaults.defaultAccent === hex && !isAdmin && (
                        <small style={{ fontSize: 9, opacity: 0.75, marginLeft: 4 }}>(Default)</small>
                      )}
                    </button>
                  ))}
                </div>

                <div className="eyebrow" style={{ margin: '30px 0 12px' }}>Week starts on</div>
                <div className="actions">
                  {['Sunday', 'Monday'].map(d => (
                    <button
                      key={d}
                      className={weekStart === d ? 'primary' : ''}
                      onClick={async () => {
                        setWeekStart(d);
                        localStorage.setItem(`weekStart_${user.id}`, d);
                        try {
                          const res = await handleApi('/api/preferences', { weekStart: d });
                          setUser(prev => (prev ? { ...prev, preferences: res.preferences } : prev));
                          if (res.workspaceDefaults) setWorkspaceDefaults(res.workspaceDefaults);
                        } catch {}
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div className="eyebrow" style={{ margin: '30px 0 12px' }}>Lead currency</div>
                <select
                  style={{ maxWidth: 220 }}
                  value={currency}
                  onChange={async e => {
                    const val = e.target.value;
                    setCurrency(val);
                    localStorage.setItem(`currency_${user.id}`, val);
                    try {
                      const res = await handleApi('/api/preferences', { currency: val });
                      setUser(prev => (prev ? { ...prev, preferences: res.preferences } : prev));
                      if (res.workspaceDefaults) setWorkspaceDefaults(res.workspaceDefaults);
                    } catch {}
                    showToast('Currency updated');
                  }}
                >
                  {['USD', 'NPR', 'INR', 'EUR', 'GBP'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {settingsTab === 'Integrations' && (
              <div>
                <h3>Connected, thoughtfully</h3>
                <div className="list-row">
                  <div className="project-symbol">
                    <Icon name="pulse" />
                  </div>
                  <div className="grow">
                    <strong>24/7 MongoDB Atlas Keep-Alive Beacon (Zero Storage Growth)</strong>
                    <span className="sub">
                      Updates a single 110-byte heartbeat record in-place &amp; purges expired sessions so your 500MB DB stays 24/7 awake across weekends with 0B extra storage
                      {state.beacon?.lastPing ? ` · Last pulse: ${new Date(state.beacon.lastPing).toLocaleTimeString()} (${state.beacon.totalPings || 1} total)` : ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="small"
                    style={{ marginRight: 8 }}
                    onClick={async () => {
                      const res = await handleApi('/api/beacon?source=manual-admin', {});
                      await refreshState();
                      showToast(`MongoDB Beacon pulsed (${res.latencyMs || 0}ms · 0B storage added)`);
                    }}
                  >
                    Pulse now
                  </button>
                  <span className="tag green">24/7 Awake · 0B Growth</span>
                </div>
                <div className="list-row">
                  <div className="project-symbol">G</div>
                  <div className="grow">
                    <strong>Gmail SMTP & Native Calendar Invite (.ics)</strong>
                    <span className="sub">Sends executive HTML invites + native Google Calendar RSVP sync</span>
                  </div>
                  <span className={`tag ${state.integrations.gmail ? 'green' : 'yellow'}`}>
                    {state.integrations.gmail ? 'Configured' : 'Setup needed'}
                  </span>
                </div>
                <div className="list-row">
                  <div className="project-symbol">📅</div>
                  <div className="grow">
                    <strong>Google Calendar & Auto Google Meet Room</strong>
                    <span className="sub">
                      {state.integrations.calendar
                        ? 'Auto-creates Google Calendar events & meet.google.com links'
                        : ' Gmail .ics sync is active · Add GOOGLE_CALENDAR_URL for auto meet.google.com links'}
                    </span>
                  </div>
                  <span className={`tag ${state.integrations.calendar ? 'green' : ''}`}>
                    {state.integrations.calendar ? 'Webhook active' : '.ics Sync active'}
                  </span>
                </div>
                <div className="list-row">
                  <div className="project-symbol">▦</div>
                  <div className="grow">
                    <strong>Google Sheets</strong>
                    <span className="sub">Automatically update your lead spreadsheet</span>
                  </div>
                  <span className={`tag ${state.integrations.sheets ? 'green' : 'yellow'}`}>
                    {state.integrations.sheets ? 'Configured' : 'Setup needed'}
                  </span>
                </div>
                <div className="note" style={{ margin: '20px 0' }}>
                  <strong>Automatic Calendar & Google Meet Sync:</strong> Every meeting automatically attaches a native <code>METHOD:REQUEST</code> iCalendar (<code>.ics</code>) invite that syncs directly into Gmail and Google Calendar. To also auto-generate <code>https://meet.google.com/xxx-xxxx-xxx</code> links on the server, deploy <code>integrations/google-calendar-meet.gs</code> in Google Apps Script and set <code>GOOGLE_CALENDAR_URL</code> in <code>.env.local</code>.
                </div>
                {isAdmin && state.jobs.length > 0 && (
                  <div style={{ marginBottom: 15 }}>
                    <h3 style={{ marginBottom: 10 }}>Delivery activity</h3>
                    {state.jobs.slice(0, 8).map(j => (
                      <div key={j.id} className="list-row">
                        <div className="grow">
                          <strong>
                            {j.kind === 'email'
                              ? j.payload?.type === 'task_assigned'
                                ? 'Task assignment email'
                                : j.payload?.type === 'announcement'
                                ? 'Announcement email'
                                : 'Meeting email'
                              : 'Sheets lead sync'}
                          </strong>
                          <span className="sub">{new Date(j.created).toLocaleString()}{j.error ? ` · ${j.error}` : ''}</span>
                        </div>
                        <span className={`tag ${j.status === 'sent' ? '' : 'yellow'}`}>{j.status}</span>
                      </div>
                    ))}
                  </div>
                )}
                {isAdmin && (
                  <div className="actions">
                    <button
                      className="small"
                      onClick={async () => {
                        await handleApi('/api/jobs/retry', {});
                        await refreshState();
                        showToast('Queued for another delivery attempt');
                      }}
                    >
                      Retry pending setup / failed
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </>
    );
  };

  // 11b. Pulse & Goals View (Daily Standups + Company OKRs)
  const renderPulse = () => {
    const todayStr = key(new Date());
    const standups = state.standups || [];
    const goals = state.goals || [];
    const todayStandups = standups.filter(s => (s.created || '').slice(0, 10) === todayStr);
    const activeBlockersCount =
      state.tasks.filter(t => t.blocked && t.status !== 'Done').length +
      todayStandups.filter(s => s.blockers && s.blockers.trim()).length;

    const avgGoalPct = goals.length
      ? Math.round(
          goals.reduce((sum, g) => {
            const target = Math.max(1, Number(g.targetValue || 100));
            const cur = Math.max(0, Number(g.currentValue || 0));
            return sum + Math.min(100, (cur / target) * 100);
          }, 0) / goals.length
        )
      : 0;

    const filteredStandups = standups.filter(s => {
      if (filter === 'Today') return (s.created || '').slice(0, 10) === todayStr;
      if (filter === 'With blockers') return Boolean(s.blockers && s.blockers.trim());
      if (filter === 'My check-ins') return s.owner === user.id;
      return true;
    });

    return (
      <>
        <div className="page-head">
          <div>
            <h1>Pulse & goals</h1>
            <p className="sub">Daily team alignment, blockers, and quarterly objectives.</p>
          </div>
          <div className="actions">
            {isAdmin && (
              <button onClick={() => setModal({ type: 'goals', data: { currentValue: 0, targetValue: 100, unit: '%' } })}>
                <Icon name="plus" /> Add goal
              </button>
            )}
            <button className="primary" onClick={() => setModal({ type: 'standups', data: { mood: 'Focused' } })}>
              <Icon name="plus" /> Post daily check-in
            </button>
          </div>
        </div>

        <div className="stats">
          <div className="stat green">
            <span>Check-ins today</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{todayStandups.length}/{state.users.length}</span>
            <span className="sub">Daily team rhythm</span>
          </div>
          <div className="stat">
            <span>Company goals</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{goals.length}</span>
            <span className="sub">{goals.length ? `${avgGoalPct}% average progress` : 'Add quarterly OKRs'}</span>
          </div>
          <div className="stat">
            <span>Active blockers</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">{activeBlockersCount}</span>
            <span className="sub">{activeBlockersCount ? 'Needs unblocking' : 'Clear runway'}</span>
          </div>
          <div className="stat">
            <span>Your check-in</span>
            <span className="arrow"><Icon name="arrow" /></span>
            <span className="value">
              {todayStandups.some(s => s.owner === user.id) ? 'Done' : 'Pending'}
            </span>
            <span className="sub">Keep the team in sync</span>
          </div>
        </div>

        <div className="two-col">
          <section className="card">
            <div className="card-head" style={{ flexWrap: 'wrap', gap: 10 }}>
              <h3>Daily check-ins</h3>
              <div className="tabs" style={{ margin: 0 }}>
                {['All', 'Today', 'With blockers', 'My check-ins'].map(tab => (
                  <button
                    key={tab}
                    className={filter === tab ? 'active' : ''}
                    onClick={() => setFilter(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {filteredStandups.map(s => {
              const author = state.users.find(u => u.id === s.owner);
              const proj = s.project ? state.projects.find(p => p.id === s.project) : null;
              return (
                <article key={s.id} className="standup-card">
                  <div className="list-row" style={{ borderTop: 0, paddingTop: 0 }}>
                    <Avatar user={author} />
                    <div className="grow">
                      <strong>{author?.name || 'Team member'}</strong>
                      <span className="sub">
                        {author?.department || 'Workspace'} · {new Date(s.created).toLocaleString()}
                      </span>
                    </div>
                    {s.mood && <span className="tag">{s.mood}</span>}
                    {proj && <span className="tag purple">{proj.title}</span>}
                    <button className="small" onClick={() => setModal({ type: 'standups', id: s.id, data: s })}>
                      {canEdit('standups', s) ? 'Edit' : 'View'}
                    </button>
                  </div>
                  <div className="standup-body">
                    <div>
                      <span className="eyebrow" style={{ margin: 0 }}>Today’s focus</span>
                      <p style={{ margin: '4px 0 8px', fontWeight: 600 }}>{s.title}</p>
                    </div>
                    {s.yesterday && (
                      <div>
                        <span className="eyebrow" style={{ margin: 0 }}>Completed recently</span>
                        <p className="sub" style={{ margin: '4px 0 8px' }}>{s.yesterday}</p>
                      </div>
                    )}
                    {s.blockers && (
                      <div className="task-blocker-note">
                        <strong>⚠ Blocker:</strong> {s.blockers}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
            {filteredStandups.length === 0 && (
              <div className="empty">
                <strong>No check-ins here yet</strong>Share what you are focusing on today so the team stays aligned.
              </div>
            )}
          </section>

          <div>
            <section className="card">
              <div className="card-head">
                <h3>Company goals & OKRs</h3>
                {isAdmin && (
                  <button
                    className="small"
                    onClick={() => setModal({ type: 'goals', data: { currentValue: 0, targetValue: 100, unit: '%' } })}
                  >
                    + Goal
                  </button>
                )}
              </div>
              {goals.map(g => {
                const target = Math.max(1, Number(g.targetValue || 100));
                const current = Math.max(0, Number(g.currentValue || 0));
                const pct = Math.min(100, Math.round((current / target) * 100));
                return (
                  <div
                    key={g.id}
                    className="goal-card"
                    onClick={() => setModal({ type: 'goals', id: g.id, data: g })}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <strong>{g.title}</strong>
                      <span className={`tag ${pct >= 80 ? 'green' : pct >= 40 ? '' : 'yellow'}`}>
                        {current} / {target} {g.unit || '%'} ({pct}%)
                      </span>
                    </div>
                    {g.description && <p className="sub" style={{ margin: '6px 0' }}>{g.description}</p>}
                    <div className="progress" style={{ margin: '8px 0' }}>
                      <i style={{ width: `${pct}%` }}></i>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span className="sub">{g.category || 'Company'}</span>
                      <span className="sub">{g.due ? `Target ${fmtDate(g.due)}` : 'Ongoing'}</span>
                    </div>
                  </div>
                );
              })}
              {goals.length === 0 && (
                <div className="empty">
                  <strong>Set clear quarterly targets</strong>
                  {isAdmin ? 'Add measurable company or department goals to track collective progress.' : 'Company goals set by leadership will appear here.'}
                </div>
              )}
            </section>

            <section className="card" style={{ marginTop: 18 }}>
              <div className="card-head">
                <h3>Today’s check-in roster</h3>
                <span className="sub">{todayStr}</span>
              </div>
              {state.users.map(u => {
                const checkedIn = todayStandups.find(s => s.owner === u.id);
                return (
                  <div key={u.id} className="list-row">
                    <Avatar user={u} />
                    <div className="grow">
                      <strong>{u.name}</strong>
                      <span className="sub">{checkedIn ? checkedIn.title : u.department}</span>
                    </div>
                    <span className={`tag ${checkedIn ? 'green' : 'yellow'}`}>
                      {checkedIn ? 'Checked in' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </section>
          </div>
        </div>
      </>
    );
  };

  // 12. Search Overlay View
  const renderSearchView = () => {
    const q = search.toLowerCase();
    const kinds = ['projects', 'tasks', 'leads', 'meetings', 'announcements', 'standups', 'goals'];
    const results = kinds.flatMap(k =>
      (state[k] || []).filter(r => JSON.stringify(r).toLowerCase().includes(q)).map(r => ({ k, r }))
    );

    return (
      <>
        <div className="page-head">
          <div>
            <h1>Search</h1>
            <p className="sub">Results for “{search}”</p>
          </div>
        </div>
        <section className="card">
          {results.map(({ k, r }) => (
            <div key={r.id} className="list-row">
              <div className="project-symbol"><Icon name={k === 'standups' || k === 'goals' ? 'pulse' : k} /></div>
              <div className="grow">
                <strong>{r.title}</strong>
                <span className="sub">{k}</span>
              </div>
              <button className="small" onClick={() => setModal({ type: k, id: r.id, data: r })}>
                Open ↗
              </button>
            </div>
          ))}
          {state.users.filter(u => u.name.toLowerCase().includes(q)).map(u => (
            <div key={u.id} className="list-row">
              <Avatar user={u} />
              <strong>{u.name}</strong>
              <button className="small" onClick={() => setModal({ type: 'person', id: u.id, data: u })}>
                Profile
              </button>
            </div>
          ))}
          {results.length === 0 && (
            <div className="empty"><strong>No matches yet</strong>Try a project, task, or person’s name.</div>
          )}
        </section>
      </>
    );
  };

  // Main View Router
  const renderCurrentView = () => {
    if (search) return renderSearchView();
    switch (page) {
      case 'dashboard': return renderDashboard();
      case 'projects': return renderProjects();
      case 'tasks': return renderTasks();
      case 'calendar': return renderCalendar();
      case 'clock': return renderClock();
      case 'team': return renderTeam();
      case 'leads': return renderLeads();
      case 'meetings': return renderMeetings();
      case 'announcements': return renderAnnouncements();
      case 'pulse': return renderPulse();
      case 'analytics': return renderAnalytics();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  // --- MODAL DIALOGS ---
  const renderModalContent = () => {
    if (!modal) return null;
    const { type, id, data = {} } = modal;

    // View Profile
    if (type === 'person') {
      const u = data;
      const uTasks = state.tasks.filter(t => t.assignee === u.id);
      const uOpen = uTasks.filter(t => t.status !== 'Done');
      const uOverdue = uOpen.filter(t => t.due && new Date(t.due) < new Date()).length;
      const uOnTime = uTasks.length ? Math.round(((uTasks.length - uOverdue) / uTasks.length) * 100) : 100;
      const uClocks = state.clocks.filter(c => c.user_id === u.id);
      const totalWorkSec = uClocks.reduce((n, c) => n + worked(c, currentTime), 0);
      const totalBreakSec = uClocks.reduce((n, c) => n + breakDuration(c, currentTime), 0);

      return (
        <div className="modal" role="dialog">
          <div className="card-head">
            <h2>{u.name}</h2>
            <button className="small" onClick={() => setModal(null)}>✕</button>
          </div>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Avatar user={u} big />
            <h3 style={{ marginTop: 10 }}>{u.department}</h3>
            <a className="link" href={`mailto:${u.email}`}>{u.email}</a>
          </div>
          <div className="person-stats" style={{ marginBottom: 18 }}>
            <div>
              <b>{uOpen.length}</b>
              <span className="sub">Open tasks</span>
            </div>
            <div>
              <b>{uOnTime}%</b>
              <span className="sub">On-time rate</span>
            </div>
            <div>
              <b>{(totalWorkSec / 3600).toFixed(1)}h</b>
              <span className="sub">Total work</span>
            </div>
            <div>
              <b>{duration(totalBreakSec)}</b>
              <span className="sub">Total break</span>
            </div>
          </div>
          <h3>Assigned tasks</h3>
          {uTasks.map(t => (
            <div key={t.id} className="list-row">
              <div className="grow">
                <strong>{t.title}</strong>
                <span className="sub">{fmtDate(t.due)}</span>
              </div>
              {t.blocked && <span className="tag red">Blocked</span>}
              <span className="tag">{t.status}</span>
            </div>
          ))}
          {uTasks.length === 0 && <div className="empty">No tasks assigned</div>}
          {isAdmin && (
            <>
              <h3 style={{ marginTop: 25 }}>Manage access</h3>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  const changes = Object.fromEntries(new FormData(e.target));
                  if (!changes.password) delete changes.password;
                  try {
                    await handleApi('/api/users', { action: 'update', id: u.id, ...changes });
                    setModal(null);
                    await refreshState();
                    showToast(changes.password ? 'Saved. Their existing sessions were signed out.' : 'Member updated');
                  } catch (err) {
                    alert(err.message);
                  }
                }}
              >
                <div className="form-row">
                  <div className="field">
                    <label>Full name</label>
                    <input name="name" type="text" required defaultValue={u.name} />
                  </div>
                  <div className="field">
                    <label>Work email (used to sign in)</label>
                    <input name="email" type="email" required defaultValue={u.email} />
                  </div>
                </div>
                <div className="field">
                  <label>Department</label>
                  <select name="department" defaultValue={u.department}>
                    {['Engineering', 'Design', 'Marketing', 'Management'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Role</label>
                  <select name="role" defaultValue={u.role}>
                    <option value="member">Member</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="field">
                  <label>Reset password (leave blank to keep)</label>
                  <input name="password" type="password" minLength="12" autoComplete="new-password" />
                </div>
                <div className="actions" style={{ marginTop: 15 }}>
                  <button className="primary">Save changes</button>
                  {u.id !== user.id && (
                    <button
                      type="button"
                      className="small"
                      onClick={async () => {
                        if (!confirm(`Remove ${u.name}? They will be signed out and can no longer log in. Their time history is kept.`)) return;
                        try {
                          await handleApi('/api/users', { action: 'remove', id: u.id });
                          setModal(null);
                          await refreshState();
                          showToast(`${u.name} was removed`);
                        } catch (err) {
                          alert(err.message);
                        }
                      }}
                    >
                      Remove member
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      );
    }

    // Clock In Dialog
    if (type === 'clock') {
      return (
        <div className="modal" role="dialog">
          <div className="card-head">
            <h2>A little focus starts here</h2>
            <button className="small" onClick={() => setModal(null)}>✕</button>
          </div>
          <form
            onSubmit={async e => {
              e.preventDefault();
              const fd = new FormData(e.target);
              try {
                await handleApi('/api/clock', { action: 'start', ...Object.fromEntries(fd) });
                setModal(null);
                await refreshState();
                showToast('Clocked in. Have a good session.');
              } catch (err) {
                alert(err.message);
              }
            }}
          >
            <div className="field">
              <label>Project</label>
              <select name="project">
                <option value="">General work</option>
                {state.projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Task</label>
              <select name="task">
                <option value="">No specific task</option>
                {state.tasks.filter(t => t.status !== 'Done').map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>What are you working on?</label>
              <textarea name="note" />
            </div>
            <button className="primary" style={{ marginTop: 15 }}>
              <Icon name="play" /> Clock in
            </button>
          </form>
        </div>
      );
    }

    // Admin: correct a time entry
    if (type === 'timeEntry') {
      const owner = state.users.find(u => u.id === data.user_id);
      return (
        <div className="modal" role="dialog">
          <div className="card-head">
            <h2>Edit time entry</h2>
            <button className="small" onClick={() => setModal(null)}>✕</button>
          </div>
          <p className="sub" style={{ marginBottom: 15 }}>
            {owner?.name || 'Former member'}{!data.end ? ' · still running — saving will clock them out' : ''}
          </p>
          <form
            onSubmit={async e => {
              e.preventDefault();
              const fd = Object.fromEntries(new FormData(e.target));
              try {
                await handleApi('/api/timesheet', {
                  action: 'update',
                  id,
                  start: new Date(fd.start).getTime() / 1000,
                  end: new Date(fd.end).getTime() / 1000,
                  break_seconds: Number(fd.breakMinutes || 0) * 60,
                  project: fd.project,
                  note: fd.note
                });
                setModal(null);
                await refreshState();
                showToast('Time entry updated');
              } catch (err) {
                alert(err.message);
              }
            }}
          >
            <div className="form-row">
              <div className="field">
                <label>Clock in (local time)</label>
                <input name="start" type="datetime-local" required defaultValue={toLocalInput(data.start)} />
              </div>
              <div className="field">
                <label>Clock out (local time)</label>
                <input name="end" type="datetime-local" required defaultValue={toLocalInput(data.end || Date.now() / 1000)} />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Break (minutes)</label>
                <input name="breakMinutes" type="number" min="0" defaultValue={Math.round(breakDuration(data, currentTime) / 60)} />
              </div>
              <div className="field">
                <label>Project</label>
                <select name="project" defaultValue={data.project || ''}>
                  <option value="">General work</option>
                  {state.projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Note</label>
              <textarea name="note" defaultValue={data.note || ''} />
            </div>
            <div className="actions" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="danger"
                onClick={async () => {
                  if (!confirm('Delete this time entry? This cannot be undone.')) return;
                  try {
                    await handleApi('/api/timesheet', { action: 'delete', id });
                    setModal(null);
                    await refreshState();
                    showToast('Time entry deleted');
                  } catch (err) {
                    alert(err.message);
                  }
                }}
              >
                Delete
              </button>
              <button className="primary">Save entry</button>
            </div>
          </form>
        </div>
      );
    }

    // Add Member Dialog
    if (type === 'users') {
      return (
        <div className="modal" role="dialog">
          <div className="card-head">
            <h2>Add team member</h2>
            <button className="small" onClick={() => setModal(null)}>✕</button>
          </div>
          <form
            onSubmit={async e => {
              e.preventDefault();
              const fd = new FormData(e.target);
              try {
                await handleApi('/api/users', Object.fromEntries(fd));
                setModal(null);
                await refreshState();
                showToast('Team member added successfully');
              } catch (err) {
                alert(err.message);
              }
            }}
          >
            <div className="field">
              <label>Full name</label>
              <input name="name" type="text" required />
            </div>
            <div className="field">
              <label>Work email</label>
              <input name="email" type="email" required />
            </div>
            <div className="field">
              <label>Initial password (12+ characters)</label>
              <input name="password" type="password" required minLength="12" />
            </div>
            <div className="field">
              <label>Department</label>
              <select name="department">
                {['Engineering', 'Design', 'Marketing', 'Management'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Role</label>
              <select name="role">
                <option value="member">member</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <button className="primary" style={{ marginTop: 15 }}>Create account</button>
          </form>
        </div>
      );
    }

    // Generic CRUD for projects, tasks, leads, meetings, announcements, standups, goals
    const editable = canEdit(type, { ...data, id });
    const singularLabel =
      type === 'standups'
        ? 'check-in'
        : type === 'goals'
        ? 'goal'
        : type.slice(0, -1);

    const updateModalData = patch =>
      setModal(prev => (prev ? { ...prev, data: { ...prev.data, ...patch } } : prev));

    return (
      <div className="modal" role="dialog">
        <div className="card-head">
          <h2>{id ? (editable ? 'Edit' : 'View') : 'New'} {singularLabel}</h2>
          <button className="small" onClick={() => setModal(null)}>✕</button>
        </div>
        <form
          onSubmit={async e => {
            e.preventDefault();
            if (!editable) return;
            const fd = new FormData(e.target);
            const body = Object.fromEntries(fd);
            if (type === 'meetings') {
              body.attendees = fd.getAll('attendees');
              body.sendToEveryone = fd.get('sendToEveryone') === 'on';
              body.autoRoom = fd.get('autoRoom') === 'on';
              body.start = new Date(body.start).toISOString();
              body.end = new Date(body.end).toISOString();
            }
            if (type === 'tasks') {
              body.blocked = fd.get('blocked') === 'on';
              body.notifyEmail = fd.get('notifyEmail') === 'on';
              body.notifyEveryone = fd.get('notifyEveryone') === 'on';
              body.estimateHours = Number(body.estimateHours || 0);
              body.subtasks = data.subtasks || [];
              body.comments = data.comments || [];
            }
            if (type === 'projects') {
              body.targetHours = Number(body.targetHours || 0);
              body.budget = Number(body.budget || 0);
              body.milestones = data.milestones || [];
            }
            if (type === 'leads') {
              body.value = Number(body.value || 0);
              body.probability = Number(body.probability || 0);
            }
            if (type === 'announcements') {
              body.notifyEmail = fd.get('notifyEmail') === 'on';
              body.notifyEveryone = fd.get('notifyEveryone') === 'on';
            }
            if (type === 'goals') {
              body.currentValue = Number(body.currentValue || 0);
              body.targetValue = Number(body.targetValue || 100);
            }
            try {
              await handleApi('/api/record', { kind: type, id, body: { ...data, ...body } });
              setModal(null);
              await refreshState();
              showToast('Saved. Workspace is up to date.');
            } catch (err) {
              alert(err.message);
            }
          }}
        >
          {!editable && (
            <div className="note" style={{ marginBottom: 15 }}>
              {['projects', 'meetings', 'announcements', 'goals'].includes(type)
                ? 'Only administrators can change this.'
                : `Only ${state.users.find(u => u.id === data.owner)?.name || 'its creator'}, the assignee, or an administrator can change this.`}
            </div>
          )}
          <fieldset disabled={!editable} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
          <div className="field">
            <label>
              {type === 'leads'
                ? 'Contact name'
                : type === 'standups'
                ? 'Today’s main focus'
                : type === 'goals'
                ? 'Objective / goal title'
                : 'Title'}
            </label>
            <input name="title" type="text" required defaultValue={data.title || ''} />
          </div>

          {type === 'projects' && (
            <>
              <div className="field">
                <label>Description</label>
                <textarea name="description" defaultValue={data.description || ''} />
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Client / stakeholder</label>
                  <input name="client" type="text" placeholder="Internal or client name" defaultValue={data.client || ''} />
                </div>
                <div className="field">
                  <label>Project lead</label>
                  <select name="lead" defaultValue={data.lead || user.id}>
                    <option value="">Unassigned</option>
                    {state.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Status</label>
                  <select name="status" defaultValue={data.status || 'Active'}>
                    {['Planning', 'Active', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Due date</label>
                  <input name="due" type="date" defaultValue={data.due || ''} />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Target hours (capacity)</label>
                  <input name="targetHours" type="number" min="0" step="1" defaultValue={data.targetHours || 0} />
                </div>
                {isAdmin && (
                  <div className="field">
                    <label>Budget ({currency})</label>
                    <input name="budget" type="number" min="0" step="100" defaultValue={data.budget || 0} />
                  </div>
                )}
              </div>
              <div className="field">
                <label>Milestones ({(data.milestones || []).filter(m => m.done).length}/{(data.milestones || []).length} completed)</label>
                <div className="checklist-editor">
                  {(data.milestones || []).map((m, idx) => (
                    <div key={m.id || idx} className="checklist-row">
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, margin: 0 }}>
                        <input
                          type="checkbox"
                          checked={Boolean(m.done)}
                          onChange={() => {
                            const next = (data.milestones || []).map((item, i) =>
                              i === idx ? { ...item, done: !item.done } : item
                            );
                            updateModalData({ milestones: next });
                          }}
                        />
                        <span style={{ textDecoration: m.done ? 'line-through' : 'none' }}>{m.title}</span>
                      </label>
                      {editable && (
                        <button
                          type="button"
                          className="small"
                          onClick={() => {
                            const next = (data.milestones || []).filter((_, i) => i !== idx);
                            updateModalData({ milestones: next });
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {editable && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <input
                        type="text"
                        placeholder="Add a project milestone…"
                        value={data._newMilestone || ''}
                        onChange={e => updateModalData({ _newMilestone: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const text = (data._newMilestone || '').trim();
                            if (!text) return;
                            updateModalData({
                              milestones: [...(data.milestones || []), { id: String(Date.now()), title: text, done: false }],
                              _newMilestone: ''
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="small"
                        onClick={() => {
                          const text = (data._newMilestone || '').trim();
                          if (!text) return;
                          updateModalData({
                            milestones: [...(data.milestones || []), { id: String(Date.now()), title: text, done: false }],
                            _newMilestone: ''
                          });
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {type === 'tasks' && (
            <>
              <div className="field">
                <label>Description</label>
                <textarea name="description" defaultValue={data.description || ''} />
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Project</label>
                  <select name="project" defaultValue={data.project || ''}>
                    <option value="">General work</option>
                    {state.projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Assign to {!isAdmin && <span className="sub">(Personal scope)</span>}</label>
                  <select name="assignee" defaultValue={data.assignee || user.id} disabled={!isAdmin}>
                    {state.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Status</label>
                  <select name="status" defaultValue={data.status || 'To do'}>
                    {['To do', 'In progress', 'In review', 'Done'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Priority</label>
                  <select name="priority" defaultValue={data.priority || 'Medium'}>
                    {['Low', 'Medium', 'High'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Due date</label>
                  <input name="due" type="date" defaultValue={data.due || ''} />
                </div>
                <div className="field">
                  <label>Department</label>
                  <select name="department" defaultValue={data.department || 'Engineering'}>
                    {['Engineering', 'Design', 'Marketing', 'Management'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Estimated hours</label>
                  <input name="estimateHours" type="number" min="0" step="0.5" defaultValue={data.estimateHours || 0} />
                </div>
                <div className="field">
                  <label>Deliverable / PR / Figma URL</label>
                  <input name="deliverableUrl" type="url" placeholder="https://…" defaultValue={data.deliverableUrl || ''} />
                </div>
              </div>

              {/* Blocker Flag */}
              <div className="field" style={{ background: '#fbf7f5', padding: 12, borderRadius: 12, border: '1px solid #ead9d2' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="blocked"
                    defaultChecked={Boolean(data.blocked)}
                  />
                  <strong>Flag this task as blocked</strong>
                </label>
                <input
                  name="blockerNote"
                  type="text"
                  placeholder="If blocked, what is needed to unblock it?"
                  defaultValue={data.blockerNote || ''}
                  style={{ marginTop: 8 }}
                />
              </div>

              {/* Subtasks Checklist */}
              <div className="field">
                <label>Subtasks / checklist ({(data.subtasks || []).filter(s => s.done).length}/{(data.subtasks || []).length})</label>
                <div className="checklist-editor">
                  {(data.subtasks || []).map((st, idx) => (
                    <div key={st.id || idx} className="checklist-row">
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, margin: 0 }}>
                        <input
                          type="checkbox"
                          checked={Boolean(st.done)}
                          onChange={() => {
                            const next = (data.subtasks || []).map((item, i) =>
                              i === idx ? { ...item, done: !item.done } : item
                            );
                            updateModalData({ subtasks: next });
                          }}
                        />
                        <span style={{ textDecoration: st.done ? 'line-through' : 'none' }}>{st.title}</span>
                      </label>
                      {editable && (
                        <button
                          type="button"
                          className="small"
                          onClick={() => {
                            const next = (data.subtasks || []).filter((_, i) => i !== idx);
                            updateModalData({ subtasks: next });
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {editable && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <input
                        type="text"
                        placeholder="Add a checklist step…"
                        value={data._newSubtask || ''}
                        onChange={e => updateModalData({ _newSubtask: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const text = (data._newSubtask || '').trim();
                            if (!text) return;
                            updateModalData({
                              subtasks: [...(data.subtasks || []), { id: String(Date.now()), title: text, done: false }],
                              _newSubtask: ''
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="small"
                        onClick={() => {
                          const text = (data._newSubtask || '').trim();
                          if (!text) return;
                          updateModalData({
                            subtasks: [...(data.subtasks || []), { id: String(Date.now()), title: text, done: false }],
                            _newSubtask: ''
                          });
                        }}
                      >
                        + Step
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments / Activity Thread */}
              <div className="field">
                <label>Activity & comments ({(data.comments || []).length})</label>
                <div className="comment-thread">
                  {(data.comments || []).map((cm, idx) => (
                    <div key={cm.id || idx} className="comment-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                        <strong>{cm.authorName || 'Team member'}</strong>
                        <span className="sub">{cm.created ? new Date(cm.created).toLocaleString() : ''}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 13 }}>{cm.text}</p>
                    </div>
                  ))}
                  {editable && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <input
                        type="text"
                        placeholder="Write an update or note…"
                        value={data._newComment || ''}
                        onChange={e => updateModalData({ _newComment: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const text = (data._newComment || '').trim();
                            if (!text) return;
                            updateModalData({
                              comments: [
                                ...(data.comments || []),
                                { id: String(Date.now()), authorName: user.name, text, created: new Date().toISOString() }
                              ],
                              _newComment: ''
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="small"
                        onClick={() => {
                          const text = (data._newComment || '').trim();
                          if (!text) return;
                          updateModalData({
                            comments: [
                              ...(data.comments || []),
                              { id: String(Date.now()), authorName: user.name, text, created: new Date().toISOString() }
                            ],
                            _newComment: ''
                          });
                        }}
                      >
                        Post
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isAdmin && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input type="checkbox" name="notifyEmail" />
                    Email assignee via Gmail
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input type="checkbox" name="notifyEveryone" />
                    <strong>Email Everyone on the team</strong>
                  </label>
                </div>
              )}
            </>
          )}

          {type === 'leads' && (
            <>
              <div className="form-row">
                <div className="field">
                  <label>Company</label>
                  <input name="company" type="text" defaultValue={data.company || ''} />
                </div>
                <div className="field">
                  <label>Lead owner {!isAdmin && <span className="sub">(Personal scope)</span>}</label>
                  <select name="assignee" defaultValue={data.assignee || user.id} disabled={!isAdmin}>
                    {state.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Email</label>
                  <input name="email" type="email" defaultValue={data.email || ''} />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input name="phone" type="text" defaultValue={data.phone || ''} />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Estimated value</label>
                  <input name="value" type="number" defaultValue={data.value || 0} />
                </div>
                <div className="field">
                  <label>Stage</label>
                  <select name="stage" defaultValue={data.stage || 'New'}>
                    {['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Follow-up date</label>
                  <input name="followup" type="date" defaultValue={data.followup || ''} />
                </div>
                <div className="field">
                  <label>Lead source & win %</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 8 }}>
                    <select name="source" defaultValue={data.source || 'Inbound'}>
                      {['Inbound', 'Referral', 'Outbound', 'Website', 'LinkedIn', 'Partner', 'CSV Import'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input name="probability" type="number" min="0" max="100" placeholder="%" defaultValue={data.probability ?? 50} />
                  </div>
                </div>
              </div>
              <div className="field">
                <label>Notes</label>
                <textarea name="description" defaultValue={data.description || ''} />
              </div>
            </>
          )}

          {type === 'meetings' && (
            <>
              <div className="form-row">
                <div className="field">
                  <label>Starts (local time)</label>
                  <input
                    name="start"
                    type="datetime-local"
                    required
                    defaultValue={toLocalInput(data.start) || `${key(selectedDay)}T10:00`}
                  />
                </div>
                <div className="field">
                  <label>Ends (local time)</label>
                  <input
                    name="end"
                    type="datetime-local"
                    required
                    defaultValue={toLocalInput(data.end) || `${key(selectedDay)}T10:30`}
                  />
                </div>
              </div>
              <div className="field">
                <div className="link-generator-head">
                  <label style={{ margin: 0 }}>Meeting link (Google Meet / video URL)</label>
                  <div className="link-generator-bar">
                    <button
                      type="button"
                      className="link-gen-btn primary-tone"
                      disabled={Boolean(data._generatingMeet)}
                      onClick={async e => {
                        const form = e.currentTarget.form;
                        const liveTitle = form?.elements?.title?.value?.trim() || data.title || 'Syneolab Meeting';
                        const liveStart = form?.elements?.start?.value
                          ? new Date(form.elements.start.value).toISOString()
                          : data.start;
                        const liveEnd = form?.elements?.end?.value
                          ? new Date(form.elements.end.value).toISOString()
                          : data.end;
                        const liveDesc = form?.elements?.description?.value || data.description || '';
                        if (!state.integrations?.calendar) {
                          window.open('https://meet.google.com/new', '_blank', 'noopener,noreferrer');
                          return;
                        }
                        try {
                          updateModalData({ _generatingMeet: true });
                          const res = await handleApi('/api/record', {
                            action: 'generateMeetLink',
                            body: { title: liveTitle, start: liveStart, end: liveEnd, description: liveDesc }
                          });
                          updateModalData({
                            _generatingMeet: false,
                            link: res.meetLink,
                            calendarEventUrl: res.eventUrl || '',
                            location: 'Google Meet'
                          });
                          showToast('Google Meet link generated & synced to Calendar');
                        } catch (err) {
                          updateModalData({ _generatingMeet: false });
                          showToast(err.message);
                        }
                      }}
                    >
                      <Icon name="meetings" />
                      <span>{data._generatingMeet ? 'Generating Meet…' : 'Generate Google Meet'}</span>
                    </button>
                    <button
                      type="button"
                      className="link-gen-btn"
                      onClick={e => {
                        const form = e.currentTarget.form;
                        const rawTitle = form?.elements?.title?.value?.trim() || data.title || 'team-sync';
                        const slug = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 20) || 'sync';
                        const roomUrl = `https://meet.jit.si/Syneolab-${slug}-${Math.random().toString(36).slice(2, 7)}`;
                        updateModalData({ link: roomUrl, location: 'Jitsi Meet', calendarEventUrl: '' });
                      }}
                    >
                      <Icon name="link" />
                      <span>Instant Jitsi Room</span>
                    </button>
                    <a
                      href="https://meet.google.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-gen-btn"
                      title="Open a blank Google Meet tab"
                    >
                      <span>meet.new</span>
                      <Icon name="arrow" />
                    </a>
                  </div>
                </div>
                <input
                  key={data.link || 'empty-link'}
                  name="link"
                  type="url"
                  placeholder="https://meet.google.com/xxx-xxxx-xxx (or leave blank to auto-create on save)"
                  defaultValue={data.link || ''}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginTop: 6, color: 'var(--muted)' }}>
                  <input type="checkbox" name="autoRoom" defaultChecked={data.autoRoom ?? !id} />
                  Auto-create a Google Meet room on save if left blank
                </label>
              </div>
              <div className="field">
                <label>Location</label>
                <input key={data.location || 'default-loc'} name="location" type="text" defaultValue={data.location || 'Google Meet'} />
              </div>
              <div className="field">
                <label>Agenda / details</label>
                <textarea name="description" defaultValue={data.description || ''} />
              </div>

              <div className="field" style={{ background: 'var(--bg)', padding: 12, borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="sendToEveryone"
                      checked={Boolean(data.sendToEveryone ?? (!id && (!data.attendees || data.attendees.length === state.users.length)))}
                      onChange={e => {
                        const checked = e.target.checked;
                        updateModalData({
                          sendToEveryone: checked,
                          attendees: checked ? state.users.map(u => u.id) : [user.id]
                        });
                      }}
                    />
                    <strong>Invite & email Everyone ({state.users.length} team members)</strong>
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="small"
                      onClick={() => updateModalData({ sendToEveryone: true, attendees: state.users.map(u => u.id) })}
                    >
                      Select everyone
                    </button>
                    <button
                      type="button"
                      className="small"
                      onClick={() => updateModalData({ sendToEveryone: false, attendees: [user.id] })}
                    >
                      Only me
                    </button>
                  </div>
                </div>

                <div className="check-list" style={{ marginTop: 10 }}>
                  {state.users.map(u => {
                    const currentAttendees = data.attendees || state.users.map(x => x.id);
                    const isChecked = Boolean(data.sendToEveryone) || currentAttendees.includes(u.id);
                    return (
                      <label key={u.id} style={{ display: 'block', margin: '4px 0' }}>
                        <input
                          type="checkbox"
                          name="attendees"
                          value={u.id}
                          checked={isChecked}
                          onChange={e => {
                            const next = e.target.checked
                              ? [...new Set([...currentAttendees, u.id])]
                              : currentAttendees.filter(x => x !== u.id);
                            updateModalData({
                              attendees: next,
                              sendToEveryone: next.length === state.users.length
                            });
                          }}
                        />{' '}
                        {u.name} <span className="sub">({u.email})</span>
                      </label>
                    );
                  })}
                </div>

                <div className="field" style={{ marginTop: 10, marginBottom: 0 }}>
                  <label style={{ fontSize: 11 }}>Additional guest emails (optional, comma-separated)</label>
                  <input
                    name="extraEmails"
                    type="text"
                    placeholder="client@example.com, partner@company.com"
                    defaultValue={data.extraEmails || ''}
                  />
                </div>
              </div>
              <p className="sub" style={{ marginTop: 8 }}>
                Saving sends the executive invitation card + native Google Calendar (<code>.ics</code>) invite to all selected recipients.
              </p>
            </>
          )}

          {type === 'announcements' && (
            <>
              <div className="field">
                <label>Type</label>
                <select name="priority" defaultValue={data.priority || 'Update'}>
                  {['Update', 'Important', 'Celebration'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Announcement</label>
                <textarea name="description" defaultValue={data.description || ''} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginTop: 8 }}>
                <input type="checkbox" name="notifyEveryone" defaultChecked={!id} />
                <strong>Send email to Everyone (All active team members via Gmail)</strong>
              </label>
            </>
          )}

          {type === 'standups' && (
            <>
              <div className="form-row">
                <div className="field">
                  <label>Primary project</label>
                  <select name="project" defaultValue={data.project || ''}>
                    <option value="">General work</option>
                    {state.projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Current energy / mode</label>
                  <select name="mood" defaultValue={data.mood || 'Focused'}>
                    {['Focused', 'Energized', 'Heads-down', 'Need a hand'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Completed recently</label>
                <textarea name="yesterday" placeholder="Key wins or progress since your last check-in…" defaultValue={data.yesterday || ''} />
              </div>
              <div className="field">
                <label>Blockers or help needed (optional)</label>
                <textarea name="blockers" placeholder="Anything slowing you down or waiting on review?" defaultValue={data.blockers || ''} />
              </div>
            </>
          )}

          {type === 'goals' && (
            <>
              <div className="form-row">
                <div className="field">
                  <label>Category</label>
                  <select name="category" defaultValue={data.category || 'Company'}>
                    {['Company', 'Engineering', 'Design', 'Revenue & Growth', 'Client Delivery'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Target date</label>
                  <input name="due" type="date" defaultValue={data.due || ''} />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Current value</label>
                  <input name="currentValue" type="number" step="any" required defaultValue={data.currentValue ?? 0} />
                </div>
                <div className="field">
                  <label>Target value & unit</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 8 }}>
                    <input name="targetValue" type="number" step="any" required defaultValue={data.targetValue ?? 100} />
                    <input name="unit" type="text" placeholder="%, USD, etc." defaultValue={data.unit || '%'} />
                  </div>
                </div>
              </div>
              <div className="field">
                <label>Key results & notes</label>
                <textarea name="description" defaultValue={data.description || ''} />
              </div>
            </>
          )}

          </fieldset>

          <div className="actions" style={{ marginTop: 20 }}>
            {id && canDelete(type, data) && (
              <button
                type="button"
                className="danger"
                onClick={async () => {
                  if (confirm('Delete this record? This cannot be undone.')) {
                    try {
                      await handleApi('/api/delete', { id });
                      setModal(null);
                      await refreshState();
                      showToast('Record deleted');
                    } catch (err) {
                      alert(err.message);
                    }
                  }
                }}
              >
                Delete
              </button>
            )}
            {editable ? (
              <button className="primary">Save {singularLabel}</button>
            ) : (
              <button type="button" onClick={() => setModal(null)}>Close</button>
            )}
          </div>
        </form>
      </div>
    );
  };

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Projects' },
    { id: 'tasks', label: 'Tasks', count: state.tasks.filter(t => t.status !== 'Done').length },
    { id: 'pulse', label: 'Pulse & goals', count: state.tasks.filter(t => t.blocked && t.status !== 'Done').length },
    { id: 'calendar', label: 'Calendar' },
    { id: 'clock', label: 'Time tracking' },
    { id: 'team', label: 'Team', count: isAdmin ? (state.requests || []).length : 0 },
    { id: 'leads', label: 'Leads' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'announcements', label: 'Announcements' }
  ];

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SyneoLogo size={34} idPrefix="sidebar" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SyneoWordmark height={15} color="var(--ink)" />
            <span style={{ fontSize: 7.2, letterSpacing: '0.14em', color: 'var(--soft)', fontWeight: 600 }}>
              CREATIVITY MEETS INNOVATIONS
            </span>
          </div>
        </div>
        <div className="sidebar-nav">
          <div className="eyebrow">Workspace</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav ${page === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <Icon name={item.id} />
              {item.label}
              {item.count !== undefined && item.count > 0 && <span className="count">{item.count}</span>}
            </button>
          ))}

          <div className="eyebrow">Insights & preferences</div>
          <button
            className={`nav ${page === 'analytics' ? 'active' : ''}`}
            onClick={() => navigate('analytics')}
          >
            <Icon name="analytics" /> Analytics
          </button>
          <button
            className={`nav ${page === 'settings' ? 'active' : ''}`}
            onClick={() => navigate('settings')}
          >
            <Icon name="settings" /> Settings
          </button>
        </div>

        <div className="side-bottom">
          <div className="workspace-card">
            <strong>Good things<br />take teamwork.</strong>
            <p>Your people. Your progress.<br />All in one place.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 10, color: 'var(--soft)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4cd97b', display: 'inline-block', flexShrink: 0 }} />
              <span>DB Beacon · 24/7 Awake (0B)</span>
            </div>
          </div>
          <button
            className="nav logout-btn"
            onClick={async () => {
              await handleApi('/api/logout', {});
              setUser(null);
              showToast('Signed out');
            }}
          >
            <Icon name="logout" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Open navigation"
          >
            <Icon name="menu" />
          </button>
          <div className="search">
            <Icon name="search" />
            <input
              id="search-input"
              placeholder="Search projects, tasks & people"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search workspace"
            />
            <span className="shortcut">⌘ K</span>
          </div>
          <div className="profile">
            {activeClock && (
              <div className={`top-clock-pill ${activeClock.break_start ? 'on-break' : ''}`}>
                <button
                  type="button"
                  className="top-clock-readout"
                  onClick={() => navigate('clock')}
                  title="Open Time tracking"
                >
                  <i className="top-clock-dot" />
                  <span>
                    <b>Work {duration(activeClockSeconds)}</b>
                    <small> · Break {duration(activeBreakSeconds)}</small>
                  </span>
                </button>
                <button
                  type="button"
                  className="top-clock-action"
                  onClick={() => handleClock(activeClock.break_start ? 'resume' : 'break')}
                  title={activeClock.break_start ? 'Resume work' : 'Start break'}
                >
                  {activeClock.break_start ? 'Resume' : 'Break'}
                </button>
                <button
                  type="button"
                  className="top-clock-action stop"
                  onClick={() => handleClock('stop')}
                  title="Clock out"
                >
                  Clock out
                </button>
              </div>
            )}
            <button className="small" onClick={() => navigate('announcements')} aria-label="Announcements">
              <Icon name="bell" />
            </button>
            <Avatar user={user} />
            <div>
              <strong>{user?.name || ''}</strong>
              <small>{isAdmin ? 'Workspace admin' : 'Team member'}</small>
            </div>
            <button
              className="top-logout-btn"
              onClick={async () => {
                await handleApi('/api/logout', {});
                setUser(null);
                showToast('Signed out');
              }}
              aria-label="Sign out"
              title="Sign out of workspace"
            >
              <Icon name="logout" />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        <div className="content">
          {renderCurrentView()}
          <div className="footer-note" style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <SyneoLogo size={18} idPrefix="footer" />
              <b>SYNEO LAB WORKSPACE</b>
            </span>
            <span>“WHERE CREATIVITY MEETS INNOVATIONS”</span>
          </div>
        </div>
      </main>

      {/* Modal Dialog Backdrop */}
      {modal && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          {renderModalContent()}
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div id="toast" role="status" style={{ display: 'block' }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}
