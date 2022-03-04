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
  const DAYS_TO_START = 7;
  const DAYS_SINCE_CREATED = 14;
  
  var col_schedule = context.services.get("mongodb-atlas").db("shf").collection("schedule");
  var col_users = context.services.get("mongodb-atlas").db("shf").collection("userdata");
  
  var d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  
  var d_start = new Date(d);
  d_start.setDate(d_start.getDate() + DAYS_TO_START);
  
  var d_created = new Date(d);
  d_created.setDate(d_created.getDate() - DAYS_SINCE_CREATED);
  
  //find schedules starting 7 days from now and that were created 14 or more days ago
  var projects = await col_schedule.aggregate([
    {$match: {"assignment.start_date" : d_start, "assignment.createdDate" : {$lte : d_created}}},
    {$group: {_id : "$projectId", "ass_created_date" : {$first: "$assignment.createdDate"}}},
    {$lookup : {from : "psproject", as : "proj", localField: "_id", foreignField: "_id"}},
    {$unwind : "$proj"},
    {$lookup : {
      from: "schedule",
      as: "sc_meantime",
      let: {pid:"$_id"},
      pipeline: [
        {$match:{$expr:{$eq:["$projectId","$$pid"]}}},
        {$match:{"assignment.start_date" : {$lt: d_start}, "assignment.end_date" : {$gt: d_created}}}
      ]
    }},
    {$match:{sc_meantime : {$size:0}}}
  ]).toArray();
  
  for(let i in projects) {
    let proj = projects[i].proj;
    
    //get Ops and PM emails
    let ps_ops = await col_users.findOne({sf_names : proj.ps_ops_resource});
    if (! ps_ops) {
      console.log(`We don't have data on the Ops person (${proj.ps_ops_resource}) for ${proj.name}`)
    }
    
    let pm;
    if (proj.project_manager !== proj.owner) {
      pm = await col_users.findOne({sf_names : proj.project_manager});
      if (! pm) {
        console.log(`We don't have data on the PM (${proj.project_manager}) for ${proj.name}`)
      }
    }
    
    if (!pm && !ps_ops)
      continue;
  
    let toEmail;
    let origEmail = "ps-bot-noreply@mongodb.com";
    let subject = `[PS-Bot] Automated reminder for ${proj.name}`
    let html = `
  	  <div>
		  Hello,
		  <br/><br/>
		  This is an automated reminder for project ${proj.name}.
		  <br/><br/>
		  This project has an upcoming assignment in ${DAYS_TO_START} days. This assignment has been created more than ${DAYS_SINCE_CREATED} days ago and we haven't had any engagements in the meantime.
		  <br/>
		  If you haven't already, I highly recommend engaging the customer (${proj.account}) to confirm their readiness.
		  <br/> <br/>
		  -PS Bot
		  <br/>
	  </div>`;
    
    if (pm) toEmail = pm._id;
    if (ps_ops) toEmail = ps_ops._id;
    if (pm && ps_ops) toEmail = `${pm._id},${ps_ops._id}`
    
    // toEmail = "alex@mongodb.com"
    // console.log(proj.name)
    // console.log(toEmail)
    
    context.functions.execute("sendMail", {origEmail, toEmail, subject, html});
    
  }
  
  return {arg: arg};
};