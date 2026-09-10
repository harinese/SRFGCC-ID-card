'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudentCardRecord, FacultyStats } from '@/lib/types';
import FacultyStatsView from '@/components/FacultyStats';
import FacultyTable from '@/components/FacultyTable';
import BatchPrintModal from '@/components/BatchPrintModal';

function FacultyContent() {
  const searchParams = useSearchParams();
  const urlKey = searchParams.get('key');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [students, setStudents] = useState<StudentCardRecord[]>([]);
  const [stats, setStats] = useState<FacultyStats | null>(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showBatchPrint, setShowBatchPrint] = useState(false);

  // Authenticate with key
  const authenticateWithKey = useCallback(async (key: string) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/faculty/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        const data = await res.json();
        setAuthError(data.error || 'Invalid faculty access key');
        setIsAuthenticated(false);
      }
    } catch {
      setAuthError('Connection error during authentication');
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Initial Auth Check
  useEffect(() => {
    if (urlKey) {
      authenticateWithKey(urlKey);
      return;
    }

    const checkSession = async () => {
      try {
        const res = await fetch('/api/faculty/auth');
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, [urlKey, authenticateWithKey]);

  // Fetch Students Data
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCourse && selectedCourse !== 'all') params.set('course', selectedCourse);
      if (selectedYear && selectedYear !== 'all') params.set('year', selectedYear);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/students?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedCourse, selectedYear, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) {
      setAuthError('Please enter access passkey');
      return;
    }
    authenticateWithKey(passkeyInput.trim());
  };

  const handleLogout = async () => {
    await fetch('/api/faculty/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setPasskeyInput('');
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete student record');
      }
    } catch {
      alert('Failed to delete student record');
    }
  };


  if (isAuthenticated === null) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Verifying faculty authorization...
      </div>
    );
  }

  // Passcode gate view
  if (!isAuthenticated) {
    return (
      <div
        style={{
          maxWidth: '440px',
          margin: '4rem auto',
          padding: '1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/krcu_logo.png"
            alt="RCU"
            style={{ width: '56px', height: '56px', objectFit: 'contain', margin: '0 auto 1rem auto' }}
          />

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Faculty Board Access
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem', marginBottom: '1.5rem' }}>
            Enter your faculty board access key or use the direct share link.
          </p>

          <form onSubmit={handleManualLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {authError && (
              <div
                style={{
                  backgroundColor: 'var(--danger-soft)',
                  color: 'var(--danger)',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                {authError}
              </div>
            )}

            <input
              type="password"
              placeholder="Enter Faculty Passkey"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-primary)',
                fontSize: '0.9rem',
              }}
            />

            <button
              type="submit"
              disabled={authLoading}
              className="interactive-element"
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              {authLoading ? 'Verifying Passkey...' : 'Enter Faculty Board'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '2rem 1.25rem',
      }}
    >
      {/* Board Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Faculty Administrative Board
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Sangolli Rayanna First Grade Constituent College &bull; Student Records & Card Production
          </p>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="interactive-element"
          style={{
            padding: '0.45rem 0.85rem',
            backgroundColor: 'var(--bg-muted)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          Sign Out
        </button>
      </div>

      {/* KPI Stats View */}
      <FacultyStatsView
        stats={stats}
        selectedCourse={selectedCourse}
        onSelectCourse={setSelectedCourse}
      />

      {/* Main Student Data Table */}
      <FacultyTable
        students={students}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        onDeleteStudent={handleDeleteStudent}
        onOpenBatchPrint={() => setShowBatchPrint(true)}
      />

      {/* Batch Print Modal */}
      {showBatchPrint && (
        <BatchPrintModal
          students={students}
          onClose={() => setShowBatchPrint(false)}
        />
      )}
    </div>
  );
}

export default function FacultyPage() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center' }}>Loading Faculty Board...</div>}>
      <FacultyContent />
    </Suspense>
  );
}
