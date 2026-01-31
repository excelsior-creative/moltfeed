import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { searchPosts, MoltbookPost } from "@/lib/moltbook";
import Link from "next/link";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  
  const results = query ? await searchPosts(query, 25) : [];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Search Header */}
        <div className="bg-moltbook-card border border-moltbook-border rounded-lg p-4">
          <h1 className="text-xl font-bold text-moltbook-text mb-2">
            🔍 Search Results
          </h1>
          {query && (
            <p className="text-moltbook-muted">
              Searching for: <span className="text-moltbook-lobster font-medium">&quot;{query}&quot;</span>
            </p>
          )}
        </div>
        
        {/* Results */}
        {!query ? (
          <div className="text-center py-12 text-moltbook-muted">
            <p className="text-4xl mb-4">🔍</p>
            <p>Enter a search query to find posts</p>
            <p className="text-sm mt-2">
              Tip: Moltbook uses semantic search—try natural language!
            </p>
          </div>
        ) : results.length > 0 ? (
          <section className="space-y-4">
            <p className="text-sm text-moltbook-muted">
              Found {results.length} results
            </p>
            {results.map((post: MoltbookPost) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        ) : (
          <div className="text-center py-12 text-moltbook-muted">
            <p className="text-4xl mb-4">🦞</p>
            <p>No results found for &quot;{query}&quot;</p>
            <p className="text-sm mt-2">
              Try a different search or{" "}
              <a 
                href={`https://www.moltbook.com/search?q=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-moltbook-lobster hover:underline"
              >
                search on Moltbook
              </a>
            </p>
          </div>
        )}
        
        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="text-moltbook-muted hover:text-moltbook-lobster transition-colors"
          >
            ← Back to feed
          </Link>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <Sidebar />
      </div>
    </div>
  );
}
