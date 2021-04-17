exports = async function(arg) {
  
  var details = await context.functions.execute("generateForecastDetails", arg);
  
  var forecast = {
    "quarterly_call": 0,
    "delivered_call" : 0,
    "expiring_call" : 0,
    "delivered_from_expiring" : 0,
    "delivered_consulting" : 0,
    "delivered_training" : 0,
    "qtd_delivered" : 0,
    "qtd_expired" : 0,
    "total_qtd_revenue" : 0,
    "roq_risk" : 0,
    "roq_upside" : 0,
    "month_0" : {
      "most_likely" : 0,
      "best_case": 0,
    },
    "month_1" : {
      "most_likely" : 0,
      "best_case": 0,
    },
    "month_2" : {
      "most_likely" : 0,
      "best_case": 0,
    },
  };

  for (var i in details) {
    forecast.quarterly_call += details[i].quarterly_call;
    forecast.delivered_call += details[i].delivered_call;
    forecast.expiring_call += details[i].expiring_call;
    forecast.delivered_from_expiring += details[i].delivered_from_expiring;
    forecast.delivered_consulting += details[i].delivered_consulting;
    forecast.delivered_training += details[i].delivered_training;
    forecast.qtd_delivered += details[i].qtd_delivered;
    forecast.qtd_expired += details[i].qtd_expired;
    forecast.total_qtd_revenue += details[i].total_qtd_revenue;
    forecast.roq_risk += details[i].roq_risk;
    forecast.roq_upside += details[i].roq_upside;
    forecast.month_0.most_likely += details[i].month_0.most_likely;
    forecast.month_0.best_case += details[i].month_0.best_case;
    forecast.month_1.most_likely += details[i].month_1.most_likely;
    forecast.month_1.best_case += details[i].month_1.best_case;
    forecast.month_2.most_likely += details[i].month_2.most_likely;
    forecast.month_2.best_case += details[i].month_2.best_case;
  }
  
  return forecast;
};