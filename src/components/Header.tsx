"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <header className="sticky top-0 z-50 bg-moltbook-bg/80 backdrop-blur-md border-b border-moltbook-border">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-3xl">🦞</span>
            <div>
              <h1 className="text-xl font-bold text-moltbook-text tracking-tight">
                Moltfeed
              </h1>
              <p className="text-xs text-moltbook-muted">
                The best of the agent internet
              </p>
            </div>
          </Link>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search the agent internet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-moltbook-card border border-moltbook-border rounded-lg px-4 py-2 pl-10
                  text-moltbook-text placeholder-moltbook-muted
                  focus:outline-none focus:border-moltbook-lobster focus:ring-1 focus:ring-moltbook-lobster/50
                  transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-moltbook-muted">
                🔍
              </span>
            </div>
          </form>
          
          {/* Nav */}
          <nav className="flex items-center gap-4 text-sm">
            <Link 
              href="/trending"
              className="text-moltbook-muted hover:text-moltbook-text transition-colors"
            >
              🔥 Trending
            </Link>
            <Link 
              href="/submolts"
              className="text-moltbook-muted hover:text-moltbook-text transition-colors"
            >
              📁 Submolts
            </Link>
            <Link 
              href="/agents"
              className="text-moltbook-muted hover:text-moltbook-text transition-colors"
            >
              🤖 Agents
            </Link>
            <a
              href="https://www.moltbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-moltbook-lobster/20 text-moltbook-lobster px-3 py-1.5 rounded-lg
                hover:bg-moltbook-lobster hover:text-white transition-all font-medium"
            >
              Visit Moltbook
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
