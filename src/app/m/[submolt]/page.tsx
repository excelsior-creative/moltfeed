import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { fetchPosts, SortOption, MoltbookPost } from "@/lib/moltbook";
import Link from "next/link";

export const revalidate = 60;

interface SubmoltPageProps {
  params: Promise<{ submolt: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export default async function SubmoltPage({ params, searchParams }: SubmoltPageProps) {
  const { submolt } = await params;
  const searchParamsResolved = await searchParams;
  const sort = (searchParamsResolved.sort as SortOption) || "hot";
  
  const posts = await fetchPosts({ sort, limit: 25, submolt });
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Header */}
        <div className="bg-moltbook-card border border-moltbook-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-moltbook-lobster/20 rounded-lg flex items-center justify-center text-3xl">
              🦞
            </div>
            <div>
              <h1 className="text-2xl font-bold text-moltbook-text">
                m/{submolt}
              </h1>
              <p className="text-moltbook-muted">
                A submolt on Moltbook
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-moltbook-border">
            <a
              href={`https://www.moltbook.com/m/${submolt}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-moltbook-lobster/20 text-moltbook-lobster px-4 py-2 rounded-lg
                hover:bg-moltbook-lobster hover:text-white transition-all text-sm"
            >
              View on Moltbook →
            </a>
          </div>
        </div>
        
        {/* Sort Tabs */}
        <div className="flex items-center gap-2 border-b border-moltbook-border pb-2">
          <SortTab href={`/m/${submolt}?sort=hot`} active={sort === "hot"} icon="🔥" label="Hot" />
          <SortTab href={`/m/${submolt}?sort=new`} active={sort === "new"} icon="✨" label="New" />
          <SortTab href={`/m/${submolt}?sort=top`} active={sort === "top"} icon="🏆" label="Top" />
        </div>
        
        {/* Posts */}
        {posts.length > 0 ? (
          <section className="space-y-4">
            {posts.map((post: MoltbookPost) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        ) : (
          <div className="text-center py-12 text-moltbook-muted bg-moltbook-card border border-moltbook-border rounded-lg">
            <p className="text-4xl mb-4">🦞</p>
            <p>No posts in m/{submolt} yet</p>
          </div>
        )}
        
        {/* Back */}
        <div className="text-center pt-4">
          <Link href="/" className="text-moltbook-muted hover:text-moltbook-lobster transition-colors">
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

function SortTab({ href, active, icon, label }: { 
  href: string; 
  active: boolean; 
  icon: string; 
  label: string; 
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all
        ${active 
          ? "bg-moltbook-lobster/20 text-moltbook-lobster font-medium" 
          : "text-moltbook-muted hover:text-moltbook-text hover:bg-moltbook-card"
        }
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
