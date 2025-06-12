import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';


import ReactPaginate from 'react-paginate';
import { Toaster, toast } from 'react-hot-toast';

import fetchMovies from '../../services/movieService';
import type { FetchMoviesResponse } from '../../services/movieService';

import type { Movie} from '../../types/movie';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  

  const queryKey: [string, string, number] = ['movies', query, page];

const queryOptions = {
  queryKey,
  queryFn: () => fetchMovies(query, page),
  enabled: query !== '',
  placeholderData: keepPreviousData,
};

const { data, isError, isLoading, isSuccess } = useQuery<
  FetchMoviesResponse,
  Error,
  FetchMoviesResponse,
  [string, string, number]
>(queryOptions);


  // Show "no results" toast
  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast('No movies found for your request.');
    }
  }, [isSuccess, data]);

  // Show network or fetch error toast
  useEffect(() => {
    if (isError) {
      toast.error('Something went wrong. Please try again.');
    }
  }, [isError]);

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearchSubmit = (searchQuery: string) => {
    if (!navigator.onLine) {
      toast.error('You are offline. Please check your internet connection.');
      return;
    }

    setQuery(searchQuery);
    setPage(1);
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  
  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <div className={css.container}>
        <SearchBar onSubmit={handleSearchSubmit} />

        {isSuccess && totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}
      </div>

      {selectedMovie && (
  <MovieModal movie={selectedMovie} onClose={closeModal} />
)}
    </div>
  );
}
