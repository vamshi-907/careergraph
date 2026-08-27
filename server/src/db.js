const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(
    process.env.COGNODB_USERNAME,
    process.env.COGNODB_PASSWORD
  )
);

async function verifyConnection() {
  const session = driver.session();

  try {
    await session.run("RETURN 1 AS result");
    console.log("Connected to CognoDB successfully");
  } catch (error) {
    console.error("CognoDB connection failed:", error.message);
    throw error;
  } finally {
    await session.close();
  }
}

module.exports = {
  driver,
  verifyConnection
};