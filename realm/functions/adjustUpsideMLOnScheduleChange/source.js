exports = function(changeEvent) {
  function getThisMonth(now) {
    const current = new Date(now.getFullYear(), now.getMonth(), 1);
    current.setUTCHours(0, 0, 0, 0);
    return current;
  }

  const fullDocument = changeEvent.fullDocument;
  if (fullDocument == null)
    return;
    
  if (! fullDocument.billable)
    return;
    
  var ms = fullDocument.milestoneId;
  var m = getThisMonth(fullDocument.week);
  
  var scheduled_revenue = fullDocument.estimated.revenue;
  
  var col_revfcst = context.services.get("mongodb-atlas").db("shf").collection("revforecast");
  
  col_revfcst.updateOne({milestoneId:ms, month: m},[{$set:{upside_ml:{$cond:[{$gt:["$upside_ml",scheduled_revenue]},{$subtract:["$upside_ml",scheduled_revenue]},0]}}}])
};
