import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FAQ from '@/components/FAQ';

describe('FAQ', () => {
  it('renders the section heading', () => {
    render(<FAQ />);
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  it('renders all FAQ questions', () => {
    render(<FAQ />);
    expect(screen.getByText(/What exam does GoPilot prepare me for/i)).toBeInTheDocument();
    expect(screen.getByText(/What's free vs. Pro/i)).toBeInTheDocument();
    expect(screen.getByText(/Is the \$14.99 a subscription/i)).toBeInTheDocument();
    expect(screen.getByText(/How is GoPilot different/i)).toBeInTheDocument();
    expect(screen.getByText(/Can I use this on my phone/i)).toBeInTheDocument();
    expect(screen.getByText(/How accurate are the practice questions/i)).toBeInTheDocument();
    expect(screen.getByText(/Does my progress save/i)).toBeInTheDocument();
  });

  it('answers are not visible initially', () => {
    render(<FAQ />);
    // Answers live in the DOM (CSS height transition), but no button is expanded
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });

  it('clicking a question reveals its answer', () => {
    render(<FAQ />);
    const question = screen.getByText(/What exam does GoPilot prepare me for/i);
    fireEvent.click(question);
    // The button for this question should now be expanded
    expect(question.closest('button').getAttribute('aria-expanded')).toBe('true');
  });

  it('clicking an open question collapses it', () => {
    render(<FAQ />);
    const question = screen.getByText(/What exam does GoPilot prepare me for/i);
    fireEvent.click(question);
    expect(question.closest('button').getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(question);
    expect(question.closest('button').getAttribute('aria-expanded')).toBe('false');
  });

  it('only one answer is open at a time', () => {
    render(<FAQ />);
    const q1 = screen.getByText(/What exam does GoPilot prepare me for/i);
    const q2 = screen.getByText(/Is the \$14.99 a subscription/i);
    fireEvent.click(q1);
    expect(q1.closest('button').getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(q2);
    // First collapses, second opens
    expect(q1.closest('button').getAttribute('aria-expanded')).toBe('false');
    expect(q2.closest('button').getAttribute('aria-expanded')).toBe('true');
  });

  it('question buttons have aria-expanded attribute', () => {
    render(<FAQ />);
    const buttons = screen.getAllByRole('button');
    // All start collapsed
    buttons.forEach(btn => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
    fireEvent.click(buttons[0]);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
  });
});
