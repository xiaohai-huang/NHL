import styles from "./GameGrid.module.css";

type TotalGamesPerDayRowProps = {
  games: number[];
};

function TotalGamesPerDayRow({ games }: TotalGamesPerDayRowProps) {
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
      <td>{calcTotalOffNights(games)}</td>
    </tr>
  );
}

/**
 * That will be a total of a teams # of Games played
 * that week on a day where <=8 games are occurring.
 * @param games
 */
function calcTotalOffNights(games: number[]) {
  let total = 0;
  games.forEach((gamesPlayed) => {
    if (gamesPlayed <= 8) {
      total++;
    }
  });
  return total;
}

export default TotalGamesPerDayRow;
