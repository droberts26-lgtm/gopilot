import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SplashScreen from '@/components/SplashScreen';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SplashScreen', () => {
  afterEach(() => vi.useRealTimers());

  // ── Content ────────────────────────────────────────────────────────────────

  describe('content', () => {
    it('renders the GO wordmark', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText('GO')).toBeInTheDocument();
    });

    it('renders the PILOT wordmark', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText('PILOT')).toBeInTheDocument();
    });

    it('renders the tagline', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText(/AVIATION TRAINING SIMULATOR/i)).toBeInTheDocument();
    });

    it('renders a description paragraph', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText(/FAA Private Pilot written exam/i)).toBeInTheDocument();
    });

    it('shows the SYSTEMS ONLINE status', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText(/SYSTEMS ONLINE/i)).toBeInTheDocument();
    });
  });

  // ── Feature cards ──────────────────────────────────────────────────────────

  describe('feature cards', () => {
    it('renders the ATC COMMS feature card', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText('ATC COMMS')).toBeInTheDocument();
    });

    it('renders the AIRMAN KNOWLEDGE feature card', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText('AIRMAN KNOWLEDGE')).toBeInTheDocument();
    });

    it('renders the AVIATION BASICS feature card', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText('AVIATION BASICS')).toBeInTheDocument();
    });

    it('renders the VIDEOS feature card', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText('VIDEOS')).toBeInTheDocument();
    });

    it('renders all 4 feature card descriptions', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText(/radio phraseology drills/i)).toBeInTheDocument();
      expect(screen.getByText(/131 FAA exam questions/i)).toBeInTheDocument();
      expect(screen.getByText(/visual slideshows/i)).toBeInTheDocument();
      expect(screen.getAllByText(/46 curated/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── CTA button ────────────────────────────────────────────────────────────

  describe('CTA button', () => {
    it('renders the initialize training button', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByRole('button', { name: /INITIALIZE TRAINING/i })).toBeInTheDocument();
    });

    it('calls onEnter after clicking the button', () => {
      vi.useFakeTimers();
      const onEnter = vi.fn();
      render(<SplashScreen onEnter={onEnter} />);
      fireEvent.click(screen.getByRole('button', { name: /INITIALIZE TRAINING/i }));
      expect(onEnter).not.toHaveBeenCalled(); // not yet — fade-out delay
      vi.runAllTimers();
      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('does not call onEnter before the button is clicked', () => {
      const onEnter = vi.fn();
      render(<SplashScreen onEnter={onEnter} />);
      expect(onEnter).not.toHaveBeenCalled();
    });
  });

  // ── Footer ────────────────────────────────────────────────────────────────

  describe('footer', () => {
    it('renders the FAA AIM reference', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText('FAA AIM')).toBeInTheDocument();
    });

    it('renders the PRIVATE PILOT ACS reference', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText('PRIVATE PILOT ACS')).toBeInTheDocument();
    });

    it('renders the training-use-only disclaimer', () => {
      render(<SplashScreen onEnter={vi.fn()} />);
      expect(screen.getByText(/FOR STUDY USE ONLY/i)).toBeInTheDocument();
    });
  });
});
