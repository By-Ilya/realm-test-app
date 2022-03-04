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

function make_me_laugh() {
  const images = [
    "https://www.memesmonkey.com/images/memesmonkey/ed/ed2d7c22385be546cfc825f6444f8e0a.jpeg",
    "https://clockify.me/blog/wp-content/uploads/2019/01/timesheet-meme-24.jpg",
    "https://www.actitime.com/wp-content/uploads/2019/08/cat-min.jpg",
    "https://i.pinimg.com/originals/22/a5/5d/22a55dddd2a7da1515c4c71385664537.jpg",
    "http://memecrunch.com/meme/BGSUY/do-your-timecard/image.jpg",
    "https://biz30.timedoctor.com/images/2022/01/late-timesheets.jpg",
    "https://www.memecreator.org/static/images/memes/5296080.jpg",
    "https://clockify.me/blog/wp-content/uploads/2019/01/timesheet-meme-58.jpg",
    "https://memegenerator.net/img/instances/76763084.jpg",
    "https://blog-cdn.everhour.com/blog/wp-content/uploads/2019/09/success-min.jpg",
    "https://www.memecreator.org/static/images/memes/4906149.jpg",
    "https://i.pinimg.com/originals/be/96/f6/be96f6c38fc4c2e80ae2a9a4e51e8774.jpg",
    "https://www.timecamp.com/blog/wp-content/uploads/2020/11/That-feeling-when-you-submit-timesheet.jpg.webp",
    "https://memegenerator.net/img/instances/63790624.jpg"
    ]
    
  return images[Math.floor(Math.random()*images.length)];
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
		  Hi ${resource_name},
		  <br/><br/>
		  This is a friendly reminder to submit your timecards for the week. Below are the engagements with timecards outstanding:
		  <br/><br/>
		  <table>
		    ${ass_table}
		  </table>
		  <br/>
		  <img src=${make_me_laugh()}>
		  <br/> <br/>
		  Your friendly PS Bot
		  <br/>
	  </div>`;
}

function getSunday(d) {
  d = new Date(d);
  var day = d.getDay(),
  diff = d.getDate() - day;
  d.setHours(0);	d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0);
  return new Date(d.setDate(diff));
}
  
exports = async function(arg){
  var today = new Date();
  var start_date = getSunday(today);
  if (start_date.getMonth() < today.getMonth()) start_date = new Date(today.getFullYear(), today.getMonth(), 1);

  var c_schedule = context.services.get("mongodb-atlas").db("shf").collection("schedule");

  var res = await c_schedule.aggregate([
	{
		"$match" : {
			"week" : start_date
		}
	},
	{
		"$match" : {
			"billable" : true,
			"$or" : [
				{
					"estimated.hours" : {
						"$gt" : 0
					}
				},
				{
					"actual.hours" : {
						"$gt" : 0
					}
				}
			]
		}
	},
	{
		"$group" : {
			"_id" : {
				"week" : "$week",
				"ass_id" : "$assignment._id"
			},
			"root" : {
				"$first" : "$$ROOT"
			}
		}
	},
	{
		"$replaceRoot" : {
			"newRoot" : "$root"
		}
	},
	{
		"$group" : {
			"_id" : {
				"week" : "$cal_week",
				"assignment_id" : "$assignment._id"
			},
			"projectId" : {
				"$first" : "$projectId"
			},
			"actual_days" : {
				"$sum" : "$actual.days"
			},
			"actual_hours" : {
				"$sum" : "$actual.hours"
			},
			"actual_revenue" : {
				"$sum" : "$actual.revenue"
			},
			"estimated_days" : {
				"$sum" : "$estimated.days"
			},
			"estimated_hours" : {
				"$sum" : "$estimated.hours"
			},
			"estimated_revenue" : {
				"$sum" : "$estimated.revenue"
			},
			"resource" : {
				"$first" : "$resource"
			},
			"resource_email" : {
				"$first" : "$resource_email"
			},
			"role" : {
				"$first" : "$role"
			}
		}
	},
	{
		"$lookup" : {
			"from" : "psproject",
			"as" : "psproject",
			"localField" : "projectId",
			"foreignField" : "_id"
		}
	},
	{
		"$addFields" : {
			"project_name" : {
				"$arrayElemAt" : [
					"$psproject.name",
					0
				]
			},
			"region" : {
				"$arrayElemAt" : [
					"$psproject.region",
					0
				]
			},
			"psm" : {
				"$arrayElemAt" : [
					"$psproject.owner",
					0
				]
			},
			"pm" : {
				"$arrayElemAt" : [
					"$psproject.project_manager",
					0
				]
			}
		}
	},
	{
		"$project" : {
			"psproject" : 0
		}
	},
	{
		"$lookup" : {
			"from" : "timecard",
			"as" : "tc",
			"let" : {
				"ass_id" : "$_id.assignment_id",
				"start" : "$_id.week"
			},
			"pipeline" : [
				{
					"$match" : {
						"$expr" : {
							"$eq" : [
								"$start_date",
								"$$start"
							]
						}
					}
				},
				{
					"$match" : {
						"$expr" : {
							"$eq" : [
								"$assignment._id",
								"$$ass_id"
							]
						}
					}
				}
			]
		}
	},
	{
		"$addFields" : {
			"approver" : {
				"$arrayElemAt" : [
					"$tc.approver.name",
					0
				]
			},
			"tc_hours" : {
				"$arrayElemAt" : [
					"$tc.hours_total",
					0
				]
			},
			"tc_status" : {
				"$arrayElemAt" : [
					"$tc.status",
					0
				]
			}
		}
	},
	{
		"$project" : {
			"tc" : 0
		}
	},
	{
		"$addFields" : {
			"tc_status" : {
				"$ifNull" : [
					"$tc_status",
					"Pending"
				]
			},
			"approver" : {
				"$ifNull" : [
					"$approver",
					"$pm"
				]
			}
		}
	},
	{
		"$match" : {
			"tc_status" : {
				"$nin" : [
					"Approved",
					"Rejected"
				]
			}
		}
	},
	{$match:{"tc_status" : {$in:["Saved","Pending"]}}},
	{$group:{_id:"$resource", resource_email:{$first:"$resource_email"},details:{$push:"$$ROOT"}}}
]).toArray();
  
  for(let i in res) {
    let name = res[i]._id;
    let email = res[i].resource_email;
    let infos = res[i].details;
  
    let toEmail = email;
    let origEmail = "ps-bot-noreply@mongodb.com";
    let subject = `[PS-Bot] Weekly timecards submission`;
    let html = generateHTML(name, infos);

    context.functions.execute("sendMail", {origEmail, toEmail, subject, html});
  }
  
  return {arg: arg};
};