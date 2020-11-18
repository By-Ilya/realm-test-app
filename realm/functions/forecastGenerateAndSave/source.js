exports = async function(arg) {
  var collection = context.services.get("mongodb-atlas").db("shf").collection("revfcst_series");
  
  var result = await context.functions.execute("generateForecast", {regions:["NA West I", "LATAM"]});
  result.ts = new Date();
  result.region = "ROW";
  collection.insertOne(result);
  
  return {arg: arg};
};