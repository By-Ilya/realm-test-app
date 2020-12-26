exports = async function(arg) {
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
  
  function getTodayDate() {
    var today = new Date();
    
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    
    return today;
  }
  
  var agg_pipeline = [
    {$match:{'close_date':{$gte: getSoQ(), $lt: getSoNQ()}}},
    {$match:{'stage':{$ne:"Closed Lost"}}},
    {$match:{'type':{$in:["Additional Sales","New Customer","Renewal"]}}},
    
    {$group:{_id:{region:"$owner_region",ps_region:"$ps_region"},
      region:{$first:"$owner_region"}, ps_region:{$first:"$ps_region"},
      closed_won: {$sum: {$cond: [{$eq:["$stage", "Closed Won"]}, "$services_post_carve" ,0]}},
      services_attach: {$sum: "$services_post_carve"},
      rd_fcst_services: {$sum: "$sales_forecast.amount_services_RD"},
      deal_pipeline: {$sum: {$cond: [
        {$or:[
          {$in:["$forecast_category",["Best Case","Most Likely","Closed"]]}, 
          {$eq:["$sales_forecast.AE",true]},
          {$eq:["$sales_forecast.RD",true]}
          ]},
        "$amount" ,0]}}
    }}
  ];
  
  var col_opp = context.services.get("mongodb-atlas").db("shf").collection("opportunity");
  var col_oppfcst = context.services.get("mongodb-atlas").db("shf").collection("salesfcst_series");
  
  var today = getTodayDate();
  var res = await col_opp.aggregate(agg_pipeline).toArray();
  var out = [];
  for (let i=0; i< res.length; i++) {
    let doc = res[i];

    doc._id.ts = today; //to preserve uniqueness of the region-stage-date combo
    doc.ts = today;
    out.push(doc);
  }
  
  col_oppfcst.insertMany(out);
  
  return {arg: arg};
};