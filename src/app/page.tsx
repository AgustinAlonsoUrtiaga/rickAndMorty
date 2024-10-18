'use client';

import { useState, useEffect, useMemo } from 'react';
import EpisodesList from '../components/EpisodesList';
import CharactersList from '../components/CharactersList';
import { Spinner, Pagination } from 'react-bootstrap';

interface Episode {
  id: number;
  name: string;
}

export default function HomePage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<any[]>([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch('https://rickandmortyapi.com/api/episode');
        const data = await response.json();
        setEpisodes(data.results);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    };
    fetchEpisodes();
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const url = selectedEpisode
          ? `https://rickandmortyapi.com/api/episode/${selectedEpisode.id}`
          : `https://rickandmortyapi.com/api/character?page=${currentPage}`;

        const response = await fetch(url);
        const data = await response.json();

        if (selectedEpisode) {
          const characterUrls = data.characters;
          const characterPromises = characterUrls.map((url: string) =>
            fetch(url).then(res => res.json())
          );
          const characterData = await Promise.all(characterPromises);
          setCharacters(characterData);
        } else {
          setCharacters(data.results);
          setTotalPages(data.info.pages);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching characters:', error);
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [selectedEpisode, currentPage]);

  const handleSelectEpisode = (episodeId: number | null) => {
    if (episodeId === null) {
      setSelectedEpisode(null);
    } else {
      const episode = episodes.find(ep => ep.id === episodeId) || null; // Evitar undefined, retornar null si no encuentra el episodio
      setSelectedEpisode(episode);
      if (!episodeId) setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const renderPaginationItems = useMemo(() => {
    if (selectedEpisode) return null;

    const items = [];
    const startPage = Math.max(currentPage - 5, 1);
    const endPage = Math.min(currentPage + 4, totalPages);

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return items;
  }, [currentPage, totalPages, selectedEpisode]);

  return (
    <div className="container">
      <h1 className="main-title">Rick and Morty Characters</h1>
      <div className="row">
        <div className="col-md-4">
          <h2>Episodes</h2>
          {loading && !characters.length ? (
            <div className="center-text">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <EpisodesList episodes={episodes} onSelectEpisode={handleSelectEpisode} />
          )}
        </div>
        <div className="col-md-8">
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              {selectedEpisode ? (
                <h3 className="episode-title">
                  {characters.length} Characters in episode "{selectedEpisode.name}"
                </h3>
              ) : (
                <h3 className="episode-title">All Characters</h3>
              )}
              <CharactersList characters={characters} />
              {!selectedEpisode && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Pagination.Prev>
                  {renderPaginationItems}
                  <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Pagination.Next>
                </Pagination>
              )}
              {!selectedEpisode && (
                <p className="text-center">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}