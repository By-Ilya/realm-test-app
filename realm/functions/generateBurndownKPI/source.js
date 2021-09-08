exports = async function(psproj_start_range_start, psproj_start_range_end, target_date) {
  /*
    Generates the average burndown percentage (in days) up to 'target_date' for projects started between 'start' and 'end'
  */
  const psprojectCol = context.services.get("mongodb-atlas").db("shf").collection("psproject");

  // const per_project_stats_pipeline = [
  // 	{$lookup:{from:"schedule",as:"schedule",localField:"_id",foreignField:"projectId"}},
  // 	{$addFields:{schedule:{$filter:{input:"$schedule",as:"s",cond:{$and:[
  // 	                                                {$lte:["$$s.week",target_date]},
  // 	                                                {$eq:["$$s.billable",true]}
  // 	                                              ]}}}}},
  // 	{$project:{
  // 	  hours_planned: "$summary.planned_hours",
  // 	  hours_delivered: {$reduce:{input:"$schedule", initialValue:0, in:{ $sum: [ "$$value", "$$this.actual.hours" ] }}}
  // 	}},
  //   {$project:{
  //     pct_delivered: {$divide:["$hours_delivered","$hours_planned"]}
  //   }},
  // ];
  
  // const pipe = [
  //   {$match:{region:{ $regex: "^NA" }}},
  //   {$match:{'details.product_start_date':{$gte: psproj_start_range_start, $lte: psproj_start_range_end}}},
  //   {$facet:{
  //   	totals: [
  //   		{$group:{_id:null, project_count: {$sum:1}}}
  //   	],
  //   	per_project: per_project_stats_pipeline
  //   }},
  //   {$unwind:"$totals"},
  //   {$project:{
  // 	  project_count: "$totals.project_count",
  // 	  pct_delivered_sum: {$reduce:{input:"$per_project", initialValue:0, in:{ $sum: [ "$$value", "$$this.pct_delivered" ] }}}
  // 	}},
  //   {$project:{
  //   	pct_delivered_avg:{$divide:["$pct_delivered_sum","$project_count"]},
  //   }}
  // ];
  
  const pipe = [
    {$match:{region:{ $regex: "^NA" }}},
    {$match:{'details.product_start_date':{$gte: psproj_start_range_start, $lte: psproj_start_range_end}}},
    {$lookup:{from:"schedule",as:"schedule",localField:"_id",foreignField:"projectId"}},
    {$addFields:{schedule:{$filter:{input:"$schedule",as:"s",cond:{$and:[
                                                    {$lte:["$$s.week",target_date]},
                                                    {$eq:["$$s.billable",true]}
                                                  ]}}}}},
    {$project:{
      hours_planned: "$summary.planned_hours",
      hours_delivered: {$reduce:{input:"$schedule", initialValue:0, in:{ $sum: [ "$$value", "$$this.actual.hours" ] }}}
    }},
    {$project:{
      hours_planned: 1,
      pct_delivered: {$divide:["$hours_delivered","$hours_planned"]}
    }},
    {$sort:{pct_delivered:1}},
    {$group:{
      _id:"null",
      items:{$push:"$pct_delivered"},
      pct_delivered_avg: {$avg:"$pct_delivered"},
      pct_delivered_stdev: {$stdDevPop:"$pct_delivered"},
      planned_hours_avg: {$avg: "$hours_planned" },
    }},
    {$addFields:{
      items_length_plus_one:{$sum:[{$size:"$items"},1]}
    }},
    {$addFields:{
      percentile_indexes:{
        p50_low:{$sum:[{$floor:{$multiply:[0.5,"$items_length_plus_one"]}},-1]},
        p50_high:{$sum:[{$ceil:{$multiply:[0.5,"$items_length_plus_one"]}},-1]},
        p25_low:{$sum:[{$floor:{$multiply:[0.25,"$items_length_plus_one"]}},-1]},
        p25_high:{$sum:[{$ceil:{$multiply:[0.25,"$items_length_plus_one"]}},-1]},
      }
    }},
    {$addFields:{
      percentiles:{
        p50: {$cond:[
                      {$eq:["$percentile_indexes.p50_low","$percentile_indexes.p50_high"]},
                      {$arrayElemAt:["$items","$percentile_indexes.p50_low"]},
                      {$divide:[{$sum:[
                          {$arrayElemAt:["$items","$percentile_indexes.p50_low"]}, {$arrayElemAt:["$items","$percentile_indexes.p50_high"]}
                      ]},2]}
                    ]},
        p25: {$cond:[
                      {$eq:["$percentile_indexes.p25_low","$percentile_indexes.p25_high"]},
                      {$arrayElemAt:["$items","$percentile_indexes.p25_low"]},
                      {$divide:[{$sum:[
                          {$arrayElemAt:["$items","$percentile_indexes.p25_low"]}, {$arrayElemAt:["$items","$percentile_indexes.p25_high"]}
                      ]},2]}
                    ]}
      }
    }},
    {$project:{
      _id:0,
      percentiles: 1,
      pct_delivered_avg: 1,
      pct_delivered_stdev: 1,
      planned_hours_avg: 1
    }}
  ];
  
  var res = await psprojectCol.aggregate(pipe).toArray();
  return res; //returns an array - empty if no projects were found in the range
};
