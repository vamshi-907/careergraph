CareerGraph

CareerGraph is a graph-powered career exploration platform built using React, Express.js, and Neo4j / CognoDB. It helps users explore relationships between technical skills, jobs, companies, and related skills through an interactive graph-based interface.

Instead of treating career information as isolated records, CareerGraph uses graph relationships to show how skills connect to jobs, how jobs connect to companies, and how different skills relate to one another.

Problem

Finding the right career path often requires understanding relationships between technologies, roles, and companies.

For example:

React
  |
  | REQUIRES
  v
Frontend Developer
  |
  | OFFERS
  v
Company

Skills can also be connected through shared job requirements:

React
  |
  | RELATED_TO
  v
JavaScript
  |
  | RELATED_TO
  v
Node.js

CareerGraph uses a graph database to represent these connected relationships and make career exploration easier.

Why a Graph Database?

Career information is naturally connected.

A skill can be required by multiple jobs.

A job can require multiple skills.

A company can offer multiple jobs.

Skills can also be related to other skills.

These many-to-many relationships become easier to traverse and explore using a graph database than with multiple relational join tables.

CareerGraph uses CognoDB to model these relationships as nodes and typed relationships.

This makes it possible to explore connected career information using graph traversal.

For example:

Skill
  |
  | REQUIRES
  v
Job
  |
  | OFFERS
  v
Company

A selected skill can also be explored through multiple hops.

Graph Data Model

Nodes

CareerGraph contains three main node types:

Skill

Job

Company

Relationships

The application uses the following typed relationships:

Skill -[:REQUIRES]-> Job

Company -[:OFFERS]-> Job

Skill -[:RELATED_TO]-> Skill

Example

Skill
  |
  | REQUIRES
  v
Job
  |
  | OFFERS
  v
Company

Related Skills Example

React
  |
  | RELATED_TO
  v
JavaScript

Graph Model Diagram

                         RELATED_TO
                    ┌─────────────────┐
                    │                 │
                    v                 │
                 Skill ───────────> Skill
                    │
                    │ REQUIRES
                    v
                   Job
                    ^
                    │
                    │ OFFERS
                    │
                 Company

Another career relationship example:

React
  |
  | REQUIRES
  v
Frontend Developer
  ^
  |
  | OFFERS
  |
Company

Technology Stack

Frontend

React

Vite

JavaScript

CSS

react-force-graph-2d

Backend

Node.js

Express.js

Neo4j JavaScript Driver

CORS

dotenv

Database

CognoDB

openCypher

Bolt protocol

Features

CareerGraph supports:

Explore available skills

Select a skill

View related jobs

View companies associated with jobs

Discover related skills

Interactive relationship graph

Display graph nodes

Display graph relationships

Display node count

Display relationship count

Drag graph nodes

Zoom graph visualization

Hover over graph nodes

Hover over relationships

Loading states

Empty states

Error handling

Database health check

Responsive user interface

Application Architecture

CareerGraph follows a simple three-layer architecture:

┌──────────────────────────────┐
│        React Frontend        │
│          Port 5173           │
└──────────────┬───────────────┘
               │
               │ HTTP / REST API
               v
┌──────────────────────────────┐
│       Express Backend        │
│          Port 5000           │
└──────────────┬───────────────┘
               │
               │ Neo4j Driver / Bolt
               v
┌──────────────────────────────┐
│           CognoDB            │
│        Graph Database        │
└──────────────────────────────┘

Frontend Flow

User
  |
  v
Select Skill
  |
  v
React Application
  |
  v
REST API

Backend Flow

REST Request
     |
     v
Express.js
     |
     v
Cypher Query
     |
     v
CognoDB
     |
     v
JSON Response

Complete Flow

User
 |
 v
React UI
 |
 | HTTP
 v
Express API
 |
 | Cypher
 v
CognoDB
 |
 | Graph Results
 v
Express API
 |
 | JSON
 v
React UI

User Flow

The main user flow is:

Open CareerGraph
       |
       v
Choose a Skill
       |
       v
Selected Skill
       |
       +------------------+------------------+
       |                  |                  |
       v                  v                  v
     Jobs             Companies       Related Skills
       |                  |                  |
       +------------------+------------------+
                          |
                          v
                 Relationship Graph

For example:

Select React
     |
     +----> Related Jobs
     |
     +----> Companies
     |
     +----> Related Skills
     |
     +----> Relationship Graph

Selecting another skill dynamically loads its related career information and graph.

Project Structure

careergraph/
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── GraphView.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── src/
│   │   ├── db.js
│   │   ├── queries.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── ...

Prerequisites

Before running CareerGraph locally, install:

Node.js

npm

Git

A CognoDB graph database instance

Check Node.js:

node --version

Check npm:

npm --version

Check Git:

git --version

CognoDB Setup

CareerGraph uses CognoDB as its graph database.

Create or use a CognoDB database instance and obtain the required Bolt connection details.

The backend uses environment variables for database configuration.

Create:

server/.env

Add your actual CognoDB credentials:

COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your-password
PORT=5000

Replace the placeholder values with the credentials from your CognoDB instance.

Environment Variable Security

Database credentials must not be hard-coded in the source code.

The actual .env file should not be committed to GitHub.

The repository should contain:

server/.env.example

Example:

COGNODB_URI=your_cognodb_bolt_uri
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your_cognodb_password
PORT=5000

The root .gitignore should contain:

node_modules/
.env
.env.*
!.env.example
dist/
build/
.DS_Store
*.log

Never commit:

Database passwords

Database connection credentials

API secrets

Private keys

Local .env files

Database Connection

The backend uses the Neo4j JavaScript Driver to connect to CognoDB.

The connection information is loaded from environment variables.

Example:

const neo4j = require("neo4j-driver");

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password)
);

The backend verifies the database connection when the server starts.

Expected output:

Server running on port 5000
Connected to CognoDB successfully

Database Seed and Data Loading

The CognoDB database is populated with career-related graph data representing:

Skills

Jobs

Companies

Skill-to-job relationships

Company-to-job relationships

Related-skill relationships

The seed/data-loading script included in the project is used to populate the CognoDB instance.

Run the seed/data-loading script according to the script included in the repository when setting up an empty database.

The database can then be verified using the read-only Cypher queries provided below.

Running the Backend

Open a terminal in the project root.

cd server

Install dependencies:

npm install

Start the backend:

npm start

If the project uses the development script:

npm run dev

The backend runs on:

http://localhost:5000

Expected output:

Server running on port 5000
Connected to CognoDB successfully

Running the Frontend

Open another terminal.

From the project root:

cd client

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend runs on:

http://localhost:5173

Open the URL in a browser to use CareerGraph.

Backend Health Check

Open:

http://localhost:5000/api/health

Expected response:

{
  "status": "ok",
  "database": "CognoDB"
}

This verifies that the backend can communicate with CognoDB.

API Endpoints

List Skills

GET /api/skills

Example:

http://localhost:5000/api/skills

Returns all available skills.

Jobs by Skill

GET /api/skills/:skill/jobs

Example:

http://localhost:5000/api/skills/React/jobs

Returns jobs associated with the selected skill.

Companies by Skill

GET /api/skills/:skill/companies

Example:

http://localhost:5000/api/skills/React/companies

Returns companies offering jobs associated with the selected skill.

Related Skills

GET /api/skills/:skill/related

Example:

http://localhost:5000/api/skills/React/related

Returns related skills discovered through shared job requirements.

Skill Graph

GET /api/skills/:skill/graph

Example:

http://localhost:5000/api/skills/React/graph

Returns graph nodes and relationships surrounding the selected skill.

Example response structure:

{
  "nodes": [],
  "links": []
}

Cypher Queries

CareerGraph uses parameterised Cypher queries.

The main queries are stored in:

server/src/queries.js

1. List Skills

MATCH (s:Skill)
RETURN s.id AS id,
       s.name AS name,
       s.category AS category
ORDER BY s.name

This retrieves all available skills.

2. Find Jobs by Skill

MATCH (s:Skill)-[:REQUIRES]-(j:Job)
MATCH (c:Company)-[:OFFERS]->(j)
WHERE s.name = $skillName
RETURN
  j.id AS id,
  j.title AS title,
  c.name AS company,
  c.location AS location
ORDER BY j.title

This traverses:

Skill → Job → Company

and returns jobs associated with the selected skill.

3. Find Companies by Skill

MATCH (s:Skill)<-[:REQUIRES]-(j:Job)<-[:OFFERS]-(c:Company)
WHERE s.name = $skillName
RETURN
  s.name AS skill,
  j.title AS job,
  c.name AS company,
  c.location AS location
ORDER BY c.name, j.title

This finds companies connected to jobs requiring the selected skill.

4. Find Related Skills

MATCH (target:Skill {name: $skillName})
MATCH (target)<-[:REQUIRES]-(j:Job)-[:REQUIRES]->(other:Skill)
WHERE other <> target
RETURN
  other.name AS skill,
  count(DISTINCT j) AS jobCount
ORDER BY jobCount DESC, skill
LIMIT 10

This discovers related skills through shared job requirements.

5. Multi-Hop Graph Traversal

The graph visualization uses a multi-hop traversal around the selected skill:

MATCH p = (s:Skill {name: $skillName})-[*1..2]-(n)
RETURN p

This explores relationships up to two hops away from the selected skill.

Example:

React
  |
  v
Frontend Developer
  |
  v
Company

The backend converts the graph information into nodes and links for the frontend visualization.

Parameterised Cypher

User-provided skill names are passed to Cypher as parameters instead of being directly concatenated into the query.

Example:

const result = await session.run(jobsBySkill, {
  skillName: req.params.skill
});

This keeps query construction separate from user input.

Interactive Graph Visualization

CareerGraph uses:

react-force-graph-2d

to display the graph dynamically.

The graph displays:

Skill nodes

Job nodes

Company nodes

Relationships

Node labels

Relationship labels

Node count

Relationship count

The graph changes dynamically when the user selects another skill.

Example:

Select React
     |
     v
GET /api/skills/React/graph
     |
     v
Express Backend
     |
     v
CognoDB
     |
     v
Graph Data
     |
     v
Interactive Graph

Database Verification Queries

The following read-only queries can be used inside CognoDB Browser.

Show All Nodes

MATCH (n)
RETURN n
LIMIT 100

Show Skills

MATCH (s:Skill)
RETURN s

Show Jobs

MATCH (j:Job)
RETURN j

Show Companies

MATCH (c:Company)
RETURN c

Show Relationships

MATCH (a)-[r]->(b)
RETURN a, r, b
LIMIT 100

Show Multi-Hop Relationships

MATCH p = (s:Skill)-[*1..2]-(n)
RETURN p
LIMIT 50

Show Node Counts

MATCH (n)
RETURN labels(n) AS type,
       count(n) AS count
ORDER BY type

Show Relationship Counts

MATCH ()-[r]->()
RETURN type(r) AS relationship,
       count(r) AS count
ORDER BY relationship

These queries are read-only and can be used to verify the graph structure.

Error Handling

CareerGraph includes error handling across the application.

Backend

The backend handles:

Database connection errors

Cypher query errors

API errors

Invalid database responses

Database session cleanup

Frontend

The frontend handles:

Backend connection failures

Loading states

Empty results

Graph loading failures

API errors

Example error message:

Unable to connect to CareerGraph.

Example loading state:

Exploring graph...

Example empty state:

No jobs found.

Database Verification

The populated CognoDB instance contains the following node types:

Skill
Job
Company

and relationship types:

REQUIRES
RELATED_TO
OFFERS

The CognoDB Browser can be used to visually inspect the graph and verify the relationships.

Testing Checklist

Database

CognoDB instance is running

Database credentials are configured

Skills exist

Jobs exist

Companies exist

Relationships exist

Multi-hop traversal works

Backend

Backend starts successfully

/api/health works

/api/skills works

Jobs endpoint works

Companies endpoint works

Related skills endpoint works

Graph endpoint works

Database connection succeeds

Frontend

Application loads

All skills are displayed

Skill selection works

Jobs update

Companies update

Related skills update

Graph updates

Graph can be interacted with

Loading state works

Empty state works

Error state works

Responsive UI works

Security

.env is not committed

Database password is not hard-coded

.env.example is included

node_modules is ignored

No secrets are present in source code

Screenshots

The project includes screenshots demonstrating the completed implementation.

Recommended screenshot categories:

screenshots/
│
├── cognodb-graph.png
├── cognodb-multihop.png
├── cognodb-node-counts.png
├── cognodb-relationship-counts.png
│
├── api-skills.png
├── api-jobs.png
├── api-companies.png
├── api-related-skills.png
├── api-graph.png
│
├── ui-home.png
├── ui-react.png
└── ui-graph.png

The screenshots demonstrate:

CognoDB graph

Multi-hop graph traversal

Database node counts

Database relationship counts

Skills API

Jobs API

Companies API

Related Skills API

Graph API

CareerGraph home page

Selected skill results

Interactive graph visualization

Replace the example screenshot filenames with the actual filenames used in the repository.

Local Development Workflow

Start the CognoDB instance first.

Then start the backend:

cd server
npm install
npm start

Then open another terminal and start the frontend:

cd client
npm install
npm run dev

Open:

http://localhost:5173

The complete local architecture is:

CognoDB
   |
   v
Express Backend
   |
   v
REST API
   |
   v
React Frontend

Deployment

The production architecture can be deployed as:

User
 |
 v
Hosted React Frontend
 |
 | HTTPS
 v
Hosted Express Backend
 |
 | Bolt
 v
CognoDB

The production backend must receive the CognoDB credentials through environment variables.

The frontend should use the deployed backend URL instead of the local URL.

For example:

VITE_API_URL=https://your-backend-url

The actual production URLs should be added after deployment.

Hosted Demo

Frontend

TODO: Add deployed frontend URL

Backend

TODO: Add deployed backend URL

API Health Check

TODO: Add deployed backend health-check URL

GitHub Repository

The GitHub repository should contain:

Full source code

Frontend application

Backend application

Cypher queries

Seed/data-loading scripts

README documentation

Graph model documentation

Screenshots

.env.example

The repository must not contain:

.env

Database passwords

Database credentials

API secrets

node_modules

Git Commands

Initialize the repository:

git init

Add project files:

git add .

Create the initial commit:

git commit -m "Initial CareerGraph implementation"

Connect the GitHub repository:

git remote add origin YOUR_GITHUB_REPOSITORY_URL

Push the project:

git branch -M main
git push -u origin main

Final Repository Verification

Before sharing the GitHub repository, verify that:

README is visible

Frontend source code is present

Backend source code is present

queries.js is present

server.js is present

db.js is present

Seed/data-loading scripts are present

.env.example is present

Screenshots are present

.env is not present

Passwords are not present

No API secrets are present

Demo Recording

Create a short screen recording demonstrating the complete application flow.

Recommended sequence:

1. Open CareerGraph
        |
        v
2. Show available skills
        |
        v
3. Select React
        |
        v
4. Show Jobs
        |
        v
5. Show Companies
        |
        v
6. Show Related Skills
        |
        v
7. Show Relationship Graph
        |
        v
8. Select another skill
        |
        v
9. Show graph updating
        |
        v
10. Briefly show CognoDB graph

The recording should focus on the working functionality and graph relationships.

Final Submission Checklist

Before submission:

Application works locally

CognoDB is connected

Skills are loaded

Jobs are loaded

Companies are loaded

Related skills are loaded

Interactive graph works

Multi-hop graph query works

Loading states work

Empty states work

Error handling works

README is complete

Graph model is documented

Cypher queries are documented

Seed/data-loading scripts are included

Screenshots are included

.env is excluded

GitHub repository is created

Code is pushed to GitHub

Hosted frontend is working

Hosted backend is working

Production database connection works

Screen recording is complete

GitHub repository URL is ready

Demo URL is ready

Submission email is ready

Assignment Deliverables

The final CareerGraph submission contains:

Full source code

Graph database implementation

Seed/data-loading scripts

Cypher queries

Graph data model

README documentation

UI screenshots

CognoDB screenshots

Hosted application

Short screen recording

GitHub repository

Future Improvements

Possible future improvements include:

Skill search

Skill categories

Advanced filters

Career path recommendations

Salary information

Location-based career exploration

Job market analytics

Authentication

Larger career dataset

Advanced graph controls

Personalized career recommendations

Author

Built as part of the Wexa AI CognoDB take-home assignment.

CareerGraph — Explore careers through connections.