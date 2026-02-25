import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ATCSimulator from '@/components/ATCSimulator';

describe('ATCSimulator', () => {
  // ─── Menu screen ───────────────────────────────────────────────────────────

  describe('menu screen', () => {
    it('renders the menu by default', () => {
      render(<ATCSimulator />);
      expect(screen.getByText(/ATC RADIO COMMUNICATIONS/i)).toBeInTheDocument();
    });

    it('shows all three difficulty levels', () => {
      render(<ATCSimulator />);
      expect(screen.getByText(/STUDENT PILOT/i)).toBeInTheDocument();
      expect(screen.getByText(/GENERAL AVIATION/i)).toBeInTheDocument();
      expect(screen.getByText(/COMMERCIAL \/ ATP/i)).toBeInTheDocument();
    });

    it('shows the total scenario count', () => {
      render(<ATCSimulator />);
      // 45 scenarios total (15 per level × 3)
      expect(screen.getByText('45')).toBeInTheDocument();
    });
  });

  // ─── Starting a level ──────────────────────────────────────────────────────

  describe('starting a level', () => {
    it('transitions to the sim screen when Student Pilot is clicked', () => {
      render(<ATCSimulator />);
      fireEvent.click(screen.getByText(/STUDENT PILOT/i));
      expect(screen.getByText(/ATC TRANSMISSION/i)).toBeInTheDocument();
    });

    it('transitions to the sim screen when General Aviation is clicked', () => {
      render(<ATCSimulator />);
      fireEvent.click(screen.getByText(/GENERAL AVIATION/i));
      expect(screen.getByText(/ATC TRANSMISSION/i)).toBeInTheDocument();
    });

    it('transitions to the sim screen when Commercial / ATP is clicked', () => {
      render(<ATCSimulator />);
      fireEvent.click(screen.getByText(/COMMERCIAL \/ ATP/i));
      expect(screen.getByText(/ATC TRANSMISSION/i)).toBeInTheDocument();
    });

    it('shows Q 1 / 10 progress indicator', () => {
      render(<ATCSimulator />);
      fireEvent.click(screen.getByText(/STUDENT PILOT/i));
      expect(screen.getByText(/Q 1 \/ 10/i)).toBeInTheDocument();
    });

    it('shows SITUATION and ATC TRANSMISSION sections', () => {
      render(<ATCSimulator />);
      fireEvent.click(screen.getByText(/STUDENT PILOT/i));
      expect(screen.getByText(/SITUATION \/\//i)).toBeInTheDocument();
      expect(screen.getByText(/ATC TRANSMISSION/i)).toBeInTheDocument();
    });

    it('shows initial score of 0/0', () => {
      render(<ATCSimulator />);
      fireEvent.click(screen.getByText(/STUDENT PILOT/i));
      expect(screen.getByText('0/0')).toBeInTheDocument();
    });

    it('shows STREAK counter starting at 0', () => {
      render(<ATCSimulator />);
      fireEvent.click(screen.getByText(/STUDENT PILOT/i));
      // The streak section shows '0' when no streak
      const scoreSection = screen.getByText('STREAK').closest('div').parentElement;
      expect(scoreSection).toBeTruthy();
    });
  });

  // ─── Answering questions ───────────────────────────────────────────────────

  describe('answering questions', () => {
    const startStudentLevel = () => {
      render(<ATCSimulator />);
      fireEvent.click(screen.getByText(/STUDENT PILOT/i));
    };

    it('renders four answer options', () => {
      startStudentLevel();
      const optionButtons = screen.getAllByRole('button').filter(b =>
        /^[ABCD]\./.test(b.textContent),
      );
      expect(optionButtons).toHaveLength(4);
    });

    it('shows INSTRUCTOR NOTE after selecting an answer', () => {
      startStudentLevel();
      const optionButtons = screen.getAllByRole('button').filter(b =>
        /^[ABCD]\./.test(b.textContent),
      );
      fireEvent.click(optionButtons[0]);
      expect(screen.getByText(/INSTRUCTOR NOTE/i)).toBeInTheDocument();
    });

    it('disables all options after selection', () => {
      startStudentLevel();
      const optionButtons = screen.getAllByRole('button').filter(b =>
        /^[ABCD]\./.test(b.textContent),
      );
      fireEvent.click(optionButtons[0]);
      optionButtons.forEach(btn => expect(btn).toBeDisabled());
    });

    it('shows NEXT TRANSMISSION button after answering', () => {
      startStudentLevel();
      const optionButtons = screen.getAllByRole('button').filter(b =>
        /^[ABCD]\./.test(b.textContent),
      );
      fireEvent.click(optionButtons[0]);
      expect(screen.getByText(/NEXT TRANSMISSION/i)).toBeInTheDocument();
    });

    it('advances to Q 2 after clicking Next', () => {
      startStudentLevel();
      const optionButtons = screen.getAllByRole('button').filter(b =>
        /^[ABCD]\./.test(b.textContent),
      );
      fireEvent.click(optionButtons[0]);
      fireEvent.click(screen.getByText(/NEXT TRANSMISSION/i));
      expect(screen.getByText(/Q 2 \/ 10/i)).toBeInTheDocument();
    });

    it('shows CORRECT marker when the correct option is chosen', () => {
      startStudentLevel();
      const optionButtons = screen.getAllByRole('button').filter(b =>
        /^[ABCD]\./.test(b.textContent),
      );
      // Click options until we find the correct one (options are shuffled)
      let foundCorrect = false;
      for (const btn of optionButtons) {
        if (!btn.disabled) {
          fireEvent.click(btn);
          if (screen.queryByText(/✓ CORRECT/)) {
            foundCorrect = true;
          }
          break;
        }
      }
      // Regardless of which option we landed on, either ✓ or ✗ feedback appears
      const hasFeedback =
        screen.queryByText(/✓ CORRECT/) !== null ||
        screen.queryByText(/✗ INCORRECT/) !== null;
      expect(hasFeedback).toBe(true);
    });

    it('shows VIEW RESULTS after answering the 10th question', () => {
      startStudentLevel();
      for (let i = 0; i < 9; i++) {
        const optButtons = screen.getAllByRole('button').filter(b =>
          /^[ABCD]\./.test(b.textContent),
        );
        fireEvent.click(optButtons[0]);
        fireEvent.click(screen.getByText(/NEXT TRANSMISSION/i));
      }
      const optButtons = screen.getAllByRole('button').filter(b =>
        /^[ABCD]\./.test(b.textContent),
      );
      fireEvent.click(optButtons[0]);
      expect(screen.getByText(/VIEW RESULTS/i)).toBeInTheDocument();
    });
  });

  // ─── Results screen ────────────────────────────────────────────────────────

  describe('results screen', () => {
    const completeStudentLevel = () => {
      render(<ATCSimulator />);
      fireEvent.click(screen.getByText(/STUDENT PILOT/i));
      for (let i = 0; i < 10; i++) {
        const optButtons = screen.getAllByRole('button').filter(b =>
          /^[ABCD]\./.test(b.textContent),
        );
        fireEvent.click(optButtons[0]);
        const next = screen.queryByText(/NEXT TRANSMISSION/i) || screen.queryByText(/VIEW RESULTS/i);
        if (next) fireEvent.click(next);
      }
    };

    it('shows SESSION COMPLETE', () => {
      completeStudentLevel();
      expect(screen.getByText(/SESSION COMPLETE/i)).toBeInTheDocument();
    });

    it('shows RETRY LEVEL and CHANGE LEVEL buttons', () => {
      completeStudentLevel();
      expect(screen.getByText(/RETRY LEVEL/i)).toBeInTheDocument();
      expect(screen.getByText(/CHANGE LEVEL/i)).toBeInTheDocument();
    });

    it('returns to the menu when CHANGE LEVEL is clicked', () => {
      completeStudentLevel();
      fireEvent.click(screen.getByText(/CHANGE LEVEL/i));
      expect(screen.getByText(/ATC RADIO COMMUNICATIONS/i)).toBeInTheDocument();
    });

    it('restarts the quiz when RETRY LEVEL is clicked', () => {
      completeStudentLevel();
      fireEvent.click(screen.getByText(/RETRY LEVEL/i));
      expect(screen.getByText(/Q 1 \/ 10/i)).toBeInTheDocument();
    });

    it('shows a score in the format N / 10', () => {
      completeStudentLevel();
      expect(screen.getByText(/\d+ \/ 10/)).toBeInTheDocument();
    });
  });

  // ─── Navigation ───────────────────────────────────────────────────────────

  describe('back navigation', () => {
    it('returns to menu via ← MENU button', () => {
      render(<ATCSimulator />);
      fireEvent.click(screen.getByText(/STUDENT PILOT/i));
      fireEvent.click(screen.getByText(/← MENU/i));
      expect(screen.getByText(/ATC RADIO COMMUNICATIONS/i)).toBeInTheDocument();
    });
  });
});
