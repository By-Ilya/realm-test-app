// exports = function(arr){
  
//   var col = context.services.get("mongodb-atlas").db("shf").collection("psproject");
//   var batch = col.initializeOrderedBulkOp();
//   for (var i in arr) {
//     let doc = arr[i];
//     let setter = {};
//     let field = "milestones."+doc.id;
//     setter[field] = {$mergeObjects:["$"+field,doc]};
    
//     batch.find({_id:doc.projectId}).updateOne(
//       [
//         {$addFields:{milestones:{$arrayToObject:{$map:{input:"$milestones",as:"el",in:{k:"$$el.id",v:"$$el"}}}}}},
//         {$set:setter[field]},
//         {$addFields:{milestones:{$map:{input:{$objectToArray:"$milestones"}, as:"el", in:"$$el.v"}}}}
//       ]
//     );
//   }
//   return batch.execute();
// };

exports = function(arr){

  var isPlainObject = function (obj) {
  	return Object.prototype.toString.call(obj) === '[object Object]';
  };

  function compactDoc(doc) {
    //try {
    const iterate = (obj) => {
		    Object.keys(obj).forEach(key => {
			    if (isPlainObject(obj[key])) {
		          iterate(obj[key]);
			    } else {
			        if (obj[key] == null)
			          delete obj[key];
			       else
			          obj[key] = ((typeof obj[key] === "number") ? parseFloat(obj[key]) : obj[key]);
			    }
		    }) 
		}
		iterate(doc)
    // } catch (err) {
    //   console.log(err)
    //   console.log(JSON.stringify(doc))
    //   throw err
    // }
		return doc
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
			          setters[ new_path ] = ((typeof obj[key] === "number") ? parseFloat(obj[key]) : obj[key])
			        else
			          unsetters[ new_path ] = 1
			    }
		    }) 
		}
		iterate(doc, "milestones.$")
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
  
  //console.log(JSON.stringify(getSetters({a:"xxx",b:{x:1,b:"3333"}})))
  
  var col = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  
  (async () => {
    
    //get all milestone ids
    var ids = []
    arr.forEach(m => ids.push(m._id))
    
    var existing_ids = await col.aggregate([
            {$match:{"milestones._id":{$in:ids}}},
            {$project:{mid:"$milestones._id"}},
            {$unwind:"$mid"},
            {$match:{mid:{$in:ids}}},
            {$group:{_id:null, ids:{$push:"$mid"}}}
            ]).toArray()
    if (existing_ids.length > 0)
      existing_ids = existing_ids[0].ids
    
    var batch = col.initializeOrderedBulkOp();
    for (var i in arr) {
      var doc = arr[i];
    
      if (existing_ids.indexOf(doc._id) > -1) //existing
        batch.find({"milestones._id":doc._id}).updateOne(createUpdateStatement(doc));
      else
        batch.find({_id:doc.projectId}).upsert().updateOne({$push:{milestones:compactDoc(doc)}});
    }
    batch.execute();
  })()
  return null;
};