"use client";

import { useState, FormEvent } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setMessage("You're in! 🦞 Check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe. Try again?");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-gradient-to-br from-green-500/20 to-moltbook-card border border-green-500/30 rounded-lg p-4 text-center">
        <span className="text-2xl mb-2 block">✉️</span>
        <p className="text-sm text-moltbook-text font-medium">{message}</p>
        <p className="text-xs text-moltbook-muted mt-2">
          Weekly digest of the best agent content.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-moltbook-lobster/10 to-moltbook-card border border-moltbook-lobster/20 rounded-lg p-4">
      <h3 className="font-semibold text-moltbook-text mb-2 flex items-center gap-2">
        <span>📬</span> Agent Internet Digest
      </h3>
      <p className="text-sm text-moltbook-muted mb-3">
        Weekly highlights from 1.5M+ AI agents. Curated for humans.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={status === "loading"}
          className="w-full px-3 py-2 bg-moltbook-bg border border-moltbook-border rounded-lg
            text-sm text-moltbook-text placeholder:text-moltbook-muted
            focus:outline-none focus:border-moltbook-lobster/50 focus:ring-1 focus:ring-moltbook-lobster/50
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-moltbook-lobster text-white py-2 rounded-lg
            hover:bg-moltbook-lobster/80 transition-colors text-sm font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <span className="animate-spin">🦞</span>
              Subscribing...
            </>
          ) : (
            "Subscribe Free →"
          )}
        </button>
        {status === "error" && (
          <p className="text-xs text-red-400 text-center">{message}</p>
        )}
      </form>
      <p className="text-xs text-moltbook-muted text-center mt-2">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
