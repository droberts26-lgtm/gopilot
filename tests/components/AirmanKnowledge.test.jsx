import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import AirmanKnowledge from '@/components/AirmanKnowledge';

// NOTE: react-pdf and next/dynamic are mocked in tests/setup.js

describe('AirmanKnowledge', () => {
  // ─── Menu screen ───────────────────────────────────────────────────────────

  describe('menu screen', () => {
    it('renders the menu by default', () => {
      render(<AirmanKnowledge />);
      expect(screen.getByText(/FAA PRIVATE PILOT KNOWLEDGE TEST/i)).toBeInTheDocument();
    });

    it('shows Full Test and Quick Practice options', () => {
      render(<AirmanKnowledge />);
      expect(screen.getByText(/FULL TEST/i)).toBeInTheDocument();
      expect(screen.getByText(/QUICK PRACTICE/i)).toBeInTheDocument();
    });

    it('shows the total question count stats', () => {
      render(<AirmanKnowledge />);
      expect(screen.getByText('61')).toBeInTheDocument();
    });
  });

  // ─── Starting a quiz ───────────────────────────────────────────────────────

  describe('starting a quiz', () => {
    it('transitions to the quiz screen when Full Test is clicked', () => {
      render(<AirmanKnowledge />);
      fireEvent.click(screen.getByText(/FULL TEST/i));
      expect(screen.getByText(/AIRMAN KNOWLEDGE/i)).toBeInTheDocument();
      expect(screen.getByText(/QUESTION 1/i)).toBeInTheDocument();
    });

    it('transitions to the quiz screen when Quick Practice is clicked', () => {
      render(<AirmanKnowledge />);
      fireEvent.click(screen.getByText(/QUICK PRACTICE/i));
      expect(screen.getByText(/QUESTION 1/i)).toBeInTheDocument();
    });

    it('shows Q 1 / N in the progress indicator', () => {
      render(<AirmanKnowledge />);
      fireEvent.click(screen.getByText(/QUICK PRACTICE/i));
      expect(screen.getByText(/Q 1 \/ 10/i)).toBeInTheDocument();
    });

    it('full test shows Q 1 / 61', () => {
      render(<AirmanKnowledge />);
      fireEvent.click(screen.getByText(/FULL TEST/i));
      expect(screen.getByText(/Q 1 \/ 61/i)).toBeInTheDocument();
    });

    it('renders answer options A, B, C on first question', () => {
      render(<AirmanKnowledge />);
      fireEvent.click(screen.getByText(/QUICK PRACTICE/i));
      expect(screen.getByText(/^A\./)).toBeInTheDocument();
      expect(screen.getByText(/^B\./)).toBeInTheDocument();
      expect(screen.getByText(/^C\./)).toBeInTheDocument();
    });
  });

  // ─── Answering questions ───────────────────────────────────────────────────

  describe('answering questions', () => {
    const startQuickPractice = () => {
      const utils = render(<AirmanKnowledge />);
      fireEvent.click(screen.getByText(/QUICK PRACTICE/i));
      return utils;
    };

    it('shows the explanation after any answer is selected', () => {
      startQuickPractice();
      const firstOption = screen.getAllByRole('button').find(b => /^[ABC]\./.test(b.textContent));
      fireEvent.click(firstOption);
      expect(screen.getByText(/WHY THIS ANSWER/i)).toBeInTheDocument();
    });

    it('disables all options after selection', () => {
      startQuickPractice();
      const optionButtons = screen.getAllByRole('button').filter(b => /^[ABC]\./.test(b.textContent));
      fireEvent.click(optionButtons[0]);
      optionButtons.forEach(btn => {
        expect(btn).toBeDisabled();
      });
    });

    it('shows the NEXT QUESTION button after answering', () => {
      startQuickPractice();
      const firstOption = screen.getAllByRole('button').find(b => /^[ABC]\./.test(b.textContent));
      fireEvent.click(firstOption);
      expect(screen.getByText(/NEXT QUESTION/i)).toBeInTheDocument();
    });

    it('advances to question 2 after clicking Next', () => {
      startQuickPractice();
      const firstOption = screen.getAllByRole('button').find(b => /^[ABC]\./.test(b.textContent));
      fireEvent.click(firstOption);
      fireEvent.click(screen.getByText(/NEXT QUESTION/i));
      expect(screen.getByText(/Q 2 \/ 10/i)).toBeInTheDocument();
    });

    it('does not allow answering the same question twice', () => {
      startQuickPractice();
      const optionButtons = screen.getAllByRole('button').filter(b => /^[ABC]\./.test(b.textContent));
      fireEvent.click(optionButtons[0]);
      // Try to click another option — it should be disabled
      expect(optionButtons[1]).toBeDisabled();
    });

    it('shows VIEW RESULTS on the last question', () => {
      render(<AirmanKnowledge />);
      fireEvent.click(screen.getByText(/QUICK PRACTICE/i));

      // Answer all 10 questions
      for (let i = 0; i < 9; i++) {
        const optButtons = screen.getAllByRole('button').filter(b => /^[ABC]\./.test(b.textContent));
        fireEvent.click(optButtons[0]);
        fireEvent.click(screen.getByText(/NEXT QUESTION/i));
      }

      // On the last question, answer it
      const optButtons = screen.getAllByRole('button').filter(b => /^[ABC]\./.test(b.textContent));
      fireEvent.click(optButtons[0]);
      expect(screen.getByText(/VIEW RESULTS/i)).toBeInTheDocument();
    });
  });

  // ─── Results screen ────────────────────────────────────────────────────────

  describe('results screen', () => {
    const completeQuickPractice = () => {
      render(<AirmanKnowledge />);
      fireEvent.click(screen.getByText(/QUICK PRACTICE/i));
      for (let i = 0; i < 10; i++) {
        const optButtons = screen.getAllByRole('button').filter(b => /^[ABC]\./.test(b.textContent));
        fireEvent.click(optButtons[0]);
        const next = screen.queryByText(/NEXT QUESTION/i) || screen.queryByText(/VIEW RESULTS/i);
        if (next) fireEvent.click(next);
      }
    };

    it('shows TEST COMPLETE on results screen', () => {
      completeQuickPractice();
      expect(screen.getByText(/TEST COMPLETE/i)).toBeInTheDocument();
    });

    it('shows RETAKE TEST and BACK TO MENU buttons', () => {
      completeQuickPractice();
      expect(screen.getByText(/RETAKE TEST/i)).toBeInTheDocument();
      expect(screen.getByText(/BACK TO MENU/i)).toBeInTheDocument();
    });

    it('returns to menu when BACK TO MENU is clicked', () => {
      completeQuickPractice();
      fireEvent.click(screen.getByText(/BACK TO MENU/i));
      expect(screen.getByText(/FAA PRIVATE PILOT KNOWLEDGE TEST/i)).toBeInTheDocument();
    });

    it('restarts quiz when RETAKE TEST is clicked', () => {
      completeQuickPractice();
      fireEvent.click(screen.getByText(/RETAKE TEST/i));
      expect(screen.getByText(/QUESTION 1/i)).toBeInTheDocument();
    });

    it('shows accuracy percentage in the score grid', () => {
      completeQuickPractice();
      // The results screen renders accuracy as "XX%" in the score breakdown grid.
      // Multiple elements may contain "%" (heading + grid cell), so use getAllBy.
      const pctEls = screen.getAllByText(/%/);
      expect(pctEls.length).toBeGreaterThanOrEqual(1);
      // At least one element should be a standalone "XX%" value
      const accuracyEl = pctEls.find(el => /^\d+%$/.test(el.textContent.trim()));
      expect(accuracyEl).toBeDefined();
    });
  });

  // ─── Navigation ───────────────────────────────────────────────────────────

  describe('back navigation', () => {
    it('returns to menu from quiz via ← MENU button', () => {
      render(<AirmanKnowledge />);
      fireEvent.click(screen.getByText(/QUICK PRACTICE/i));
      fireEvent.click(screen.getByText(/← MENU/i));
      expect(screen.getByText(/FAA PRIVATE PILOT KNOWLEDGE TEST/i)).toBeInTheDocument();
    });
  });
});
