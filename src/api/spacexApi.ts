import axios from 'axios';
import type { Launch } from '../types';

const API_BASE = 'https://api.spacexdata.com/v3/launches';

export const fetchLaunches = async (year: string): Promise<Launch[]> => {
  const response = await axios.get(API_BASE, { params: { launch_year: year } });
  return response.data;
};