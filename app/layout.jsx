import './globals.css';

export const metadata = {
  title: 'GoPilot — Aviation Training Simulator',
  description: 'Master ATC communications and FAA private pilot knowledge test questions with GoPilot.',
  keywords: 'aviation, pilot training, ATC, FAA, private pilot, airman knowledge test',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
