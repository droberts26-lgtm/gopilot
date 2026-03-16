import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingModal from '@/components/OnboardingModal';

const ONBOARDED_KEY = 'gopilot_onboarded';

beforeEach(() => {
  localStorage.clear();
});

describe('OnboardingModal', () => {
  it('shows on first visit (no localStorage key)', () => {
    render(<OnboardingModal />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/WELCOME TO GOPILOT/i)).toBeInTheDocument();
  });

  it('does not show if already onboarded', () => {
    localStorage.setItem(ONBOARDED_KEY, '1');
    render(<OnboardingModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the first step content on open', () => {
    render(<OnboardingModal />);
    expect(screen.getByText('AIRMAN KNOWLEDGE')).toBeInTheDocument();
  });

  it('advances to the next step on NEXT click', () => {
    render(<OnboardingModal />);
    fireEvent.click(screen.getByText(/NEXT →/i));
    expect(screen.getByText('ATC COMMS')).toBeInTheDocument();
  });

  it('goes back to the previous step on BACK click', () => {
    render(<OnboardingModal />);
    fireEvent.click(screen.getByText(/NEXT →/i));
    expect(screen.getByText('ATC COMMS')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/← BACK/i));
    expect(screen.getByText('AIRMAN KNOWLEDGE')).toBeInTheDocument();
  });

  it('shows BEGIN TRAINING on the last step', () => {
    render(<OnboardingModal />);
    fireEvent.click(screen.getByText(/NEXT →/i)); // step 2
    fireEvent.click(screen.getByText(/NEXT →/i)); // step 3
    fireEvent.click(screen.getByText(/NEXT →/i)); // step 4 (last)
    expect(screen.getByText(/BEGIN TRAINING →/i)).toBeInTheDocument();
  });

  it('dismisses and saves to localStorage on BEGIN TRAINING', () => {
    render(<OnboardingModal />);
    fireEvent.click(screen.getByText(/NEXT →/i));
    fireEvent.click(screen.getByText(/NEXT →/i));
    fireEvent.click(screen.getByText(/NEXT →/i));
    fireEvent.click(screen.getByText(/BEGIN TRAINING →/i));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(localStorage.getItem(ONBOARDED_KEY)).toBe('1');
  });

  it('dismisses immediately when SKIP is clicked', () => {
    render(<OnboardingModal />);
    fireEvent.click(screen.getByText('SKIP'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(localStorage.getItem(ONBOARDED_KEY)).toBe('1');
  });

  it('shows correct step count indicators', () => {
    render(<OnboardingModal />);
    // There should be 4 step dots rendered
    const stepDots = screen.getByRole('dialog').querySelectorAll('[style*="border-radius: 3px"]');
    expect(stepDots).toHaveLength(4);
  });
});
