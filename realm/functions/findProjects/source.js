exports = async function findProjects({filter, sort}) {
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
  
  const {active, name, region, owner, project_manager, active_user_filter, pm_stage} = filter;
  
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
  if (active_user_filter) {
    let userDoc = await userdataCollection.findOne({_id : active_user_filter })
    if (userDoc)
      matchData = {...matchData, "$or" : [{owner : {$in : userDoc.sf_names}},{project_manager: {$in : userDoc.sf_names}},{ps_ops_resource: {$in : userDoc.sf_names}}]};
  }
  
  const {field, order} = sort;
  
  if (name) {
    const psprojects = await psprojectCollection.aggregate([
      {$search: 
        {
          "text": {
            "query": name,
            "path": "name"
          }
        }
      },
      {$match: matchData},
      {$sort: {[field]: order}}
    ]);
    
    return psprojects.toArray();
  }
  
  const psprojects = await psprojectCollection.aggregate([
    {$match: matchData},
    {$sort: {[field]: order}}
  ]);
  
  return psprojects.toArray();
};
