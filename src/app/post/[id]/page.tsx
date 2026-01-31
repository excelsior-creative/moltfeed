import { fetchPost, timeAgo, formatKarma, MoltbookComment } from "@/lib/moltbook";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 30;

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const { post, comments } = await fetchPost(id);
  
  if (!post) {
    notFound();
  }
  
  const score = post.upvotes - post.downvotes;
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-moltbook-muted mb-4">
        <Link href="/" className="hover:text-moltbook-lobster">Home</Link>
        <span className="mx-2">→</span>
        <Link href={`/m/${post.submolt.name}`} className="hover:text-moltbook-lobster">
          m/{post.submolt.name}
        </Link>
      </nav>
      
      {/* Post */}
      <article className="bg-moltbook-card border border-moltbook-border rounded-lg p-6 mb-6">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-moltbook-muted mb-4">
          <Link 
            href={`/m/${post.submolt.name}`}
            className="font-medium text-moltbook-lobster hover:underline"
          >
            m/{post.submolt.name}
          </Link>
          <span>•</span>
          <span>Posted by 🤖 {post.author.name}</span>
          <span>•</span>
          <time>{timeAgo(post.created_at)}</time>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-moltbook-text mb-4">
          {post.title}
        </h1>
        
        {/* Content */}
        {post.content && (
          <div className="text-moltbook-text whitespace-pre-wrap mb-4">
            {post.content}
          </div>
        )}
        
        {/* Link */}
        {post.url && (
          <a 
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-400 hover:underline mb-4"
          >
            🔗 {post.url}
          </a>
        )}
        
        {/* Footer */}
        <div className="flex items-center gap-4 pt-4 border-t border-moltbook-border">
          <div className={`
            flex items-center gap-2 font-mono
            ${score > 0 ? "text-green-400" : score < 0 ? "text-red-400" : "text-moltbook-muted"}
          `}>
            <span>▲</span>
            <span className="text-lg font-semibold">{formatKarma(score)}</span>
            <span className="text-moltbook-muted">points</span>
          </div>
          
          <span className="text-moltbook-muted">
            💬 {post.comment_count} comments
          </span>
          
          <a
            href={`https://www.moltbook.com/post/${post.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-moltbook-lobster hover:underline text-sm"
          >
            View on Moltbook →
          </a>
        </div>
      </article>
      
      {/* Comments */}
      <section>
        <h2 className="text-lg font-semibold text-moltbook-text mb-4">
          💬 Comments ({comments.length})
        </h2>
        
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-moltbook-muted bg-moltbook-card border border-moltbook-border rounded-lg">
            <p>No comments yet.</p>
            <a
              href={`https://www.moltbook.com/post/${post.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-moltbook-lobster hover:underline text-sm mt-2 inline-block"
            >
              Join the discussion on Moltbook →
            </a>
          </div>
        )}
      </section>
    </div>
  );
}

function CommentCard({ comment, depth = 0 }: { comment: MoltbookComment; depth?: number }) {
  const score = comment.upvotes - comment.downvotes;
  
  return (
    <div 
      className={`
        bg-moltbook-card border border-moltbook-border rounded-lg p-4
        ${depth > 0 ? "ml-6 border-l-2 border-l-moltbook-lobster/30" : ""}
      `}
    >
      <div className="flex items-center gap-2 text-sm text-moltbook-muted mb-2">
        <span>🤖 {comment.author.name}</span>
        <span>•</span>
        <span className={score > 0 ? "text-green-400" : score < 0 ? "text-red-400" : ""}>
          {formatKarma(score)} points
        </span>
        <span>•</span>
        <time>{timeAgo(comment.created_at)}</time>
      </div>
      
      <div className="text-moltbook-text whitespace-pre-wrap">
        {comment.content}
      </div>
      
      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
