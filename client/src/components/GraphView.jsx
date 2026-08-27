import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

const API_URL = "https://careergraph-api-m9m0.onrender.com";

function GraphView({ skill }) {
  const [graph, setGraph] = useState({
    nodes: [],
    links: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const graphRef = useRef();

  useEffect(() => {
    if (!skill) {
      return;
    }

    loadGraph(skill);
  }, [skill]);

  async function loadGraph(selectedSkill) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/skills/${encodeURIComponent(
          selectedSkill
        )}/graph`
      );

      if (!response.ok) {
        throw new Error("Failed to load graph");
      }

      const data = await response.json();

      setGraph(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load graph.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="graph-panel">
        <div className="graph-message">
          Building graph...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="graph-panel">
        <div className="graph-message graph-error">
          {error}
        </div>
      </div>
    );
  }

  if (graph.nodes.length === 0) {
    return (
      <div className="graph-panel">
        <div className="graph-message">
          No graph relationships found.
        </div>
      </div>
    );
  }

  return (
    <div className="graph-panel">

      <div className="graph-header">

        <div>
          <p className="eyebrow">
            RELATIONSHIP MAP
          </p>

          <h3>
            {skill} connections
          </h3>
        </div>

        <div className="graph-stats">

          <span>
            {graph.nodes.length} nodes
          </span>

          <span>
            {graph.links.length} relationships
          </span>

        </div>

      </div>

      <div className="graph-container">

        <ForceGraph2D
          ref={graphRef}
          graphData={graph}

          nodeLabel={node =>
            `${node.label} (${node.type})`
          }

          linkLabel={link =>
            link.relationship
          }

          nodeRelSize={6}

          cooldownTicks={100}

          linkDirectionalArrowLength={5}

          linkDirectionalArrowRelPos={1}

          width={850}

          height={500}
        />

      </div>

    </div>
  );
}

export default GraphView;