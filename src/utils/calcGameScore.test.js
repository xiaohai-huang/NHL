import { formatGameScore, handleBackToBackGameScore } from "./calcGameScore";

it('format game score', () => {
    expect(formatGameScore(0.75)).toEqual("2.50");
    expect(formatGameScore(0.25)).toEqual("-2.50");
});

it("Back to back game score", () => {
    const originalGameScores = [null, 0.3, null, 0.3, 6.4, null, 2.7];
    const updatedGameScores = [null, 0.3, null, 0.3, 4.8, null, 2.7];

    expect(handleBackToBackGameScore(originalGameScores)).toEqual(updatedGameScores)
})