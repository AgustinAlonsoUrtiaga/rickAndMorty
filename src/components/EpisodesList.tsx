'use client';

import { useState } from 'react';
import { Button } from 'react-bootstrap';

interface Episode {
  id: number;
  name: string;
}

interface EpisodesListProps {
  episodes: Episode[];
  onSelectEpisode: (episodeId: number | null) => void;
}

export default function EpisodesList({ episodes, onSelectEpisode }: EpisodesListProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  const handleSelectEpisode = (episodeId: number) => {
    const newSelectedEpisode = selectedEpisode === episodeId ? null : episodeId;
    setSelectedEpisode(newSelectedEpisode);
    onSelectEpisode(newSelectedEpisode);
  };

  return (
    <div className="episode-list">
      {episodes.map((episode) => (
        <Button
          key={episode.id}
          variant={episode.id === selectedEpisode ? 'dark' : 'outline-dark'}
          className="mb-2 w-100"
          onClick={() => handleSelectEpisode(episode.id)}
        >
          {episode.name}
        </Button>
      ))}
    </div>
  );
}