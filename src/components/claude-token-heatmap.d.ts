import "react";

// teaches TypeScript about the <claude-token-heatmap> web component
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "claude-token-heatmap": React.HTMLAttributes<HTMLElement> & {
        user?: string;
        palette?: string;
        theme?: string;
      };
    }
  }
}
