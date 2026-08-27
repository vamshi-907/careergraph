import { useEffect, useState } from "react";
import GraphView from "./components/GraphView";

import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/skills`
      );

      if (!response.ok) {
        throw new Error("Failed to load skills");
      }

      const data = await response.json();

      setSkills(data);

      if (data.length > 0) {
        await exploreSkill(data[0].name);
      }
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to CareerGraph. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function exploreSkill(skill) {
    try {
      setSelectedSkill(skill);
      setLoading(true);
      setError("");

      const encodedSkill = encodeURIComponent(skill);

      const [
        jobsResponse,
        companiesResponse,
        relatedResponse
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/skills/${encodedSkill}/jobs`
        ),
        fetch(
          `${API_URL}/api/skills/${encodedSkill}/companies`
        ),
        fetch(
          `${API_URL}/api/skills/${encodedSkill}/related`
        )
      ]);

      if (
        !jobsResponse.ok ||
        !companiesResponse.ok ||
        !relatedResponse.ok
      ) {
        throw new Error("API request failed");
      }

      const jobsData = await jobsResponse.json();
      const companiesData =
        await companiesResponse.json();
      const relatedData =
        await relatedResponse.json();

      setJobs(jobsData);
      setCompanies(companiesData);
      setRelated(relatedData);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to explore this skill."
      );

      setJobs([]);
      setCompanies([]);
      setRelated([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">

      <header className="header">
        <div>
          <p className="eyebrow">
            CAREERGRAPH
          </p>

          <h1>
            Explore careers through connections.
          </h1>

          <p className="subtitle">
            Discover jobs, companies and related
            skills using graph relationships.
          </p>
        </div>
      </header>

      <main className="container">

        <section className="skill-section">

          <h2>Choose a skill</h2>

          <div className="skill-list">

            {skills.map(skill => (
              <button
                key={skill.id}
                className={
                  selectedSkill === skill.name
                    ? "skill-button active"
                    : "skill-button"
                }
                onClick={() =>
                  exploreSkill(skill.name)
                }
              >
                {skill.name}
              </button>
            ))}

          </div>

        </section>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            Exploring graph...
          </div>
        ) : (
          <section>

            <div className="section-heading">

              <div>
                <p className="eyebrow">
                  SELECTED SKILL
                </p>

                <h2>
                  {selectedSkill}
                </h2>
              </div>

            </div>

            <GraphView skill={selectedSkill} />


            <div className="grid">

              <div className="panel">

                <h3>Jobs</h3>

                {jobs.length === 0 ? (
                  <p className="muted">
                    No jobs found.
                  </p>
                ) : (
                  jobs.map(job => (
                    <div
                      className="card"
                      key={job.id}
                    >
                      <strong>
                        {job.title}
                      </strong>

                      <span>
                        {job.company}
                      </span>

                      <small>
                        {job.location}
                      </small>
                    </div>
                  ))
                )}

              </div>

              <div className="panel">

                <h3>Companies</h3>

                {companies.length === 0 ? (
                  <p className="muted">
                    No companies found.
                  </p>
                ) : (
                  companies.map(
                    (company, index) => (
                      <div
                        className="card"
                        key={`${company.company}-${index}`}
                      >
                        <strong>
                          {company.company}
                        </strong>

                        <span>
                          {company.job}
                        </span>

                        <small>
                          {company.location}
                        </small>
                      </div>
                    )
                  )
                )}

              </div>

              <div className="panel">

                <h3>Related Skills</h3>

                {related.length === 0 ? (
                  <p className="muted">
                    No related skills found.
                  </p>
                ) : (
                  related.map(item => (
                    <div
                      className="related"
                      key={item.skill}
                    >
                      <span>
                        {item.skill}
                      </span>

                      <strong>
                        {item.jobCount} jobs
                      </strong>
                    </div>
                  ))
                )}

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;