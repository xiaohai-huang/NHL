import { DAYS, TeamRowData } from "../components/GameGrid/TeamRow";
import getPython from "./initPython";

let runtime: any = null;
export async function initGameScoreEnv() {
  if (!runtime) {
    runtime = await getPython;
    const pyCode = await fetch("/pythonScripts/my_script.py").then((res) =>
      res.text()
    );
    console.log({ pyCode });

    await runtime.runPythonAsync(pyCode);
    await runtime.runPythonAsync("init()");
  }
}

export default async function calcGameScore(
  homeTeam: string,
  awayTeam: string
) {
  // [odds, home_score, away_score]
  const result = await runtime.runPythonAsync(
    `get_game_scores("${homeTeam}","${awayTeam}")`
  );
  const parsed = JSON.parse(result) as [number, number, number];

  return parsed[1];
}

/**
 * Test if the day is the 2d day of a back-to-back.
 * @param gameScores A list of GameScores
 * @param day The index of the day
 * @returns true if the `day` is 2d day of a back-to-back. Otherwise, false.
 */
export function isBackToBack(gameScores: (number | null)[], day: number) {
  if (day <= 0) return false;
  const playedYesterday = gameScores[day - 1] !== null;
  const playedToday = gameScores[day] !== null;

  if (!playedToday) return false;
  if (playedYesterday && playedToday) return true;
  return false;
}

/**
 * Convert a TeamRowData to a list of GameScores.
 * @param row A team's stats for a week
 * @returns A list of GameScores. e.g., [null, 0.3, null, 0.3, 6.4, null, 2.7]
 */
export function convertTeamRowToGameScores(row: TeamRowData) {
  const scores: (number | null)[] = [];
  DAYS.forEach((day, i) => {
    const score = row[day]?.score;
    scores[i] = score !== undefined ? score : null;
  });
  return scores;
}

/**
 *
 * Adjust the **GameScore** if a team plays 2x in 2 nights (called a back to back), the gameScore is multiplied by `dilutedFactor` for the second game.
 *
 * If a team also plays a team that is playing game 2/2 in a back to back, no handicap is placed
 *
 * Higher the game Score, the better a chance a team has to win.
 *
 * Directly operates on the argument.
 *
 * @param teams The whole league
 * @param dilutedFactor The penalty term for the 2d game.
 */
export function adjustBackToBackGames(
  teams: TeamRowData[],
  dilutedFactor: number = 0.75
): void {
  teams.forEach((row) => {
    const scores = convertTeamRowToGameScores(row);
    DAYS.forEach((day, i) => {
      const oldScore = row[day]?.score;
      if (!oldScore) return;
      // test if the current day is the 2d back-to-back game
      if (isBackToBack(scores, i)) {
        // multiply by 0.75
        row[day]!.score = oldScore * dilutedFactor;
      }
      // test if the opponent is also playing a 2d back-to-back game
      const opponent = teams.find((item) => {
        return item.teamName === row[day]?.opponentName;
      });

      if (opponent) {
        const opponentGameScores = convertTeamRowToGameScores(opponent);
        if (isBackToBack(scores, i) && isBackToBack(opponentGameScores, i)) {
          // don't multiply by 0.75
          row[day]!.score = oldScore;
        }
      }
    });
  });
}

/**
 * GameScore would have to be adjusted to be within a -5 to 5 range, with 50% being 0.
  - 75% winOdds = 2.5
  - 25% winOdds = -2.5
 * @param score A floating point number between 0 and 1
 * @returns 
 */
export function formatGameScore(score: number) {
  return (score * 10 - 5).toFixed(2);
}
