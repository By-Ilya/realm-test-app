module.exports = {
  getThisMonth,
  getNextMonth
};

function getThisMonth(now) {
  var current = new Date(now.getFullYear(), now.getMonth(), 1);
  
  current.setUTCHours(0,0,0,0);
  
  return current;
}

function getNextMonth(now, utc=true) {
  var current;
  if (now.getMonth() === 11) {
      current = new Date(now.getFullYear() + 1, 0, 1);
  } else {
      current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  
  if (utc)
    current.setUTCHours(0,0,0,0);
  else
    current.setHours(0,0,0,0);
  
  return current;
}