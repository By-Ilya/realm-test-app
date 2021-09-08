exports = async function(arg){
  /*
    Accessing application's values:
    var x = context.values.get("value_name");

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
    collection.findOne({ owner_id: context.user.id }).then((doc) => {
      // do something with doc
    });

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);

    Try running in the console below.
  */
  const statsColHist = context.services.get("mongodb-atlas").db("shf").collection("burndown_kpi_stats_hist");
  var res = [];
  
  const begin = new Date("2019-01-01")
  const num_qtrs = 2; 
  const offset_qtrs = 1;
  const series_name = "2q_1offset";
  
  let i = 0;
  let target = new Date("2021-08-01");
  let end, start;
  
  do {
    end = new Date(target)
    end.setMonth(end.getMonth() - offset_qtrs * 3)
    
    start = new Date(end)
    start.setMonth(start.getMonth() - num_qtrs*3)
    
    if (start < begin)
      break;
      
    //console.log(`Start: ${start} ; End: ${end} ; Target: ${target}`)
    let r = await context.functions.execute("generateBurndownKPI", start, end, target);
    res.push({asOf: new Date(target),type: series_name,values: (r.length > 0) ? r[0] : null})
    
    target.setMonth(target.getMonth() - 3)
    
  } while (true)
  
  
  // for(let i=0;end > begin;i++) {
  //   let start = new Date(begin)
  //   start.setMonth(start.getMonth()+i*3)
  //   let end = new Date(start)
  //   end.setMonth(end.getMonth()+6)
  //   let target = new Date(start)
  //   target.setMonth(target.getMonth()+9)
    
  //   console.log(`Start: ${start} ; End: ${end} ; Target: ${target}`)
  //   //let r = await context.functions.execute("generateBurndownKPI", start, end, target);
  //   //
  // }
  
  statsColHist.insertMany(res);
  
  return {arg: arg};
};