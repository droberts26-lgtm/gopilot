import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FAQ from '@/components/FAQ';

describe('FAQ', () => {
  it('renders the section heading', () => {
    render(<FAQ />);
    expect(screen.getByText(/QUESTIONS & ANSWERS/i)).toBeInTheDocument();
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
    expect(screen.queryByText(/FAA Private Pilot Airman Knowledge Test/i)).not.toBeInTheDocument();
  });

  it('clicking a question reveals its answer', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText(/What exam does GoPilot prepare me for/i));
    expect(screen.getByText(/FAA Private Pilot Airman Knowledge Test/i)).toBeInTheDocument();
  });

  it('clicking an open question collapses it', () => {
    render(<FAQ />);
    const question = screen.getByText(/What exam does GoPilot prepare me for/i);
    fireEvent.click(question);
    expect(screen.getByText(/FAA Private Pilot Airman Knowledge Test/i)).toBeInTheDocument();
    fireEvent.click(question);
    expect(screen.queryByText(/FAA Private Pilot Airman Knowledge Test/i)).not.toBeInTheDocument();
  });

  it('only one answer is open at a time', () => {
    render(<FAQ />);
    fireEvent.click(screen.getByText(/What exam does GoPilot prepare me for/i));
    fireEvent.click(screen.getByText(/Is the \$14.99 a subscription/i));
    // First answer should be gone, second visible
    expect(screen.queryByText(/FAA Private Pilot Airman Knowledge Test/i)).not.toBeInTheDocument();
    expect(screen.getByText(/One-time payment/i)).toBeInTheDocument();
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
