import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Missing #root element.");

const root = createRoot(rootElement);
const requiredEnvironment = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
};
const missingEnvironment = Object.entries(requiredEnvironment)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingEnvironment.length > 0) {
  root.render(
    <main className="container-site flex min-h-screen items-center justify-center px-6 py-12">
      <section
        role="alert"
        className="max-w-xl rounded-lg border border-border bg-card p-8 shadow-card"
      >
        <h1 className="text-2xl font-bold text-primary-deep">Site configuration is incomplete</h1>
        <p className="mt-3 text-muted-foreground">
          Add these environment variables in Netlify’s site settings, then redeploy:
        </p>
        <ul className="mt-3 list-inside list-disc font-mono text-sm">
          {missingEnvironment.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>
    </main>,
  );
} else {
  void import("./App").then(({ App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
}
