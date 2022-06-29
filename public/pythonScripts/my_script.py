import pandas as pd
import numpy as np
from scipy.stats import poisson



from pyodide.http import pyfetch
import asyncio

async def fetch_data():
    # seasonId<=20212022 and seasonId>=20212022
    start_season_id = 20212022
    end_season_id = 20212022
    query = 'isAggregate=false&isGame=false&sort=[{"property":"points","direction":"DESC"},{"property":"wins","direction":"DESC"},{"property":"teamId","direction":"ASC"}]&start=0&limit=50&factCayenneExp=gamesPlayed>=1&cayenneExp=gameTypeId=2 and '+ \
            f'seasonId<={end_season_id} and seasonId>={start_season_id}'
    proxy_url = "https://cors-anywhere.herokuapp.com/"
    url = f"https://api.nhle.com/stats/rest/en/team/summary?{query}"


    async def request():
        response = await pyfetch(url=url, method="GET")
        return await response.json()
   
    data = await request()
    data = data["data"]

    df = pd.DataFrame.from_dict(data)

    # Make team name display at the first column
    columns = df.columns.tolist()
    columns.remove("teamFullName")
    columns = ["teamFullName", *columns]

    # remove ties
    if "ties" in columns:
        columns.remove("ties")

    df = df[columns]

    df["O-Strength"] = df["goalsForPerGame"] / df["goalsForPerGame"].mean()
    df["D-Strength"] = df["goalsAgainstPerGame"] / df["goalsAgainstPerGame"].mean()
    return df



def get_XGF(home_team, away_team, df):
    avgGFperGame = df["goalsForPerGame"].mean()
    home_team_data = df[df["teamFullName"]==home_team]
    away_team_data = df[df["teamFullName"]==away_team]

    home_OScore = home_team_data["O-Strength"].iloc[0]
    away_DScore = away_team_data["D-Strength"].iloc[0]

    xGF = (home_OScore * away_DScore) * avgGFperGame


    # print(f"home_OScore={home_OScore}")
    # print(f"away_DScore={away_DScore}")
    # print(f"avgGFperGame={avgGFperGame}")
    # print(f"xGF={xGF}")
    return xGF

def get_game_scores_(home_team, away_team,df):
    home_xGF = get_XGF(home_team, away_team,df)
    away_xGF = get_XGF(away_team, home_team,df)

    num_rows = 10
    num_cols = 10
    table = []

    for row_idx in range(num_rows):
        col = []
        for col_idx in range(num_cols):
            first = poisson.pmf(mu=home_xGF, k=row_idx)
            second = poisson.pmf(mu=away_xGF, k=col_idx)
            r = first*second
            col.append(r)
        table.append(col)

    table = np.array(table)


    red = 0
    row_idx = 1
    for col_idx in range(table.shape[1]-1):
        col = table[row_idx:, col_idx]
        red += np.sum(col)
        row_idx += 1
        
    blue = np.sum(table.diagonal())

    yellow = 0

    row_idx = 1
    for col_idx in range(1, table.shape[1]):
        col = table[:row_idx, col_idx]
        yellow += np.sum(col)
        row_idx += 1

    home_score = red + blue/2
    away_score = yellow + blue/2
    odds = home_score + away_score

    return [odds, home_score, away_score]


df = None
async def get_game_scores(home_team, away_team):
    # global df
    # if type(df) == type(None):
    #     print("df is None, fetching data")
    #     df= await fetch_data()
   

    return f'{get_game_scores_(home_team,away_team, df)}'

async def init():
    global df
    if type(df) == type(None):
        print("df is None, fetching data")
        df= await fetch_data()
    