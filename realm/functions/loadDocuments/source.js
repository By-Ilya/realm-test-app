exports = async function(col_name, arr){
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
  var isPlainObject = function (obj) {
  	return Object.prototype.toString.call(obj) === '[object Object]';
  };
  
  function prepValue(obj) {
    if (obj == null)
      return null;
    
    if (typeof obj === "number")
      return parseFloat(obj);
		
		if (isPlainObject(obj)) {
		  Object.keys(obj).forEach(key => {
			        obj[key] = prepValue(obj[key]);
		    })
		} else if (Array.isArray(obj)) {
		  for (let i in obj)
		    obj[i] = prepValue(obj[i]);
		}
		  
		return obj;
  }

  function getSetters(doc) {
    var setters = {}
    var unsetters = {}
    
    //try {
    const iterate = (obj,path) => {
		    Object.keys(obj).forEach(key => {
          //console.log("Path:",path, "  Key:",key, "  Type:", typeof obj[key])
          let new_path = path === "" ? key : (path + "." + key)
			    if (isPlainObject(obj[key])) {
		          iterate(obj[key],new_path)
			    } else {
			        if (obj[key] != null)
			          setters[ new_path ] = prepValue(obj[key]);//((typeof obj[key] === "number") ? parseFloat(obj[key]) : obj[key]);
			          //setters[ new_path ] = obj[key];
			        else
			          unsetters[ new_path ] = 1
			    }
		    }) 
		}
		iterate(doc, "")
    // } catch (err) {
    //   console.log(err)
    //   console.log(JSON.stringify(doc))
    //   throw err
    // }
		
		return {setters,unsetters}
  }
  
  function createUpdateStatement(doc) {
    const {setters,unsetters} = getSetters(doc);
    res = {}
    if (Object.keys(setters).length > 0)
      res["$set"] = setters;
    if (Object.keys(unsetters).length > 0)
      res["$unset"] = unsetters;
    return res;
  }
  
  //console.log(JSON.stringify(getSetters({a:"xxx",b:{x:1,b:"3333"}}))); return;
  
  var col = context.services.get("mongodb-atlas").db("shf").collection(col_name);
  var batch = col.initializeOrderedBulkOp();
  console.log("AAA: " + new Date());
  for (var i in arr) {
    //batch.find({_id:arr[i]._id}).upsert().replaceOne(arr[i]); //need to do a smart update and populate the changeset
    batch.find({_id:arr[i]._id}).upsert().updateOne(createUpdateStatement(arr[i]));
  }
  console.log("BBB: " + new Date());
  var res = await batch.execute();
  console.log("CCC: " + new Date());
  return res;
};