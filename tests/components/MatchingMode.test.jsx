import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MatchingMode from '@/components/MatchingMode';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/data/matchingSets', () => ({
  matchingCategories: [
    {
      id: 'airspace',
      name: 'Airspace',
      icon: '✈',
      color: '#06b6d4',
      sets: [
        {
          id: 'airspace-classes',
          name: 'Airspace Classes',
          pairs: [
            { id: 1, term: 'Class A',    definition: 'FL180 to FL600' },
            { id: 2, term: 'Class B',    definition: 'Busiest airports' },
            { id: 3, term: 'Class C',    definition: 'Approach control airports' },
            { id: 4, term: 'Class D',    definition: 'Tower airports' },
            { id: 5, term: 'Class E',    definition: 'Controlled, not A/B/C/D' },
            { id: 6, term: 'Class G',    definition: 'Uncontrolled airspace' },
            { id: 7, term: 'MOA',        definition: 'Military training area' },
            { id: 8, term: 'Prohibited', definition: 'No flight allowed' },
          ],
        },
        {
          id: 'airspace-vfr',
          name: 'VFR Minimums',
          pairs: [
            { id: 1, term: 'Class B vis',   definition: '3 SM' },
            { id: 2, term: 'Class C vis',   definition: '3 SM C' },
            { id: 3, term: 'Class D vis',   definition: '3 SM D' },
            { id: 4, term: 'Class E vis',   definition: '3 SM E' },
            { id: 5, term: 'Class G day',   definition: '1 SM' },
            { id: 6, term: 'Class G night', definition: '3 SM G night' },
            { id: 7, term: 'Class B cloud', definition: 'Clear of clouds' },
            { id: 8, term: 'Class C cloud', definition: '500/1000/2000' },
          ],
        },
        {
          id: 'airspace-speeds',
          name: 'Speed Rules',
          pairs: [
            { id: 1, term: 'Below 10,000', definition: '250 kts' },
            { id: 2, term: 'Class C or D',  definition: '200 kts' },
            { id: 3, term: 'Under Class B', definition: '200 kts B' },
            { id: 4, term: 'Class A floor', definition: 'FL180' },
            { id: 5, term: 'VFR east odd',  definition: 'Odd + 500' },
            { id: 6, term: 'VFR west even', definition: 'Even + 500' },
            { id: 7, term: 'Class E floor', definition: '1,200 AGL' },
            { id: 8, term: 'Transition area', definition: '700 AGL' },
          ],
        },
      ],
    },
    {
      id: 'weather',
      name: 'Weather',
      icon: '⛅',
      color: '#60a5fa',
      sets: [
        {
          id: 'weather-metar',
          name: 'METAR Codes',
          pairs: [
            { id: 1, term: 'FEW', definition: '1-2 oktas' },
            { id: 2, term: 'SCT', definition: '3-4 oktas' },
            { id: 3, term: 'BKN', definition: '5-7 oktas' },
            { id: 4, term: 'OVC', definition: '8 oktas' },
            { id: 5, term: 'RA',  definition: 'Rain' },
            { id: 6, term: 'SN',  definition: 'Snow' },
            { id: 7, term: 'TS',  definition: 'Thunderstorm' },
            { id: 8, term: 'BR',  definition: 'Mist' },
          ],
        },
        {
          id: 'weather-advisories',
          name: 'Advisories',
          pairs: [
            { id: 1, term: 'SIGMET',      definition: 'Severe conditions' },
            { id: 2, term: 'AIRMET S',    definition: 'IFR conditions' },
            { id: 3, term: 'AIRMET T',    definition: 'Turbulence' },
            { id: 4, term: 'AIRMET Z',    definition: 'Icing' },
            { id: 5, term: 'PIREP',       definition: 'Pilot report' },
            { id: 6, term: 'TAF',         definition: 'Terminal forecast' },
            { id: 7, term: 'FA',          definition: 'Area forecast' },
            { id: 8, term: 'Conv SIGMET', definition: 'Severe thunderstorms' },
          ],
        },
        {
          id: 'weather-phenomena',
          name: 'Phenomena',
          pairs: [
            { id: 1, term: 'Lapse rate',    definition: '2C/1000ft' },
            { id: 2, term: 'Dew point',     definition: '2-3C closes' },
            { id: 3, term: 'Stable air',    definition: 'Stratiform clouds' },
            { id: 4, term: 'Unstable air',  definition: 'Cumuliform clouds' },
            { id: 5, term: 'Wind shear',    definition: 'Rapid wind change' },
            { id: 6, term: 'Mountain wave', definition: 'Lenticular clouds' },
            { id: 7, term: 'Radiation fog', definition: 'Ground cooling' },
            { id: 8, term: 'Advection fog', definition: 'Warm over cool' },
          ],
        },
      ],
    },
  ],
}));

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const noop = () => {};

const ALL_PAIRS = [
  { term: 'Class A',    def: 'FL180 to FL600' },
  { term: 'Class B',    def: 'Busiest airports' },
  { term: 'Class C',    def: 'Approach control airports' },
  { term: 'Class D',    def: 'Tower airports' },
  { term: 'Class E',    def: 'Controlled, not A/B/C/D' },
  { term: 'Class G',    def: 'Uncontrolled airspace' },
  { term: 'MOA',        def: 'Military training area' },
  { term: 'Prohibited', def: 'No flight allowed' },
];

/** Navigate from categories → Airspace → Airspace Classes game */
const startAirspaceClassesGame = () => {
  render(<MatchingMode onBack={noop} />);
  fireEvent.click(screen.getByText(/^AIRSPACE$/i));
  fireEvent.click(screen.getByText(/AIRSPACE CLASSES/i));
};

/** Match all 8 pairs correctly to reach the complete screen */
const matchAllPairs = () => {
  for (const { term, def } of ALL_PAIRS) {
    fireEvent.click(screen.getByText(term));
    fireEvent.click(screen.getByText(def));
  }
};

const completeGame = () => {
  startAirspaceClassesGame();
  matchAllPairs();
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MatchingMode', () => {

  // ── Categories screen ──────────────────────────────────────────────────────

  describe('categories screen', () => {
    it('shows MATCHING MODE label', () => {
      render(<MatchingMode onBack={noop} />);
      expect(screen.getByText(/MATCHING MODE/i)).toBeInTheDocument();
    });

    it('shows CHOOSE A CATEGORY heading', () => {
      render(<MatchingMode onBack={noop} />);
      expect(screen.getByText(/CHOOSE A CATEGORY/i)).toBeInTheDocument();
    });

    it('renders all category cards', () => {
      render(<MatchingMode onBack={noop} />);
      expect(screen.getByText(/^AIRSPACE$/i)).toBeInTheDocument();
      expect(screen.getByText(/^WEATHER$/i)).toBeInTheDocument();
    });

    it('shows ← MENU button', () => {
      render(<MatchingMode onBack={noop} />);
      expect(screen.getByText(/← MENU/i)).toBeInTheDocument();
    });

    it('calls onBack when ← MENU is clicked', () => {
      const onBack = vi.fn();
      render(<MatchingMode onBack={onBack} />);
      fireEvent.click(screen.getByText(/← MENU/i));
      expect(onBack).toHaveBeenCalledOnce();
    });

    it('shows completion progress after a set is finished', () => {
      completeGame();
      fireEvent.click(screen.getByText(/ALL CATEGORIES/i));
      // 1/3 sets done for Airspace
      expect(screen.getByText(/1\/3 DONE/i)).toBeInTheDocument();
    });
  });

  // ── Sets screen ────────────────────────────────────────────────────────────

  describe('sets screen', () => {
    it('transitions to sets screen when a category is clicked', () => {
      render(<MatchingMode onBack={noop} />);
      fireEvent.click(screen.getByText(/^AIRSPACE$/i));
      expect(screen.getByText(/AIRSPACE CLASSES/i)).toBeInTheDocument();
    });

    it('shows all sets for the chosen category', () => {
      render(<MatchingMode onBack={noop} />);
      fireEvent.click(screen.getByText(/^AIRSPACE$/i));
      expect(screen.getByText(/AIRSPACE CLASSES/i)).toBeInTheDocument();
      expect(screen.getByText(/VFR MINIMUMS/i)).toBeInTheDocument();
      expect(screen.getByText(/SPEED RULES/i)).toBeInTheDocument();
    });

    it('shows ← BACK button on sets screen', () => {
      render(<MatchingMode onBack={noop} />);
      fireEvent.click(screen.getByText(/^AIRSPACE$/i));
      expect(screen.getByText(/← BACK/i)).toBeInTheDocument();
    });

    it('returns to categories screen when ← BACK is clicked', () => {
      render(<MatchingMode onBack={noop} />);
      fireEvent.click(screen.getByText(/^AIRSPACE$/i));
      fireEvent.click(screen.getByText(/← BACK/i));
      expect(screen.getByText(/CHOOSE A CATEGORY/i)).toBeInTheDocument();
    });

    it('shows best time chip on sets screen after completing a set', () => {
      completeGame();
      fireEvent.click(screen.getByText(/MORE SETS IN/i));
      expect(screen.getByText(/⏱ BEST:/i)).toBeInTheDocument();
    });

    it('does NOT show best time chip for a set that has never been completed', () => {
      render(<MatchingMode onBack={noop} />);
      fireEvent.click(screen.getByText(/^AIRSPACE$/i));
      expect(screen.queryByText(/⏱ BEST:/i)).toBeNull();
    });
  });

  // ── Game screen ────────────────────────────────────────────────────────────

  describe('game screen', () => {
    it('shows TERMS and DEFINITIONS column headers', () => {
      startAirspaceClassesGame();
      expect(screen.getByText(/^TERMS$/i)).toBeInTheDocument();
      expect(screen.getByText(/^DEFINITIONS$/i)).toBeInTheDocument();
    });

    it('shows the matched counter starting at 0 / 8', () => {
      startAirspaceClassesGame();
      expect(screen.getByText('0 / 8')).toBeInTheDocument();
    });

    it('shows the stopwatch at 0:00.0 on start', () => {
      startAirspaceClassesGame();
      expect(screen.getByTestId('stopwatch')).toBeInTheDocument();
      expect(screen.getByTestId('stopwatch').textContent).toBe('0:00.0');
    });

    it('shows stopwatch advancing after time passes', () => {
      startAirspaceClassesGame();
      act(() => vi.advanceTimersByTime(5200));
      expect(screen.getByTestId('stopwatch').textContent).toBe('0:05.2');
    });

    it('shows TIME label above the stopwatch', () => {
      startAirspaceClassesGame();
      expect(screen.getByText(/^TIME$/i)).toBeInTheDocument();
    });

    it('shows SELECT A TERM instruction before selecting', () => {
      startAirspaceClassesGame();
      expect(screen.getByText(/SELECT A TERM ON THE LEFT/i)).toBeInTheDocument();
    });

    it('shows updated instruction after selecting a term', () => {
      startAirspaceClassesGame();
      fireEvent.click(screen.getByText('Class A'));
      expect(screen.getByText(/NOW SELECT THE MATCHING DEFINITION/i)).toBeInTheDocument();
    });

    it('shows ← SETS button on game screen', () => {
      startAirspaceClassesGame();
      expect(screen.getByText(/← SETS/i)).toBeInTheDocument();
    });

    it('returns to sets screen when ← SETS is clicked', () => {
      startAirspaceClassesGame();
      fireEvent.click(screen.getByText(/← SETS/i));
      expect(screen.getByText(/AIRSPACE CLASSES/i)).toBeInTheDocument();
    });

    it('increments matched count after a correct match', () => {
      startAirspaceClassesGame();
      fireEvent.click(screen.getByText('Class A'));
      fireEvent.click(screen.getByText('FL180 to FL600'));
      expect(screen.getByText('1 / 8')).toBeInTheDocument();
    });

    it('does not increment matched count for a wrong match', () => {
      startAirspaceClassesGame();
      fireEvent.click(screen.getByText('Class A'));
      fireEvent.click(screen.getByText('Busiest airports')); // Class B's def
      expect(screen.getByText('0 / 8')).toBeInTheDocument();
    });

    it('clears selection after wrong match (after flash timeout)', () => {
      startAirspaceClassesGame();
      fireEvent.click(screen.getByText('Class A'));
      fireEvent.click(screen.getByText('Busiest airports'));
      act(() => vi.advanceTimersByTime(700));
      expect(screen.getByText(/SELECT A TERM ON THE LEFT/i)).toBeInTheDocument();
    });

    it('shows best time hint when this set has a previous record', () => {
      // First completion sets the record
      completeGame();
      // Play again — game screen should show the best time hint
      fireEvent.click(screen.getByText(/PLAY AGAIN/i));
      expect(screen.getByText(/BEST 0:00/i)).toBeInTheDocument();
    });
  });

  // ── Complete screen ────────────────────────────────────────────────────────

  describe('complete screen', () => {
    it('shows NEW BEST! on first completion of a set', () => {
      completeGame();
      expect(screen.getByText(/NEW BEST!/i)).toBeInTheDocument();
    });

    it('shows SET COMPLETE heading when not a new best', () => {
      // First completion is always NEW BEST — play again to get a non-best
      completeGame();
      // Advance timer so second run is "slower"
      fireEvent.click(screen.getByText(/PLAY AGAIN/i));
      act(() => vi.advanceTimersByTime(60000)); // simulate 60 seconds
      matchAllPairs();
      // Second run took longer than first (0ms), so NOT a new best
      expect(screen.getByText(/SET COMPLETE/i)).toBeInTheDocument();
    });

    it('shows PLAY AGAIN button', () => {
      completeGame();
      expect(screen.getByText(/PLAY AGAIN/i)).toBeInTheDocument();
    });

    it('shows MORE SETS IN button', () => {
      completeGame();
      expect(screen.getByText(/MORE SETS IN/i)).toBeInTheDocument();
    });

    it('shows ALL CATEGORIES button', () => {
      completeGame();
      expect(screen.getByText(/ALL CATEGORIES/i)).toBeInTheDocument();
    });

    it('shows ← BACK TO MENU button', () => {
      completeGame();
      expect(screen.getByText(/← BACK TO MENU/i)).toBeInTheDocument();
    });

    it('calls onBack when ← BACK TO MENU is clicked', () => {
      const onBack = vi.fn();
      render(<MatchingMode onBack={onBack} />);
      fireEvent.click(screen.getAllByText(/^AIRSPACE$/i)[0]);
      fireEvent.click(screen.getAllByText(/AIRSPACE CLASSES/i)[0]);
      matchAllPairs();
      fireEvent.click(screen.getByText(/← BACK TO MENU/i));
      expect(onBack).toHaveBeenCalledOnce();
    });

    it('restarts the game when PLAY AGAIN is clicked', () => {
      completeGame();
      fireEvent.click(screen.getByText(/PLAY AGAIN/i));
      expect(screen.getByText('0 / 8')).toBeInTheDocument();
    });

    it('shows elapsed time on the complete screen', () => {
      completeGame();
      // With fake timers, elapsed is 0ms → formatStopwatch(0) = '0:00.0'
      expect(screen.getByText('0:00.0')).toBeInTheDocument();
    });

    it('navigates to sets screen when MORE SETS IN button is clicked', () => {
      completeGame();
      fireEvent.click(screen.getByText(/MORE SETS IN/i));
      expect(screen.getByText(/VFR MINIMUMS/i)).toBeInTheDocument();
    });

    it('navigates to categories screen when ALL CATEGORIES is clicked', () => {
      completeGame();
      fireEvent.click(screen.getByText(/ALL CATEGORIES/i));
      expect(screen.getByText(/CHOOSE A CATEGORY/i)).toBeInTheDocument();
    });
  });
});
