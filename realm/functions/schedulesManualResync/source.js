exports = function(){
  var col_requests = context.services.get("mongodb-atlas").db("sync").collection("requests");
  col_requests.insertOne({
     status:"New",
     origin:null,
     type: "manual_override",
     ts:{created:new Date()},
     resync:true,
     sched:true
  })
  return {queued:true};
}