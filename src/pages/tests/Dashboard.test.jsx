import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { BrowserRouter } from 'react-router-dom';


beforeAll(() => {
  vi.stubGlobal('alert', vi.fn());
  vi.stubGlobal('localStorage', {
    getItem: vi.fn(() => 'mock-user-id'),
    setItem: vi.fn(),
  });
});

// mock fetch
global.fetch = vi.fn();

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  test('renders dashboard and calls fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter(<Dashboard />);

    expect(screen.getByRole('heading', { name: /task management/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/new team name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add team/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/teams/', {
        headers: { 'X-User-Id': 'mock-user-id' },
      });
    });
  });
});
