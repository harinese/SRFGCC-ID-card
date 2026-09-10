'use client';

import React from 'react';
import { FacultyStats } from '@/lib/types';

interface FacultyStatsProps {
  stats: FacultyStats | null;
  selectedCourse: string;
  onSelectCourse: (course: string) => void;
}

export default function FacultyStatsView({
  stats,
  selectedCourse,
  onSelectCourse,
}: FacultyStatsProps) {
  if (!stats) return null;

  const courses = ['B.Sc.', 'B.Com.', 'B.B.A.', 'B.C.A.', 'B.A.'];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Total Card */}
      <div
        onClick={() => onSelectCourse('all')}
        className="interactive-element"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: `1.5px solid ${selectedCourse === 'all' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.2rem',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Total Submissions
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
          {stats.total}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
          All Enrolled Courses
        </div>
      </div>

      {/* Course Breakdown Cards */}
      {courses.map((course) => {
        const count = stats.byCourse[course] || 0;
        const isSelected = selectedCourse === course;

        return (
          <div
            key={course}
            onClick={() => onSelectCourse(course)}
            className="interactive-element"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.2rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {course}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {count}
            </div>
            <div style={{ fontSize: '0.72rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-dim)', marginTop: '0.1rem' }}>
              {isSelected ? 'Active Filter' : 'Filter by Course'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
