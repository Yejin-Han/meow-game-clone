export function getTimeString(time) {
  // time(단위: s)
  const hour = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor((time / 60) % 60)
    .toString()
    .padStart(2, "0");
  const second = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${hour}:${minute}:${second}`;
}
