import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signOut } from 'next-auth/react';
import UserMenu from '@/components/UserMenu';

const mockUser = { name: 'Ada Lovelace', email: 'ada@example.com', image: null };
const mockUserWithImage = { name: 'Orville Wright', email: 'orville@example.com', image: 'https://example.com/photo.jpg' };

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the avatar button', () => {
    render(<UserMenu user={mockUser} />);
    expect(screen.getByRole('button', { name: /user menu/i })).toBeInTheDocument();
  });

  it('dropdown is hidden by default', () => {
    render(<UserMenu user={mockUser} />);
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
  });

  it('clicking avatar opens the dropdown with user name', () => {
    render(<UserMenu user={mockUser} />);
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }));
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
  });

  it('dropdown shows user email', () => {
    render(<UserMenu user={mockUser} />);
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }));
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
  });

  it('dropdown shows SIGN OUT button', () => {
    render(<UserMenu user={mockUser} />);
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }));
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('clicking SIGN OUT calls signOut', () => {
    render(<UserMenu user={mockUser} />);
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }));
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('shows user initial when no image provided', () => {
    render(<UserMenu user={mockUser} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('shows profile image when image url is provided', () => {
    render(<UserMenu user={mockUserWithImage} />);
    const img = screen.getByAltText('Orville Wright');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });
});
