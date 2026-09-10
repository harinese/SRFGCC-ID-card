'use client';

import React, { useState } from 'react';
import { StudentCardRecord, COURSES, YEARS } from '@/lib/types';
import IdCardReplica from './IdCardReplica';

interface FacultyTableProps {
  students: StudentCardRecord[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  selectedCourse: string;
  onCourseChange: (course: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  onDeleteStudent: (id: string) => Promise<void>;
  onOpenBatchPrint: () => void;
}

export default function FacultyTable({
  students,
  loading,
  search,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  selectedYear,
  onYearChange,
  onDeleteStudent,
  onOpenBatchPrint,
}: FacultyTableProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentCardRecord | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCopyShareLink = () => {
    const url = new URL('/faculty', window.location.origin);
    url.searchParams.set('key', 'srfgcc-faculty-pass-2026');
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (selectedCourse && selectedCourse !== 'all') params.set('course', selectedCourse);
    if (selectedYear && selectedYear !== 'all') params.set('year', selectedYear);
    if (search.trim()) params.set('search', search.trim());
    window.location.href = `/api/export/csv?${params.toString()}`;
  };

  const handleExportPhotos = () => {
    const params = new URLSearchParams();
    if (selectedCourse && selectedCourse !== 'all') params.set('course', selectedCourse);
    if (selectedYear && selectedYear !== 'all') params.set('year', selectedYear);
    if (search.trim()) params.set('search', search.trim());
    window.location.href = `/api/export/photos?${params.toString()}`;
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the record for ${name}?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await onDeleteStudent(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Control Bar */}
      <div
        style={{
          padding: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search & Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, reg no, mobile..."
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-primary)',
                fontSize: '0.85rem',
              }}
            />
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
              }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <select
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-primary)',
              fontSize: '0.85rem',
            }}
          >
            <option value="all">All Courses</option>
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-primary)',
              fontSize: '0.85rem',
            }}
          >
            <option value="all">All Years</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          <button
            onClick={handleCopyShareLink}
            type="button"
            className="interactive-element"
            title="Copy direct shareable faculty link with authenticated passkey"
            style={{
              padding: '0.55rem 0.9rem',
              backgroundColor: copiedLink ? 'var(--success-soft)' : 'var(--bg-muted)',
              color: copiedLink ? 'var(--success)' : 'var(--text-primary)',
              border: `1px solid ${copiedLink ? 'var(--success)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            {copiedLink ? 'Share Link Copied' : 'Share Faculty Link'}
          </button>

          <button
            onClick={handleExportCsv}
            type="button"
            className="interactive-element"
            style={{
              padding: '0.55rem 0.9rem',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export CSV
          </button>

          <button
            onClick={handleExportPhotos}
            type="button"
            className="interactive-element"
            title="Download ZIP archive of all student photos named by registration number"
            style={{
              padding: '0.55rem 0.9rem',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Photos (ZIP)
          </button>

          <button
            onClick={onOpenBatchPrint}
            disabled={students.length === 0}
            type="button"
            className="interactive-element"
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Batch Print Sheet ({students.length})
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.85rem',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <th style={{ padding: '0.75rem 1rem' }}>Photo</th>
              <th style={{ padding: '0.75rem 1rem' }}>Student Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Course & Year</th>
              <th style={{ padding: '0.75rem 1rem' }}>Reg No / Aadhaar</th>
              <th style={{ padding: '0.75rem 1rem' }}>Mobile / DOB</th>
              <th style={{ padding: '0.75rem 1rem' }}>Blood Group</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading student records...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No student records match the selected filters.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '0.65rem 1rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '44px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#cbd5e1',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {student.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={student.photoUrl}
                          alt={student.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : null}
                    </div>
                  </td>

                  <td style={{ padding: '0.65rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {student.address}
                    </div>
                  </td>

                  <td style={{ padding: '0.65rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '3px',
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--accent-primary)',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                      }}
                    >
                      {student.course}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {student.year}
                    </div>
                  </td>

                  <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.regNo}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.aadhaarNo}</div>
                  </td>

                  <td style={{ padding: '0.65rem 1rem' }}>
                    <div>{student.mobile}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>DOB: {student.dob}</div>
                  </td>

                  <td style={{ padding: '0.65rem 1rem' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#b91c1c',
                        backgroundColor: 'var(--danger-soft)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '3px',
                        fontSize: '0.75rem',
                      }}
                    >
                      {student.bloodGroup}
                    </span>
                  </td>

                  <td style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => setSelectedStudent(student)}
                        type="button"
                        className="interactive-element"
                        title="Inspect ID Card Replica"
                        style={{
                          padding: '0.35rem 0.65rem',
                          backgroundColor: 'var(--bg-muted)',
                          color: 'var(--accent-primary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                        }}
                      >
                        View Card
                      </button>

                      <button
                        onClick={() => handleDelete(student.id, student.name)}
                        disabled={deletingId === student.id}
                        type="button"
                        className="interactive-element"
                        title="Delete Record"
                        style={{
                          padding: '0.35rem 0.55rem',
                          backgroundColor: 'transparent',
                          color: 'var(--danger)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                        }}
                      >
                        {deletingId === student.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Single ID Card Inspection Modal */}
      {selectedStudent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '440px',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedStudent.name}
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                type="button"
                style={{
                  fontSize: '1.2rem',
                  color: 'var(--text-muted)',
                  padding: '0.2rem 0.5rem',
                }}
              >
                &times;
              </button>
            </div>

            <IdCardReplica data={selectedStudent} />

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', width: '100%' }}>
              <button
                onClick={() => window.print()}
                type="button"
                className="interactive-element"
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Print Card
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                type="button"
                className="interactive-element"
                style={{
                  padding: '0.6rem 1.2rem',
                  backgroundColor: 'var(--bg-muted)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
