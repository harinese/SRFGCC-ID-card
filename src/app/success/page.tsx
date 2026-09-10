'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import IdCardReplica from '@/components/IdCardReplica';
import { StudentCardRecord } from '@/lib/types';

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [student, setStudent] = useState<StudentCardRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/students/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data.student);
        } else {
          setError('Could not retrieve student details');
        }
      } catch {
        setError('Network error while retrieving card');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2.5rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        className="no-print"
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--success-soft)',
            color: 'var(--success)',
            marginBottom: '0.75rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1
          style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}
        >
          Registration Submitted Successfully
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            marginTop: '0.35rem',
            maxWidth: '520px',
          }}
        >
          Your details have been recorded for Sangolli Rayanna First Grade Constituent College ID card issuance.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '1.25rem',
          }}
        >
          <button
            onClick={handlePrint}
            type="button"
            className="interactive-element"
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print ID Card
          </button>

          <Link
            href="/"
            className="interactive-element"
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Submit Another
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Generating card replica...</div>
      ) : error ? (
        <div style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</div>
      ) : student ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <IdCardReplica data={student} />
        </div>
      ) : (
        <div style={{ color: 'var(--text-muted)' }}>No student record found.</div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
