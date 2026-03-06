import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoLibrary from '@/components/VideoLibrary';

// ─── Mock ─────────────────────────────────────────────────────────────────────
// Use a minimal 2-topic dataset so tests don't depend on real content.

vi.mock('@/data/videoLibrary', () => ({
  TOTAL_VIDEOS: 4,
  VIDEO_TOPICS: [
    {
      id: 'weather-basics',
      title: 'Weather Fundamentals',
      icon: '🌤️',
      acsArea: 'PA.I.C',
      desc: 'Atmosphere, clouds, fog types',
      videos: [
        { id: 'AAA1111111A', title: 'Weather BASICS Explained' },
        { id: 'BBB2222222B', title: 'Air Masses and Fronts' },
      ],
    },
    {
      id: 'airspace',
      title: 'National Airspace System',
      icon: '🗺️',
      acsArea: 'PA.I.E',
      desc: 'Classes A–G, VFR weather minimums',
      videos: [
        { id: 'CCC3333333C', title: 'Airspace Classes Explained' },
        { id: 'DDD4444444D', title: 'Special Use Airspace' },
      ],
    },
  ],
}));

// ─── Topic grid ───────────────────────────────────────────────────────────────

describe('VideoLibrary', () => {
  describe('topic grid (initial screen)', () => {
    it('renders the section header', () => {
      render(<VideoLibrary />);
      expect(screen.getByText(/VIDEO STUDY GUIDES/i)).toBeInTheDocument();
    });

    it('shows total video count in header', () => {
      render(<VideoLibrary />);
      expect(screen.getByText('4 videos')).toBeInTheDocument();
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
      const badges = screen.getAllByText(/2 VIDEOS/i);
      expect(badges).toHaveLength(2);
    });

    it('shows topic descriptions on cards', () => {
      render(<VideoLibrary />);
      expect(screen.getByText('Atmosphere, clouds, fog types')).toBeInTheDocument();
    });
  });

  // ─── Navigation into a topic ────────────────────────────────────────────────

  describe('navigating into a topic', () => {
    it('entering a topic hides the grid header and shows topic title', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      expect(screen.queryByText(/VIDEO STUDY GUIDES/i)).not.toBeInTheDocument();
      // Topic title is shown in heading (all-caps)
      expect(screen.getByRole('heading', { name: /WEATHER FUNDAMENTALS/i })).toBeInTheDocument();
    });

    it('shows the back button after entering a topic', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      expect(screen.getByText(/← ALL TOPICS/i)).toBeInTheDocument();
    });

    it('renders a card for each video in the topic', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      expect(screen.getByText('Weather BASICS Explained')).toBeInTheDocument();
      expect(screen.getByText('Air Masses and Fronts')).toBeInTheDocument();
    });

    it('renders thumbnails with correct YouTube URLs', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const imgs = screen.getAllByRole('img');
      expect(imgs[0].src).toContain('AAA1111111A');
      expect(imgs[1].src).toContain('BBB2222222B');
    });

    it('renders WATCH buttons for each video', () => {
      render(<VideoLibrary />);
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const watchBtns = screen.getAllByText(/▶ WATCH/i);
      expect(watchBtns).toHaveLength(2);
    });
  });

  // ─── Back navigation ────────────────────────────────────────────────────────

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
      const cards = screen.getAllByText(/2 VIDEOS/i);
      expect(cards).toHaveLength(2);
    });
  });

  // ─── Video player ────────────────────────────────────────────────────────────

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
      // Title is shown in the modal header
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

    it('can navigate between topics and open different videos', () => {
      render(<VideoLibrary />);
      // Open first topic, watch first video
      fireEvent.click(screen.getByText('WEATHER FUNDAMENTALS'));
      const watchBtns1 = screen.getAllByText(/▶ WATCH/i);
      fireEvent.click(watchBtns1[0]);
      expect(screen.getByTitle('Weather BASICS Explained')).toBeInTheDocument();
      fireEvent.click(screen.getByText(/✕ CLOSE/i));

      // Back to grid, go to second topic
      fireEvent.click(screen.getByText(/← ALL TOPICS/i));
      fireEvent.click(screen.getByText('NATIONAL AIRSPACE SYSTEM'));
      const watchBtns2 = screen.getAllByText(/▶ WATCH/i);
      fireEvent.click(watchBtns2[0]);
      expect(screen.getByTitle('Airspace Classes Explained')).toBeInTheDocument();
    });
  });
});
