import { parseDateStr } from "../components/GameGrid/Header";
import { DAYS, MatchUpCellData, MatchUpRowData } from "../components/GameGrid/MatchUpRow";
import { getDayStr } from "./date-func";

const URL = `https://statsapi.web.nhl.com/api/v1/`

export default function getData(path:string){
    return fetch(`${URL}${path}`).then(res=>res.json())
}

export type Team = {
    id:number;
    name: string;
}

type Game = {
    /**
     * e.g. 2022-04-27T23:30:00Z
     */
    gameDate:string;
    /**
     * 2022-04-27
     */
    date:string;
    teams:{
        home:{
            team:Team;
            score:number;
        },
        away:{
            team:Team;
            score:number;
        }
    }
}
/**
 * API: schedule?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
 * @param start Date string. e.g., 2020-01-13
 * @param end Date string. e.g., 2020-01-13
 * @returns 
 */
export async function getMatchUps(start:string, end:string): Promise<[MatchUpRowData[], number[]]>{
    const dates = (await getData(`schedule?startDate=${start}&endDate=${end}`)).dates;
    const games:Game[] = dates.map((date:any)=>date.games).flat() as Game[];
     
    // Obtain Total Games Per Day
    const temp1:{[day:string]:number} = {}
    const totalGamesPerDay:number[] = [];
    dates.forEach(({date,totalGames, games}:{date:string;totalGames:number; games:Game[]})=>{
        const day = getDayStr(parseDateStr(date));
        temp1[day] = totalGames;

        // use the Gregorian calendar day
        games.forEach(game=>{
            game.date = date; 
        })
    })

    DAYS.forEach((day)=>{
        const numGames = temp1[day] ?? 0;
        totalGamesPerDay.push(numGames)
    })


    const temp:{[day:string]:MatchUpCellData} = {};
    // console.log(games);

    games.forEach(game=>{
        const day = getDayStr(parseDateStr(game.date));
                
        const {home, away} = game.teams;
        temp[home.team.name] = {...temp[home.team.name], [day]:{
            home:true,
            away:false,
            logo:getTeamLogo(away.team.name),
            score:home.score
        }}

        temp[away.team.name] = {...temp[away.team.name], [day]:{
            home:false,
            away:true,
            logo:getTeamLogo(home.team.name),
            score:away.score
        }}
    })
    // console.log(temp);
    const matchUps:MatchUpRowData[] = [];

    Object.entries(temp).forEach(([teamName, games])=>{
        matchUps.push({
            teamName: teamName,
            ...games
        })
    })
    
    
    // console.log(matchUps);
    
    return [matchUps,totalGamesPerDay];
}

function getTeamLogo(teamName:string){
    return `/teamLogos/${teamName}.png`
}

export async function getAllTeams():Promise <Team[]>{
    const teams = (await getData("teams")).teams.map((team:any)=>({
        id:team.id,
        name:team.name
    }));
    return teams;
}