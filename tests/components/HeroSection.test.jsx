import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from '@/components/HeroSection';

const HIDDEN_KEY = 'gopilot_hero_hidden';

beforeEach(() => {
  localStorage.clear();
});

describe('HeroSection', () => {
  it('renders headline and sub-headline', () => {
    render(<HeroSection onUnlockPro={() => {}} />);
    expect(screen.getByText(/Pass Your FAA Written Exam/i)).toBeInTheDocument();
    expect(screen.getByText(/most complete online study tool/i)).toBeInTheDocument();
  });

  it('shows all three stat badges', () => {
    render(<HeroSection onUnlockPro={() => {}} />);
    expect(screen.getByText('131')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('46')).toBeInTheDocument();
  });

  it('renders START STUDYING and UNLOCK PRO buttons', () => {
    render(<HeroSection onUnlockPro={() => {}} />);
    expect(screen.getByText(/START STUDYING/i)).toBeInTheDocument();
    expect(screen.getByText(/UNLOCK PRO/i)).toBeInTheDocument();
  });

  it('calls onUnlockPro when UNLOCK PRO button is clicked', () => {
    const onUnlockPro = vi.fn();
    render(<HeroSection onUnlockPro={onUnlockPro} />);
    fireEvent.click(screen.getByText(/UNLOCK PRO/i));
    expect(onUnlockPro).toHaveBeenCalledOnce();
  });

  it('dismisses when ✕ is clicked', () => {
    render(<HeroSection onUnlockPro={() => {}} />);
    expect(screen.getByText(/Pass Your FAA Written Exam/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Dismiss hero section/i));
    expect(screen.queryByText(/Pass Your FAA Written Exam/i)).not.toBeInTheDocument();
  });

  it('saves dismissed state to localStorage', () => {
    render(<HeroSection onUnlockPro={() => {}} />);
    fireEvent.click(screen.getByLabelText(/Dismiss hero section/i));
    expect(localStorage.getItem(HIDDEN_KEY)).toBe('1');
  });

  it('does not render when already dismissed in localStorage', () => {
    localStorage.setItem(HIDDEN_KEY, '1');
    render(<HeroSection onUnlockPro={() => {}} />);
    expect(screen.queryByText(/Pass Your FAA Written Exam/i)).not.toBeInTheDocument();
  });
});
