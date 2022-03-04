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
  
  function getProjectBurnrateStatus(pct,period) {
    //const burnrate_bounds = [0.25/*0*/, 0.45 /*1*/, 0.54 /*2*/, 0.60 /*3*/, 0.65, 0.69, 0.71, 0.74, 0.77, 0.81, 0.85, 0.94 /*11*/];
    const burnrate_bounds = [0.15/*0*/, 0.29 /*1*/, 0.38 /*2*/, 0.45 /*3*/, 0.50, 0.56, 0.60, 0.63, 0.67, 0.71, 0.77, 0.87 /*11*/];
    //the expectation is that if we're in period 3 (n), then we're expected to be between 0.54 (n-1) and 0.6 (n)
    //anything above 0.54 (n-1) is green, between 0.54 (n-1) and 0.25 (n-3) is yellow, and below 0 (n-3) is red
    
    function getArrayElemWithOverflow(arr, index) { //we'll just extrapolate for simplicity
      if (index < 0) return 0;
      if (index >= arr.length) return arr[arr.length - 1];
      return arr[index];
    }
    
    if (pct >= getArrayElemWithOverflow(burnrate_bounds, period-1)) return "green";
    if (pct >= getArrayElemWithOverflow(burnrate_bounds, period-3)) return "yellow";
    
    return "red";
  }
  
  var col_project = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  
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

  var res = await col_project.aggregate([
  {
    '$match': {
      'region': {
        '$in': arg.regions
      },
      'details.product_end_date':{$gte:soq} //non-expired projects only
    }
  }, 
  {$match:{"details.pm_stage":{$nin:["Closed","Cancelled"]}}},
  {$match:{"summary.gap_hours":{$gt:0}}},
  {$match:{"summary.backlog_bookings":{$gt:0}}},
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
  { $addFields: {
      upside_ml : {$sum: "$fcst.upside_ml"},
      upside : {$sum: "$fcst.upside"}
  }},
  { $group: {
    _id: "$_id",
    'opportunity_name': {$first: "$opportunity.name"},
    'name': {$first: "$name"},
    'region': {$first: "$region"},
    'status': {$first: "$details.pm_stage"},
    'start': {$first: "$details.product_start_date"},
    'end': {$first: "$details.product_end_date"},
    'pm' : {$first: "$project_manager"},

    'isExpiring' : {$first: "$isExpiring"},

    summary: {$first:"$summary"},

    backlog_bookings: {$first:"$summary.backlog_bookings"},
    upside_ml : {$sum: "$upside_ml"},
    upside : {$sum: "$upside"}
  }},
  // {$unwind:"$fcst"},
  // { $group: {
  //   _id: "$_id",
  //   'opportunity_name': {$first: "$opportunity.name"},
  //   'name': {$first: "$name"},
  //   'region': {$first: "$region"},
  //   'status': {$first: "$details.pm_stage"},
  //   'start': {$first: "$details.product_start_date"},
  //   'end': {$first: "$details.product_end_date"},
  //   'pm' : {$first: "$project_manager"},

  //   'isExpiring' : {$first: "$isExpiring"},

  //   summary: {$first:"$summary"},

  //   backlog_bookings: {$first:"$summary.backlog_bookings"},
  //   upside_ml : {$sum: "$fcst.upside_ml"},
  //   upside : {$sum: "$fcst.upside"}
  // }},
  {$addFields: {
    'backlog_rate': {$divide:["$summary.backlog_bookings","$summary.gap_hours"]} 
  }},
  {$addFields: {
    'pct_complete_projection': {$subtract:[1,{$divide:[
      {$subtract:["$summary.backlog_hours",
        {$divide:["$upside_ml","$backlog_rate"]}
      ]},
      "$summary.planned_hours"
    ]}]}
  }},
]).toArray();
      
  //console.log(JSON.stringify(res))
  //console.log(sonq)
  res.forEach(it => {
    delta = (it.end - it.start)/12;
    it.period_projected = (mplus_3 <= it.start) ? 0 : Math.floor((mplus_3 - it.start) / delta);
    it.burnrate_status = getProjectBurnrateStatus(it.pct_complete_projection, it.period_projected);
  })
  
  return res;
};