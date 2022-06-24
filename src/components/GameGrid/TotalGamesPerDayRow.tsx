import { Day } from "./GameGrid";
import { DAYS } from "./TeamRow";

import styles from "./GameGrid.module.css";

type TotalGamesPerDayRowProps = {
  games: number[];
  excludedDays: Day[];
};

function TotalGamesPerDayRow({
  games,
  excludedDays,
}: TotalGamesPerDayRowProps) {
  return (
    <tr>
      <td>Total Games Per Day</td>
      {games.map((numGames, i) => (
        <td className={styles.totalGamesPerDayCell} key={i}>
          {numGames}
        </td>
      ))}
      {/* Total GP */}
      <td>{games.reduce((prev, current) => prev + current, 0)}</td>
      {/* Total Off-Nights */}
      <td>{calcTotalOffNights(games, excludedDays)}</td>
    </tr>
  );
}

/**
 * That will be a total of a teams # of Games played
 * that week on a day where <=8 games are occurring.
 * @param games
 */
function calcTotalOffNights(games: number[], excludedDays: Day[]) {
  let total = 0;
  // ["Fri","Tue"] => [4, 1]
  const excludedDaysIdx = excludedDays.map((day) => DAYS.indexOf(day));
  games.forEach((gamesPlayed, i) => {
    const excluded = excludedDaysIdx.includes(i);
    if (!excluded && gamesPlayed <= 8) {
      total++;
    }
  });
  return total;
}

export default TotalGamesPerDayRow;
