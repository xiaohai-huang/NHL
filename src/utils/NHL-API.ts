import { parseDateStr } from "../components/GameGrid/Header";
import {
  DAYS,
  MatchUpCellData,
  TeamRowData,
} from "../components/GameGrid/TeamRow";
import { getDayStr } from "./date-func";

const URL = `https://statsapi.web.nhl.com/api/v1/`;

export default function getData(path: string) {
  return fetch(`${URL}${path}`).then((res) => res.json());
}

export type Team = {
  id: number;
  name: string;
};

type Game = {
  /**
   * e.g. 2022-04-27T23:30:00Z
   */
  gameDate: string;
  /**
   * 2022-04-27
   */
  date: string;
  teams: {
    home: {
      team: Team;
      score: number;
    };
    away: {
      team: Team;
      score: number;
    };
  };
};
/**
 * API: schedule?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
 * @param start Date string. e.g., 2020-01-13
 * @param end Date string. e.g., 2020-01-13
 * @returns
 */
export async function getTeams(
  start: string,
  end: string
): Promise<[TeamRowData[], number[]]> {
  const dates = (await getData(`schedule?startDate=${start}&endDate=${end}`))
    .dates;
  const games: Game[] = dates.map((date: any) => date.games).flat() as Game[];

  // Obtain Total Games Per Day
  const temp1: { [day: string]: number } = {};
  const totalGamesPerDay: number[] = [];
  dates.forEach(
    ({
      date,
      totalGames,
      games,
    }: {
      date: string;
      totalGames: number;
      games: Game[];
    }) => {
      const day = getDayStr(parseDateStr(date));
      temp1[day] = totalGames;

      // use the Gregorian calendar day
      games.forEach((game) => {
        game.date = date;
      });
    }
  );

  DAYS.forEach((day) => {
    const numGames = temp1[day] ?? 0;
    totalGamesPerDay.push(numGames);
  });

  const temp: { [day: string]: MatchUpCellData } = {};
  // console.log(games);

  games.forEach((game) => {
    const day = getDayStr(parseDateStr(game.date));

    const { home, away } = game.teams;
    temp[home.team.name] = {
      ...temp[home.team.name],
      [day]: {
        home: true,
        away: false,
        logo: getTeamLogo(away.team.name),
        score: home.score,
      },
    };

    temp[away.team.name] = {
      ...temp[away.team.name],
      [day]: {
        home: false,
        away: true,
        logo: getTeamLogo(home.team.name),
        score: away.score,
      },
    };
  });
  // console.log(temp);
  const teams: TeamRowData[] = [];

  Object.entries(temp).forEach(([teamName, games]) => {
    teams.push({
      teamName: teamName,
      ...games,
      totalGamesPlayed: 0,
      totalOffNights: 0,
    });
  });

  const offNights = getOffNights(totalGamesPerDay);
  teams.forEach((row) => {
    // add off nights to each day for shading light color
    offNights.forEach((day) => {
      // @ts-ignore
      row[day] = { ...row[day], offNight: true };
    });

    // add Total GP for each team
    const totalGamesPlayed = getTotalGamePlayed(row);

    // add Total Off-Nights
    const totalOffNights = calcTotalOffNights(row);

    row.totalGamesPlayed = totalGamesPlayed;
    row.totalOffNights = totalOffNights;
  });

  return [teams, totalGamesPerDay];
}

function getTeamLogo(teamName: string) {
  return `/teamLogos/${teamName}.png`;
}

export async function getAllTeams(): Promise<Team[]> {
  const teams = (await getData("teams")).teams.map((team: any) => ({
    id: team.id,
    name: team.name,
  }));
  return teams;
}

function getOffNights(totalGamesPerDay: number[]) {
  const days: string[] = [];
  totalGamesPerDay.forEach((numGames, i) => {
    // when a day has <= 8 games, mark that day as off night
    if (numGames <= 8) {
      days.push(DAYS[i]);
    }
  });
  return days;
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

function getTotalGamePlayed(matchUps: TeamRowData) {
  let num = 0;
  DAYS.forEach((day) => {
    // @ts-ignore
    const hasMatchUp_ = hasMatchUp(matchUps[day]);
    if (hasMatchUp_) num++;
  });
  return num;
}

/**
 * If a team plays game at off night day, then increment counter by 1.
 * @param matchUps All match ups. Monday ~ Sunday
 * @returns Total Off Nights
 */
function calcTotalOffNights(matchUps: TeamRowData) {
  let num = 0;
  DAYS.forEach((day) => {
    // @ts-ignore
    const matchUp: MatchUpCellData = matchUps[day];
    const hasMatchUp_ = hasMatchUp(matchUp);
    if (hasMatchUp_ && matchUp.offNight) num++;
  });
  return num;
}
