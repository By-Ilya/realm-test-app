exports = function(arg){
  /*
    Accessing application's values:
    var x = context.values.get("value_name");

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
    var doc = collection.findOne({owner_id: context.user.id});

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);

    Try running in the console below.
  */
  var col = context.services.get("mongodb-atlas").db("shf").collection(arg);

  return col.find({}).sort({SystemModstamp:-1}).limit(1).toArray()
  .then(items => {
    console.log(`Successfully found ${items.length} documents.`)
    //console.log(JSON.stringify(items[0]))
    return items[0].SystemModstamp
  })
  .catch(err => {return null})
};