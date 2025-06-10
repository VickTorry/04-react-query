import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';
import { Toaster, toast } from 'react-hot-toast';
import fetchMovies from '../../services/movieService';
import type {Movie} from '../../types/movie';
import { useState } from 'react';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearchSubmit = async (query: string) => {
    setMovies([]); // 🧹 Очистити попередній список одразу
  
    try {
      setIsLoading(true);
      setIsError(false);

      const results = await fetchMovies(query);
  
      if (results.length === 0) {
        toast("No movies found for your request.");
        return;
      }
  
      setMovies(results);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };
  
  return (
    <div className={css.app}>
  <Toaster position="top-right" />

  <div className={css.container}>
    <SearchBar onSubmit={handleSearchSubmit} />
    {isLoading && <Loader />}
    {isError && <ErrorMessage />}
    {movies.length > 0 && (
      <MovieGrid movies={movies} onSelect={openModal} />
    )}
  </div>

  {isModalOpen && selectedMovie && (
    <MovieModal movie={selectedMovie} onClose={closeModal} />
  )}
</div>

  );
}
