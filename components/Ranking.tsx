'use client';

import { useState } from 'react';
import { ScoreEntry } from '@/lib/constants';

type Tab = 'today' | 'week' | 'all';

const TAB_LABELS: Record<Tab, string> = {
  today: 'TODAY',
  week: 'THIS WEEK',
  all: 'ALL TIME',
};

function filterEntries(entries: ScoreEntry[], tab: Tab): ScoreEntry[] {
  const now = new Date();
  if (tab === 'today') {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return entries.filter((e) => new Date(e.date) >= todayStart);
  }
  if (tab === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return entries.filter((e) => new Date(e.date) >= weekAgo);
  }
  return entries;
}

interface Props {
  entries: ScoreEntry[];
}

export default function Ranking({ entries }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const filtered = filterEntries(entries, activeTab);

  return (
    <div style={{ width: '100%', fontFamily: 'monospace' }}>
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #333',
          marginBottom: '8px',
        }}
      >
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #FFFFFF' : '2px solid transparent',
              color: activeTab === tab ? '#FFFFFF' : '#555555',
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '1px',
              padding: '6px 0',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p
          style={{
            color: '#444444',
            fontSize: '12px',
            textAlign: 'center',
            padding: '16px 0',
          }}
        >
          NO RECORDS
        </p>
      ) : (
        <div>
          {filtered.map((entry, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 0',
                borderBottom: '1px solid #1a1a1a',
                color: i === 0 ? '#FFFFFF' : '#888888',
                fontSize: '12px',
              }}
            >
              <span style={{ color: i === 0 ? '#EF4444' : '#444444', width: '28px' }}>
                #{i + 1}
              </span>
              <span style={{ flex: 1 }}>{(entry.score / 10).toFixed(1)}s</span>
              <span style={{ color: '#444444' }}>
                {new Date(entry.date).toLocaleDateString('ja-JP', {
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
