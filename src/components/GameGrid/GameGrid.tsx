import { useState } from "react";

import MatchUpRow, { MatchUpRowData } from "./MatchUpRow";
import TotalGamesPerDayRow from "./TotalGamesPerDayRow";

import styles from "./GameGrid.module.css";
import Header from "./Header";

const defaultData: MatchUpRowData[] = [
  {
    teamName: "Colorado Avalanche",
    Tue: {
      home: true,
      away: false,
      logo: "http://127.0.0.1:5500/teamLogos/Tampa%20Bay%20Lightning.png",
      score: 7.33,
    },
    Thu: {
      home: false,
      away: true,
      logo: "http://127.0.0.1:5500/teamLogos/Tampa%20Bay%20Lightning.png",
      score: 6.9,
    },
    Sun: {
      home: false,
      away: true,
      logo: "http://127.0.0.1:5500/teamLogos/Tampa%20Bay%20Lightning.png",
      score: 1.03,
    },
  },
  {
    teamName: "Tampa Bay Lightning",
    Tue: {
      home: false,
      away: true,
      logo: "http://127.0.0.1:5500/teamLogos/Colorado%20Avalanche.png",
      score: 0.33,
    },
    Thu: {
      home: true,
      away: false,
      logo: "http://127.0.0.1:5500/teamLogos/Colorado%20Avalanche.png",
      score: 2.9,
    },
    Sun: {
      home: true,
      away: false,
      logo: "http://127.0.0.1:5500/teamLogos/Colorado%20Avalanche.png",
      score: 71.03,
    },
  },
  {
    teamName: "xiaohai",
  },
];

function useData(start: string, end: string) {}

export default function GameGrid() {
  const [data, setData] = useState(() => [...defaultData]);
  // startDate, endDate
  const [dates, setDates] = useState<[string, string]>(() => [
    "2022-06-20",
    "2022-06-26",
  ]);

  return (
    <table className={styles.scheduleGrid}>
      <Header start={dates[0]} end={dates[1]} />
      <tbody>
        {/* Total Games Per Day */}
        <TotalGamesPerDayRow games={[0, 1, 0, 1, 0, 0, 1]} />
        {/* Teams */}
        {data.map((row) => (
          <MatchUpRow key={row.teamName} {...row} />
        ))}
      </tbody>
    </table>
  );
}
