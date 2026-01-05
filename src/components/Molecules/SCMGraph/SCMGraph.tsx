import { useCallback, useMemo } from "react";
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
}

export const SCMGraph = ({ nodes, edges }: SCMGraphProps) => {
  // Convert SCM nodes to ReactFlow nodes
  const flowNodes: Node[] = useMemo(() => {
    const nodeKeys = Object.keys(nodes);
    const totalNodes = nodeKeys.length;
    const radius = 150;
    const centerX = 250;
    const centerY = 200;

    return nodeKeys.map((key, index) => {
      // Position nodes in a circular layout
      const angle = (2 * Math.PI * index) / totalNodes;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        id: key,
        type: "default",
        position: { x, y },
        data: {
          label: (
            <div className="text-center">
              <div className="font-bold text-purple-300">{key}</div>
              <div className="text-xs text-slate-400 mt-1 max-w-[120px] break-words">
                {nodes[key]}
              </div>
            </div>
          ),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          background: "rgba(139, 92, 246, 0.1)",
          border: "2px solid rgb(168, 85, 247)",
          borderRadius: "8px",
          padding: "12px",
          width: "auto",
          minWidth: "140px",
          zIndex: 10,
        },
      };
    });
  }, [nodes]);

  // Convert SCM edges to ReactFlow edges
  const flowEdges: Edge[] = useMemo(() => {
    return edges.map(([source, target], index) => ({
      id: `${source}-${target}-${index}`,
      source,
      target,
      type: "smoothstep",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "rgb(168, 85, 247)",
      },
      style: {
        stroke: "rgb(168, 85, 247)",
        strokeWidth: 2,
      },
      zIndex: 0,
    }));
  }, [edges]);

  return (
    <div className="w-full h-[400px] bg-slate-950 rounded-lg border border-slate-700">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#475569" gap={16} />
        <Controls className="bg-slate-800 border-slate-700" />
      </ReactFlow>
    </div>
  );
};
