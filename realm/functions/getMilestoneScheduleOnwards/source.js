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

  var col = context.services.get("mongodb-atlas").db("shf").collection("schedule");
  var sundate = getSunday(new Date());
  
  
  var past = await col.aggregate([
    {$match:{"milestoneId":arg,"week":{$lt:sundate}}},
    {$match:{$or:[{"actual.hours":{$gt:0}},{"actual.revenue":{$gt:0}}]}},
    {$match:{role:{$ne:"Project Manager"}}},
    {$sort:{"week":1}},
    {$group:{_id:"$week","week":{$first:"$week"},hours:{$sum:"$actual.hours"}, 
      hours_nonbillable:{$sum:{ $cond: [ "$billable", 0, "$actual.hours" ] }},
      revenue:{$sum:"$actual.revenue"}, resources: {$addToSet: "$resource"}}},
    {$sort:{"week":-1}},
    {$limit:3},
    {$sort:{"week":1}}
  ]).toArray();
  
  var future = await col.aggregate([
    {$match:{"milestoneId":arg,"week":{$gte:sundate}}},
    {$match:{$or:[{"estimated.hours":{$gt:0}},{"estimated.revenue":{$gt:0}}]}},
    {$match:{role:{$ne:"Project Manager"}}},
    {$sort:{"week":1}},
    {$group:{_id:"$week","week":{$first:"$week"},hours:{$sum:"$estimated.hours"}, 
      hours_nonbillable:{$sum:{ $cond: [ "$billable", 0, "$estimated.hours" ] }},
      revenue:{$sum:"$estimated.revenue"}, resources: {$addToSet: "$resource"}}},
    {$sort:{"week":1}},
    {$limit:7}
  ]).toArray();
  
  
  //sundate = sunday of the week
  //get agg actuals (rev + hours) for weeks < sundate , sorted by sundate asc, limit 3
  //get agg estimates (rev + hours) for weeks >= sundate , sorted by sundate asc, limit 7
  //concat results 
  return past.concat(future);
};