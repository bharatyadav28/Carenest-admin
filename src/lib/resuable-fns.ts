export function getTokenExpiration(token: string): number {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expInSec = payload.exp;
  const nowInSec = Math.floor(Date.now() / 1000);
  const secondsLeft = expInSec - nowInSec;
  const daysLeft = Math.ceil(secondsLeft / 86400);

  return daysLeft;
}

export function getCookieConfig(token: string) {
  return {
    expires: getTokenExpiration(token),
    sameSite: "Strict" as "Strict",
    secure: process.env.NODE_ENV === "production",
  };
}
