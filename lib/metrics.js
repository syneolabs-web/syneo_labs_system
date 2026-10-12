/**
 * Shared deterministic metrics and chart calculations.
 * Compatible with Node.js and Browser environments.
 */

export const themes = {
  '#145c40': {
    name: 'Forest',
    green: '#1c714e',
    deep: '#093e2b',
    mid: '#459c70',
    soft: '#86cba4',
    light: '#e6f2e9',
    bg: '#f3f6f2',
    ink: '#203c2e',
    muted: '#788b7d',
    line: '#e0e9df',
    white: '#fefffc',
    stripe: '#bdccbe'
  },
  '#285a80': {
    name: 'Ocean',
    green: '#285cb0',
    deep: '#102d61',
    mid: '#5488d3',
    soft: '#97b9eb',
    light: '#e7effb',
    bg: '#f2f5fa',
    ink: '#233950',
    muted: '#788ba1',
    line: '#dfe7f1',
    white: '#fdfefe',
    stripe: '#bdcbdc'
  },
  '#644780': {
    name: 'Plum',
    green: '#7954a4',
    deep: '#38204f',
    mid: '#a17bc3',
    soft: '#c5a8e0',
    light: '#f0e8f7',
    bg: '#f7f3f9',
    ink: '#41304f',
    muted: '#93829e',
    line: '#e9e0ee',
    white: '#fffdfF',
    stripe: '#d1c1db'
  },
  '#9b512d': {
    name: 'Ember',
    green: '#b0673d',
    deep: '#552d20',
    mid: '#d39467',
    soft: '#e8bd95',
    light: '#f8eddf',
    bg: '#faf6f0',
    ink: '#513b2e',
    muted: '#9a897a',
    line: '#eee2d6',
    white: '#fffefa',
    stripe: '#dbccba'
  },
  '#b84b76': {
    name: 'Rose',
    green: '#c24d7c',
    deep: '#561b34',
    mid: '#df78a1',
    soft: '#f2b2cc',
    light: '#fcebf2',
    bg: '#faf3f6',
    ink: '#452231',
    muted: '#947482',
    line: '#eedce4',
    white: '#fffcfd',
    stripe: '#dfc2cf'
  },
  '#d4688e': {
    name: 'Sakura',
    green: '#d15e88',
    deep: '#61253c',
    mid: '#e68bb0',
    soft: '#f6bfd6',
    light: '#fdf0f5',
    bg: '#fcf6f8',
    ink: '#4a2836',
    muted: '#9a7a88',
    line: '#f2e1e9',
    white: '#fffdfe',
    stripe: '#e6cad6'
  }
};

export function key(d) {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function worked(c, nowSec) {
  const now = nowSec || Date.now() / 1000;
  const end = c.end !== null && c.end !== undefined ? c.end : now;
  const breakSec = c.break_seconds || 0;
  const activeBreak = c.break_start ? Math.max(0, end - c.break_start) : 0;
  return Math.max(0, end - c.start - breakSec - activeBreak);
}

export function breakDuration(c, nowSec) {
  const now = nowSec || Date.now() / 1000;
  const end = c.end !== null && c.end !== undefined ? c.end : now;
  const breakSec = c.break_seconds || 0;
  const activeBreak = c.break_start ? Math.max(0, end - c.break_start) : 0;
  return Math.max(0, breakSec + activeBreak);
}

export function series(clocks, days, nowSec = Date.now() / 1000, offset = 0) {
  const end = new Date(nowSec * 1000);
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() - offset);

  return Array.from({ length: days }, (_, i) => {
    const d = new Date(end);
    d.setDate(d.getDate() - days + 1 + i);
    const dateStr = key(d);
    const rows = (clocks || []).filter(c => key(new Date(c.start * 1000)) === dateStr);
    return {
      date: dateStr,
      hours: rows.reduce((n, c) => n + worked(c, nowSec) / 3600, 0),
      sessions: rows.length,
      people: new Set(rows.map(c => c.user_id)).size
    };
  });
}

export function completion(tasks = []) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'Done').length;
  const ongoing = tasks.filter(t => ['In progress', 'In review'].includes(t.status)).length;
  return {
    total,
    done,
    ongoing,
    pending: Math.max(0, total - done - ongoing),
    percent: total ? Math.round((done / total) * 100) : 0,
    doneShare: total ? done / total : 0,
    ongoingShare: total ? ongoing / total : 0
  };
}

export function points(values, width = 600, height = 180, pad = 12, maxValue) {
  const max = Math.max(1, maxValue || 0, ...values);
  return values.map((v, i) => [
    pad + (i * (width - 2 * pad)) / Math.max(1, values.length - 1),
    height - pad - (v / max) * (height - 2 * pad)
  ]);
}
