import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import ProModal from '@/components/ProModal';

describe('ProModal', () => {
  it('renders Pro features list', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByText(/Full Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/ATC General/i)).toBeInTheDocument();
    expect(screen.getByText(/Matching/i)).toBeInTheDocument();
    expect(screen.getByText(/FAA Exam Timer/i)).toBeInTheDocument();
  });

  it('renders the pricing text', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByText('$14.99')).toBeInTheDocument();
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<ProModal onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not show sign-in button when session is present', () => {
    // setup.js mocks useSession to return an authenticated user by default
    render(<ProModal onClose={() => {}} />);
    expect(screen.queryByText(/sign in to continue/i)).not.toBeInTheDocument();
  });

  it('shows sign-in button when not authenticated', () => {
    useSession.mockReturnValueOnce({ data: null, status: 'unauthenticated' });
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /sign in to continue/i })).toBeInTheDocument();
  });
});
