import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Header from "./Header";
import TeamRow from "./TeamRow";
import TotalGamesPerDayRow from "./TotalGamesPerDayRow";

import { addDays, startAndEndOfWeek } from "../../utils/date-func";
import useTeams from "../../hooks/useTeams";
import styles from "./GameGrid.module.css";

export default function GameGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  // [startDate, endDate]
  const [dates, setDates] = useState<[string, string]>(() =>
    startAndEndOfWeek()
  );
  const [matchUps, totalGamesPerDay] = useTeams(...dates);

  // PREV, NEXT button click
  const handleClick = (action: string) => () => {
    let days = 7;
    if (action === "PREV") days = -7;

    let [start, end] = dates;
    const newStart = addDays(new Date(start), days).toISOString().split("T")[0];
    const newEnd = addDays(new Date(end), days).toISOString().split("T")[0];
    setSearchParams({ startDate: newStart, endDate: newEnd });
    setDates([newStart, newEnd]);
  };

  // Sync dates with URL search params
  useEffect(() => {
    let ignore = false;
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    if (start && end) {
      if (!ignore) {
        setDates([start, end]);
      }
    }
    return () => {
      ignore = true;
    };
  }, [searchParams]);

  // console.log(matchUps);

  return (
    <>
      <button className={styles.dateButtonPrev} onClick={handleClick("PREV")}>
        Prev
      </button>
      <button className={styles.dateButtonNext} onClick={handleClick("NEXT")}>
        Next
      </button>
      <table className={styles.scheduleGrid}>
        <Header start={dates[0]} end={dates[1]} />
        <tbody>
          {/* Total Games Per Day */}
          <TotalGamesPerDayRow games={totalGamesPerDay} />
          {/* Teams */}
          {matchUps.map((row) => {
            return <TeamRow key={row.teamName} {...row} />;
          })}
        </tbody>
      </table>
    </>
  );
}
