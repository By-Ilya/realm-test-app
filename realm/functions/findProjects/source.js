exports = async function findProjects({filter, sort, count_only}) {
  // function getSoQ() {
  //   var today = new Date(),
  //   month = today.getMonth(),
  //   qYear = (month == 0) ? today.getFullYear()-1 : today.getFullYear(),
  //   qMonth = (month < 1) ? 10 : ((month < 4) ? 1 : ((month < 7) ? 4 : ((month < 10) ? 7 : 10))),
  //   SOQ = new Date( qYear, qMonth, 1 );
    
  //   SOQ.setHours(0);
  //   SOQ.setMinutes(0);
  //   SOQ.setSeconds(0);
    
  //   return SOQ;
  // }
    
  const cluster = context.services.get("mongodb-atlas");
  const psprojectCollection = cluster.db("shf").collection("psproject");
  const userdataCollection = cluster.db("shf").collection("userdata");
  
  const {active, name, region, owner, project_manager, active_user_filter, pm_stage, limit, monthly_forecast_done} = filter;
  
  let matchData = {};
  if (active) matchData = {...matchData, "details.pm_stage" : {$nin : ["Closed","Cancelled"] }, active };
  if (region) matchData = {...matchData, region}
  if (owner) matchData = {...matchData, owner};
  if (project_manager) matchData = {...matchData, project_manager};
  if (pm_stage) {
    if (pm_stage === '-None-')
      matchData = {...matchData, "details.pm_stage" : null};
    else
      matchData = {...matchData, "details.pm_stage" : pm_stage};
  }
  if (active_user_filter && active_user_filter.name) {
    let userDoc = await userdataCollection.findOne({_id : active_user_filter.email })
    let names;
    if (userDoc) {
      names = userDoc.sf_names;
      if (names.indexOf(active_user_filter.name) < 0)
        names.push(active_user_filter.name)
    } else
      names = [active_user_filter.name];
        
    matchData = {...matchData, "$or" : [
                                  {owner : {$in : names}},
                                  {project_manager: {$in : names}},
                                  {ps_ops_resource: {$in : names}},
                                  {'opportunity.engagement_manager': {$in : names}},
                                  {'future_assignments_dates.resource_email': active_user_filter.email}
                                ]};
  }
  if (monthly_forecast_done === true) {
    matchData = {...matchData, "monthly_forecast_done" : true};
  } else if (monthly_forecast_done === false) {
    matchData = {...matchData, "monthly_forecast_done" : {$ne: true}};
  }
  
  var agg_pipeline = [];
  if (name)
    agg_pipeline.push(
      {$search: 
        // {
        //   "text": {
        //     "query": name,
        //     "path": ["name","custom_name"]
        //   }
        // }
        {
          "compound": 
        	{
        		"should":[{
        			"autocomplete": {
        			  "path": "name",
        			  "query": name,
        			}
        		},
        		{
        			"autocomplete": {
        			  "path": "custom_name",
        			  "query": name,
        			}
        		},
        		{
        			"autocomplete": {
        			  "path": "account",
        			  "query": name,
        			}
        		},
        		{
        			"autocomplete":{
        			  "path": "opportunity.name",
        			  "query": name
        			}
        		}]
        	}
        }
      }
    );
  //we can have malformed projects with no details (ghost milestone upserts) or no milestones (old projects getting updated)
  agg_pipeline.push({$match:{details:{$ne:null},milestones:{$ne:null}}});
  
  agg_pipeline.push(
    {$match: matchData}
  );
  
  if (!count_only) {
    const {field, order} = sort;
    const biasedLimit = limit + 1;
    
    agg_pipeline.push(
      {$sort: {[field]: order}}
    );
    agg_pipeline.push(
      {$limit: biasedLimit || 51}
    );

  } else
    agg_pipeline.push(
      {$count: "name"}
    );
  
  const psprojects = await psprojectCollection.aggregate(agg_pipeline);
  
  return psprojects.toArray();
};
