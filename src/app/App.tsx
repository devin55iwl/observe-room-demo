import React from "react";
import { ResearcherView } from "./pages/ResearcherView";

export default function App() {
  return (
    <>
      <main className="observe-demo-shell">
        <ResearcherView />
      </main>
      <aside className="observe-demo-mobile-guard" aria-label="Desktop viewport required">
        <div>
          <p>Observe Room Demo</p>
          <h1>Open this demo on a desktop viewport.</h1>
          <span>
            The observer console uses floating research panels and is optimized for
            screens 1024px and wider.
          </span>
        </div>
      </aside>
    </>
  );
}
