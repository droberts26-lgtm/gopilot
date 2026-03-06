import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LearnMode from '@/components/LearnMode';
import { MASTERY_THRESHOLD } from '@/lib/learn';

// ─── Mocks ────────────────────────────────────────────────────────────────────

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

const getContinueButton = () =>
  screen.getByRole('button', { name: /CONTINUE/i });

const answerAndContinue = (optionIdx = 0) => {
  const opts = getOptionButtons();
  fireEvent.click(opts[optionIdx]);
  fireEvent.click(getContinueButton());
};

const answerCorrectlyAndContinue = () => answerAndContinue(1); // B is correct

const masterAllQuestions = () => {
  for (let i = 0; i < MASTERY_THRESHOLD; i++) answerCorrectlyAndContinue();
};

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('LearnMode', () => {
  // ── Initial render (no saved session) ─────────────────────────────────────

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
      expect(screen.queryByRole('button', { name: /CONTINUE/i })).toBeNull();
    });

    it('shows the FLAG button', () => {
      render(<LearnMode onBack={noop} />);
      expect(screen.getByText(/FLAG/i)).toBeInTheDocument();
    });
  });

  // ── localStorage resume screen ─────────────────────────────────────────────

  describe('resume screen', () => {
    const seedSavedSession = () => {
      // Manually construct a valid saved session for 1 question (matching mock bank)
      const session = {
        queue: [1],
        masteryMap: { 1: { correctStreak: 1, attempts: 2, mastered: false } },
      };
      const meta = { totalAnswered: 2, totalCorrect: 1, startTime: Date.now() - 60000, flaggedIds: [] };
      localStorage.setItem('gopilot_learn_session', JSON.stringify({ session, meta }));
    };

    it('shows resume screen when a valid saved session exists', () => {
      seedSavedSession();
      render(<LearnMode onBack={noop} />);
      expect(screen.getByText(/SESSION IN PROGRESS/i)).toBeInTheDocument();
    });

    it('shows RESUME SESSION button on resume screen', () => {
      seedSavedSession();
      render(<LearnMode onBack={noop} />);
      expect(screen.getByText(/RESUME SESSION/i)).toBeInTheDocument();
    });

    it('shows START FRESH button on resume screen', () => {
      seedSavedSession();
      render(<LearnMode onBack={noop} />);
      expect(screen.getByText(/START FRESH/i)).toBeInTheDocument();
    });

    it('transitions to learn screen when RESUME SESSION is clicked', () => {
      seedSavedSession();
      render(<LearnMode onBack={noop} />);
      fireEvent.click(screen.getByText(/RESUME SESSION/i));
      expect(screen.getByText(/minimum safe altitude/i)).toBeInTheDocument();
    });

    it('transitions to learn screen (fresh) when START FRESH is clicked', () => {
      seedSavedSession();
      render(<LearnMode onBack={noop} />);
      fireEvent.click(screen.getByText(/START FRESH/i));
      expect(screen.getByText(/LEARN MODE/i)).toBeInTheDocument();
      expect(screen.getByText('0 / 1')).toBeInTheDocument();
    });

    it('does NOT show resume screen when localStorage is empty', () => {
      render(<LearnMode onBack={noop} />);
      expect(screen.queryByText(/SESSION IN PROGRESS/i)).toBeNull();
    });

    it('does NOT show resume screen when saved count mismatches question bank', () => {
      // Save a session for 5 questions, but mock bank has only 1
      const session = {
        queue: [1, 2, 3, 4, 5],
        masteryMap: Object.fromEntries([1,2,3,4,5].map(id => [id, { correctStreak: 0, attempts: 0, mastered: false }])),
      };
      localStorage.setItem('gopilot_learn_session', JSON.stringify({ session, meta: { totalAnswered: 0, totalCorrect: 0, startTime: 0, flaggedIds: [] } }));
      render(<LearnMode onBack={noop} />);
      expect(screen.queryByText(/SESSION IN PROGRESS/i)).toBeNull();
    });
  });

  // ── Answering ──────────────────────────────────────────────────────────────

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
      expect(screen.getByRole('button', { name: /CONTINUE/i })).toBeInTheDocument();
    });

    it('shows ✓ WELL DONE header on correct answer', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(getOptionButtons()[1]); // B is correct
      expect(screen.getByText(/WELL DONE/i)).toBeInTheDocument();
    });

    it('shows ✗ INCORRECT header on wrong answer', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(getOptionButtons()[0]); // A is wrong
      expect(screen.getAllByText(/INCORRECT/i).length).toBeGreaterThan(0);
    });
  });

  // ── Flag button ────────────────────────────────────────────────────────────

  describe('flag button', () => {
    it('toggles to FLAGGED when clicked', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(screen.getByText(/⚐ FLAG/i));
      expect(screen.getByText(/⚑ FLAGGED/i)).toBeInTheDocument();
    });

    it('toggles back to FLAG when clicked a second time', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(screen.getByText(/⚐ FLAG/i));
      fireEvent.click(screen.getByText(/⚑ FLAGGED/i));
      expect(screen.getByText(/⚐ FLAG/i)).toBeInTheDocument();
    });

    it('shows PRIORITY indicator in streak area when flagged', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(screen.getByText(/⚐ FLAG/i));
      expect(screen.getByText(/PRIORITY/i)).toBeInTheDocument();
    });
  });

  // ── After CONTINUE ─────────────────────────────────────────────────────────

  describe('after clicking CONTINUE', () => {
    it('clears the selected state so options become enabled again', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(getOptionButtons()[0]);
      fireEvent.click(getContinueButton());
      const opts = getOptionButtons();
      opts.forEach(btn => expect(btn).not.toBeDisabled());
    });

    it('hides the CONTINUE button after continuing', () => {
      render(<LearnMode onBack={noop} />);
      fireEvent.click(getOptionButtons()[0]);
      fireEvent.click(getContinueButton());
      expect(screen.queryByRole('button', { name: /CONTINUE/i })).toBeNull();
    });

    it('increments mastered count after mastering the question', () => {
      render(<LearnMode onBack={noop} />);
      for (let i = 0; i < MASTERY_THRESHOLD - 1; i++) answerCorrectlyAndContinue();
      expect(screen.getByText('0 / 1')).toBeInTheDocument();
      answerCorrectlyAndContinue();
      expect(screen.getByText(/ALL TOPICS MASTERED/i)).toBeInTheDocument();
    });
  });

  // ── Complete screen ────────────────────────────────────────────────────────

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

  // ── Navigation ─────────────────────────────────────────────────────────────

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

    it('calls onBack when BACK TO MENU is clicked from resume screen', () => {
      const session = {
        queue: [1],
        masteryMap: { 1: { correctStreak: 0, attempts: 1, mastered: false } },
      };
      localStorage.setItem('gopilot_learn_session', JSON.stringify({
        session,
        meta: { totalAnswered: 1, totalCorrect: 0, startTime: 0, flaggedIds: [] },
      }));
      const onBack = vi.fn();
      render(<LearnMode onBack={onBack} />);
      fireEvent.click(screen.getByText(/← BACK TO MENU/i));
      expect(onBack).toHaveBeenCalledOnce();
    });
  });
});
