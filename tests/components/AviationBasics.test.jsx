import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AviationBasics from '@/components/AviationBasics';

// ─── Mock ─────────────────────────────────────────────────────────────────────
// Use a minimal 2-topic, 2-slide-each dataset so tests don't rely on real content.

vi.mock('@/data/aviationLessons', () => ({
  aviationTopics: [
    {
      id: 'alpha',
      title: 'Alpha Topic',
      icon: '✈',
      color: '#38bdf8',
      description: 'First topic description.',
      slides: [
        {
          title: 'Alpha Slide One',
          body: 'Body text for alpha slide one.',
          imageUrl: 'https://example.com/img1.jpg',
          imageAlt: 'Image one',
          imageCaption: 'Caption one',
        },
        {
          title: 'Alpha Slide Two',
          body: 'Body text for alpha slide two.',
          imageUrl: 'https://example.com/img2.jpg',
          imageAlt: 'Image two',
          imageCaption: 'Caption two',
        },
      ],
    },
    {
      id: 'bravo',
      title: 'Bravo Topic',
      icon: '🛩️',
      color: '#f97316',
      description: 'Second topic description.',
      slides: [
        {
          title: 'Bravo Slide One',
          body: 'Body text for bravo slide one.',
          imageUrl: 'https://example.com/img3.jpg',
          imageAlt: 'Image three',
          imageCaption: 'Caption three',
        },
        {
          title: 'Bravo Slide Two',
          body: 'Body text for bravo slide two.',
          imageUrl: 'https://example.com/img4.jpg',
          imageAlt: 'Image four',
          imageCaption: 'Caption four',
        },
      ],
    },
  ],
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AviationBasics', () => {

  describe('topic grid (initial view)', () => {
    it('renders the AVIATION FUNDAMENTALS heading', () => {
      render(<AviationBasics />);
      expect(screen.getByText(/AVIATION FUNDAMENTALS/i)).toBeInTheDocument();
    });

    it('shows a card for every topic', () => {
      render(<AviationBasics />);
      expect(screen.getByText(/Alpha Topic/i)).toBeInTheDocument();
      expect(screen.getByText(/Bravo Topic/i)).toBeInTheDocument();
    });

    it('shows each topic description', () => {
      render(<AviationBasics />);
      expect(screen.getByText('First topic description.')).toBeInTheDocument();
      expect(screen.getByText('Second topic description.')).toBeInTheDocument();
    });

    it('shows the slide count for each topic', () => {
      render(<AviationBasics />);
      // Both topics have 2 slides each — "2 SLIDES ›" appears twice
      const slideLabels = screen.getAllByText(/2 SLIDES/i);
      expect(slideLabels).toHaveLength(2);
    });

    it('does not show slideshow controls on the grid screen', () => {
      render(<AviationBasics />);
      expect(screen.queryByText(/← PREV/i)).toBeNull();
      expect(screen.queryByText(/NEXT →/i)).toBeNull();
    });
  });

  describe('entering a topic', () => {
    it('transitions to the slideshow when a topic card is clicked', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      expect(screen.getByText('Alpha Slide One')).toBeInTheDocument();
    });

    it('shows the topic title in the slideshow header', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      // Header shows topic title (uppercase)
      expect(screen.getByText(/ALPHA TOPIC/i)).toBeInTheDocument();
    });

    it('shows SLIDE 1 OF 2 on the first slide', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      expect(screen.getByText(/SLIDE 1 OF 2/i)).toBeInTheDocument();
    });

    it('shows the slide body text', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      expect(screen.getByText('Body text for alpha slide one.')).toBeInTheDocument();
    });

    it('shows the image caption', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      expect(screen.getByText('Caption one')).toBeInTheDocument();
    });

    it('renders a ← TOPICS back button', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      expect(screen.getByText(/← TOPICS/i)).toBeInTheDocument();
    });
  });

  describe('slideshow navigation', () => {
    const enterAlpha = () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
    };

    it('PREV button is disabled on the first slide', () => {
      enterAlpha();
      expect(screen.getByText(/← PREV/i)).toBeDisabled();
    });

    it('NEXT button is enabled on the first slide', () => {
      enterAlpha();
      expect(screen.getByText(/NEXT →/i)).not.toBeDisabled();
    });

    it('clicking NEXT advances to the next slide', () => {
      enterAlpha();
      fireEvent.click(screen.getByText(/NEXT →/i));
      expect(screen.getByText('Alpha Slide Two')).toBeInTheDocument();
    });

    it('shows SLIDE 2 OF 2 after clicking NEXT', () => {
      enterAlpha();
      fireEvent.click(screen.getByText(/NEXT →/i));
      expect(screen.getByText(/SLIDE 2 OF 2/i)).toBeInTheDocument();
    });

    it('shows FINISH ✓ on the last slide instead of NEXT →', () => {
      enterAlpha();
      fireEvent.click(screen.getByText(/NEXT →/i));
      expect(screen.getByText(/FINISH/i)).toBeInTheDocument();
      expect(screen.queryByText(/NEXT →/i)).toBeNull();
    });

    it('PREV is enabled after advancing to slide 2', () => {
      enterAlpha();
      fireEvent.click(screen.getByText(/NEXT →/i));
      expect(screen.getByText(/← PREV/i)).not.toBeDisabled();
    });

    it('clicking PREV goes back to slide 1', () => {
      enterAlpha();
      fireEvent.click(screen.getByText(/NEXT →/i));
      fireEvent.click(screen.getByText(/← PREV/i));
      expect(screen.getByText('Alpha Slide One')).toBeInTheDocument();
    });

    it('renders the correct number of progress dots', () => {
      enterAlpha();
      // 2 slides → 2 dots (aria-label "Go to slide N")
      const dots = screen.getAllByRole('button', { name: /Go to slide/i });
      expect(dots).toHaveLength(2);
    });

    it('clicking a progress dot jumps to that slide', () => {
      enterAlpha();
      const dot2 = screen.getByRole('button', { name: /Go to slide 2/i });
      fireEvent.click(dot2);
      expect(screen.getByText('Alpha Slide Two')).toBeInTheDocument();
    });
  });

  describe('image lightbox', () => {
    it('clicking the slide image opens the lightbox', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByAltText('Image one'));
      expect(screen.getByRole('button', { name: /Close lightbox/i })).toBeInTheDocument();
    });

    it('clicking the close button dismisses the lightbox', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByAltText('Image one'));
      fireEvent.click(screen.getByRole('button', { name: /Close lightbox/i }));
      expect(screen.queryByRole('button', { name: /Close lightbox/i })).toBeNull();
    });

    it('pressing Escape dismisses the lightbox', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByAltText('Image one'));
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('button', { name: /Close lightbox/i })).toBeNull();
    });

    it('navigating to the next slide closes the lightbox', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByAltText('Image one'));
      fireEvent.click(screen.getByText(/NEXT →/i));
      expect(screen.queryByRole('button', { name: /Close lightbox/i })).toBeNull();
    });

    it('lightbox shows zoom percentage starting at 100%', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByAltText('Image one'));
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('zoom in button increases the zoom percentage', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByAltText('Image one'));
      fireEvent.click(screen.getByRole('button', { name: /Zoom in/i }));
      expect(screen.getByText('150%')).toBeInTheDocument();
    });

    it('zoom out button decreases the zoom percentage', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByAltText('Image one'));
      fireEvent.click(screen.getByRole('button', { name: /Zoom in/i }));
      fireEvent.click(screen.getByRole('button', { name: /Zoom out/i }));
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('zoom resets to 100% when lightbox is closed and reopened', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByAltText('Image one'));
      fireEvent.click(screen.getByRole('button', { name: /Zoom in/i })); // 150%
      fireEvent.click(screen.getByRole('button', { name: /Close lightbox/i }));
      // After closing, only one image with this alt remains
      fireEvent.click(screen.getByAltText('Image one'));
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('navigation back to topic grid', () => {
    it('clicking ← TOPICS returns to the topic grid', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByText(/← TOPICS/i));
      expect(screen.getByText(/AVIATION FUNDAMENTALS/i)).toBeInTheDocument();
    });

    it('clicking FINISH on the last slide returns to the topic grid', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByText(/NEXT →/i));   // go to slide 2
      fireEvent.click(screen.getByText(/FINISH/i));     // finish
      expect(screen.getByText(/AVIATION FUNDAMENTALS/i)).toBeInTheDocument();
    });

    it('after returning, the second topic card is still visible', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByText(/← TOPICS/i));
      expect(screen.getByText(/Bravo Topic/i)).toBeInTheDocument();
    });

    it('can enter a different topic after returning', () => {
      render(<AviationBasics />);
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByText(/← TOPICS/i));
      fireEvent.click(screen.getByText(/Bravo Topic/i));
      expect(screen.getByText('Bravo Slide One')).toBeInTheDocument();
    });

    it('slide index resets to 1 when re-entering a topic', () => {
      render(<AviationBasics />);
      // Enter alpha, go to slide 2
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      fireEvent.click(screen.getByText(/NEXT →/i));
      // Go back to grid, re-enter alpha
      fireEvent.click(screen.getByText(/← TOPICS/i));
      fireEvent.click(screen.getByText(/Alpha Topic/i));
      expect(screen.getByText(/SLIDE 1 OF 2/i)).toBeInTheDocument();
    });
  });
});
