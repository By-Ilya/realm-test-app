const stringIsAValidUrl = (s) => {
  let url;
  
  try {
    url = new URL(s);
  } catch (err) {
    return false;  
  }
  
  return url.protocol === "http:" || url.protocol === "https:";
};

module.exports = {
    stringIsAValidUrl
};