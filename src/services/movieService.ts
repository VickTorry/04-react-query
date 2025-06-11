// services/movieService.ts
import axios from 'axios';
import type { FetchMoviesResponse } from '../types/movie';

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export default async function fetchMovies(query: string, page: number): Promise<FetchMoviesResponse> {
  const response = await axios.get<FetchMoviesResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      params: { query, page },
    }
  );

  return response.data;
}
