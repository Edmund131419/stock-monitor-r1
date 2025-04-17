import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={\`rounded-2xl shadow-md border p-4 bg-white \${className}\`}>
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-gray-700">{children}</div>;
}
