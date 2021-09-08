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
  function getMonthStart() {
    var date = new Date();
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
  }
  
  var ms_id = event.documentKey._id.ms_id;
  if (ms_id == null)
    return;
  
  var col_proj = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  var col_schedule = context.services.get("mongodb-atlas").db("shf").collection("schedule");
  
  var res = await col_schedule.aggregate([
    {$match:{"milestoneId":ms_id, billable:true}},
    {$match:{"week":{$gte: getMonthStart()}}},
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
    
  await col_proj.updateOne({'milestones._id':ms_id},{$set: {'milestones.$.summary.billable_hours_scheduled_undelivered': parseFloat(val) }});
  
  //clever way to create a computed field and do our best to fix the backlog hours value for the project
  addFieldsPipe = [
  {$addFields:
         { "summary.backlog_hours_fixed":
            {$sum:{
              $map:
                 {
                   input: "$milestones",
                   as: "m",
                   in:  
                   	{$cond:
                   	  [ {$and:[ 
                   	       {$gte:["$$m.summary.billable_hours_in_financials",0]},
                   	       {$gte:["$$m.summary.billable_hours_scheduled_undelivered",0]} 
                   	    ]},
                        { $subtract: 
                           [ "$$m.summary.planned_hours", {$add:
                              [ "$$m.summary.billable_hours_in_financials", "$$m.summary.billable_hours_scheduled_undelivered" ]} ] 
                        },
                   	    "$$m.summary.unscheduled_hours"
                   	  ]
                   	}
                 }
            }}
         }
      }
  ];
  
  await col_proj.updateOne({'milestones._id':ms_id},addFieldsPipe);
  
  return {arg: ms_id};
};