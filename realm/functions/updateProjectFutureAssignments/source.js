exports = async function(event){
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
  var projectId = event.fullDocument.projectId;
  
  var col_proj = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  var col_schedule = context.services.get("mongodb-atlas").db("shf").collection("schedule");
  
  var d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setHours(0);	d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0);
  
  var res = await col_schedule.aggregate([
    {$match:{"projectId":projectId,"assignment.end_date":{$gte:d}}},
    {$match:{$or:[{"estimated.hours":{$gt:0}},{"estimated.revenue":{$gt:0}}]}},
    {$match:{role:{$ne:"Project Manager"}}},
    {$sort:{"assignment.end_date":1}},
    {$project:{ass_dates: {s:"$assignment.start_date",e:"$assignment.end_date",resource_email:"$resource_email"}}},
    {$group:{_id:null, dates_array:{$push : "$ass_dates"}}}
  ]).toArray();
  
  if (res.length > 0)
    col_proj.updateOne({_id:projectId},{$set: {future_assignments_dates: res[0].dates_array}});
  
  return {arg: projectId};
};