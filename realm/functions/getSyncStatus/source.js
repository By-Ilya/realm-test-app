exports = async function(request_id){
  var col_requests = context.services.get("mongodb-atlas").db("sync").collection("requests");
  const result = await col_requests.findOne({_id:request_id})
  if (result)
    return result.status
  else
    return null
}