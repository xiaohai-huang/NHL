import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import Header from "./Header";
import TeamRow from "./TeamRow";
import TotalGamesPerDayRow, { calcTotalGP } from "./TotalGamesPerDayRow";

import { addDays, startAndEndOfWeek } from "../../utils/date-func";
import { calcTotalOffNights, getTotalGamePlayed } from "../../utils/NHL-API";
import useTeams from "../../hooks/useTeams";
import useTitle from "../../hooks/useTitle";
import calcWeekScore from "../../utils/calcWeekScore";
import { convertTeamRowToWinOddsList } from "../../utils/calcWinOdds";

import styles from "./GameGrid.module.css";

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export default function GameGrid() {
  useTitle("FHFH | Game Grid");
  const [searchParams, setSearchParams] = useSearchParams();
  // [startDate, endDate]
  const [dates, setDates] = useState<[string, string]>(() =>
    startAndEndOfWeek()
  );
  const [teams, totalGamesPerDay, loading] = useTeams(...dates);
  const [excludedDays, setExcludedDays] = useState<Day[]>([]);
  const [sortKeys, setSortKeys] = useState<
    { key: string; ascending: boolean }[]
  >([]);

  // calculate new total GP and total off-nights based on excluded days.
  const filteredColumns = useMemo(() => {
    const copy = [...teams];
    const totalGP = calcTotalGP(totalGamesPerDay, excludedDays);
    copy.forEach((row) => {
      // add Total GP for each team
      const totalGamesPlayed = getTotalGamePlayed(row, excludedDays);

      // add Total Off-Nights
      const totalOffNights = calcTotalOffNights(row, excludedDays);

      row.totalGamesPlayed = totalGamesPlayed;
      row.totalOffNights = totalOffNights;

      // add Week Score
      const winOddsList = convertTeamRowToWinOddsList(row);

      row.weekScore = calcWeekScore(
        winOddsList,
        totalOffNights,
        totalGP,
        totalGamesPlayed
      );
    });
    return copy;
  }, [excludedDays, teams, totalGamesPerDay]);

  const sortedTeams = useMemo(() => {
    return [...filteredColumns].sort((a, b) => {
      for (let i = 0; i < sortKeys.length; i++) {
        const { key, ascending } = sortKeys[i];
        if (a[key] - b[key] !== 0) {
          return ascending ? a[key] - b[key] : b[key] - a[key];
        }
      }
      return a.teamName.localeCompare(b.teamName);
    });
  }, [sortKeys, filteredColumns]);

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

  return (
    <>
      <button className={styles.dateButtonPrev} onClick={handleClick("PREV")}>
        Prev
      </button>
      <button className={styles.dateButtonNext} onClick={handleClick("NEXT")}>
        Next
      </button>
      {loading && <p style={{ color: "white" }}>loading...</p>}
      <table className={styles.scheduleGrid}>
        <Header
          start={dates[0]}
          end={dates[1]}
          setSortKeys={setSortKeys}
          excludedDays={excludedDays}
          setExcludedDays={setExcludedDays}
        />
        <tbody>
          {/* Total Games Per Day */}
          <TotalGamesPerDayRow
            games={totalGamesPerDay}
            excludedDays={excludedDays}
          />
          {/* Teams */}
          {sortedTeams.map((row) => {
            return <TeamRow key={row.teamName} {...row} />;
          })}
        </tbody>
      </table>
    </>
  );
}
