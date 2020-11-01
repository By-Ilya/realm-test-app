exports = function() {
  const psprojectCollection = context.services.get("mongodb-atlas").db("shf").collection("psproject");
  
  const regions = psprojectCollection.distinct("region");
  const owners = psprojectCollection.distinct("owner");
  const projectManagers = psprojectCollection.distinct("project_manager");
  
  return {regions, owners, projectManagers};
};