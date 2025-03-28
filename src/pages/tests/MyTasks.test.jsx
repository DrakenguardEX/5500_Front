import { render, screen, waitFor } from '@testing-library/react';
import MyTasks from '../MyTasks';
import { BrowserRouter } from 'react-router-dom';


beforeAll(() => {
  vi.stubGlobal('alert', vi.fn());
  vi.stubGlobal('localStorage', {
    getItem: vi.fn(() => 'mock-user-id'),
    setItem: vi.fn(),
  });
});

global.fetch = vi.fn();

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('MyTasks Page', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  test('renders and loads tasks', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 't1', title: 'Sample Task', description: 'Test Desc' },
      ],
    });

    renderWithRouter(<MyTasks />);

    expect(screen.getByRole('heading', { name: /my personal tasks/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/new personal task/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/sample task/i)).toBeInTheDocument()
    );
    expect(fetch).toHaveBeenCalledWith('/api/tasks/user/mock-user-id');
  });
});
