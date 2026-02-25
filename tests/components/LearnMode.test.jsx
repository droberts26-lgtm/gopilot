import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LearnMode from '@/components/LearnMode';
import { MASTERY_THRESHOLD } from '@/lib/learn';

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Replace the 61-question bank with a single question so we can drive the
// mastery cycle in tests without 183 interactions.
vi.mock('@/data/parQuestions', () => ({
  parQuestions: [
    {
      id: 1,
      question: 'What is the minimum safe altitude over a congested area?',
      figures: [],
      options: [
        { letter: 'A', text: '500 ft above obstacles', correct: false },
        { letter: 'B', text: '1,000 ft above the highest obstacle', correct: true },
        { letter: 'C', text: '1,500 ft AGL', correct: false },
      ],
      explanation: 'FAR 91.119 requires 1,000 ft above the highest obstacle within 2,000 ft.',
      acsCode: 'PA.I.B.K1',
    },
  ],
  figurePdfPages: {},
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const noop = () => {};

const getOptionButtons = () =>
  screen.getAllByRole('button').filter(b => /^[ABC]\./.test(b.textContent));

/** Answer the current question and click CONTINUE. */
const answerAndContinue = (optionIdx = 0) => {
  const opts = getOptionButtons();
  fireEvent.click(opts[optionIdx]);
  fireEvent.click(screen.getByText(/CONTINUE/i));
};

/** Answer correctly (option B, index 1 is correct in mock) and continue. */
const answerCorrectlyAndContinue = () => answerAndContinue(1);

/** Master the single question by answering correctly MASTERY_THRESHOLD times. */
const masterAllQuestions = () => {
  for (let i = 0; i < MASTERY_THRESHOLD; i++) {
    answerCorrectlyAndContinue();
  }
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('LearnMode', () => {
  describe('initial render', () => {
    it('shows the ← MENU button', () => {
      render(<LearnMode onBack={noop} />);
      expect(screen.getByText(/← MENU/i)).toBeInTheDocument();
    });

    it('shows the mastered counter starting at 0 / 1', () => {
      render(<LearnMode onBack={noop} />);
      expect(screen.getByText('0 / 1')).toBeInTheDocument();
    });

    it('shows LEARN MODE label', () => {
      render(<LearnMode onBack={noop} />);
      expect(screen.getByText(/LEARN MODE/i)).toBeInTheDocument();
    });

    it('renders the question text', () => {
      render(<LearnMode onBack={noop} />);
      expect(screen.getByText(/minimum safe altitude/i)).toBeInTheDocument();
    });

    it('renders answer options A, B, C', () => {
      render(<LearnMode onBack={noop} />);
      expect(screen.getByText(/^A\./)).toBeInTheDocument();
      expect(screen.getByText(/^B\./)).toBeInTheDocument();
      expect(screen.getByText(/^C\./)).toBeInTheDocument();
    });

    it('does not show CONTINUE button before answering', () => {
      render(<LearnMode onBack={noop} />);
      expect(screen.queryByText(/CONTINUE/i)).toBeNull();
    });
  });

  describe('answering a question', () => {
    it('shows the explanation after selecting an answer', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(getOptionButtons()[0]);
      expect(screen.getByText(/EXPLANATION/i)).toBeInTheDocument();
    });

    it('disables all options after selection', () => {
      render(<LearnMode onBack={noop} />);
      const opts = getOptionButtons();
      fireEvent.click(opts[0]);
      opts.forEach(btn => expect(btn).toBeDisabled());
    });

    it('shows CONTINUE button after answering', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(getOptionButtons()[0]);
      expect(screen.getByText(/CONTINUE/i)).toBeInTheDocument();
    });

    it('shows ✓ WELL DONE header on correct answer', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(getOptionButtons()[1]); // B is correct
      expect(screen.getByText(/WELL DONE/i)).toBeInTheDocument();
    });

    it('shows ✗ INCORRECT header on wrong answer', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(getOptionButtons()[0]); // A is wrong
      // Multiple elements may contain "INCORRECT" (button indicator + panel header)
      expect(screen.getAllByText(/INCORRECT/i).length).toBeGreaterThan(0);
    });
  });

  describe('after clicking CONTINUE', () => {
    it('clears the selected state so options become enabled again', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(getOptionButtons()[0]);
      fireEvent.click(screen.getByText(/CONTINUE/i));
      const opts = getOptionButtons();
      opts.forEach(btn => expect(btn).not.toBeDisabled());
    });

    it('hides the CONTINUE button after continuing', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(getOptionButtons()[0]);
      fireEvent.click(screen.getByText(/CONTINUE/i));
      expect(screen.queryByText(/CONTINUE/i)).toBeNull();
    });

    it('increments mastered count after mastering the question', () => {
      render(<LearnMode onBack={noop} />);
      for (let i = 0; i < MASTERY_THRESHOLD - 1; i++) {
        answerCorrectlyAndContinue();
      }
      // After MASTERY_THRESHOLD - 1 correct answers, mastered is still 0
      expect(screen.getByText('0 / 1')).toBeInTheDocument();
      // One more correct answer completes the session
      answerCorrectlyAndContinue();
      // Now on complete screen; mastered counter is no longer rendered
      expect(screen.getByText(/ALL TOPICS MASTERED/i)).toBeInTheDocument();
    });
  });

  describe('complete screen', () => {
    beforeEach(() => {
      render(<LearnMode onBack={noop} />);
      masterAllQuestions();
    });

    it('shows ALL TOPICS MASTERED heading', () => {
      expect(screen.getByText(/ALL TOPICS MASTERED/i)).toBeInTheDocument();
    });

    it('shows RESTART LEARN MODE button', () => {
      expect(screen.getByText(/RESTART LEARN MODE/i)).toBeInTheDocument();
    });

    it('shows BACK TO MENU button', () => {
      expect(screen.getByText(/BACK TO MENU/i)).toBeInTheDocument();
    });

    it('shows accuracy percentage', () => {
      const pctEls = screen.getAllByText(/%/);
      expect(pctEls.length).toBeGreaterThanOrEqual(1);
    });

    it('restarts the session when RESTART LEARN MODE is clicked', () => {
      fireEvent.click(screen.getByText(/RESTART LEARN MODE/i));
      expect(screen.getByText(/LEARN MODE/i)).toBeInTheDocument();
      expect(screen.getByText('0 / 1')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('calls onBack when ← MENU is clicked from learn screen', () => {
      const onBack = vi.fn();
      render(<LearnMode onBack={onBack} />);
      fireEvent.click(screen.getByText(/← MENU/i));
      expect(onBack).toHaveBeenCalledOnce();
    });

    it('calls onBack when BACK TO MENU is clicked from complete screen', () => {
      const onBack = vi.fn();
      render(<LearnMode onBack={onBack} />);
      masterAllQuestions();
      fireEvent.click(screen.getByText(/BACK TO MENU/i));
      expect(onBack).toHaveBeenCalledOnce();
    });
  });
});
