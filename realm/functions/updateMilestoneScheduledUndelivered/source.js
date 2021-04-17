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
  var ms_id = event.documentKey._id.ms_id;
  if (ms_id == null)
    return;
  
  var col_proj = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  var col_schedule = context.services.get("mongodb-atlas").db("shf").collection("schedule");
  
  var res = await col_schedule.aggregate([
    {$match:{"milestoneId":ms_id, billable:true}},
    {$project:{ hours_scheduled : { 
                  $let: {
                           vars: {
                              diff: {$sum:{$subtract: ["$estimated.hours","$actual.hours"]}},
                           },
               in: { $cond: [ {$gt:["$$diff",0]}, "$$diff", 0 ] }
            }}}},
    {$group:{_id:"null", 
            hours_scheduled:{$sum:"$hours_scheduled"}
    }}
  ]).toArray();
  
  var val = 0;
  
  if (res.length > 0)
    val = res[0].hours_scheduled;
    
  col_proj.updateOne({'milestones._id':ms_id},{$set: {'milestones.$.summary.billable_hours_scheduled_undelivered': parseFloat(val) }});
  
  return {arg: ms_id};
};