function getSunday(d) {
    d = new Date(d);
    var day = d.getDay(),
    diff = d.getDate() - day;
    d.setHours(0);	d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0);
    return new Date(d.setDate(diff));
}

function getSundayNextWeek(d) {
    d = new Date(d);
    var day = d.getDay(),
    diff = d.getDate() - day + 7;
    d.setHours(0);	d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0);
    return new Date(d.setDate(diff));
}

function format_date(date_format) {
  return (date_format.getMonth()+1)+'/'+ date_format.getDate()+'/'+date_format.getFullYear();
}

function generateHTML(resource_name, assignment_infos, assignment_infos2) {
  
  let ass_table = `
    <tr>
      <th>Region</th>
      <th>Project</th>
      <th>Milestone</th>
      <th>CE</th>
      <th>Days</th>
      <th>Hours</th>
    </tr>`;
    
  let ass_table2 = `
    <tr>
      <th>Region</th>
      <th>Project</th>
      <th>Milestone</th>
      <th>CE</th>
      <th>Days</th>
      <th>Hours</th>
    </tr>`;
  
  for(let i in assignment_infos) {
    ass_table += `
      <tr>
        <td>${assignment_infos[i].region}</td>
        <td>${assignment_infos[i].project}</td>
        <td><a href=https://mongodb.my.salesforce.com/${assignment_infos[i].ass_id}>${assignment_infos[i].milestone}</a></td>
        <td>${assignment_infos[i].resource}</td>
        <td>${assignment_infos[i].days}</td>
        <td>${assignment_infos[i].hours}</td>
      </tr>`;
  }
  
  for(let i in assignment_infos2) {
    ass_table2 += `
      <tr>
        <td>${assignment_infos2[i].region}</td>
        <td>${assignment_infos2[i].project}</td>
        <td><a href=https://mongodb.my.salesforce.com/${assignment_infos2[i].ass_id}>${assignment_infos2[i].milestone}</a></td>
        <td>${assignment_infos2[i].resource}</td>
        <td>${assignment_infos2[i].days}</td>
        <td>${assignment_infos2[i].hours}</td>
      </tr>`;
  }
  
  return `
         <head>
      <style>
         table, th, td {
            border: 1px solid black;
         }
      </style>
   </head>
   <body>
  	  <div>
		  Hello ${resource_name},
		  <br/><br/>
		  Hope you're having a great weekend! Here are the upcoming engagements for the projects where you're the PM/PA.
		  <br/>This week:<br/>
		  <table>
		    ${ass_table}
		  </table>
		  <br/>Next week:<br/>
		  <table>
		    ${ass_table2}
		  </table>
		  <br/>
		  Note that this information might be slightly out of date :)
		  <br/> <br/>
		  Your friendly PS Bot
		  <br/>
	  </div>
	  </body>`;
}

exports = async function(arg){
  
  var col_schedule = context.services.get("mongodb-atlas").db("shf").collection("schedule");

  const today = new Date();
  const sunday = getSunday(today);
  const sundayNextWeek = getSundayNextWeek(today);
  
  const pipe = [
				{
					"$match" : {
						"estimated.days" : {
							"$gt" : 0
						},
						"role" : {$regex:'Engineer|Train|Consultant'},
						"billable" : true,
						"cal_week" : {$in:[sunday,sundayNextWeek]}
					}
				},
        {$group:{_id:{week:"$week",ass_id:"$assignment._id"}, root:{$first:"$$ROOT"}}},
        {$replaceRoot: { newRoot: "$root" } },
				{
					"$lookup" : {
						"from" : "psproject",
						"as" : "project",
						"localField" : "projectId",
						"foreignField" : "_id"
					}
				},
				{
					"$unwind" : "$project"
				},
				{
					"$match" : {
						"project.region" : {$regex:'^NA'}
					}
				},
				{
					"$project" : {
						"resource" : 1,
						"project" : "$project.name",
						"account" : "$project.account",
						"region" : "$project.region",
						"milestone" : {
							"$filter" : {
								"input" : "$project.milestones",
								"as" : "m",
								"cond" : {
									"$eq" : [
										"$$m._id",
										"$milestoneId"
									]
								}
							}
						},
						"days" : "$estimated.days",
						"hours" : "$estimated.hours",
						"ass_start" : "$assignment.start_date",
						"ass_end" : "$assignment.end_date",
						"ass_id" : "$assignment._id",
						"pm" : "$project.project_manager",
						"pm_email" : "$project.project_manager_email",
						"week" : "$cal_week"
					}
				},
				{
					"$unwind" : "$milestone"
				},
				{
					"$addFields" : {
						"milestone" : "$milestone.name"
					}
				},
				{
					"$sort" : {
					  "region" : 1,
						"account" : 1,
						"ass_start" : 1
					}
				},
				{$group:{_id:"$pm", pm_email:{$first:"$pm_email"},details:{$push:"$$ROOT"}}}
			];

  var res = await col_schedule.aggregate(pipe).toArray();

  for(let i in res) {
    let name = res[i]._id;
    let email = res[i].pm_email;
    let infos = res[i].details.filter(info => info.week.getTime() === sunday.getTime());
    let infos2 = res[i].details.filter(info => info.week.getTime() === sundayNextWeek.getTime());
  
    let toEmail = email;
    let origEmail = "ps-bot-noreply@mongodb.com";
    let subject = `[PS-Bot] Your projects' assignments for the week of ${format_date(sunday)}`;
    let html = generateHTML(name, infos, infos2);
    
    context.functions.execute("sendMail", {origEmail, toEmail, subject, html});
  }
  
  return {arg: arg};
};