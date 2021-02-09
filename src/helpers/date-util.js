function getThisMonth(now) {
  let current = new Date(now.getFullYear(), now.getMonth(), 1);
  current.setUTCHours(0, 0, 0, 0);
  return current;
}

function getNextMonth(now, utc=true) {
  let current = (now.getMonth() === 11) 
    ? new Date(now.getFullYear() + 1, 0, 1)
    : new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  if (utc) current.setUTCHours(0, 0, 0, 0);
  else current.setHours(0, 0, 0, 0);
  
  return current;
}

function setUtcZeroTime(date) {
  date.setUTCHours(0)
  date.setUTCMinutes(0)
  date.setUTCSeconds(0)
  date.setUTCMilliseconds(0)
}

module.exports = {
  getThisMonth,
  getNextMonth,
  setUtcZeroTime
};