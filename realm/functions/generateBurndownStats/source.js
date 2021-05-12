exports = async function() {
  /*
    A Scheduled Trigger will always call a function without arguments.
    Documentation on Triggers: https://docs.mongodb.com/realm/triggers/overview/

    Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

    Access a mongodb service:
    const collection = context.services.get(<SERVICE_NAME>).db("<DB_NAME>").collection("<COLL_NAME>");
    const doc = collection.findOne({ name: "mongodb" });

    Note: In Atlas Triggers, the service name is defaulted to the cluster name.

    Call other named functions if they are defined in your application:
    const result = context.functions.execute("function_name", arg1, arg2);

    Access the default http client and execute a GET request:
    const response = context.http.get({ url: <URL> })

    Learn more about http client here: https://docs.mongodb.com/realm/functions/context/#context-http
  */
  function getDay(d) {
    d = new Date(d);
    d.setHours(0);	d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0)
    return d;
  }
  
  var now = new Date()
  var ny = new Date("2019-06-01")
  var num_periods = 12;
  
  var today = getDay(now);
  
  const psprojectCol = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  const statsCol = context.services.get("mongodb-atlas").db("shf").collection("burndown_stats");
  const statsColHist = context.services.get("mongodb-atlas").db("shf").collection("burndown_stats_hist");
  
  const bucket_by_month_pipeline = [
  	{$lookup:{from:"schedule",as:"schedule",localField:"_id",foreignField:"projectId"}},
  	{$unwind:"$schedule"},
  	{$addFields:{month:{$floor:
  	   {$multiply:
  	   	 [{$divide:[{$subtract:["$schedule.week","$details.product_start_date"]},{$subtract:["$details.product_end_date","$details.product_start_date"]}]},12]
  	   }
  	}}},
  	{$addFields:{month:{$cond:[{$lt:["$month",0]},0,"$month"]}}},
  	{$group:{
  		_id: {
  			pr_id: "$_id",
  			month: "$month",
  		},
  		total_hours_planned: {$first: "$summary.planned_hours"},
  		hours_delivered: {$sum: "$schedule.actual.hours"}
  	}},
  	{$addFields:{pct:{$divide:["$hours_delivered","$total_hours_planned"]}}},
  	{$group:{
  		_id: {
  			month: "$_id.month",
  		},
  		count:{$sum:1},
  		pct_delivered_sum:{$sum:"$pct"},
  		total_hours_planned:{$sum:"$total_hours_planned"},
  		hours_delivered:{$sum:"$hours_delivered"},
  	}}
  ];
  
  const pipe = [
    {$match:{region:{ $regex: "^NA" }}},
    {$match:{'details.product_start_date':{$gte: ny}}},
    {$match:{$expr:{$lte:[
    	{$add :[
    		'$details.product_start_date',
    		{$multiply:[
    			num_periods / 12,
    			{$subtract:["$details.product_end_date","$details.product_start_date"]}
    		]}
    	]},
    	now
    ]}}},
    {$facet:{
    	totals: [
    		{$group:{_id:null, total_hours_planned: {$sum: "$summary.planned_hours"}, total_count: {$sum:1}}}
    	],
    	monthly: bucket_by_month_pipeline
    }},
    {$unwind:"$totals"},
    {$unwind:"$monthly"},
    {$project:{
    	month:"$monthly._id.month",
    	pct_avg:{$divide:["$monthly.pct_delivered_sum","$totals.total_count"]},
    	pct_avg_w:{$divide:["$monthly.hours_delivered","$totals.total_hours_planned"]},
    }}//,
    //{$out:"burndown_stats"}
  ];
  var res = await psprojectCol.aggregate(pipe).toArray();
  res = res.filter(el => el.month < 12);
  res.forEach(el => {el.asOf = today; el.type = "all"});
  console.log(JSON.stringify(res));
  
  const small_t = 120;
  var res_small = await psprojectCol.aggregate([{$match:{'summary.planned_hours':{$lte: small_t}}},...pipe]).toArray();
  res_small = res_small.filter(el => el.month < 12);
  res_small.forEach(el => {el.asOf = today; el.type = "small"});
  
  var res_large = await psprojectCol.aggregate([{$match:{'summary.planned_hours':{$gt: small_t}}},...pipe]).toArray();
  res_large = res_large.filter(el => el.month < 12);
  res_large.forEach(el => {el.asOf = today; el.type = "large"});
  
  
  statsCol.deleteMany({});
  statsCol.insertMany(res);
  statsCol.insertMany(res_small);
  statsCol.insertMany(res_large);
  statsColHist.insertMany(res);
  statsColHist.insertMany(res_small);
  statsColHist.insertMany(res_large);
};
