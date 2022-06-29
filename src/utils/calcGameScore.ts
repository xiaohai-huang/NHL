import getPython from "./initPython";

// http://localhost:3000/pythonScripts/my_script.py

let runtime: any = null;
export async function initGameScoreEnv() {
  if (!runtime) {
    runtime = await getPython;
    const pyCode = await fetch("/pythonScripts/my_script.py").then((res) =>
      res.text()
    );
    console.log({ pyCode });

    await runtime.runPythonAsync(pyCode);
    await runtime.runPythonAsync("init()");
  }
}

export default async function calcGameScore(
  homeTeam: string,
  awayTeam: string
) {
  // [odds, home_score, away_score]
  const result = await runtime.runPythonAsync(
    `get_game_scores("${homeTeam}","${awayTeam}")`
  );
  const parsed = JSON.parse(result) as [number, number, number];
  console.log({ homeTeam, awayTeam, scores: parsed });

  return parsed[1];
}

export function handleBackToBackGameScore(gameScores: number | null[]) {
  return [];
}