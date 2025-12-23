export interface Launch {
  flight_number: number;
  mission_name: string;
  launch_year: string;
  details: string | null;
  links: {
    mission_patch_small: string | null;
    mission_patch: string | null;
  };
  rocket: {
    rocket_name: string;
  };
}

export interface AppState {
  launches: Launch[];
  selectedLaunch: Launch | null;
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
}

export type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Launch[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_LAUNCH'; payload: Launch }
  | { type: 'CLOSE_MODAL' };