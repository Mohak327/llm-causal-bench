import { useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

interface SCMGraphProps {
  nodes: Record<string, string>;
  edges: [string, string][];
  intervened?: string[];
}

const COBALT = "#1D3A9E";
const TEA = "#C8862A";

// Longest-path depth from any root, so causes sit above their effects.
const depthOf = (keys: string[], edges: [string, string][]) => {
  const depth: Record<string, number> = Object.fromEntries(keys.map((k) => [k, 0]));
  for (let i = 0; i < keys.length; i++) {
    for (const [from, to] of edges) {
      if (depth[from] !== undefined && depth[to] !== undefined) {
        depth[to] = Math.max(depth[to], depth[from] + 1);
      }
    }
  }
  return depth;
};

export const SCMGraph = ({ nodes, edges, intervened = [] }: SCMGraphProps) => {
  const flowNodes: Node[] = useMemo(() => {
    const keys = Object.keys(nodes);
    const depth = depthOf(keys, edges);
    const columns: Record<number, string[]> = {};
    keys.forEach((k) => (columns[depth[k]] ??= []).push(k));

    return keys.map((key) => {
      const col = columns[depth[key]];
      const row = col.indexOf(key);
      const isV = intervened.includes(key);
      return {
        id: key,
        position: {
          x: (row - (col.length - 1) / 2) * 190 + (depth[key] % 2 ? 36 : -36),
          y: depth[key] * 105,
        },
        data: {
          label: (
            <div className="text-center">
              <div className="text-xs font-bold" style={{ color: isV ? TEA : COBALT }}>
                {key}
              </div>
              <div className="mt-0.5 text-[13px] font-semibold leading-tight text-ink">
                {String(nodes[key]).replace(/_/g, " ")}
              </div>
            </div>
          ),
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        style: {
          background: isV ? "#F4E6CF" : "#FFFFFF",
          border: `1.5px solid ${isV ? TEA : COBALT}`,
          borderRadius: 18,
          padding: "10px 14px",
          width: 170,
        },
      };
    });
  }, [nodes, edges, intervened]);

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map(([source, target], index) => {
        const color = intervened.includes(source) ? TEA : "#6F84C9";
        return {
          id: `${source}-${target}-${index}`,
          source,
          target,
          type: "default",
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color },
          style: { stroke: color, strokeWidth: 2 },
        };
      }),
    [edges, intervened]
  );

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-3xl border border-glaze bg-white" data-lenis-prevent>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.1 }}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
      >
        <Background color="#D5DCE6" gap={18} size={1.5} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};
