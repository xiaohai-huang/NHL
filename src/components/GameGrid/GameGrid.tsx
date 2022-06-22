import { useState } from "react";

import {
  addDays,
  dateDiffInDays,
  formatDate,
  getDayStr,
} from "../../utils/date-func";
import MatchUpRow, { MatchUpRowData } from "./MatchUpRow";
import TotalGamesPerDayRow from "./TotalGamesPerDayRow";

import styles from "./GameGrid.module.css";

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
];

export default function GameGrid() {
  const [data, setData] = useState(() => [...defaultData]);
  // startDate, endDate
  const [dates, setDates] = useState<[string, string]>(() => [
    "2022-06-20",
    "2022-06-26",
  ]);
  const columns = [
    { label: "Team Name", id: "teamName" },
    ...getDayColumns(...dates),
    { label: "Total GP", id: "totalGP" },
  ];
  return (
    <table className={styles.scheduleGrid}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.id}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Total Games Per Day */}
        <TotalGamesPerDayRow games={[0, 1, 0, 1, 0, 0, 1]} />
        {/* Teams */}
        {data.map((row) => (
          <tr key={row.teamName}>
            <MatchUpRow {...row} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function getDayColumns(start: string, end: string) {
  // "2022-06-20", "2022-06-20"
  const startDate = new Date(start);
  const endDate = new Date(end);

  const days = dateDiffInDays(startDate, endDate);
  const columns = [] as { label: JSX.Element | string; id: string }[];
  let current = startDate;
  for (let i = 0; i <= days; i++) {
    columns.push({
      label: (
        <>
          {getDayStr(current)}
          <br /> {formatDate(current)}
        </>
      ),
      id: getDayStr(current),
    });
    current = addDays(current, 1);
  }

  return columns;
}
