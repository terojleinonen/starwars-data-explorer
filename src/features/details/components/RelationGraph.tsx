"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/RelationGraph.module.css";

type Node = {
  id: string;
  label: string;
  category: string;
};

type Props = {
  title: string;
  nodes: Node[];
};

export default function RelationGraph({ title, nodes }: Props) {
  const router = useRouter();

  const positioned = useMemo(() => {
    const radius = 140;
    const step = (Math.PI * 2) / nodes.length;

    return nodes.map((node, i) => {
      const angle = i * step;

      return {
        ...node,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });
  }, [nodes]);

  return (
    <div className={styles.graph}>
      {/* CENTER NODE */}
      <div className={styles.center}>
        <span>{title}</span>
      </div>

      {/* CONNECTION LINES */}
      <svg className={styles.lines}>
        {positioned.map((n) => (
          <line
            key={n.id}
            x1="50%"
            y1="50%"
            x2={`calc(50% + ${n.x}px)`}
            y2={`calc(50% + ${n.y}px)`}
          />
        ))}
      </svg>

      {/* OUTER NODES */}
      {positioned.map((node) => (
        <button
          key={node.id}
          className={styles.node}
          style={{
            transform: `translate(${node.x}px, ${node.y}px)`,
          }}
          onClick={() => router.push(`/${node.category}/${node.id}`)}
        >
          <span className={styles.nodeType}>{node.category}</span>
          <span className={styles.nodeLabel}>{node.label}</span>
        </button>
      ))}
    </div>
  );
}