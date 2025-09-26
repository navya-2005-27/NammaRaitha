import React from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function Dashboard() {
  const [sp] = useSearchParams();
  const lang = sp.get("lang") || "en";
  const tab = sp.get("tab") || "overview";
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold">Your Farm Dashboard</h1>
        <p className="mt-2 text-gray-600">Language: {lang} • Tab: {tab}</p>
        <div className="mt-6 rounded-xl border p-6 bg-gray-50">
          <p>This is a placeholder dashboard. Ask to generate detailed pages next.</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 underline">← Back to AgriSync</Link>
        </div>
      </div>
    </div>
  );
}
