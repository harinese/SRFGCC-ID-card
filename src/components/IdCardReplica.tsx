'use client';

import React from 'react';
import { StudentInput } from '@/lib/types';

interface IdCardReplicaProps {
  data: Partial<StudentInput>;
  scale?: number;
  hideHolder?: boolean;
  className?: string;
}

export default function IdCardReplica({
  data,
  scale = 1,
  hideHolder = false,
  className = '',
}: IdCardReplicaProps) {
  const {
    name = '',
    dob = '',
    mobile = '',
    address = '',
    course = 'B.Sc.',
    year = 'I Year',
    regNo = '',
    aadhaarNo = '',
    bloodGroup = 'A+ve',
    photoUrl = '',
  } = data;

  const formattedClass = course ? `${course} (${year || 'I Year'})` : 'B. Sc. (I Year)';

  const cardContent = (
    <div
      style={{
        width: '320px',
        height: '475px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: hideHolder ? 'none' : '0 2px 8px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#1e293b',
        userSelect: 'none',
      }}
    >
      {/* Official Header Banner */}
      <div
        style={{
          background: 'linear-gradient(180deg, #16467f 0%, #1e5396 60%, #174279 100%)',
          color: '#ffffff',
          padding: '6px 6px 4px 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #38bdf8',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left Emblem: Kitturu Rani Channamma */}
        <div style={{ width: '40px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/krcu_logo.png"
            alt="RCU Logo"
            style={{ width: '38px', height: '38px', objectFit: 'contain' }}
          />
        </div>

        {/* Center Header Titles */}
        <div style={{ textAlign: 'center', flex: 1, padding: '0 4px' }}>
          <div
            style={{
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '0.4px',
              color: '#93c5fd',
              lineHeight: 1.1,
              textTransform: 'uppercase',
            }}
          >
            RANI CHANNAMMA UNIVERSITY
          </div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.3px',
              fontFamily: 'Georgia, serif',
              color: '#ffffff',
              lineHeight: 1.15,
              marginTop: '1px',
              textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}
          >
            SANGOLLI RAYANNA
          </div>
          <div
            style={{
              fontSize: '7.5px',
              fontWeight: 700,
              letterSpacing: '0.2px',
              color: '#f8fafc',
              lineHeight: 1.1,
              marginTop: '1px',
            }}
          >
            FIRST GRADE CONSTITUENT COLLEGE
          </div>
          <div
            style={{
              fontSize: '6.5px',
              fontWeight: 500,
              color: '#cbd5e1',
              lineHeight: 1.1,
              marginTop: '1.5px',
            }}
          >
            Anjaneya Nagar, Mal Maruti Extension, Belagavi - 590 017.
          </div>
          <div
            style={{
              fontSize: '6.5px',
              fontWeight: 500,
              color: '#cbd5e1',
              lineHeight: 1.1,
            }}
          >
            Phone Number: (Off) 0831-2454360
          </div>
        </div>

        {/* Right Emblem: Sangolli Rayanna Statue */}
        <div style={{ width: '40px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/rayanna_statue.png"
            alt="Sangolli Rayanna Statue"
            style={{ width: '38px', height: '40px', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Decorative Graphic Waves and Arches behind Photo */}
      <div
        style={{
          position: 'relative',
          paddingTop: '6px',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        {/* Concentric Decorative Cyan Arches */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '210px',
            height: '210px',
            borderRadius: '50%',
            border: '14px solid #38bdf8',
            opacity: 0.85,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-32px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '235px',
            height: '235px',
            borderRadius: '50%',
            border: '8px solid #0284c7',
            opacity: 0.9,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-44px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            border: '6px solid #bae6fd',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />

        {/* Student Photograph Frame */}
        <div
          style={{
            width: '100px',
            height: '118px',
            borderRadius: '6px 6px 4px 4px',
            border: '2px solid #ffffff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            backgroundColor: '#e2e8f0',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 3,
            marginBottom: '6px',
          }}
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#cbd5e1',
                color: '#64748b',
                fontSize: '9px',
                textAlign: 'center',
                padding: '4px',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21a8 8 0 1 0-16 0"></path>
              </svg>
              <span>Photo</span>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Grid */}
      <div
        style={{
          flex: 1,
          padding: '8px 14px 6px 14px',
          fontSize: '10.5px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '3.5px',
          lineHeight: '1.25',
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Row 1: NAME */}
        <div style={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '10.5px' }}>NAME</span>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>:</span>
          <span
            style={{
              fontWeight: 800,
              color: name ? '#b91c1c' : '#94a3b8',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.2px',
            }}
          >
            {name || 'STUDENT NAME'}
          </span>
        </div>

        {/* Row 2: DOB */}
        <div style={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '10.5px' }}>DOB</span>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>:</span>
          <span style={{ fontWeight: 600, color: dob ? '#0f172a' : '#94a3b8' }}>{dob || 'DD/MM/YYYY'}</span>
        </div>

        {/* Row 3: MOBILE NO. */}
        <div style={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '10.5px' }}>MOBILE NO.</span>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>:</span>
          <span style={{ fontWeight: 600, color: mobile ? '#0f172a' : '#94a3b8' }}>{mobile || '----------'}</span>
        </div>

        {/* Row 4: ADDRESS */}
        <div style={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '10.5px' }}>ADDRESS</span>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>:</span>
          <span
            style={{
              fontWeight: 600,
              color: address ? '#0f172a' : '#94a3b8',
              fontSize: '9.8px',
              lineHeight: '1.2',
              wordBreak: 'break-word',
            }}
          >
            {address || 'Permanent residential address'}
          </span>
        </div>

        <div style={{ height: '3px' }} />

        {/* Row 5: CLASS */}
        <div style={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '10.5px' }}>CLASS</span>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>:</span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{formattedClass}</span>
        </div>

        {/* Row 6: REG. NO. */}
        <div style={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '10.5px' }}>REG. NO.</span>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>:</span>
          <span style={{ fontWeight: 700, color: regNo ? '#0f172a' : '#94a3b8', letterSpacing: '0.4px' }}>
            {regNo || 'U15------'}
          </span>
        </div>

        {/* Row 7: ADHAR NO. */}
        <div style={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '10.5px' }}>ADHAR NO.</span>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>:</span>
          <span style={{ fontWeight: 600, color: aadhaarNo ? '#0f172a' : '#94a3b8', letterSpacing: '0.4px' }}>
            {aadhaarNo || '---- ---- ----'}
          </span>
        </div>

        {/* Row 8: BLOOD GR. */}
        <div style={{ display: 'grid', gridTemplateColumns: '84px 10px 1fr', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '10.5px' }}>BLOOD GR.</span>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>:</span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{bloodGroup || 'A+ve'}</span>
        </div>

        {/* Bottom Signature Section */}
        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            right: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/principal_signature.png"
            alt="Principal Signature"
            style={{
              height: '24px',
              width: '75px',
              objectFit: 'contain',
              marginBottom: '-2px',
            }}
          />
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              fontFamily: 'Georgia, serif',
              color: '#0f172a',
              letterSpacing: '0.2px',
            }}
          >
            Principal
          </div>
        </div>
      </div>
    </div>
  );

  if (hideHolder) {
    return (
      <div
        className={className}
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          display: 'inline-block',
        }}
      >
        {cardContent}
      </div>
    );
  }

  // Render with physical acrylic lanyard card-holder bezel
  return (
    <div
      className={className}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        display: 'inline-block',
      }}
    >
      <div
        style={{
          width: '344px',
          height: '526px',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(4px)',
          borderRadius: '16px',
          border: '5px solid #cbd5e1',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.16)',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Top Lanyard Slot Punch Hole */}
        <div
          style={{
            width: '64px',
            height: '14px',
            backgroundColor: 'rgba(51, 65, 85, 0.25)',
            border: '1.5px solid #94a3b8',
            borderRadius: '7px',
            marginBottom: '8px',
          }}
        />

        {/* Card Body */}
        {cardContent}
      </div>
    </div>
  );
}
