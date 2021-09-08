exports = async function(arg){
  function getSoQ() {
    var today = new Date(),
    month = today.getMonth(),
    qYear = (month == 0) ? today.getFullYear()-1 : today.getFullYear(),
    qMonth = (month < 1) ? 10 : ((month < 4) ? 1 : ((month < 7) ? 4 : ((month < 10) ? 7 : 10))),
    SOQ = new Date( qYear, qMonth, 1 );
    
    SOQ.setHours(0);
    SOQ.setMinutes(0);
    SOQ.setSeconds(0);
    SOQ.setMilliseconds(0);
    
    return SOQ;
  }
  
  function getSunday(d) {
    d = new Date(d);
    var day = d.getDay(),
    diff = d.getDate() - day;
    d.setHours(0);	d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0);
    return new Date(d.setDate(diff));
  }
  function getSoNQ() {
    var today = new Date(),
    month = today.getMonth(),
    qYear = (month >= 10) ? today.getFullYear()+1 : today.getFullYear(),
    qMonth = (month < 1) ? 1 : ((month < 4) ? 4 : ((month < 7) ? 7 : ((month < 10) ? 10 : 1))),
    SOQ = new Date( qYear, qMonth, 1 );
    
    SOQ.setHours(0);
    SOQ.setMinutes(0);
    SOQ.setSeconds(0);
    SOQ.setMilliseconds(0);
    
    return SOQ;
  }
  function getThisMonth(now) {
    var current = new Date(now.getFullYear(), now.getMonth(), 1);
    
    current.setHours(0);
    current.setMinutes(0);
    current.setSeconds(0);
    current.setMilliseconds(0);
    
    return current;
  }
  
  function getNextMonth(now) {
    var current;
    if (now.getMonth() == 11) {
        current = new Date(now.getFullYear() + 1, 0, 1);
    } else {
        current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    
    current.setHours(0);
    current.setMinutes(0);
    current.setSeconds(0);
    current.setMilliseconds(0);
    
    return current;
  }
  
  function getFinalMonthIndex() { //returns an index 0,1,2
    var today = new Date(),
    month = today.getMonth(),
    qEndMonth = (month < 1) ? 1 : ((month < 4) ? 4 : ((month < 7) ? 7 : ((month < 10) ? 10 : 1)));


    //1->4: 0,1,2
    //2->4: 0,1
    //10->1: 0,1,2
    //11->1: 0,1
    //0->1:0
    var delta = (qEndMonth > month) ? (qEndMonth - month) : (qEndMonth + 12 - month);
    return delta - 1;
  }
  
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

  //initialize the details map with the project
  function getOrInitMapDetails(map, project) {
    if (! map.hasOwnProperty(project)) {

      map[project] = {
        "delivered_call": 0,
        "expiring_call": 0,
        "delivered_consulting_call": 0,
        "delivered_training_call": 0,
        "qtd_delivered": 0,

        "delivered_c": 0,
        "delivered_t": 0,
        "scheduled_c": 0,
        "scheduled_t": 0,

        "m0_ml": 0,
        "m1_ml": 0,
        "m2_ml": 0,

        "delivered_from_expiring": 0,

        "expired_qtd": 0,
        "expiring_0": 0,
        "expiring_1": 0,
        "expiring_2": 0,

        "risk_0": 0,
        "risk_1": 0,
        "risk_2": 0,
        "upside_0": 0,
        "upside_1": 0,
        "upside_2": 0,
        "risk_roq": 0,
        "upside_roq": 0,
        
        "upside_ml_0": 0,
        "upside_ml_1": 0,
        "upside_ml_2": 0,
        "upside_ml_roq_c": 0,
        "upside_ml_roq_t": 0,
        
        "opportunity_name": "",
      }
    }

    return map[project];
  }

  var col_schedule = context.services.get("mongodb-atlas").db("shf").collection("schedule");
  var col_project = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  var col_fcst = context.services.get("mongodb-atlas").db("shf").collection("revforecast");
  
  var soq = getSoQ(),
      sonq = getSoNQ(),
      today = new Date(),
      sunday = getSunday(today),
      month = getThisMonth(today),
      mplus_1 = getNextMonth(today),
      mplus_2 = getNextMonth(mplus_1),
      mplus_3 = getNextMonth(mplus_2),
      final_month_index = getFinalMonthIndex();
    
  //adjust sunday in case it's before the soq
  if (sunday < soq) sunday = soq;
      
  if (!arg.regions || (!Array.isArray(arg.regions)) || (arg.regions.length == 0))
    return null;
  
  var details_map = {};

  //delivered and scheduled for the next three months broken down by month and fromTraining
  var res = await col_project.aggregate([
  {
    '$match': {
      'region': {
        '$in': arg.regions
      },
      'details.product_end_date':{$gte:soq} //non-expired projects only
    }
  }, 
  {$addFields: {
      "isExpiring": {
               $switch: {
                  branches: [
                     { case: { $lt: [ "$details.product_end_date", sonq ] }, then: true }
                  ],
                  default:false
               }
      }
  }},
  {'$unwind' : "$milestones"},
  {
    '$lookup': {
      'from': 'schedule', 
      'let': {
        'mids': '$milestones._id'
      }, 
      'as': 'schedule', 
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$eq': [
                '$milestoneId', '$$mids'
              ]
            }
          }
        }, {
          '$match': {
            'week': {$gte:soq,$lt:mplus_3}
          }
        }
      ]
    }
  }, {
    '$unwind': {
      'path': '$schedule'
    }
  }, 
  {$addFields: {
      "m_group": {
               $switch: {
                  branches: [
                     { case: { $lt: [ "$schedule.week", mplus_1 ] }, then: 0 },
                     { case: { $lt: [ "$schedule.week", mplus_2 ] }, then: 1 },
                     { case: { $lt: [ "$schedule.week", mplus_3 ] }, then: 2 }
                  ]
               }
      }
  }},
  {
    '$group': {
      '_id': {
        fromTraining:"$milestones.fromTraining",
        m: "$m_group",
        e: "$isExpiring",
        pid: "$name"
      },
      'opportunity_name': {$first: "$opportunity.name"},
      'delivered': {
        '$sum': {
          '$switch': {
            'branches': [
              {
                'case': {
                  '$lt': [
                    '$schedule.week', today
                  ]
                }, 
                'then': '$schedule.actual.revenue'
              }, {
                'case': {
                  '$gte': [
                    '$schedule.week', today
                  ]
                }, 
                'then': 0
              }
            ]
          }
        }
      }, 
      'scheduled': {
        '$sum': {
          '$switch': {
            'branches': [
              {
                'case': {
                  '$lt': [
                    '$schedule.week', month
                  ]
                }, 
                'then': 0
              }, {
                'case': {
                  '$gte': [
                    '$schedule.week', month
                  ]
                }, 
                'then': {
                  '$subtract': [
                    '$schedule.estimated.revenue', '$schedule.actual.revenue'
                  ]
                }
              }
            ]
          }
        }
      }
    }
  }
]).toArray();
      
  //console.log(JSON.stringify(res))
  //console.log(sonq)

  //get delivered and scheduled for this quarter for each project
  for (let i=0; i< res.length; i++) {
    let doc = res[i];
    let details = getOrInitMapDetails(details_map, doc._id.pid);
    details.opportunity_name = doc.opportunity_name;
    
    if (doc._id.m > final_month_index)
      continue;
    
    if (doc._id.fromTraining === true) { //fromTraining
      details.delivered_t += (doc.delivered > 0) ? doc.delivered : 0;
      details.scheduled_t += (doc.scheduled > 0) ? doc.scheduled : 0;
    } else {
      details.delivered_c += (doc.delivered > 0) ? doc.delivered : 0;
      details.scheduled_c += (doc.scheduled > 0) ? doc.scheduled : 0;
    }
  }

  //post-processing
  Object.keys(details_map).forEach(function(project) {
    let details = details_map[project];

    details.delivered_training_call = details.delivered_t + details.scheduled_t;
    details.delivered_consulting_call = details.delivered_c + details.scheduled_c;
    details.delivered_call = details.delivered_training_call + details.delivered_consulting_call;
    details.qtd_delivered = details.delivered_t + details.delivered_c;
  });
  
  //get most likely for the next 3 months
  for (let i=0; i< res.length; i++) {
    let doc = res[i];
    let details = getOrInitMapDetails(details_map, doc._id.pid);
    
    switch (doc._id.m) {
      case 0: details.m0_ml += doc.scheduled; break;
      case 1: details.m1_ml += doc.scheduled; break;
      case 2: details.m2_ml += doc.scheduled; break;
    }
  }
  
  //get delivered from expiring
  for (let i=0; i< res.length; i++) {
    let doc = res[i];
    let details = getOrInitMapDetails(details_map, doc._id.pid);

    if (doc._id.e === true)
      details.delivered_from_expiring += (doc.scheduled + doc.delivered);
  }
  
  //expired
  res = await col_project.aggregate([
    {$match:{"region":{'$in': arg.regions},"details.product_end_date":{$gte:soq, $lt:mplus_3}}},
    {$match:{"stage":{$ne:"Won't Deliver (At Risk Only)"}}},
    {$project:{
      "name": "$name",
      "milestone":"$milestones",
      "opportunity":"$opportunity",
      "exp_group": {
              $switch: {
                  branches: [
                    { case: { $lt: [ "$details.product_end_date", today ] }, then: "qtd" },
                    { case: { $lt: [ "$details.product_end_date", mplus_1 ] }, then: "0" },
                    { case: { $lt: [ "$details.product_end_date", mplus_2 ] }, then: "1" },
                    { case: { $lt: [ "$details.product_end_date", mplus_3 ] }, then: "2" }
                  ]
              }
      }
    }},
    {$unwind:"$milestone"},
    {$match:{"milestone.summary.unscheduled_hours":{$gt:0}}},
    {$group:{
      _id: { 
              e: "$exp_group", 
              pid: "$name"
            },
      'opportunity_name': {$first: "$opportunity.name"},
      "expired":{$sum: {$multiply:[
                    {$cond:
                   	  [ {$and:[ 
                   	       {$gte:["$milestone.summary.billable_hours_in_financials",0]},
                   	       {$gte:["$milestone.summary.billable_hours_scheduled_undelivered",0]} 
                   	    ]},
                        { $subtract: 
                           [ "$milestone.summary.planned_hours", {$add:
                              [ "$milestone.summary.billable_hours_in_financials", "$milestone.summary.billable_hours_scheduled_undelivered" ]} ] 
                        },
                   	    "$milestone.summary.unscheduled_hours"
                   	  ]
                   	},
        "$milestone.details.bill_rate"]}},
    }},
  ]).toArray(); //console.log(JSON.stringify(res))
  
  for (let i=0; i< res.length; i++) {
    let doc = res[i];
    let details = getOrInitMapDetails(details_map, doc._id.pid);
    details.opportunity_name = doc.opportunity_name;

    let val = doc.expired;
    switch (doc._id.e) {
      case "qtd": details.expired_qtd += val; break;
      case "0": details.expiring_0 += val; break;
      case "1": details.expiring_1 += val; break;
      case "2": details.expiring_2 += val; break;
    }
  }
  
  //post-processing
  Object.keys(details_map).forEach(function(project) {
    let details = details_map[project];

    details.expiring_call = details.expired_qtd + getCallFromThree([details.expiring_0, details.expiring_1, details.expiring_2]);
  });

  
  //forecasted
  res = await col_project.aggregate([
  {
    '$match': {
      'region': {
        '$in': arg.regions
      },
      'details.product_end_date':{$gte:soq} //non-expired projects only
    }
  },
  {$match:{"details.pm_stage":{$nin:["Closed","Cancelled"]}}},
  {'$unwind' : "$milestones"},
  {
    '$lookup': {
      'from': 'revforecast', 
      'as': 'fcst', 
      'let': {
        'mid': '$milestones._id'
      }, 
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$eq': [
                '$milestoneId', '$$mid'
              ]
            }
          }
        }, {
          '$match': {
            'month': {$gte:month,$lt:mplus_3}
          }
        }
      ]
    }
  },
  {$unwind:"$fcst"},
  {$addFields: {
      "m_group": {
               $switch: {
                  branches: [
                     { case: { $lt: [ "$fcst.month", mplus_1 ] }, then: 0 },
                     { case: { $lt: [ "$fcst.month", mplus_2 ] }, then: 1 },
                     { case: { $lt: [ "$fcst.month", mplus_3 ] }, then: 2 }
                  ]
               }
      }
  }},
  { $group: {
    _id: { m: "$m_group", pid: "$name", fromTraining:"$milestones.fromTraining" },
    'opportunity_name': {$first: "$opportunity.name"},
    upside : {$sum: "$fcst.upside"},
    risk : {$sum: "$fcst.risk"},
    upside_ml : {$sum: "$fcst.upside_ml"}
  }},
  ]).toArray(); //console.log(JSON.stringify(res))
  
  for (let i=0; i< res.length; i++) {
    let doc = res[i];
    let details = getOrInitMapDetails(details_map, doc._id.pid);
    details.opportunity_name = doc.opportunity_name;

    switch (doc._id.m) {
      case 0: details.risk_0 += doc.risk; details.upside_0 += doc.upside; details.upside_ml_0 += doc.upside_ml; break;
      case 1: details.risk_1 += doc.risk; details.upside_1 += doc.upside; details.upside_ml_1 += doc.upside_ml; break;
      case 2: details.risk_2 += doc.risk; details.upside_2 += doc.upside; details.upside_ml_2 += doc.upside_ml; break;
    }
    
    if (doc._id.m <= final_month_index) {
      if (doc._id.fromTraining === true) 
        details.upside_ml_roq_t += doc.upside_ml;
      else
        details.upside_ml_roq_c += doc.upside_ml;
    }
  }
  
  //post-processing
  Object.keys(details_map).forEach(function(project) {
    let details = details_map[project];

    details.risk_roq = getCallFromThree([details.risk_0, details.risk_1, details.risk_2]);
    details.upside_roq = getCallFromThree([details.upside_0, details.upside_1, details.upside_2]);
    
    //apply ML adjustment
    details.delivered_training_call += details.upside_ml_roq_t;
    details.delivered_consulting_call += details.upside_ml_roq_c;
    details.delivered_call = details.delivered_training_call + details.delivered_consulting_call;
    details.m0_ml += details.upside_ml_0;
    details.m1_ml += details.upside_ml_1;
    details.m2_ml += details.upside_ml_2;
    
    //apply expiring call adjustment for upside ML
    if (details.expiring_call > 0) {
      let expiring_adjustment = details.upside_ml_roq_t + details.upside_ml_roq_c;
      let exp_delta = (details.expiring_call > expiring_adjustment) ? expiring_adjustment : details.expiring_call;
      details.expiring_call -= exp_delta;
      details.delivered_from_expiring += exp_delta;
    }
  });
  
  //create the result
  var forecastDetails = [];

  Object.keys(details_map).forEach(function(project) {
    let details = details_map[project];

    var forecast = {
        "name": project,
        
        "opportunity_name": details.opportunity_name,
        "quarterly_call": details.delivered_call + details.expiring_call,
        "delivered_call" : details.delivered_call,
        "expiring_call" : details.expiring_call,
        "delivered_from_expiring" : details.delivered_from_expiring,
        "delivered_consulting" : details.delivered_consulting_call,
        "delivered_training" : details.delivered_training_call,
        "qtd_delivered" : details.qtd_delivered,
        "qtd_expired" : details.expired_qtd,
        "total_qtd_revenue" : details.qtd_delivered + details.expired_qtd,
        "roq_risk" : details.risk_roq,
        "roq_upside" : details.upside_roq,
        "month_0" : {
          "most_likely" : details.m0_ml,
          "best_case": details.upside_0,
        },
        "month_1" : {
          "most_likely" : details.m1_ml,
          "best_case": details.upside_1,
        },
        "month_2" : {
          "most_likely" : details.m2_ml,
          "best_case": details.upside_2,
        },
    };

    forecastDetails.push(forecast);
  });  
  
  forecastDetails.sort((a, b) => (a.name > b.name) ? 1 : -1)
  
  return forecastDetails;
};