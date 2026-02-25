'use client';

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use CDN for the PDF.js worker — works reliably on Vercel
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfFigure({ pageNumber, figureNumbers, note }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const pages = Array.isArray(pageNumber) ? pageNumber : [pageNumber];
  const figLabel = Array.isArray(figureNumbers)
    ? figureNumbers.map(n => `Figure ${n}`).join(' & ')
    : `Figure ${figureNumbers}`;

  if (loadError) return null;

  return (
    <div style={{
      background: 'rgba(245, 158, 11, 0.04)',
      border: '1px solid rgba(245, 158, 11, 0.25)',
      borderRadius: 10,
      padding: '12px 14px',
      marginBottom: 18,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: isExpanded ? 12 : 0,
        cursor: 'pointer',
      }} onClick={() => setIsExpanded(v => !v)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: '#f59e0b' }}>◈ REFERENCE: {figLabel}</span>
          {note && (
            <span style={{ fontSize: 9, color: '#b45309', letterSpacing: 1 }}>— {note}</span>
          )}
        </div>
        <span style={{ fontSize: 10, color: '#92400e', letterSpacing: 2 }}>
          {isExpanded ? '▲ COLLAPSE' : '▼ VIEW FIGURE'}
        </span>
      </div>

      {isExpanded && (
        <div>
          {pages.map((pg, idx) => (
            <div key={pg} style={{ marginBottom: idx < pages.length - 1 ? 16 : 0 }}>
              {pages.length > 1 && (
                <div style={{ fontSize: 8, color: '#92400e', letterSpacing: 2, marginBottom: 6 }}>
                  {Array.isArray(figureNumbers) ? `FIGURE ${figureNumbers[idx]}` : ''}
                </div>
              )}
              <div style={{
                background: '#fff',
                borderRadius: 6,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                maxHeight: 520,
                overflowY: 'auto',
              }}>
                <Document
                  file="/akts.pdf"
                  onLoadError={() => setLoadError(true)}
                  loading={
                    <div style={{ padding: 24, color: '#92400e', fontFamily: 'monospace', fontSize: 11 }}>
                      Loading figure...
                    </div>
                  }
                >
                  <Page
                    pageNumber={pg}
                    width={Math.min(typeof window !== 'undefined' ? window.innerWidth - 80 : 600, 680)}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
