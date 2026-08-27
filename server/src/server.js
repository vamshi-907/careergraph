const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { driver, verifyConnection } = require("./db");

const {
  listSkills,
  jobsBySkill,
  companiesBySkill,
  relatedSkills,
  graphForSkill
} = require("./queries");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "CareerGraph API is running"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await driver.verifyConnectivity();

    res.json({
      status: "ok",
      database: "CognoDB"
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(503).json({
      status: "error",
      message: "Database unavailable"
    });
  }
});

app.get("/api/skills", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(listSkills);

    const skills = result.records.map(record => ({
      id: record.get("id"),
      name: record.get("name"),
      category: record.get("category")
    }));

    res.json(skills);
  } catch (error) {
    console.error("Skills error:", error.message);

    res.status(500).json({
      message: "Unable to load skills"
    });
  } finally {
    await session.close();
  }
});

app.get("/api/skills/:skill/jobs", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(jobsBySkill, {
      skillName: req.params.skill
    });

    const jobs = result.records.map(record => ({
      id: record.get("id"),
      title: record.get("title"),
      company: record.get("company"),
      location: record.get("location")
    }));

    res.json(jobs);
  } catch (error) {
    console.error("Jobs error:", error.message);

    res.status(500).json({
      message: "Unable to find jobs"
    });
  } finally {
    await session.close();
  }
});

app.get("/api/skills/:skill/companies", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(companiesBySkill, {
      skillName: req.params.skill
    });

    const companies = result.records.map(record => ({
      skill: record.get("skill"),
      job: record.get("job"),
      company: record.get("company"),
      location: record.get("location")
    }));

    res.json(companies);
  } catch (error) {
    console.error("Companies error:", error.message);

    res.status(500).json({
      message: "Unable to find companies"
    });
  } finally {
    await session.close();
  }
});

app.get("/api/skills/:skill/related", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(relatedSkills, {
      skillName: req.params.skill
    });

    const related = result.records.map(record => ({
      skill: record.get("skill"),
      jobCount: record.get("jobCount").toNumber()
    }));

    res.json(related);
  } catch (error) {
    console.error("Related skills error:", error.message);

    res.status(500).json({
      message: "Unable to find related skills"
    });
  } finally {
    await session.close();
  }
});

app.get("/api/skills/:skill/graph", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(graphForSkill, {
      skillName: req.params.skill
    });

    const nodes = new Map();
    const links = new Map();

    for (const record of result.records) {
      const sourceNode = record.get("sourceNode");
      const targetNode = record.get("targetNode");
      const relationship = record.get("relationship");

      if (!sourceNode || !targetNode) {
        continue;
      }

      const sourceId = sourceNode.properties.id;
      const targetId = targetNode.properties.id;

      if (!sourceId || !targetId) {
        continue;
      }

      const sourceLabel =
        sourceNode.properties.name ||
        sourceNode.properties.title ||
        "Unknown";

      const targetLabel =
        targetNode.properties.name ||
        targetNode.properties.title ||
        "Unknown";

      nodes.set(sourceId, {
        id: sourceId,
        label: sourceLabel,
        type: sourceNode.labels[0] || "Unknown"
      });

      nodes.set(targetId, {
        id: targetId,
        label: targetLabel,
        type: targetNode.labels[0] || "Unknown"
      });

      const key =
        `${sourceId}-${targetId}-${relationship}`;

      links.set(key, {
        source: sourceId,
        target: targetId,
        relationship
      });
    }

    res.json({
      nodes: Array.from(nodes.values()),
      links: Array.from(links.values())
    });

  } catch (error) {
    console.error("Graph error:", error);
    console.error(error.message);

    res.status(500).json({
      message: "Unable to load graph",
      error: error.message
    });

  } finally {
    await session.close();
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await verifyConnection();
  } catch (error) {
    console.error("Database connection failed.");
  }
});