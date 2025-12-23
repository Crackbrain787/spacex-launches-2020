import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import App from '../App';

vi.mock('../api/spacexApi');

import { fetchLaunches } from '../api/spacexApi';

const mockLaunches = [
  {
    flight_number: 94,
    mission_name: 'CCtCap Demo Mission 2',
    launch_year: '2020',
    details: 'SpaceX will launch the second demonstration mission of its Crew Dragon vehicle.',
    links: {
      mission_patch_small: 'https://images2.imgbox.com/eb/0f/Vev7xkUX_o.png',
      mission_patch: 'https://images2.imgbox.com/ab/79/Wyc9K7fv_o.png',
    },
    rocket: {
      rocket_name: 'Falcon 9',
    },
  },
  {
    flight_number: 95,
    mission_name: 'Starlink-2',
    launch_year: '2020',
    details: 'This mission will launch the second batch of Starlink satellites.',
    links: {
      mission_patch_small: 'https://images2.imgbox.com/3c/0e/T8iJcSN3_o.png',
      mission_patch: 'https://images2.imgbox.com/3c/0e/T8iJcSN3_o.png',
    },
    rocket: {
      rocket_name: 'Falcon 9',
    },
  },
  {
    flight_number: 96,
    mission_name: 'Starlink-3',
    launch_year: '2020',
    details: 'This mission will launch the third batch of Starlink satellites.',
    links: {
      mission_patch_small: 'https://images2.imgbox.com/4b/b9/oS8ezl6V_o.png',
      mission_patch: 'https://images2.imgbox.com/4b/b9/oS8ezl6V_o.png',
    },
    rocket: {
      rocket_name: 'Falcon 9',
    },
  },
];

const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('App Component', () => {

  beforeEach(() => {

    cleanup();

    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('1. Заголовок "SpaceX Launches 2020" отображается корректно', () => {
    renderWithMantine(<App />);
    const titleElement = screen.getByText(/SpaceX Launches 2020/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('2. При загрузке данных отображается индикатор загрузки', () => {
    vi.mocked(fetchLaunches).mockImplementation(() => new Promise(() => {}));
    renderWithMantine(<App />);

    expect(screen.getByText(/SpaceX Launches 2020/i)).toBeInTheDocument();
    expect(screen.queryByText(/CCtCap Demo Mission 2/i)).not.toBeInTheDocument();
  });

  test('3. После успешной загрузки отображаются карточки запусков с названиями и кнопками', async () => {
    vi.mocked(fetchLaunches).mockResolvedValue(mockLaunches);
    renderWithMantine(<App />);

    await waitFor(() => {
      expect(screen.getByText(/CCtCap Demo Mission 2/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Starlink-2/i)).toBeInTheDocument();
    expect(screen.getByText(/Starlink-3/i)).toBeInTheDocument();

    const rocketNames = screen.getAllByText(/Falcon 9/i);
    expect(rocketNames).toHaveLength(3);

    const seeMoreButtons = screen.getAllByText(/See more/i);
    expect(seeMoreButtons).toHaveLength(3);
  });

  test('4. При ошибке загрузки данных отображается сообщение об ошибке', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(fetchLaunches).mockRejectedValue(new Error(errorMessage));
    renderWithMantine(<App />);

    await waitFor(() => {

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('5. При клике на кнопку "See more" открывается модальное окно с деталями запуска', async () => {
    vi.mocked(fetchLaunches).mockResolvedValue(mockLaunches);
    renderWithMantine(<App />);

    await waitFor(() => {
      expect(screen.getByText(/CCtCap Demo Mission 2/i)).toBeInTheDocument();
    });

    const firstSeeMoreButton = screen.getAllByText(/See more/i)[0];
    
    await act(async () => {
      await userEvent.click(firstSeeMoreButton);
    });

 
    await waitFor(() => {
      const modalRoot = document.getElementById('modal-root');
      expect(modalRoot).toBeInTheDocument();
      const modalHeading = modalRoot!.querySelector('h2');
      expect(modalHeading).toHaveTextContent(/CCtCap Demo Mission 2/i);
    });

    const modalRoot = document.getElementById('modal-root')!;
    expect(modalRoot).toHaveTextContent(/Mission name:/i);
    expect(modalRoot).toHaveTextContent(/Rocket name:/i);
    expect(modalRoot).toHaveTextContent(/Falcon 9/i);
    expect(modalRoot).toHaveTextContent(/SpaceX will launch the second demonstration mission/i);
  });

  test('6. Модальное окно закрывается при клике на кнопку закрытия', async () => {
    vi.mocked(fetchLaunches).mockResolvedValue(mockLaunches);
    renderWithMantine(<App />);

    await waitFor(() => {
      expect(screen.getByText(/CCtCap Demo Mission 2/i)).toBeInTheDocument();
    });

    const firstSeeMoreButton = screen.getAllByText(/See more/i)[0];
    
    await act(async () => {
      await userEvent.click(firstSeeMoreButton);
    });

    await waitFor(() => {
      const modalRoot = document.getElementById('modal-root');
      expect(modalRoot).toBeInTheDocument();
      const modalHeading = modalRoot!.querySelector('h2');
      expect(modalHeading).toHaveTextContent(/CCtCap Demo Mission 2/i);
    });


    const modalRoot = document.getElementById('modal-root')!;
    const closeButton = modalRoot.querySelector('button')!;
    expect(closeButton).toBeInTheDocument();
    
    await act(async () => {
      await userEvent.click(closeButton);
    });

    
    await waitFor(() => {
      const modalRoot = document.getElementById('modal-root')!;
    
      expect(modalRoot).toBeEmptyDOMElement();
    });
  });
});