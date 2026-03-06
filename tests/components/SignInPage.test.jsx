import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signIn } from 'next-auth/react';
import SignInPage from '@/components/SignInPage';

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders GOPILOT branding', () => {
    render(<SignInPage />);
    // "GO" + nested <span>PILOT</span> — find the outer span by tag + textContent
    const logo = screen.getByText((_, el) => el?.tagName === 'SPAN' && el?.textContent === 'GOPILOT');
    expect(logo).toBeInTheDocument();
  });

  it('renders the continue with google button', () => {
    render(<SignInPage />);
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('calls signIn with google when button is clicked', () => {
    render(<SignInPage />);
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));
    expect(signIn).toHaveBeenCalledWith('google');
  });

  it('renders the aviation training subtitle', () => {
    render(<SignInPage />);
    expect(screen.getByText(/aviation training simulator/i)).toBeInTheDocument();
  });

  it('renders the training-only disclaimer', () => {
    render(<SignInPage />);
    expect(screen.getByText(/not for actual flight operations/i)).toBeInTheDocument();
  });
});
