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
      {/* Total GP (last column) */}
      <td>{games.reduce((prev, current) => prev + current, 0)}</td>
    </tr>
  );
}

export default TotalGamesPerDayRow;
