function getCurrentMonthName() {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const d = new Date();
  return monthNames[d.getMonth()];
}

function format_date(date_format) {
  return (date_format.getMonth()+1)+'/'+ date_format.getDate()+'/'+date_format.getFullYear();
}

function generateHTML(resource_name, assignment_infos) {
  
  let ass_table = `
    <tr>
      <th>Week</th>
      <th>Project</th>
      <th>Days</th>
      <th>Hours</th>
      <th>Revenue</th>
      <th>Assignment</th>
    </tr>`;
  
  for(var i in assignment_infos) {
    ass_table += `
      <tr>
        <td>${format_date(assignment_infos[i]._id.week)}</td>
        <td>${assignment_infos[i].project_name}</td>
        <td>${assignment_infos[i].estimated_days}</td>
        <td>${assignment_infos[i].estimated_hours}</td>
        <td>${assignment_infos[i].estimated_revenue}</td>
        <td>https://mongodb.my.salesforce.com/${assignment_infos[i]._id.assignment_id}</td>
      </tr>`;
  }
  
  return `
  	  <div>
		  Hello ${resource_name},
		  <br/><br/>
		  It's the end of the month and I noticed that you might still have unsubmitted timecards. Please see the details below.
		  <br/><br/>
		  <table>
		    ${ass_table}
		  </table>
		  <br/>
		  If you haven't already, please go ahead and submit all of them as soon as you can so that we can close this month's books on time.
		  <br/> <br/>
		  Your friendly PS Bot
		  <br/>
	  </div>`;
}

function isLastDay(dt) {
    var test = new Date(dt.getTime());
    test.setDate(test.getDate() + 1);
    return test.getDate() === 1;
}

exports = async function(arg){
  var today = new Date();
  //happy Friday! (the weekly notification will take care of this)
  //also don't run on non-last dates since the trigger runs on 28-31 because of a Realm bug
  if ((today.getDay() == 5) || (!isLastDay(today)))
    return;
  
  var c_missing_timecards = context.services.get("mongodb-atlas").db("shf").collection("missing_timecards_this_month");

  var res = await c_missing_timecards.aggregate([
    {$match:{"tc_status" : {$in:["Saved","Pending"]}}},
    {$sort:{"_id.week":1}},
    {$group:{_id:"$resource", resource_email:{$first:"$resource_email"},details:{$push:"$$ROOT"}}}
  ]).toArray();
  
  for(let i in res) {
    let name = res[i]._id;
    let email = res[i].resource_email;
    let infos = res[i].details;
  
    let toEmail = email;
    let origEmail = "ps-bot-noreply@mongodb.com";
    let subject = `[PS-Bot] Did you miss these timecards for ${getCurrentMonthName()}?`;
    let html = generateHTML(name, infos);
    
    context.functions.execute("sendMail", {origEmail, toEmail, subject, html});
  }
  
  return {arg: arg};
};