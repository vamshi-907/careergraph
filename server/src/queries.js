const listSkills = `
  MATCH (s:Skill)
  RETURN s.id AS id,
         s.name AS name,
         s.category AS category
  ORDER BY s.name
`;

const jobsBySkill = `
  MATCH (s:Skill)-[:REQUIRES]-(j:Job)
  MATCH (c:Company)-[:OFFERS]->(j)
  WHERE s.name = $skillName
  RETURN
    j.id AS id,
    j.title AS title,
    c.name AS company,
    c.location AS location
  ORDER BY j.title
`;

const companiesBySkill = `
  MATCH (s:Skill)<-[:REQUIRES]-(j:Job)<-[:OFFERS]-(c:Company)
  WHERE s.name = $skillName
  RETURN
    s.name AS skill,
    j.title AS job,
    c.name AS company,
    c.location AS location
  ORDER BY c.name, j.title
`;

const relatedSkills = `
  MATCH (target:Skill {name: $skillName})
  MATCH (target)<-[:REQUIRES]-(j:Job)-[:REQUIRES]->(other:Skill)
  WHERE other <> target
  RETURN
    other.name AS skill,
    count(DISTINCT j) AS jobCount
  ORDER BY jobCount DESC, skill
  LIMIT 10
`;

const graphForSkill = `
  MATCH p = (s:Skill {name: $skillName})-[*1..2]-(n)
  UNWIND relationships(p) AS rel

  RETURN DISTINCT
    startNode(rel) AS sourceNode,
    endNode(rel) AS targetNode,
    type(rel) AS relationship
`;


module.exports = {
  listSkills,
  jobsBySkill,
  companiesBySkill,
  relatedSkills,
  graphForSkill
};