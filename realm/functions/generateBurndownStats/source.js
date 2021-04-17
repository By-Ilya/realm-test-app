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
  
  var now = new Date()
  var ny = new Date("2019-06-01")
  var num_periods = 12;
  
  const psprojectCol = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  const statsCol = context.services.get("mongodb-atlas").db("shf").collection("burndown_stats");
  
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
  
  var res = await psprojectCol.aggregate([
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
  ]).toArray();
  
  console.log(JSON.stringify(res));
  
  statsCol.deleteMany({});
  statsCol.insertMany(res.filter(el => el.month < 12));
};
