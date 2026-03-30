import React from 'react';
import { ItunesResult } from '../../types';
import { Card, Badge , Artwork, ArtworkPlaceholder, Info, Title, Sub} from './resultCard.styles';
import { formatTitle, formatSub, typeLabel } from './ResultCard.utils';

interface ResultCardProps {
  item: ItunesResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ item }) => {
  const title = formatTitle(item);
  const sub = formatSub(item);

  return (
    <Card data-testid="result-card" aria-label={`${typeLabel(item)}: ${title}`}>
      {item.artworkUrl100 ? (
        <Artwork src={item.artworkUrl100} alt={title} loading="lazy" />
      ) : (
        <ArtworkPlaceholder aria-hidden="true">
          {item.wrapperType ? item.wrapperType : "Music"}
        </ArtworkPlaceholder>
      )}
      <Info>
        <Title>{title}</Title>
        {sub && <Sub>{sub}</Sub>}
      </Info>
      <Badge $type={item.wrapperType} data-testid="type-badge">
        {typeLabel(item)}
      </Badge>
    </Card>
  );
};

export default ResultCard;
