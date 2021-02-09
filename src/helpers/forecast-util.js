// Calculate the call based on three months rolling window
function getCallFromThree(vals) {
    const today = new Date();
    const month = today.getMonth();

    // TODO: check the equality
    qEndMonth = (month < 1) ? 1 : ((month < 4) ? 4 : ((month < 7) ? 7 : ((month < 10) ? 10 : 1)));

    //1->4: 0,1,2
    //2->4: 0,1
    //10->1: 0,1,2
    //11->1: 0,1
    //0->1:0
    const delta = (qEndMonth > month) 
        ? (qEndMonth - month)
        : (qEndMonth + 12 - month);

    let res = 0;
    for (let i = 0; i < delta; i++)
    	res += vals[i];

    return res;
}

function getRatesWithQtd(forecastField, qtd) {
    const rates = getCallFromThree([
        forecastField["0"],
        forecastField["1"],
        forecastField["2"]
    ]);

    return rates + qtd;
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
    
    const {
        most_likely,
        expiring,
        risk,
        upside,
        scheduled,
        delivered_qtd,
        expired_qtd
    } = forecast;
    
    const deliveredCall = getRatesWithQtd(most_likely, delivered_qtd);
    const expiringCall = getRatesWithQtd(expiring, expired_qtd);
    const allIn = deliveredCall + expiringCall;

    const roqRisk = getCallFromThree([
        risk["0"],
        risk["1"],
        risk["2"]
    ]);
    const roqUpside = getCallFromThree([
        upside["0"],
        upside["1"],
        upside["2"]
    ]);


    const row = [];
    row.push({
        name: "Delivered", 
        "0": delivered_qtd,
        cq_field: "Delivered QTD",
        cq_call: delivered_qtd
    });
    row.push({
        name: "Expired",
        "0": expired_qtd,
        cq_field: "Expired QTD",
        cq_call: expired_qtd
    });
    row.push({
        name: "Scheduled", 
        "0": scheduled["0"],
        "1": scheduled["1"],
        "2": scheduled["2"],
        cq_field: "Delivered Call",
        cq_call: deliveredCall
    });
    row.push({
        name: "Expiring",
        "0": expiring["0"],
        "1": expiring["1"],
        "2": expiring["2"],
        cq_field: "Expired Call",
        cq_call: expiringCall
    });
    row.push({
        name: "Most Likely $", 
        "0": most_likely["0"],
        "1": most_likely["1"],
        "2": most_likely["2"],
        cq_field: "All-in Call",
        cq_call: allIn
    });
    row.push({
        name: "Risk $",
        "0": risk["0"],
        "1": risk["1"],
        "2": risk["2"],
        cq_field: "ROQ Risk",
        cq_call: roqRisk
    });
    row.push({
        name: "Upside $",
        "0": upside["0"],
        "1": upside["1"],
        "2": upside["2"],
        cq_field: "ROQ Upside",
        cq_call: roqUpside
    });

    row.push({
        name: "Upside ML $",
        "0": forecast.upside_ml["0"],
        "1" : forecast.upside_ml["1"],
        "2" : forecast.upside_ml["2"]
    });

    return row;
}

module.exports = {
    convertForecastIntoRows,
    getCallFromThree
};