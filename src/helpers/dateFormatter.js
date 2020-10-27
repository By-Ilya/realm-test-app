module.exports = {
    toEnUsDate,
    toDateOnly
};

function toEnUsDate(stringDate) {
    return new Date(stringDate).toLocaleString("en-US");
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getUTCMonth() + 1),
        day = '' + d.getUTCDate(),
        year = d.getUTCFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [month, day, year].join('-');
}

function toDateOnly(stringDate) {
    return formatDate(new Date(stringDate));
}