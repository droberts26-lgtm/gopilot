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
    // Headline is split across a <br> so match each part
    expect(screen.getByText(/Pass Your FAA/i)).toBeInTheDocument();
    expect(screen.getByText(/most complete study tool/i)).toBeInTheDocument();
  });

  it('shows all three stat badges', () => {
    render(<HeroSection onUnlockPro={() => {}} />);
    // Stat labels are always present; counters animate but labels are stable
    expect(screen.getByText('Exam Questions')).toBeInTheDocument();
    expect(screen.getByText('ATC Scenarios')).toBeInTheDocument();
    expect(screen.getByText('Training Videos')).toBeInTheDocument();
  });

  it('renders START STUDYING and UNLOCK PRO buttons', () => {
    render(<HeroSection onUnlockPro={() => {}} />);
    expect(screen.getByText(/Start Studying/i)).toBeInTheDocument();
    expect(screen.getByText(/Unlock Pro/i)).toBeInTheDocument();
  });

  it('calls onUnlockPro when UNLOCK PRO button is clicked', () => {
    const onUnlockPro = vi.fn();
    render(<HeroSection onUnlockPro={onUnlockPro} />);
    fireEvent.click(screen.getByText(/Unlock Pro/i));
    expect(onUnlockPro).toHaveBeenCalledOnce();
  });

  it('dismisses when ✕ is clicked', () => {
    render(<HeroSection onUnlockPro={() => {}} />);
    expect(screen.getByText(/Pass Your FAA/i)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Dismiss hero section/i));
    expect(screen.queryByText(/Pass Your FAA/i)).not.toBeInTheDocument();
  });

  it('saves dismissed state to localStorage', () => {
    render(<HeroSection onUnlockPro={() => {}} />);
    fireEvent.click(screen.getByLabelText(/Dismiss hero section/i));
    expect(localStorage.getItem(HIDDEN_KEY)).toBe('1');
  });

  it('does not render when already dismissed in localStorage', () => {
    localStorage.setItem(HIDDEN_KEY, '1');
    render(<HeroSection onUnlockPro={() => {}} />);
    expect(screen.queryByText(/Pass Your FAA/i)).not.toBeInTheDocument();
  });
});
