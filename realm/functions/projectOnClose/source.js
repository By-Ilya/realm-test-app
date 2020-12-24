exports = function(changeEvent) {
    const projectId = changeEvent.documentKey._id;
    const doc = changeEvent.fullDocument;
    
    //we assume that Closed projects don't get updated frequently, so if we got an update with status Closed, that's likely to be the actual event
    console.log(`Project ${projectId} is closed!`)
    
    if (!doc.milestones || (doc.milestones.length < 1))
      return;
    
    var m_ids = [];
    for (let i in doc.milestones)
      m_ids.push(doc.milestones[i]._id);
    
    const col = context.services.get("mongodb-atlas").db("shf").collection("revforecast");
    col.deleteMany({milestoneId:{$in:m_ids}})
};
