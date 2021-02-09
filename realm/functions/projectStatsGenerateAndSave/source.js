exports = async function(arg) {
  function getTodayDate() {
    var today = new Date();
    
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    
    return today;
  }
  
  var agg_pipeline = [
    {$match:{'details.pm_stage':{$nin:["Closed","Cancelled"]}}},
    {$match:{'details.product_end_date':{$gte: new Date()}}},
    {$addFields:{stage:
    	{ $cond: [ {$lte:["$summary.gap_hours",0]}, "Outstanding obligations",
    		{ $cond: [ {$eq: ["$details.pm_stage","In Progress"]}, 
    			{ $cond: [ {$eq:["$summary.gap_hours","$summary.backlog_hours"]}, "In Progress - Stalled", "In Progress" ] }
    		, "$details.pm_stage" ] }
    	]}
    }},
    {$group:{_id:{region:"$region",stage:"$stage"},region:{$first:"$region"}, stage:{$first:"$stage"}, 
      count: {$sum:1},
      backlog_hours : {$sum : {$cond: [ {$gt:["$summary.backlog_hours",0]} ,"$summary.backlog_hours",0]}},
      projects: {$push: {name:"$name",backlog_hours: "$summary.backlog_hours"}}}}
  ];
  
  var col_project = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  var col_projectstats = context.services.get("mongodb-atlas").db("shf").collection("projectstats_series");
  
  var today = getTodayDate();
  var res = await col_project.aggregate(agg_pipeline).toArray();
  var out = [];
  for (let i=0; i< res.length; i++) {
    let doc = res[i];

    doc.backlog_days = doc.backlog_hours / 8;

    doc._id.ts = today; //to preserve uniqueness of the region-stage-date combo
    doc.ts = today;
    out.push(doc);
  }
  
  col_projectstats.insertMany(out);
  
  return {arg: arg};
};