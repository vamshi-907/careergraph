const { driver } = require("../src/db");

const companies = [
  {
    id: "c1",
    name: "TechNova",
    location: "Hyderabad"
  },
  {
    id: "c2",
    name: "CloudSphere",
    location: "Bengaluru"
  },
  {
    id: "c3",
    name: "DataBridge",
    location: "Hyderabad"
  },
  {
    id: "c4",
    name: "InnovateLabs",
    location: "Pune"
  },
  {
    id: "c5",
    name: "FinEdge",
    location: "Mumbai"
  }
];

const skills = [
  { id: "s1", name: "JavaScript", category: "Programming" },
  { id: "s2", name: "React", category: "Frontend" },
  { id: "s3", name: "Node.js", category: "Backend" },
  { id: "s4", name: "TypeScript", category: "Programming" },
  { id: "s5", name: "Python", category: "Programming" },
  { id: "s6", name: "Django", category: "Backend" },
  { id: "s7", name: "SQL", category: "Database" },
  { id: "s8", name: "AWS", category: "Cloud" },
  { id: "s9", name: "Docker", category: "DevOps" },
  { id: "s10", name: "MongoDB", category: "Database" }
];

const jobs = [
  {
    id: "j1",
    title: "Frontend Developer",
    companyId: "c1",
    skills: ["React", "JavaScript", "TypeScript"]
  },
  {
    id: "j2",
    title: "Full Stack Developer",
    companyId: "c1",
    skills: ["React", "Node.js", "JavaScript", "MongoDB"]
  },
  {
    id: "j3",
    title: "Backend Developer",
    companyId: "c2",
    skills: ["Node.js", "JavaScript", "SQL", "Docker"]
  },
  {
    id: "j4",
    title: "Python Developer",
    companyId: "c3",
    skills: ["Python", "Django", "SQL", "Docker"]
  },
  {
    id: "j5",
    title: "Cloud Engineer",
    companyId: "c4",
    skills: ["AWS", "Docker", "Python", "SQL"]
  },
  {
    id: "j6",
    title: "Software Engineer",
    companyId: "c5",
    skills: ["JavaScript", "React", "Node.js", "AWS"]
  }
];

async function seed() {
  const session = driver.session();

  try {
    await session.run(`
      CREATE CONSTRAINT company_id IF NOT EXISTS
      FOR (c:Company) REQUIRE c.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT job_id IF NOT EXISTS
      FOR (j:Job) REQUIRE j.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT skill_id IF NOT EXISTS
      FOR (s:Skill) REQUIRE s.id IS UNIQUE
    `);

    await session.run(
      `
      UNWIND $companies AS company
      MERGE (c:Company {id: company.id})
      SET c.name = company.name,
          c.location = company.location
      `,
      { companies }
    );

    await session.run(
      `
      UNWIND $skills AS skill
      MERGE (s:Skill {id: skill.id})
      SET s.name = skill.name,
          s.category = skill.category
      `,
      { skills }
    );

    await session.run(
      `
      UNWIND $jobs AS job
      MERGE (j:Job {id: job.id})
      SET j.title = job.title
      WITH j, job
      MATCH (c:Company {id: job.companyId})
      MERGE (c)-[:OFFERS]->(j)
      `,
      { jobs }
    );

    await session.run(
      `
      UNWIND $jobs AS job
      MATCH (j:Job {id: job.id})
      UNWIND job.skills AS skillName
      MATCH (s:Skill {name: skillName})
      MERGE (j)-[:REQUIRES]->(s)
      `,
      { jobs }
    );

    await session.run(`
      MATCH (a:Skill), (b:Skill)
      WHERE a.id < b.id
        AND (
          (a.name = 'React' AND b.name IN ['JavaScript', 'TypeScript'])
          OR
          (a.name = 'Node.js' AND b.name IN ['JavaScript', 'MongoDB', 'Docker'])
          OR
          (a.name = 'Python' AND b.name IN ['Django', 'SQL', 'Docker'])
          OR
          (a.name = 'AWS' AND b.name IN ['Docker', 'Python'])
        )
      MERGE (a)-[:RELATED_TO]->(b)
      MERGE (b)-[:RELATED_TO]->(a)
    `);

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();