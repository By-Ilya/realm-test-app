function extractDateValues(date) {
    return {
        day: String(date.getUTCDate()).padStart(2, '0'),
        month: String(date.getUTCMonth() + 1).padStart(2, '0'),
        year: String(date.getUTCFullYear())
    };
}

function formatDate(date) {
    const d = new Date(date);
    const {day, month, year} = extractDateValues(d);

    return [month, day, year].join('-');
}

function toEnUsDate(stringDate) {
    return new Date(stringDate).toLocaleString('en-US');
}

function toDateOnly(stringDate) {
    return formatDate(new Date(stringDate));
}

module.exports = {
    toEnUsDate,
    toDateOnly
};