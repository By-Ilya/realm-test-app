const QUARTAL_MONTHS = [1, 4, 7, 10];

function getCurrentDateInfo() {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  
  return {month, year};
}

function getCurrentQuartalMonth(month) {
  let qEndMonth = 1;
  QUARTAL_MONTHS.some(qMonth => {
    if (month < qMonth) {
      qEndMonth = qMonth
      return true
    }
  });
  
  return qEndMonth;
}

function getPreviousQuartalMonth(currentQuartalMonth) {
  const indexOfMonth = QUARTAL_MONTHS.indexOf(currentQuartalMonth);
  if (indexOfMonth === 0) {
    return QUARTAL_MONTHS[QUARTAL_MONTHS.length - 1];
  }
  
  return QUARTAL_MONTHS[indexOfMonth - 1];
}

function getNextQuartalMonth(currentQuartalMonth) {
  const indexOfMonth = QUARTAL_MONTHS.indexOf(currentQuartalMonth);
  if (indexOfMonth === QUARTAL_MONTHS.length - 1) {
    return QUARTAL_MONTHS[0];
  }
  
  return QUARTAL_MONTHS[indexOfMonth + 1];
}

exports = async function findOpportunities({filter, sort, count_only}) {
  const cluster = context.services.get("mongodb-atlas");
  const opportunityCollection = cluster.db("shf").collection("opportunity");
  const userdataCollection = cluster.db("shf").collection("userdata");
  
  const {
    owner_region,
    ps_region,
    close_date,
    engagement_manager,
    name,
    inForecast,
    active_user_filter,
    limit
  } = filter;
  
  let matchData = {};
  if (owner_region) matchData = {...matchData, owner_region};
  if (ps_region) matchData = {...matchData, ps_region};
  
  const {month, year} = getCurrentDateInfo();
  switch (close_date) {
    case 'All':
      break;
    case 'This Q':
      const thisQEndMonth = getCurrentQuartalMonth(month);
      const thisQStartMonth = getPreviousQuartalMonth(thisQEndMonth);
      
      const thisQStartDate = new Date(thisQStartMonth <= month ? year : year - 1, thisQStartMonth, 1);
      const thisQEndDate = new Date(thisQEndMonth >= month ? year : year + 1, thisQEndMonth, 1);
      
      matchData = {
        ...matchData,
        "close_date": {
          "$gte": thisQStartDate,
          "$lte": thisQEndDate
        }
      };
      break;
    case 'Next Q':
      const nextQStartMonth = getCurrentQuartalMonth(month);
      const nextQEndMonth = getNextQuartalMonth(nextQStartMonth);
      
      const nextQStartDate = new Date(nextQStartMonth >= month ? year : year + 1, nextQStartMonth, 1);
      const nextQEndDate = new Date(nextQEndMonth >= month ? year : year + 1, nextQEndMonth, 1);
      
      matchData = {
        ...matchData,
        "close_date": {
          "$gte": nextQStartDate,
          "$lt": nextQEndDate
        }
      };
      break;
    default:
      break;
  }
  
  if (engagement_manager) matchData = {
    ...matchData,
    "em.engagement_manager": engagement_manager
  };
  if (active_user_filter && active_user_filter.name) {
    const userDoc = await userdataCollection.findOne(
      {_id: active_user_filter.email}
    );
    let names;
    if (userDoc) {
      names = userDoc.sf_names;
      if (names.includes(active_user_filter.name))
        names.push(active_user_filter.name)
    } else names = [active_user_filter.name];
        
    matchData = {...matchData, "$or": [
        {owner: {$in: names}},
        {"em.engagement_manager": {$in : names}},
    ]};
  }
  
  const agg_pipeline = [];
  if (name)
    agg_pipeline.push(
      {$search: 
        {
          "text": {
            "query": name,
            "path": "name"
          }
        }
      }
    );
  
  agg_pipeline.push({$match: matchData});
  
  if (inForecast) {
    agg_pipeline.push({$match: {
      $or : [
        {stage:"Closed Won"},
        {"sales_forecast.AE":true},
        {"sales_forecast.RD":true},
//        {"sales_forecast.amount_services_RD":{$gt:0}},
      ]
    }})
  }
  
  if (count_only) {
    agg_pipeline.push({
      $group: {
        _id: "name",
        amountTotal: {$sum: "$amount"},
        servicesTotal: {$sum: "$services_post_carve"},
        servicesForecastSales: {$sum: {$cond: [{$eq:["$stage", "Closed Won"]}, "$services_post_carve" ,
          {$cond: [
            {$or:[
              //{$in:["$forecast_category",["Best Case","Most Likely","Closed"]]}, 
              {$eq:["$sales_forecast.AE",true]},
              {$eq:["$sales_forecast.RD",true]},
//              {$gt:["$sales_forecast.amount_services_RD",0]},
              ]},
            "$sales_forecast.amount_services_RD" ,0]}
          ]}},
        count: {$sum: 1}
      }
    });
    
    const result = await opportunityCollection.aggregate(agg_pipeline);
    return result.toArray();
  }
  
  const {field, order} = sort;
  const biasedLimit = limit + 1;
    
  agg_pipeline.push(
    {$sort: {[field]: order}}
  );
  agg_pipeline.push(
    {$limit: biasedLimit || 51}
  );
  
  const opportunities = await opportunityCollection.aggregate(agg_pipeline);
  return opportunities.toArray();
};