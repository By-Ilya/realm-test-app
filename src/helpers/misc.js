// Create our number formatter.
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const valueAsUSD = (val) => {
  return formatter.format(val);
};

const generateSFLink = (id) => {
    return `https://mongodb.my.salesforce.com/${id}`;
}

module.exports = {
    valueAsUSD, generateSFLink
};