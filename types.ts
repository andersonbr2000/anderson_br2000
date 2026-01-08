
export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  isPlayed: boolean;
  round: number;
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  teamColor: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}
