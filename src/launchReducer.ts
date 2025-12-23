import type { AppState, Action } from './types';

export const initialState: AppState = {
  launches: [],
  selectedLaunch: null,
  isLoading: false,
  error: null,
  isModalOpen: false,
};

export function launchReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, launches: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SELECT_LAUNCH':
      return { ...state, selectedLaunch: action.payload, isModalOpen: true };
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, selectedLaunch: null };
    default:
      return state;
  }
}