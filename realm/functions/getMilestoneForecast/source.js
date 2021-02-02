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
  // function getSoNQ() {
  //   var today = new Date(),
  //   month = today.getMonth(),
  //   qYear = (month == 11) ? today.getFullYear()+1 : today.getFullYear(),
  //   qMonth = (month < 1) ? 1 : ((month < 4) ? 4 : ((month < 7) ? 7 : ((month < 10) ? 10 : 1))),
  //   SOQ = new Date( qYear, qMonth, 1 );
    
  //   SOQ.setHours(0);
  //   SOQ.setMinutes(0);
  //   SOQ.setSeconds(0);
    
  //   return SOQ;
  // }
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

  var col_schedule = context.services.get("mongodb-atlas").db("shf").collection("schedule");
  var col_project = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  var col_fcst = context.services.get("mongodb-atlas").db("shf").collection("revforecast");
  
  var soq = getSoQ(),
      //sonq = getSoNQ(),
      today = new Date(),
      sunday = getSunday(today),
      month = getThisMonth(today),
      mplus_1 = getNextMonth(today),
      mplus_2 = getNextMonth(mplus_1),
      mplus_3 = getNextMonth(mplus_2);
    
  //adjust sunday in case it's before the soq
  if (sunday < soq) sunday = soq;
  
  //delivered
  var res = await col_schedule.aggregate([
    {$match:{"milestoneId":arg,"week":{$gte:soq,$lt:today}}},
    {$group:{_id:null, revenue:{$sum:"$actual.revenue"}}},
  ]).toArray();
  var delivered_qtd = (res.length > 0) ? Math.ceil(res[0].revenue) : 0;
  
  //scheduled
  res = await col_schedule.aggregate([
    {$match:{"milestoneId":arg,"week":{$gte:sunday,$lt:mplus_3}}},
    {$addFields: {
      "m_group": {
               $switch: {
                  branches: [
                     { case: { $lt: [ "$week", mplus_1 ] }, then: "0" },
                     { case: { $lt: [ "$week", mplus_2 ] }, then: "1" },
                     { case: { $lt: [ "$week", mplus_3 ] }, then: "2" }
                  ]
               }
      }
    }},
    {$group:{_id:"$m_group", revenue:{$sum:{$subtract: ["$estimated.revenue","$actual.revenue"]}}}}, //need to substract actuals since there might be an overlap for this week
    {$group: {_id: null, arr: {$push:{k:"$_id",v:"$revenue"}}}},
    {$replaceRoot: { newRoot: {$arrayToObject:"$arr"} } }
  ]).toArray(); //console.log(JSON.stringify(res))
  var scheduled_0 = 0,
      scheduled_1 = 0,
      scheduled_2 = 0;
  
  if (res.length > 0) {
    if (res[0]["0"] > 0) scheduled_0 = Math.ceil(res[0]["0"]);
    if (res[0]["1"] > 0) scheduled_1 = Math.ceil(res[0]["1"]);
    if (res[0]["2"] > 0) scheduled_2 = Math.ceil(res[0]["2"]);
  }
  
  //expired
  res = await col_project.aggregate([
    {$match:{"milestones._id":arg,"details.product_end_date":{$gte:soq, $lt:mplus_3}}},
    {$project:{
      "milestone":{$filter:{input:"$milestones",as:"m",cond:{$eq:["$$m._id", arg]}}},
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
    {$project:{
      "expired":{$multiply:["$milestone.summary.unscheduled_hours","$milestone.details.bill_rate"]},
      "exp_group":"$exp_group"
    }},
  ]).toArray(); //console.log(JSON.stringify(res))
  var expired_qtd = 0;
  var expiring_0 = 0,
      expiring_1 = 0,
      expiring_2 = 0;
  
  if (res.length > 0) {
    let val = Math.ceil(res[0].expired);
    switch (res[0].exp_group) {
      case "qtd": expired_qtd = val; break;
      case "0": expiring_0 = val; break;
      case "1": expiring_1 = val; break;
      case "2": expiring_2 = val; break;
    }
  }
  
  //forecasted
  var risk_0 = 0,
      risk_1 = 0,
      risk_2 = 0,
      upside_0 = 0,
      upside_1 = 0,
      upside_2 = 0,
      upside_ml_0 = 0,
      upside_ml_1 = 0,
      upside_ml_2 = 0;
      
  var fcst_m0 = await col_fcst.findOne({'milestoneId' : arg, 'month' : month});
  if (fcst_m0) { 
    risk_0 = fcst_m0.risk ? fcst_m0.risk : 0;
    upside_0 = fcst_m0.upside ? fcst_m0.upside : 0;
    upside_ml_0 = fcst_m0.upside_ml ? fcst_m0.upside_ml : 0;
  }
  var fcst_m1 = await col_fcst.findOne({'milestoneId' : arg, 'month' : mplus_1});
  if (fcst_m1) { 
    risk_1 = fcst_m1.risk ? fcst_m1.risk : 0;
    upside_1 = fcst_m1.upside ? fcst_m1.upside : 0;
    upside_ml_1 = fcst_m1.upside_ml ? fcst_m1.upside_ml : 0;
  }
  var fcst_m2 = await col_fcst.findOne({'milestoneId' : arg, 'month' : mplus_2});
  if (fcst_m2) { 
    risk_2 = fcst_m2.risk ? fcst_m2.risk : 0;
    upside_2 = fcst_m2.upside ? fcst_m2.upside : 0;
    upside_ml_2 = fcst_m2.upside_ml ? fcst_m2.upside_ml : 0;
  }
  
        var forecast = {
            "delivered_qtd" : delivered_qtd,
            "expired_qtd" : expired_qtd,
            scheduled : {
                "0": scheduled_0,
                "1": scheduled_1,
                "2": scheduled_2
            },
            expiring : {
                "0": expiring_0,
                "1": expiring_1,
                "2": expiring_2
            },
            most_likely : {
                "0": scheduled_0+upside_ml_0,
                "1": scheduled_1+upside_ml_1,
                "2":scheduled_2+upside_ml_2
            },
            risk : {
                "0": risk_0,
                "1": risk_1,
                "2": risk_2
            },
            upside : {
                "0": upside_0,
                "1": upside_1,
                "2": upside_2
            },
            upside_ml : {
                "0": upside_ml_0,
                "1": upside_ml_1,
                "2": upside_ml_2
            }
        };
  return forecast;
};