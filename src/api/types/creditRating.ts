export interface RatingByCriteria {
  score: number;
  ratingLevel: string;
}

export interface RatingByCIC {
  score: number;
  riskLevel: string;
  scoringDate: string;
  document: string;
  term: number;
}

export interface CreditRatingRequest {
  ratingByCriteria: RatingByCriteria;
  ratingByCIC: RatingByCIC;
  application: {
    id: string;
  };
}

export interface CreditRatingResponse {
  id: string;
  ratingByCriteria: RatingByCriteria;
  ratingByCIC: RatingByCIC;
  createdAt: string;
  updatedAt: string;
}
