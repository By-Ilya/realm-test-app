exports = async function(arg){
  /*
    Accessing application's values:
    var x = context.values.get("value_name");

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
    var doc = collection.findOne({owner_id: context.user.id});

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);

    Try running in the console below.
  */
  function getSunday(d) {
    d = new Date(d);
    var day = d.getDay(),
    diff = d.getDate() - day;
    d.setHours(0);	d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0)
    return new Date(d.setDate(diff));
  }
  
  function getMonthStart() {
    var date = new Date();
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
  }

  var col = context.services.get("mongodb-atlas").db("shf").collection("schedule");
  var sundate = getSunday(new Date());
  
  
  var past = await col.aggregate([
    {$match:{"milestoneId":arg,"week":{$lt:sundate}}},
    {$match:{$or:[{"actual.hours":{$gt:0}},{"actual.revenue":{$gt:0}}]}},
    {$match:{role:{$ne:"Project Manager"}}},
    {$sort:{"week":1}},
    // Hack to circumvent the bug in FF that leads to duplicate EVAs
    {$sort:{SystemModstamp:-1}},
    {$group:{_id:{week:"$week",ass_id:"$assignment._id"}, root:{$first:"$$ROOT"}}},
    {$replaceRoot: { newRoot: "$root" } },
    // ---
    {$group:{_id:"$week","week":{$first:"$week"},hours:{$sum:"$actual.hours"}, 
      hours_nonbillable:{$sum:{ $cond: [ "$billable", 0, "$actual.hours" ] }},
      revenue:{$sum:{ $cond: [ "$billable","$actual.revenue", 0]}}, resources: {$addToSet: "$resource"}}},
    {$sort:{"week":-1}},
    {$limit:3},
    {$sort:{"week":1}}
  ]).toArray();
  
  var past_unsubmitted = await col.aggregate([
    {$match:{"milestoneId":arg,"week":{$gte:getMonthStart(),$lt:sundate}}},
    {$match:{$or:[{"estimated.hours":{$gt:0}},{"estimated.revenue":{$gt:0}}], "actual.hours":0}},
    {$match:{role:{$ne:"Project Manager"}}},
    {$sort:{"week":1}},
    // Hack to circumvent the bug in FF that leads to duplicate EVAs
    {$sort:{SystemModstamp:-1}},
    {$group:{_id:{week:"$week",ass_id:"$assignment._id"}, root:{$first:"$$ROOT"}}},
    {$replaceRoot: { newRoot: "$root" } },
    // ---
    {$group:{_id:"$week","week":{$first:"$week"},hours:{$sum:"$estimated.hours"}, 
      hours_nonbillable:{$sum:{ $cond: [ "$billable", 0, "$estimated.hours" ] }},
      revenue:{$sum:{ $cond: [ "$billable","$estimated.revenue", 0]}}, resources: {$addToSet: {$concat:["$resource","*"]}},
    }},
    {$sort:{"week":1}}
  ]).toArray();
  
  var future = await col.aggregate([
    {$match:{"milestoneId":arg,"week":{$gte:sundate}}},
    {$match:{$or:[{"estimated.hours":{$gt:0}},{"estimated.revenue":{$gt:0}}]}},
    {$match:{role:{$ne:"Project Manager"}}},
    {$sort:{"week":1}},
    // Hack to circumvent the bug in FF that leads to duplicate EVAs
    {$sort:{SystemModstamp:-1}},
    {$group:{_id:{week:"$week",ass_id:"$assignment._id"}, root:{$first:"$$ROOT"}}},
    {$replaceRoot: { newRoot: "$root" } },
    // ---
    {$group:{_id:"$week","week":{$first:"$week"},hours:{$sum:"$estimated.hours"}, 
      hours_nonbillable:{$sum:{ $cond: [ "$billable", 0, "$estimated.hours" ] }},
      revenue:{$sum:{ $cond: [ "$billable", "$estimated.revenue", 0]}}, resources: {$addToSet: "$resource"}}},
    {$sort:{"week":1}},
    {$limit:7}
  ]).toArray();
  
  
  //sundate = sunday of the week
  //get agg actuals (rev + hours) for weeks < sundate , sorted by sundate asc, limit 3
  //get agg estimates (rev + hours) for weeks >= sundate , sorted by sundate asc, limit 7
  //concat results 
  let res = past.concat(past_unsubmitted).concat(future);
  return res.sort((a, b) => (a.week > b.week) ? 1 : -1)
};