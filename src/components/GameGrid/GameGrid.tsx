import { useEffect, useState, useMemo } from "react";

import Header from "./Header";
import MatchUpRow, { DAYS, MatchUpRowData } from "./MatchUpRow";
import TotalGamesPerDayRow from "./TotalGamesPerDayRow";

import styles from "./GameGrid.module.css";
import { getAllTeams, getMatchUps, Team } from "../../utils/NHL-API";
import { addDays, startAndEndOfWeek } from "../../utils/date-func";
import { useSearchParams } from "react-router-dom";

// const defaultData: MatchUpRowData[] = [
//   {
//     teamName: "Colorado Avalanche",
//     Tue: {
//       home: true,
//       away: false,
//       logo: "http://127.0.0.1:5500/teamLogos/Tampa%20Bay%20Lightning.png",
//       score: 7.33,
//     },
//     Thu: {
//       home: false,
//       away: true,
//       logo: "http://127.0.0.1:5500/teamLogos/Tampa%20Bay%20Lightning.png",
//       score: 6.9,
//     },
//     Sun: {
//       home: false,
//       away: true,
//       logo: "http://127.0.0.1:5500/teamLogos/Tampa%20Bay%20Lightning.png",
//       score: 1.03,
//     },
//   },
//   {
//     teamName: "Tampa Bay Lightning",
//     Tue: {
//       home: false,
//       away: true,
//       logo: "http://127.0.0.1:5500/teamLogos/Colorado%20Avalanche.png",
//       score: 0.33,
//     },
//     Thu: {
//       home: true,
//       away: false,
//       logo: "http://127.0.0.1:5500/teamLogos/Colorado%20Avalanche.png",
//       score: 2.9,
//     },
//     Sun: {
//       home: true,
//       away: false,
//       logo: "http://127.0.0.1:5500/teamLogos/Colorado%20Avalanche.png",
//       score: 71.03,
//     },
//   },
//   {
//     teamName: "xiaohai",
//   },
// ];

function useMatchUps(start: string, end: string): [MatchUpRowData[], number[]] {
  const [matchUps, setMatchUps] = useState<MatchUpRowData[]>([]);
  const [totalGamesPerDay, setTotalGamesPerDay] = useState<number[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      const teams = await getAllTeams();
      if (!ignore) {
        setAllTeams(teams);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const [matchUps, totalGamesPerDay] = await getMatchUps(start, end);
      if (!ignore) {
        const paddedMatchUps = [...matchUps];
        // add other teams even they are not playing
        allTeams.forEach((team) => {
          const exist =
            matchUps.findIndex((matchUp) => matchUp.teamName === team.name) !==
            -1;
          if (!exist) {
            paddedMatchUps.push({ teamName: team.name });
            // console.log("add team: " + team.name);
          }
        });
        paddedMatchUps.sort((a, b) => a.teamName.localeCompare(b.teamName));
        setMatchUps(paddedMatchUps);
        setTotalGamesPerDay(totalGamesPerDay);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [start, end, allTeams]);

  return [matchUps, totalGamesPerDay];
}

export default function GameGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  // [startDate, endDate]
  const [dates, setDates] = useState<[string, string]>(() =>
    startAndEndOfWeek()
  );
  const [matchUps, totalGamesPerDay] = useMatchUps(...dates);
  const offNights = useMemo(() => {
    const days: string[] = [];
    totalGamesPerDay.forEach((numGames, i) => {
      // when a day has <= 8 games, mark that day as off night
      if (numGames <= 8) {
        days.push(DAYS[i]);
      }
    });
    return days;
  }, [totalGamesPerDay]);

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
      <table className={styles.scheduleGrid}>
        <Header start={dates[0]} end={dates[1]} />
        <tbody>
          {/* Total Games Per Day */}
          <TotalGamesPerDayRow games={totalGamesPerDay} />
          {/* Teams */}
          {matchUps.map((row) => {
            const rowData = { ...row };
            offNights.forEach((day) => {
              // @ts-ignore
              rowData[day] = { ...rowData[day], offNight: true };
            });
            return <MatchUpRow key={row.teamName} {...rowData} />;
          })}
        </tbody>
      </table>
    </>
  );
}
