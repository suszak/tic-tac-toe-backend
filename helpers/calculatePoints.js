export const calculatePoints = (data) => {
  const winnerPoints = data.winnerPoints;
  const loserPoints = data.loserPoints;

  if (winnerPoints > loserPoints) {
    return {
      newWinnerPoints:
        winnerPoints +
        Math.max(10, Math.floor(Math.min(winnerPoints, loserPoints) * 0.2)),
      newLoserPoints:
        loserPoints -
        Math.max(10, Math.floor(Math.min(winnerPoints, loserPoints) * 0.2)),
    };
  } else {
    return {
      newWinnerPoints:
        winnerPoints +
        Math.max(10, Math.floor(Math.max(winnerPoints, loserPoints) * 0.2)),

      newLoserPoints:
        loserPoints -
        Math.max(10, Math.floor(Math.max(winnerPoints, loserPoints) * 0.2)),
    };
  }
};
