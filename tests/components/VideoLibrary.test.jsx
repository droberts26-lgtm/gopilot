import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoLibrary from '@/components/VideoLibrary';

// ─── Mock ─────────────────────────────────────────────────────────────────────
// 2-topic dataset: each topic has 4 videos so we can test free (0-1) vs locked (2-3).

vi.mock('@/data/videoLibrary', () => ({
  TOTAL_VIDEOS: 8,
  VIDEO_TOPICS: [
    {
      id: 'weather-basics', // in POPULAR_TOPICS
      title: 'Weather Fundamentals',
      icon: '🌤️',
      acsArea: 'PA.I.C',
      desc: 'Atmosphere, clouds, fog types',
      videos: [
        { id: 'AAA1111111A', title: 'Weather BASICS Explained' },
        { id: 'BBB2222222B', title: 'Air Masses and Fronts' },
        { id: 'CCC3333333C', title: 'Cloud Types — Pro Video' },
        { id: 'DDD4444444D', title: 'Fog Formation — Pro Video' },
      ],
    },
    {
      id: 'airspace', // in POPULAR_TOPICS
      title: 'National Airspace System',
      icon: '🗺️',
      acsArea: 'PA.I.E',
      desc: 'Classes A–G, VFR weather minimums',
      videos: [
        { id: 'EEE5555555E', title: 'Airspace Classes Explained' },
        { id: 'FFF6666666F', title: 'Special Use Airspace' },
        { id: 'GGG7777777G', title: 'VFR Minimums — Pro Video' },
        { id: 'HHH8888888H', title: 'TFRs Explained — Pro Video' },
      ],
    },
  ],
}));

// Mock ProModal so it renders a simple sentinel
vi.mock('@/components/ProModal', () => ({
  default: ({ onClose }) => (
    <div data-testid="pro-modal">
      <button onClick={onClose}>Close ProModal</button>
    </div>
  ),
}));

beforeEach(() => {
  localStorage.clear();
});

// ─── Topic grid ───────────────────────────────────────────────────────────────

describe('VideoLibrary', () => {
  describe('topic grid (initial screen)', () => {
    it('renders the section header', () => {
      render(<VideoLibrary />);
      expect(screen.getByText(/VIDEO STUDY GUIDES/i)).toBeInTheDocument();
    });

    it('shows total video count in header', () => {
      render(<VideoLibrary />);
      expect(screen.getByText('8 videos')).toBeInTheDocument();
    });

    it('shows total topic count in header', () => {
      render(<VideoLibrary />);
      expect(screen.getByText('2 topics')).toBeInTheDocument();
    });

    it('renders a card for each topic', () => {
      render(<VideoLibrary />);
      expect(screen.getByText('WEATHER FUNDAMENTALS')).toBeInTheDocument();
      expect(screen.getByText('NATIONAL AIRSPACE SYSTEM')).toBeInTheDocument();
    });

    it('shows video counts on topic cards', () => {
      render(<VideoLibrary />);
      const badges = screen.getAllByText(/4 VIDEOS/i);
      expect(badges).toHaveLength(2);
    });

    it('shows topic descriptions on cards', () => {
      render(<VideoLibrary />);
      expect(screen.getByText('Atmosphere, clouds, fog types')).toBeInTheDocument();
    });

    it('shows POPULAR badge on popular topics', () => {
      render(<VideoLibrary />);
      const badges = screen.getAllByText(/★ POPULAR/i);
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Navigation into a topic ─────────────────────────────────────────────────

  describe('navigating into a topic', () => {
    it('entering a topic hides the grid header and shows topic title', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      expect(screen.queryByText(/VIDEO STUDY GUIDES/i)).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /WEATHER FUNDAMENTALS/i })).toBeInTheDocument();
    });

    it('shows the back button after entering a topic', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      expect(screen.getByText(/← ALL TOPICS/i)).toBeInTheDocument();
    });

    it('renders free video cards with WATCH button', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      expect(screen.getByText('Weather BASICS Explained')).toBeInTheDocument();
      expect(screen.getByText('Air Masses and Fronts')).toBeInTheDocument();
      const watchBtns = screen.getAllByText(/▶ WATCH/i);
      expect(watchBtns).toHaveLength(2);
    });

    it('renders thumbnails with correct YouTube URLs for free videos', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const imgs = screen.getAllByRole('img');
      const srcs = imgs.map(img => img.src);
      expect(srcs.some(s => s.includes('AAA1111111A'))).toBe(true);
      expect(srcs.some(s => s.includes('BBB2222222B'))).toBe(true);
    });
  });

  // ─── Pro gating ───────────────────────────────────────────────────────────────

  describe('pro gating', () => {
    it('locks videos after index 1 when pro=false', () => {
      render(<VideoLibrary pro={false} />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      expect(screen.getAllByText(/▶ WATCH/i)).toHaveLength(2);
      expect(screen.getAllByText(/🔒 UNLOCK PRO/i)).toHaveLength(2);
    });

    it('locked cards show PRO VIDEO label', () => {
      render(<VideoLibrary pro={false} />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      // Each locked card renders "PRO VIDEO" — parent + child elements both match the regex
      const proLabels = screen.getAllByText(/PRO VIDEO/i);
      expect(proLabels.length).toBeGreaterThanOrEqual(2);
    });

    it('shows all WATCH buttons when pro=true', () => {
      render(<VideoLibrary pro={true} />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const watchBtns = screen.getAllByText(/▶ WATCH/i);
      expect(watchBtns).toHaveLength(4);
      expect(screen.queryByText(/🔒 UNLOCK PRO/i)).not.toBeInTheDocument();
    });

    it('shows no locked cards while proLoading=true', () => {
      render(<VideoLibrary pro={false} proLoading={true} />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      expect(screen.queryByText(/🔒 UNLOCK PRO/i)).not.toBeInTheDocument();
    });

    it('clicking UNLOCK PRO on a locked card opens ProModal', () => {
      render(<VideoLibrary pro={false} />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const unlockBtns = screen.getAllByText(/🔒 UNLOCK PRO/i);
      fireEvent.click(unlockBtns[0]);
      expect(screen.getByTestId('pro-modal')).toBeInTheDocument();
    });

    it('ProModal can be closed', () => {
      render(<VideoLibrary pro={false} />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const unlockBtns = screen.getAllByText(/🔒 UNLOCK PRO/i);
      fireEvent.click(unlockBtns[0]);
      fireEvent.click(screen.getByText('Close ProModal'));
      expect(screen.queryByTestId('pro-modal')).not.toBeInTheDocument();
    });
  });

  // ─── Back navigation ──────────────────────────────────────────────────────────

  describe('back navigation', () => {
    it('clicking ← ALL TOPICS returns to the grid', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      fireEvent.click(screen.getByText(/← ALL TOPICS/i));
      expect(screen.getByText(/VIDEO STUDY GUIDES/i)).toBeInTheDocument();
      expect(screen.getByText('NATIONAL AIRSPACE SYSTEM')).toBeInTheDocument();
    });

    it('grid shows both topic cards again after going back', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('NATIONAL AIRSPACE SYSTEM'));
      fireEvent.click(screen.getByText(/← ALL TOPICS/i));
      const cards = screen.getAllByText(/4 VIDEOS/i);
      expect(cards).toHaveLength(2);
    });
  });

  // ─── Video player modal ───────────────────────────────────────────────────────

  describe('video player modal', () => {
    it('no modal is rendered on initial load', () => {
      render(<VideoLibrary />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('clicking WATCH opens the player modal', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const watchBtns = screen.getAllByText(/▶ WATCH/i);
      fireEvent.click(watchBtns[0]);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('modal contains an iframe with the correct video ID', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const watchBtns = screen.getAllByText(/▶ WATCH/i);
      fireEvent.click(watchBtns[0]);
      const iframe = screen.getByTitle('Weather BASICS Explained');
      expect(iframe.src).toContain('AAA1111111A');
    });

    it('clicking ✕ CLOSE closes the modal', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const watchBtns = screen.getAllByText(/▶ WATCH/i);
      fireEvent.click(watchBtns[0]);
      fireEvent.click(screen.getByText(/✕ CLOSE/i));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('clicking the overlay (outside the player) closes the modal', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const watchBtns = screen.getAllByText(/▶ WATCH/i);
      fireEvent.click(watchBtns[0]);
      const overlay = screen.getByRole('dialog');
      fireEvent.click(overlay);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('modal shows the video title', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const watchBtns = screen.getAllByText(/▶ WATCH/i);
      fireEvent.click(watchBtns[0]);
      const modal = screen.getByRole('dialog');
      expect(modal.textContent).toContain('Weather BASICS Explained');
    });

    it('clicking play overlay on thumbnail also opens the modal', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const playOverlay = screen.getByLabelText('Play: Weather BASICS Explained');
      fireEvent.click(playOverlay);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('shows upsell strip in player for non-pro users', () => {
      render(<VideoLibrary pro={false} />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      fireEvent.click(screen.getAllByText(/▶ WATCH/i)[0]);
      expect(screen.getByRole('dialog').textContent).toMatch(/UNLOCK PRO/i);
    });

    it('does not show upsell strip in player for pro users', () => {
      render(<VideoLibrary pro={true} />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      fireEvent.click(screen.getAllByText(/▶ WATCH/i)[0]);
      // Dialog should exist but have no UNLOCK PRO strip (only the title + close)
      const dialog = screen.getByRole('dialog');
      expect(dialog.textContent).not.toMatch(/UNLOCK PRO/i);
    });

    it('can navigate between topics and open different videos', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      fireEvent.click(screen.getAllByText(/▶ WATCH/i)[0]);
      expect(screen.getByTitle('Weather BASICS Explained')).toBeInTheDocument();
      fireEvent.click(screen.getByText(/✕ CLOSE/i));

      fireEvent.click(screen.getByText(/← ALL TOPICS/i));
      fireEvent.click(screen.getByText('NATIONAL AIRSPACE SYSTEM'));
      fireEvent.click(screen.getAllByText(/▶ WATCH/i)[0]);
      expect(screen.getByTitle('Airspace Classes Explained')).toBeInTheDocument();
    });
  });

  // ─── Progress tracking ───────────────────────────────────────────────────────

  describe('progress tracking', () => {
    it('shows WATCHED badge after playing a video', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      fireEvent.click(screen.getAllByText(/▶ WATCH/i)[0]);
      fireEvent.click(screen.getByText(/✕ CLOSE/i));
      expect(screen.getByText(/✓ WATCHED/i)).toBeInTheDocument();
    });

    it('shows watched count on topic card after watching', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      fireEvent.click(screen.getAllByText(/▶ WATCH/i)[0]);
      fireEvent.click(screen.getByText(/✕ CLOSE/i));
      fireEvent.click(screen.getByText(/← ALL TOPICS/i));
      expect(screen.getByText(/1\/4 WATCHED/i)).toBeInTheDocument();
    });
  });
});
