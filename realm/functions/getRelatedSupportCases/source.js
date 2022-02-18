exports = async function(arg){
  const {account_id} = arg;

  var col = context.services.get("mongodb-atlas").db("shf").collection("case");
  
  var cases = await col.aggregate([
    {$match:{"account_id":account_id}},
    {$sort:{"account_id":1,"status_sortid":1,"fts":-1,"date_created":-1}},
    {$limit:10}
  ]).toArray();
  
  return cases;
};