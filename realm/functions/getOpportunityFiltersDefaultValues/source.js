exports = async function (){
  const opportunityCollection = context.services.get("mongodb-atlas").db("shf").collection("opportunity");
  
  const ownerRegions = opportunityCollection.distinct("owner_region");
  const psRegions = opportunityCollection.distinct("ps_region");
  const emManagers = opportunityCollection.distinct("em.engagement_manager");
  
  return {ownerRegions, psRegions, emManagers};
};