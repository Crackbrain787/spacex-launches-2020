import { useEffect, useReducer } from 'react';
import { Container, Title, Grid, LoadingOverlay, Alert } from '@mantine/core';
import { launchReducer, initialState } from './launchReducer';
import { LaunchCard } from './components/LaunchCard';
import { LaunchModal } from './components/LaunchModal';
import { fetchLaunches } from './api/spacexApi';
import type { Launch } from './types';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(launchReducer, initialState);
  const { launches, isLoading, selectedLaunch, isModalOpen, error } = state;

  useEffect(() => {
    const getLaunches = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const data = await fetchLaunches('2020');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ 
          type: 'FETCH_ERROR', 
          payload: err instanceof Error ? err.message : 'Failed to fetch launches' 
        });
      }
    };
    getLaunches();
  }, []);

  const handleSelectLaunch = (launch: Launch) => {
    dispatch({ type: 'SELECT_LAUNCH', payload: launch });
  };

  const handleCloseModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  return (
    <>
      <Container size="xl" py="xl">
        <Title order={1} ta="center" mb="lg">SpaceX Launches 2020</Title>
        <LoadingOverlay visible={isLoading} />
        
        {error && (
          <Alert title="Error" color="red" mb="lg">
            {error}
          </Alert>
        )}
        
        <Grid>
          {launches.map((launch, index) => (
            <Grid.Col key={`${launch.flight_number}-${index}`} span={{ base: 12, sm: 6, md: 4 }}>
              <LaunchCard launch={launch} onSelect={handleSelectLaunch} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
      {selectedLaunch && (
        <LaunchModal
          launch={selectedLaunch}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default App;