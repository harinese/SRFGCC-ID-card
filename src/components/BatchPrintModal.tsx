'use client';

import React from 'react';
import { StudentCardRecord } from '@/lib/types';
import IdCardReplica from './IdCardReplica';

interface BatchPrintModalProps {
  students: StudentCardRecord[];
  onClose: () => void;
}

export default function BatchPrintModal({ students, onClose }: BatchPrintModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        padding: '1.5rem',
      }}
    >
      {/* Action Header (Hidden during print) */}
      <div
        className="no-print"
        style={{
          width: '100%',
          maxWidth: '900px',
          backgroundColor: 'var(--bg-surface)',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Batch Print Sheet ({students.length} Cards)
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            CR-80 card format ready for standard A4 printing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handlePrint}
            type="button"
            className="interactive-element"
            style={{
              padding: '0.55rem 1.1rem',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Sheet / Save PDF
          </button>

          <button
            onClick={onClose}
            type="button"
            className="interactive-element"
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Sheet Container */}
      <div
        id="printable-sheet"
        style={{
          width: '100%',
          maxWidth: '850px',
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '4px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(325px, 1fr))',
          gap: '16px',
          justifyItems: 'center',
        }}
      >
        {students.map((student) => (
          <div
            key={student.id}
            style={{
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
              border: '1px dashed #94a3b8',
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
            }}
          >
            <IdCardReplica data={student} hideHolder={true} scale={0.96} />
          </div>
        ))}
      </div>
    </div>
  );
}
