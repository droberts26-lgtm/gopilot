import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession, signIn } from 'next-auth/react';
import ProModal from '@/components/ProModal';

describe('ProModal — authenticated view', () => {
  // setup.js mocks useSession to return an authenticated user by default

  it('renders the full Pro features list', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByText(/Full Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/ATC General/i)).toBeInTheDocument();
    expect(screen.getByText(/Matching Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/FAA Exam Timer/i)).toBeInTheDocument();
  });

  it('renders the pricing', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByText('$14.99')).toBeInTheDocument();
    expect(screen.getByText(/ONE-TIME/i)).toBeInTheDocument();
  });

  it('shows the UNLOCK PRO button', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /unlock pro/i })).toBeInTheDocument();
  });

  it('does not show the Google sign-in button when authenticated', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.queryByText(/continue with google/i)).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<ProModal onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('POSTs to /api/checkout and redirects when UNLOCK PRO is clicked', async () => {
    const mockUrl = 'https://checkout.stripe.com/test-session';
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ url: mockUrl }),
    });
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    render(<ProModal onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /unlock pro/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/checkout', { method: 'POST' });
      expect(window.location.href).toBe(mockUrl);
    });

    window.location = originalLocation;
  });

  it('shows CONNECTING... while the checkout request is in flight', async () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {})); // never resolves

    render(<ProModal onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /unlock pro/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /connecting/i })).toBeInTheDocument();
    });
  });
});

describe('ProModal — unauthenticated view', () => {
  beforeEach(() => {
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  });

  it('shows the Google sign-in button', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /sign in \/ sign up with google/i })).toBeInTheDocument();
  });

  it('shows a Pro feature teaser', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByText(/Full Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn Mode/i)).toBeInTheDocument();
  });

  it('shows the price', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByText('$14.99')).toBeInTheDocument();
  });

  it('does not show the UNLOCK PRO button', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: /unlock pro/i })).not.toBeInTheDocument();
  });

  it('shows SIGN IN REQUIRED heading', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByText(/sign in required/i)).toBeInTheDocument();
  });

  it('shows account creation hint', () => {
    render(<ProModal onClose={() => {}} />);
    expect(screen.getByText(/created automatically/i)).toBeInTheDocument();
  });

  it('calls signIn when the Google button is clicked', () => {
    render(<ProModal onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in \/ sign up with google/i }));
    expect(signIn).toHaveBeenCalledWith('google');
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<ProModal onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
