exports = async function(event){
  /*
    Accessing application's values:
    var x = context.values.get("value_name");

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
    var doc = collection.findOne({owner_id: context.user.id});

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);

    Try running in the console below.
    event.ns.coll
  */
  //attachment event
  var oppId;
  
  if (event.ns.coll === "attachment")
    oppId = event.fullDocument.parentId;
  else if (event.ns.coll === "psproject")
    oppId = event.fullDocument.opportunity._id;
  
  if (oppId == null)
    return;

  var col_proj = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  var col_att = context.services.get("mongodb-atlas").db("shf").collection("attachment");
  
  var res = await col_att.aggregate([
    {$match:{"parentId":oppId}},
    {$sort:{"name":1,"title":1}}
  ]).toArray();
  
  if (res.length > 0)
    col_proj.updateOne({"opportunity._id":oppId},{$set: {"attachments": res}});
  
  return {arg: oppId};
};