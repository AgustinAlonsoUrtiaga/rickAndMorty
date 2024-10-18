'use client';

import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

interface Character {
  id: number;
  name: string;
  image: string;
}

interface CharactersListProps {
  characters: Character[];
}

export default function CharactersList({ characters }: CharactersListProps) {
  const [displayedCharacters, setDisplayedCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setDisplayedCharacters(characters), 100);
    return () => clearTimeout(timeout);
  }, [characters]);

  return (
    <div className="row fade-in">
      {displayedCharacters.map((character) => (
        <div className="col-md-3 mb-3" key={character.id}>
          <Card className="shadow-sm">
            <Card.Img variant="top" src={character.image} alt={character.name} />
            <Card.Body>
              <Card.Title>{character.name}</Card.Title>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
}