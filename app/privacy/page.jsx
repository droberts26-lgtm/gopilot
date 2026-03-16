export const metadata = {
  title: 'Privacy Policy — GoPilot',
  description: 'How GoPilot collects, uses, and protects your information.',
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
};

export default function PrivacyPage() {
  return (
    <div style={styles.page}>
      <div style={styles.inner}>

        <a href="/" style={styles.backLink}>← BACK TO GOPILOT</a>

        <div style={styles.eyebrow}>◈ LEGAL ◈</div>
        <h1 style={styles.h1}>Privacy Policy</h1>
        <div style={styles.updated}>Last updated: {LAST_UPDATED}</div>

        <p style={styles.p}>
          GoPilot ("we", "us", or "our") operates the GoPilot aviation training simulator at gopilot.app.
          This policy explains what information we collect, how we use it, and your rights regarding that information.
          By using GoPilot, you agree to this policy.
        </p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>1. Information We Collect</h2>
        <p style={styles.p}><strong style={{ color: '#cfe2f7' }}>Account information.</strong> When you sign in with Google, we receive your name, email address, and profile picture from Google's OAuth service. We store your Google account ID to identify your account.</p>
        <p style={styles.p}><strong style={{ color: '#cfe2f7' }}>Payment information.</strong> Payments are processed by Stripe. We do not store your credit card number, CVV, or full payment details. Stripe provides us with a record that a payment was completed and the email address used.</p>
        <p style={styles.p}><strong style={{ color: '#cfe2f7' }}>Usage data.</strong> We store your study progress (quiz scores, questions mastered, matching mode times) in our database so it syncs across your devices when you are signed in.</p>
        <p style={styles.p}><strong style={{ color: '#cfe2f7' }}>Local storage.</strong> When you are not signed in, progress is saved only in your browser's local storage and never sent to our servers.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>2. How We Use Your Information</h2>
        <ul style={styles.ul}>
          <li>To authenticate you and maintain your session</li>
          <li>To sync and restore your study progress across devices</li>
          <li>To record that your account has active Pro access after payment</li>
          <li>To send Stripe payment receipts (handled by Stripe directly)</li>
          <li>To respond to support requests you send us</li>
        </ul>
        <p style={styles.p}>We do not sell your data, use it for advertising, or share it with third parties except as described in Section 4.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>3. Data Retention</h2>
        <p style={styles.p}>We retain your account data for as long as your account is active. If you would like your data deleted, email us at <strong style={{ color: '#cfe2f7' }}>{CONTACT_EMAIL}</strong> and we will remove it within 30 days.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>4. Third-Party Services</h2>
        <p style={styles.p}>GoPilot uses the following third-party services that may process your data:</p>
        <ul style={styles.ul}>
          <li><strong style={{ color: '#cfe2f7' }}>Google OAuth</strong> — authentication. Governed by Google's Privacy Policy.</li>
          <li><strong style={{ color: '#cfe2f7' }}>Stripe</strong> — payment processing. Governed by Stripe's Privacy Policy.</li>
          <li><strong style={{ color: '#cfe2f7' }}>Supabase</strong> — database hosting for progress and Pro status. Data is stored in the United States.</li>
          <li><strong style={{ color: '#cfe2f7' }}>Vercel</strong> — application hosting. May log request metadata (IP, user agent) per their standard practices.</li>
          <li><strong style={{ color: '#cfe2f7' }}>YouTube</strong> — video content is embedded from YouTube. YouTube may set cookies when you watch videos.</li>
        </ul>

        <div style={styles.divider} />

        <h2 style={styles.h2}>5. Cookies & Local Storage</h2>
        <p style={styles.p}>GoPilot uses a session cookie set by NextAuth to keep you signed in. No advertising or tracking cookies are used by us. YouTube embeds may set their own cookies when you interact with them.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>6. Children's Privacy</h2>
        <p style={styles.p}>GoPilot is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us personal information, contact us and we will delete it.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>7. Changes to This Policy</h2>
        <p style={styles.p}>We may update this policy from time to time. We will update the "Last updated" date at the top of this page. Continued use of GoPilot after changes constitutes acceptance of the updated policy.</p>

        <div style={styles.divider} />

        <h2 style={styles.h2}>8. Contact</h2>
        <p style={styles.p}>Questions about this policy? Email us at <strong style={{ color: '#cfe2f7' }}>{CONTACT_EMAIL}</strong>.</p>

      </div>
    </div>
  );
}
