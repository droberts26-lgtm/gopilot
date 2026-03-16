export const metadata = {
  title: 'Terms of Service — GoPilot',
  description: 'Terms governing your use of GoPilot aviation training simulator.',
};

const LAST_UPDATED = 'March 16, 2026';
const CONTACT_EMAIL = 'support@gopilot.app';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#070b12',
    color: '#c0d4e8',
    fontFamily: "'Courier New', monospace",
    padding: 'clamp(32px, 6vw, 64px) clamp(16px, 5vw, 32px)',
  },
  inner: {
    maxWidth: 720,
    margin: '0 auto',
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 5,
    color: '#00ff88',
    marginBottom: 12,
    opacity: 0.7,
  },
  h1: {
    fontSize: 'clamp(22px, 4vw, 30px)',
    fontWeight: 900,
    letterSpacing: 2,
    color: '#f0f6ff',
    margin: '0 0 8px',
  },
  updated: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#3d5878',
    marginBottom: 48,
  },
  h2: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2.5,
    color: '#00ff88',
    margin: '36px 0 12px',
    textTransform: 'uppercase',
  },
  p: {
    fontSize: 13,
    lineHeight: 1.85,
    color: '#6a8aa4',
    margin: '0 0 14px',
  },
  ul: {
    fontSize: 13,
    lineHeight: 1.85,
    color: '#6a8aa4',
    paddingLeft: 20,
    margin: '0 0 14px',
  },
  divider: {
    borderTop: '1px solid rgba(255,255,255,0.04)',
    margin: '36px 0',
  },
  backLink: {
    display: 'inline-block',
    fontSize: 10,
    letterSpacing: 2,
    color: '#00ff88',
    textDecoration: 'none',
    marginBottom: 32,
    opacity: 0.7,
  },
  highlight: {
    background: 'rgba(0,255,136,0.04)',
    border: '1px solid rgba(0,255,136,0.12)',
    borderRadius: 8,
    padding: '14px 18px',
    margin: '0 0 14px',
    fontSize: 13,
    lineHeight: 1.85,
    color: '#6a8aa4',
  },
};

export default function TermsPage() {
  return (
    <div style={styles.page}>
      <div style={styles.inner}>

        <a href="/" style={styles.backLink}>← BACK TO GOPILOT</a>

        <div style={styles.eyebrow}>◈ LEGAL ◈</div>
        <h1 style={styles.h1}>Terms of Service</h1>
        <div style={styles.updated}>Last updated: {LAST_UPDATED}</div>

        <p style={styles.p}>
          These Terms of Service ("Terms") govern your use of GoPilot ("Service"), operated by GoPilot ("we", "us", "our").
          By accessing or using GoPilot you agree to be bound by these Terms. If you do not agree, do not use the Service.
        </p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>1. The Service</h2>
        <p style={styles.p}>GoPilot is an aviation training simulator designed to help student pilots prepare for the FAA Private Pilot Airman Knowledge Test. It is provided for educational purposes only.</p>
        <div style={styles.highlight}>
          GoPilot is for training purposes only and is not a substitute for official FAA-approved ground school instruction.
          Do not rely on GoPilot content for actual flight operations.
        </div>

        <div style={styles.divider} />

        <h2 style={styles.h2}>2. Accounts</h2>
        <p style={styles.p}>You may use GoPilot without an account, but signing in with Google is required to sync progress across devices and to access Pro features. You are responsible for maintaining the security of your Google account. We are not liable for any loss resulting from unauthorized use of your account.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>3. Pro Access & Payment</h2>
        <p style={styles.p}><strong style={{ color: '#cfe2f7' }}>One-time purchase.</strong> Pro access is available for a one-time payment of $14.99 USD, processed by Stripe. Upon successful payment, Pro features are permanently unlocked for the Google account used at the time of purchase.</p>
        <p style={styles.p}><strong style={{ color: '#cfe2f7' }}>No subscription.</strong> There are no recurring charges. Your Pro access does not expire.</p>
        <p style={styles.p}><strong style={{ color: '#cfe2f7' }}>Refunds.</strong> Because Pro access is granted immediately upon payment and consists of digital content, all sales are final. If Pro features did not activate after payment, contact us at <strong style={{ color: '#cfe2f7' }}>{CONTACT_EMAIL}</strong> and we will resolve it promptly.</p>
        <p style={styles.p}><strong style={{ color: '#cfe2f7' }}>Account tied access.</strong> Pro access is tied to your Google account. We cannot transfer Pro access to a different account.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>4. Acceptable Use</h2>
        <p style={styles.p}>You agree not to:</p>
        <ul style={styles.ul}>
          <li>Attempt to circumvent Pro access restrictions or payment systems</li>
          <li>Scrape, copy, or redistribute question content or ATC scenarios</li>
          <li>Use automated tools to access or stress-test the Service</li>
          <li>Use the Service for any unlawful purpose</li>
        </ul>

        <div style={styles.divider} />

        <h2 style={styles.h2}>5. Intellectual Property</h2>
        <p style={styles.p}>FAA question content is in the public domain as a work of the US federal government. All other content — including the GoPilot interface, ATC scenarios, video curation, and application code — is owned by GoPilot and may not be reproduced without permission. Embedded YouTube videos are owned by their respective creators and subject to YouTube's Terms of Service.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>6. Disclaimers</h2>
        <p style={styles.p}>The Service is provided "as is" without warranties of any kind. We do not guarantee that GoPilot will be error-free, uninterrupted, or that use of the Service will result in passing the FAA knowledge test. Question content is based on the FAA question bank but may not reflect the most recent updates to the test.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>7. Limitation of Liability</h2>
        <p style={styles.p}>To the fullest extent permitted by law, GoPilot shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to loss of data or failure to pass an exam. Our total liability to you for any claim shall not exceed the amount you paid for Pro access.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>8. Changes to These Terms</h2>
        <p style={styles.p}>We may update these Terms at any time. We will update the "Last updated" date at the top. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>9. Governing Law</h2>
        <p style={styles.p}>These Terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of competent jurisdiction.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>10. Contact</h2>
        <p style={styles.p}>Questions about these Terms? Email us at <strong style={{ color: '#cfe2f7' }}>{CONTACT_EMAIL}</strong>.</p>

      </div>
    </div>
  );
}
