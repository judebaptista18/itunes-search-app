import React from "react";
import { ItunesResult } from "../../types";
import {
  Card,
  Badge,
  Artwork,
  ArtworkPlaceholder,
  Info,
  Title,
  Sub,
} from "./ResultCard.styles";
import { formatTitle, formatSub, typeLabel } from "./ResultCard.utils";

interface ResultCardProps {
  item: ItunesResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ item }) => {
  /**
   * Derived display values.
   * Keeps JSX clean and separates formatting logic from UI.
   */
  const title = formatTitle(item);
  const sub = formatSub(item);
  const label = typeLabel(item);

  return (
    /**
     * Card acts as a semantic container for a single result item.
     * aria-label improves accessibility for screen readers.
     */
    <Card data-testid="result-card" aria-label={`${label}: ${title}`}>
      {/**
       * Artwork rendering:
       * - Shows image if available
       * - Falls back to placeholder for missing artwork
       */}
      {item.artworkUrl100 ? (
        <Artwork src={item.artworkUrl100} alt={title} loading="lazy" />
      ) : (
        <ArtworkPlaceholder aria-hidden="true">
          {item.wrapperType ?? "track"}
        </ArtworkPlaceholder>
      )}
      <Info>
        <Title>{title}</Title>
        {sub && <Sub>{sub}</Sub>}
      </Info>
      <Badge $type={item.wrapperType} data-testid="type-badge">
        {label}
      </Badge>
    </Card>
  );
};

export default ResultCard;
