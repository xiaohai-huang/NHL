import styles from "./GameGrid.module.css";

type MatchUpCellData = {
  home: boolean;
  away: boolean;
  /**
   * URL, the team's logo.
   */
  logo: string;
  score: number;
};

export type MatchUpRowData = {
  teamName: string;
  Mon?: MatchUpCellData;
  Tue?: MatchUpCellData;
  Wed?: MatchUpCellData;
  Thu?: MatchUpCellData;
  Fri?: MatchUpCellData;
  Sat?: MatchUpCellData;
  Sun?: MatchUpCellData;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function MatchUpRow(props: MatchUpRowData) {
  return (
    <tr>
      {/* Team Name */}
      <td>{props.teamName}</td>
      {/* Days */}
      {DAYS.map((day) => {
        // @ts-ignore
        const cellData = props[day] as MatchUpCellData | undefined;
        if (!cellData) return <td key={day}>-</td>;
        return <MatchUpCell key={day} {...cellData} />;
      })}

      {/* Total Game Played */}
      <td>{getTotalGamePlayed(props)}</td>
    </tr>
  );
}

function getTotalGamePlayed(matchUps: MatchUpRowData) {
  let num = 0;
  DAYS.forEach((day) => {
    // @ts-ignore
    const matchUp = matchUps[day];
    if (matchUp) num++;
  });
  return num;
}

function MatchUpCell({ home, away, logo, score }: MatchUpCellData) {
  return (
    <td>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className={styles.homeAway}>
            {home && "HOME"}
            {away && "AWAY"}
          </span>
          <p className={styles.score}>{score}</p>
        </div>
        <img alt="Team logo" width={30} height={30} src={logo} />
      </div>
    </td>
  );
}

export default MatchUpRow;
