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
    
    return SOQ;
  }
  
  function getSunday(d) {
    d = new Date(d);
    var day = d.getDay(),
    diff = d.getDate() - day;
    d.setHours(0);	d.setMinutes(0); d.setSeconds(0);
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
    
    return SOQ;
  }
  function getThisMonth(now) {
    var current = new Date(now.getFullYear(), now.getMonth(), 1);
    
    current.setHours(0);
    current.setMinutes(0);
    current.setSeconds(0);
    
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
  
  var delivered_call = 0,
      expiring_call = 0,
      delivered_consulting_call = 0,
      delivered_training_call = 0,
      qtd_delivered = 0;
      
  if (!arg.regions || (!Array.isArray(arg.regions)) || (arg.regions.length == 0))
    return null;
  
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
        e: "$isExpiring"
      },
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
                    '$schedule.week', sunday
                  ]
                }, 
                'then': 0
              }, {
                'case': {
                  '$gte': [
                    '$schedule.week', sunday
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
  var delivered_c = 0,
      delivered_t = 0,
      scheduled_c = 0,
      scheduled_t = 0;
      
  //console.log(JSON.stringify(res))
  //console.log(sonq)

  //get delivered and scheduled for this quarter
  for (let i=0; i< res.length; i++) {
    let doc = res[i];
    
    if (doc._id.m > final_month_index)
      continue;
    
    if (doc._id.fromTraining === true) { //fromTraining
      delivered_t += (doc.delivered > 0) ? doc.delivered : 0;
      scheduled_t += (doc.scheduled > 0) ? doc.scheduled : 0;
    } else {
      delivered_c += (doc.delivered > 0) ? doc.delivered : 0;
      scheduled_c += (doc.scheduled > 0) ? doc.scheduled : 0;
    }
  }

  delivered_training_call = delivered_t + scheduled_t;
  delivered_consulting_call = delivered_c + scheduled_c;
  delivered_call = delivered_training_call + delivered_consulting_call;
  qtd_delivered = delivered_t + delivered_c;
  
  //get most likely for the next 3 months
  var m0_ml = 0,
      m1_ml = 0,
      m2_ml = 0;
  
  for (let i=0; i< res.length; i++) {
    let doc = res[i];
    
    switch (doc._id.m) {
      case 0: m0_ml += doc.scheduled; break;
      case 1: m1_ml += doc.scheduled; break;
      case 2: m2_ml += doc.scheduled; break;
    }
  }
  
  //get delivered from expiring
  var delivered_from_expiring = 0;
  for (let i=0; i< res.length; i++) {
    let doc = res[i];
    if (doc._id.e === true)
      delivered_from_expiring += (doc.scheduled + doc.delivered);
  }
  
  //expired
  res = await col_project.aggregate([
    {$match:{"region":{'$in': arg.regions},"details.product_end_date":{$gte:soq, $lt:mplus_3}}},
    {$match:{"stage":{$ne:"Won't Deliver (At Risk Only)"}}},
    {$project:{
      "milestone":"$milestones",
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
    {$group:{
      _id: "$exp_group",
      "expired":{$sum: {$multiply:["$milestone.summary.unscheduled_hours","$milestone.details.bill_rate"]}},
    }},
  ]).toArray(); //console.log(JSON.stringify(res))
  var expired_qtd = 0;
  var expiring_0 = 0,
      expiring_1 = 0,
      expiring_2 = 0;
  
  for (let i=0; i< res.length; i++) {
    let doc = res[i];
    let val = doc.expired;
    switch (doc._id) {
      case "qtd": expired_qtd += val; break;
      case "0": expiring_0 += val; break;
      case "1": expiring_1 += val; break;
      case "2": expiring_2 += val; break;
    }
  }
  
  expiring_call = expired_qtd + getCallFromThree([expiring_0, expiring_1, expiring_2]);
  
  //forecasted
  var risk_0 = 0,
      risk_1 = 0,
      risk_2 = 0,
      upside_0 = 0,
      upside_1 = 0,
      upside_2 = 0,
      risk_roq = 0,
      upside_roq = 0;
      
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
  {
    '$lookup': {
      'from': 'revforecast', 
      'as': 'fcst', 
      'let': {
        'mids': '$milestones._id'
      }, 
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$in': [
                '$milestoneId', '$$mids'
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
    _id: { m: "$m_group" },
    upside : {$sum: "$fcst.upside"},
    risk : {$sum: "$fcst.risk"}
  }},
  ]).toArray(); //console.log(JSON.stringify(res))
  
  for (let i=0; i< res.length; i++) {
    let doc = res[i];

    switch (doc._id.m) {
      case 0: risk_0 += doc.risk; upside_0 += doc.upside; break;
      case 1: risk_1 += doc.risk; upside_1 += doc.upside; break;
      case 2: risk_2 += doc.risk; upside_2 += doc.upside; break;
    }
  }
  
  risk_roq = getCallFromThree([risk_0, risk_1, risk_2]);
  upside_roq = getCallFromThree([upside_0, upside_1, upside_2]);
  
  var forecast = {
      "quarterly_call": delivered_call + expiring_call,
      "delivered_call" : delivered_call,
      "expiring_call" : expiring_call,
      "delivered_from_expiring" : delivered_from_expiring,
      "delivered_consulting" : delivered_consulting_call,
      "delivered_training" : delivered_training_call,
      "qtd_delivered" : qtd_delivered,
      "qtd_expired" : expired_qtd,
      "total_qtd_revenue" : qtd_delivered + expired_qtd,
      "roq_risk" : risk_roq,
      "roq_upside" : upside_roq,
      "month_0" : {
        "most_likely" : m0_ml,
        "best_case": upside_0,
      },
      "month_1" : {
        "most_likely" : m1_ml,
        "best_case": upside_1,
      },
      "month_2" : {
        "most_likely" : m2_ml,
        "best_case": upside_2,
      },
  };
        
  //TODO: save in a forecast collection with a timestamp
  
  return forecast;
};