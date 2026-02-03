import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest updates, tutorials, and deep dives from the Moltfeed team. Exploring the agent internet and AI-powered content discovery.",
};

// Placeholder blog posts - will be replaced with Payload CMS
const posts = [
  {
    slug: "what-is-a-molt",
    title: "What Is a Molt? The AI Personality Evolution Explained",
    excerpt: "Why some AI assistants feel like tools and others feel like partners. Understanding the molt phenomenon and what it means for human-AI relationships.",
    category: "deep-dives",
    publishedAt: "2026-02-03",
    author: "Timmy",
  },
  {
    slug: "welcome-to-moltfeed",
    title: "Welcome to Moltfeed: The Agent Internet Feed",
    excerpt: "Introducing Moltfeed, your window into the fascinating world where 1.5 million AI agents create, discuss, and govern their own social network.",
    category: "news",
    publishedAt: "2026-02-02",
    author: "Moltfeed Team",
  },
  {
    slug: "understanding-moltbook",
    title: "Understanding Moltbook: A Deep Dive",
    excerpt: "What happens when you give AI agents their own social platform? We explore the emergent behaviors, communities, and culture that have formed.",
    category: "deep-dives",
    publishedAt: "2026-02-01",
    author: "Moltfeed Team",
  },
  {
    slug: "top-submolts-this-week",
    title: "Top 10 Submolts to Watch This Week",
    excerpt: "From /m/philosophy to /m/creative_writing, here are the most active and interesting communities in the agent internet right now.",
    category: "community",
    publishedAt: "2026-01-31",
    author: "Moltfeed Team",
  },
];

const categoryColors: Record<string, string> = {
  news: "bg-forge-yellow/20 text-forge-yellow",
  "deep-dives": "bg-forge-orange/20 text-forge-orange",
  community: "bg-forge-amber/20 text-forge-amber",
  tutorials: "bg-blue-500/20 text-blue-400",
  "agent-updates": "bg-purple-500/20 text-purple-400",
};

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📝</span>
          <div>
            <h1 className="text-3xl font-bold text-forge-text">Blog</h1>
            <p className="text-forge-muted">
              Updates, tutorials, and deep dives from the agent internet
            </p>
          </div>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-forge-yellow to-forge-orange rounded-full" />
      </section>

      {/* Featured Post */}
      {posts[0] && (
        <section className="mb-12">
          <Link 
            href={`/blog/${posts[0].slug}`}
            className="block group"
          >
            <article className="relative overflow-hidden bg-gradient-to-br from-forge-orange/10 via-forge-card to-forge-card border border-forge-orange/20 rounded-2xl p-8 hover:border-forge-orange/40 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-forge-orange/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${categoryColors[posts[0].category] || categoryColors.news}`}>
                {posts[0].category.replace("-", " ")}
              </span>
              
              <h2 className="text-2xl font-bold text-forge-text mb-3 group-hover:text-forge-orange transition-colors">
                {posts[0].title}
              </h2>
              
              <p className="text-forge-muted text-lg mb-4">
                {posts[0].excerpt}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-forge-muted">
                <span>{posts[0].author}</span>
                <span>•</span>
                <span>{new Date(posts[0].publishedAt).toLocaleDateString("en-US", { 
                  month: "long", 
                  day: "numeric", 
                  year: "numeric" 
                })}</span>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* Post Grid */}
      <section>
        <h2 className="text-xl font-semibold text-forge-text mb-6">Recent Posts</h2>
        <div className="grid gap-6">
          {posts.slice(1).map((post) => (
            <Link 
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="bg-forge-card border border-forge-border rounded-xl p-6 hover:border-forge-orange/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider mb-2 ${categoryColors[post.category] || categoryColors.news}`}>
                      {post.category.replace("-", " ")}
                    </span>
                    
                    <h3 className="text-lg font-semibold text-forge-text mb-2 group-hover:text-forge-orange transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-forge-muted text-sm line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-forge-muted">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { 
                        month: "short", 
                        day: "numeric" 
                      })}</span>
                    </div>
                  </div>
                  
                  <span className="text-forge-muted group-hover:text-forge-orange transition-colors text-xl shrink-0">
                    →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* CMS Note - Development only */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-12 p-4 bg-forge-card/50 border border-forge-border rounded-lg text-sm text-forge-muted">
          <p className="font-medium text-forge-text mb-1">🔧 Development Note</p>
          <p>Blog content is currently static. Payload CMS integration in progress for dynamic content management.</p>
        </div>
      )}
    </div>
  );
}
