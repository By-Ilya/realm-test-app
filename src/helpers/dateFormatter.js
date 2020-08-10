module.exports = {
    toEnUsDate
};

function toEnUsDate(stringDate) {
    return new Date(stringDate).toLocaleString("en-US");
}