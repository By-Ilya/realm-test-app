module.exports = {
    convertForecastIntoRows,
    getCallFromThree
};

//calculate the call based on three months rolling window
function getCallFromThree(vals) {
    var today = new Date(),
    month = today.getMonth(),
    qEndMonth = (month < 1) ? 1 : ((month < 4) ? 4 : ((month < 7) ? 7 : ((month < 10) ? 10 : 1)));


    //1->4: 0,1,2
    //2->4: 0,1
    //10->1: 0,1,2
    //11->1: 0,1
    //0->1:0
    var delta = (qEndMonth > month) ? (qEndMonth - month) : (qEndMonth + 12 - month);
    var res = 0;
    for (let i=0; i<delta; i++)
    	res += vals[i];

    return res;
}

function convertForecastIntoRows(forecast) {
    // In
    // {
    //     delivered_qtd : 15000,
    //     expired_qtd : 500,
    //     scheduled : {
    //         "0": 600,
    //         "1": 1500,
    //         "2":400
    //     },
    //     expiring : {
    //         "0": 0,
    //         "1": 0,
    //         "2": 0
    //     },
    //     most_likely : {
    //         "0": 600,
    //         "1": 1500,
    //         "2":400
    //     },
    //     risk : {
    //         "0": 600,
    //         "1":1500,
    //         "2":400
    //     },
    //     upside : {
    //         "0": 600,
    //         "1":1500,
    //         "2":400
    //     }
    // };
    // Out
    // [
    //     {name: "Delivered", "0": 15000, cq_field:"Delivered QTD", cq_call: 15000},
    //     {name: "Expired", "0": 500, cq_field:"Expired QTD", cq_call: 500},
    //     {name: "Scheduled", "0": 600, "1": 1500, "2": 400, cq_field:"Delivered Call", cq_call: 18000},
    // ];
    var delivered_call = getCallFromThree([forecast.most_likely["0"],forecast.most_likely["1"],forecast.most_likely["2"]]) + forecast.delivered_qtd,
    expiring_call = getCallFromThree([forecast.expiring["0"],forecast.expiring["1"],forecast.expiring["2"]]) + forecast.expired_qtd,
    all_in = delivered_call + expiring_call,
    roq_risk = getCallFromThree([forecast.risk["0"], forecast.risk["1"], forecast.risk["2"]]),
    roq_upside = getCallFromThree([forecast.upside["0"], forecast.upside["1"], forecast.upside["2"]]);


    var row = [];
    row.push(
        {name: "Delivered", "0": forecast.delivered_qtd, cq_field:"Delivered QTD", cq_call: forecast.delivered_qtd}
        );
    row.push(
        {name: "Expired", "0": forecast.expired_qtd, cq_field:"Expired QTD", cq_call: forecast.expired_qtd}
        );
    row.push(
        {name: "Scheduled", "0": forecast.scheduled["0"], "1" : forecast.scheduled["1"], "2" : forecast.scheduled["2"], cq_field:"Delivered Call", cq_call: delivered_call}
        );
    row.push(
        {name: "Expiring", "0": forecast.expiring["0"], "1" : forecast.expiring["1"], "2" : forecast.expiring["2"], cq_field:"Expired Call", cq_call: expiring_call},
        );
    row.push(
        {name: "Most Likely $", "0": forecast.most_likely["0"], "1" : forecast.most_likely["1"], "2" : forecast.most_likely["2"], cq_field:"All-in Call", cq_call: all_in},
        );
    row.push(
        {name: "Risk $", "0": forecast.risk["0"], "1" : forecast.risk["1"], "2" : forecast.risk["2"], cq_field:"ROQ Risk", cq_call: roq_risk},
        );
    row.push(
        {name: "Upside $", "0": forecast.upside["0"], "1" : forecast.upside["1"], "2" : forecast.upside["2"], cq_field:"ROQ Upside", cq_call: roq_upside},
        );

    return row;
}