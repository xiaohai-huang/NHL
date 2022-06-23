import styles from "./GameGrid.module.css";

export type MatchUpCellData = {
  home: boolean;
  away: boolean;
  /**
   * URL, the opponent's team logo.
   */
  logo: string;
  score: number;
  /**
   * if the total # of games played that day was <=8
   * to signify what I call an “Off-Night”
   */
  offNight: boolean;
};

export type TeamRowData = {
  teamName: string;
  Mon?: MatchUpCellData;
  Tue?: MatchUpCellData;
  Wed?: MatchUpCellData;
  Thu?: MatchUpCellData;
  Fri?: MatchUpCellData;
  Sat?: MatchUpCellData;
  Sun?: MatchUpCellData;
  totalGamesPlayed: number;
  totalOffNights: number;
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function TeamRow(props: TeamRowData) {
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

      {/* Total Games Played */}
      <td>{props.totalGamesPlayed}</td>
      {/* Total Off-Nights */}
      <td>{props.totalOffNights}</td>
    </tr>
  );
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

export default TeamRow;
