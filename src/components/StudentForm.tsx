'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { COURSES, YEARS, BLOOD_GROUPS, StudentInput } from '@/lib/types';
import IdCardReplica from './IdCardReplica';

export default function StudentForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<StudentInput>({
    name: '',
    dob: '',
    mobile: '',
    address: '',
    course: 'B.Sc.',
    year: 'I Year',
    regNo: '',
    aadhaarNo: '',
    bloodGroup: 'A+ve',
    photoUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length >= 5) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setFormData((prev) => ({ ...prev, dob: formatted }));
    if (errors.dob) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.dob;
        return next;
      });
    }
  };

  const handleCalendarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const [year, month, day] = val.split('-');
      if (year && month && day) {
        setFormData((prev) => ({ ...prev, dob: `${day}/${month}/${year}` }));
        if (errors.dob) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.dob;
            return next;
          });
        }
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'regNo' ? value.toUpperCase() : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateSingleField = (field: string, val: string): string => {
    switch (field) {
      case 'name':
        if (!val.trim()) return 'Full name is required';
        if (val.trim().length < 2) return 'Full name must be at least 2 characters';
        return '';
      case 'dob':
        if (!val.trim()) return 'Date of birth is required';
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(val.trim())) return 'Date of birth must be DD/MM/YYYY';
        return '';
      case 'mobile':
        if (!val.trim()) return 'Mobile number is required';
        if (!/^[6-9]\d{9}$/.test(val.trim())) return 'Enter a valid 10-digit Indian mobile number';
        return '';
      case 'address':
        if (!val.trim()) return 'Permanent address is required';
        if (val.trim().length < 5) return 'Permanent address is too short (min 5 characters)';
        return '';
      case 'course':
        if (!val) return 'Please select a course';
        return '';
      case 'year':
        if (!val) return 'Please select academic year';
        return '';
      case 'regNo':
        if (!val.trim()) return 'Registration number is required';
        if (val.trim().length < 3) return 'Registration number must be at least 3 characters';
        return '';
      case 'aadhaarNo': {
        const clean = val.replace(/\s+/g, '');
        if (!clean) return 'Aadhaar number is required';
        if (!/^\d{12}$/.test(clean)) return 'Aadhaar number must be exactly 12 digits';
        return '';
      }
      case 'bloodGroup':
        if (!val) return 'Please select blood group';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    const errorMsg = validateSingleField(field, formData[field as keyof StudentInput] || '');
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePhotoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photo: 'Selected file must be an image' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Image size should be less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress & scale to optimal passport photo resolution (400x480)
        const canvas = document.createElement('canvas');
        const targetWidth = 400;
        const targetHeight = 480;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Center crop calculation
          const imgAspect = img.width / img.height;
          const targetAspect = targetWidth / targetHeight;
          let renderWidth = targetWidth;
          let renderHeight = targetHeight;
          let offsetX = 0;
          let offsetY = 0;

          if (imgAspect > targetAspect) {
            renderWidth = img.height * targetAspect;
            offsetX = (img.width - renderWidth) / 2;
            ctx.drawImage(img, offsetX, 0, renderWidth, img.height, 0, 0, targetWidth, targetHeight);
          } else {
            renderHeight = img.width / targetAspect;
            offsetY = (img.height - renderHeight) / 2;
            ctx.drawImage(img, 0, offsetY, img.width, renderHeight, 0, 0, targetWidth, targetHeight);
          }

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setFormData((prev) => ({ ...prev, photoUrl: compressedDataUrl }));
          setErrors((prev) => {
            const next = { ...prev };
            delete next.photo;
            return next;
          });
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please provide student full name';
    }
    if (!formData.dob.trim()) {
      newErrors.dob = 'Date of birth is required';
    }
    if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.address.trim() || formData.address.trim().length < 5) {
      newErrors.address = 'Address is too short';
    }
    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }
    if (!formData.year) {
      newErrors.year = 'Please select academic year';
    }
    if (!formData.regNo.trim() || formData.regNo.trim().length < 3) {
      newErrors.regNo = 'Valid registration number is required';
    }
    const cleanAadhaar = formData.aadhaarNo.replace(/\s+/g, '');
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      newErrors.aadhaarNo = 'Aadhaar must be exactly 12 digits';
    }
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Please select blood group';
    }
    if (!formData.photoUrl) {
      newErrors.photo = 'Student photograph is required for ID card generation';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          aadhaarNo: cleanAadhaar,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        setServerError(resData.error || 'Failed to submit details');
        setSubmitting(false);
        return;
      }

      const createdId = resData.data?.id;
      router.push(`/success?id=${createdId}`);
    } catch {
      setServerError('Network error while connecting to server. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.25rem',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          Student ID Card Registration
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
          Official identity card application for academic enrollment at Sangolli Rayanna First Grade Constituent College.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {serverError && (
            <div
              style={{
                backgroundColor: 'var(--danger-soft)',
                color: 'var(--danger)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {serverError}
            </div>
          )}

          {/* Photo Upload Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.4rem',
              }}
            >
              Student Photograph *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handlePhotoUpload(e.dataTransfer.files[0]);
                }
              }}
              style={{
                border: errors.photo ? '1.5px dashed var(--danger)' : '1.5px dashed var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-subtle)',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handlePhotoUpload(e.target.files[0]);
                  }
                }}
              />
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {formData.photoUrl ? 'Replace Photo' : 'Click to Upload or Drag & Drop'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                JPEG, PNG or WebP (Passport ratio recommended)
              </div>
            </div>
            {errors.photo && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem', display: 'block' }}>
                {errors.photo}
              </span>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.35rem',
              }}
            >
              Full Name (As per SSLC / PU Marks Card) *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              placeholder="Enter student full name"
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${errors.name ? 'var(--danger)' : 'var(--border-subtle)'}`,
                backgroundColor: 'var(--bg-primary)',
                fontSize: '0.9rem',
              }}
            />
            {errors.name && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>
                {errors.name}
              </span>
            )}
          </div>

          {/* DOB & Mobile Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label
                htmlFor="dob"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                Date of Birth *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="dob"
                  name="dob"
                  type="text"
                  maxLength={10}
                  value={formData.dob}
                  onChange={handleDobChange}
                  onBlur={() => handleBlur('dob')}
                  placeholder="DD/MM/YYYY"
                  style={{
                    width: '100%',
                    padding: '0.6rem 2.4rem 0.6rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${errors.dob ? 'var(--danger)' : 'var(--border-subtle)'}`,
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '0.9rem',
                  }}
                />
                <input
                  ref={dateInputRef}
                  type="date"
                  tabIndex={-1}
                  aria-hidden="true"
                  onChange={handleCalendarSelect}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    width: '1px',
                    height: '1px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    try {
                      dateInputRef.current?.showPicker();
                    } catch {
                      dateInputRef.current?.focus();
                    }
                  }}
                  title="Choose date from calendar"
                  aria-label="Choose date from calendar"
                  style={{
                    position: 'absolute',
                    right: '0.55rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.2rem',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </button>
              </div>
              {errors.dob && (
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>
                  {errors.dob}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="mobile"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                Mobile Number *
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                maxLength={10}
                value={formData.mobile}
                onChange={handleChange}
                onBlur={() => handleBlur('mobile')}
                placeholder="10-digit number"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${errors.mobile ? 'var(--danger)' : 'var(--border-subtle)'}`,
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '0.9rem',
                }}
              />
              {errors.mobile && (
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>
                  {errors.mobile}
                </span>
              )}
            </div>
          </div>

          {/* Course & Year Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label
                htmlFor="course"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                Course / Degree *
              </label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                onBlur={() => handleBlur('course')}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${errors.course ? 'var(--danger)' : 'var(--border-subtle)'}`,
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '0.9rem',
                }}
              >
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.course && (
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>
                  {errors.course}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="year"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                Academic Year *
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                onBlur={() => handleBlur('year')}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${errors.year ? 'var(--danger)' : 'var(--border-subtle)'}`,
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '0.9rem',
                }}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.year && (
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>
                  {errors.year}
                </span>
              )}
            </div>
          </div>

          {/* Registration Number & Aadhaar Number Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label
                htmlFor="regNo"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                Registration Number *
              </label>
              <input
                id="regNo"
                name="regNo"
                type="text"
                value={formData.regNo}
                onChange={handleChange}
                onBlur={() => handleBlur('regNo')}
                placeholder="e.g. U15HS2450001"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${errors.regNo ? 'var(--danger)' : 'var(--border-subtle)'}`,
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '0.9rem',
                }}
              />
              {errors.regNo && (
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>
                  {errors.regNo}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="aadhaarNo"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                Aadhaar Number *
              </label>
              <input
                id="aadhaarNo"
                name="aadhaarNo"
                type="text"
                maxLength={12}
                value={formData.aadhaarNo}
                onChange={handleChange}
                onBlur={() => handleBlur('aadhaarNo')}
                placeholder="Enter 12-digit Aadhaar number"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${errors.aadhaarNo ? 'var(--danger)' : 'var(--border-subtle)'}`,
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '0.9rem',
                }}
              />
              {errors.aadhaarNo && (
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>
                  {errors.aadhaarNo}
                </span>
              )}
            </div>
          </div>

          {/* Blood Group */}
          <div>
            <label
              htmlFor="bloodGroup"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.35rem',
              }}
            >
              Blood Group *
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              onBlur={() => handleBlur('bloodGroup')}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${errors.bloodGroup ? 'var(--danger)' : 'var(--border-subtle)'}`,
                backgroundColor: 'var(--bg-primary)',
                fontSize: '0.9rem',
              }}
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {errors.bloodGroup && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>
                {errors.bloodGroup}
              </span>
            )}
          </div>

          {/* Permanent Address */}
          <div>
            <label
              htmlFor="address"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.35rem',
              }}
            >
              Permanent Address *
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              onBlur={() => handleBlur('address')}
              placeholder="Enter full permanent residential address..."
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${errors.address ? 'var(--danger)' : 'var(--border-subtle)'}`,
                backgroundColor: 'var(--bg-primary)',
                fontSize: '0.9rem',
                resize: 'vertical',
              }}
            />
            {errors.address && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>
                {errors.address}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="interactive-element"
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem 1.5rem',
              backgroundColor: submitting ? 'var(--text-dim)' : 'var(--accent-primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.01em',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {submitting ? 'Registering Details...' : 'Submit & Generate ID Card'}
          </button>
        </form>

        {/* Right Column: Live Interactive ID Card Replica */}
        <div
          style={{
            position: 'sticky',
            top: '5.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              marginBottom: '0.85rem',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Student Identity Card Preview
            </span>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: '0.35rem',
              }}
            >
              Official credential preview for SRFGCC Belagavi
            </p>
          </div>

          <IdCardReplica data={formData} />
        </div>
      </div>
    </div>
  );
}
