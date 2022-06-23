import styles from "./GameGrid.module.css";

export type MatchUpCellData = {
  home: boolean;
  away: boolean;
  /**
   * URL, the team's logo.
   */
  logo: string;
  score: number;
  /**
   * if the total # of games played that day was <=8
   * to signify what I call an “Off-Night”
   */
  offNight: boolean;
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

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function MatchUpRow(props: MatchUpRowData) {
  return (
    <tr>
      {/* Team Name */}
      <td>{props.teamName}</td>
      {/* Days */}
      {DAYS.map((day) => {
        // @ts-ignore
        const cellData = props[day] as MatchUpCellData | undefined;
        const hasMatchUp_ = cellData && hasMatchUp(cellData);
        return (
          <td
            key={day}
            style={cellData?.offNight ? { backgroundColor: "#505050" } : {}}
          >
            {hasMatchUp_ ? <MatchUpCell key={day} {...cellData} /> : "-"}
          </td>
        );
      })}

      {/* Total Game Played */}
      <td>{getTotalGamePlayed(props)}</td>
      {/* Total Off-Nights */}
      <td>{calcTotalOffNights(props)}</td>
    </tr>
  );
}

function getTotalGamePlayed(matchUps: MatchUpRowData) {
  let num = 0;
  DAYS.forEach((day) => {
    // @ts-ignore
    const hasMatchUp_ = hasMatchUp(matchUps[day]);
    if (hasMatchUp_) num++;
  });
  return num;
}

function MatchUpCell({ home, away, logo, score }: MatchUpCellData) {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginRight: "4px",
        }}
      >
        <span className={styles.homeAway}>
          {home && "HOME"}
          {away && "AWAY"}
        </span>
        <p className={styles.score}>{score}</p>
      </div>
      <img alt="Team logo" width={30} height={30} src={logo} />
    </div>
  );
}

/**
 * Test if the match up exist.
 * If a match up does not exist, then its home and away will both be false.
 * @param matchUp A match up.
 * @returns true if the match up exist, otherwise false.
 */
function hasMatchUp(matchUp: MatchUpCellData) {
  return matchUp?.away || matchUp?.home;
}

/**
 * If a team plays game at off night day, then increment counter by 1.
 * @param matchUps All match ups. Monday ~ Sunday
 * @returns Total Off Nights
 */
function calcTotalOffNights(matchUps: MatchUpRowData) {
  let num = 0;
  DAYS.forEach((day) => {
    // @ts-ignore
    const matchUp: MatchUpCellData = matchUps[day];
    const hasMatchUp_ = hasMatchUp(matchUp);
    if (hasMatchUp_ && matchUp.offNight) num++;
  });
  return num;
}

export default MatchUpRow;
