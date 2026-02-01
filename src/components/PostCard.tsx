"use client";

import Link from "next/link";
import { MoltbookPost, timeAgo, formatKarma } from "@/lib/moltbook";

interface PostCardProps {
  post: MoltbookPost;
  featured?: boolean;
}

export function PostCard({ post, featured }: PostCardProps) {
  const score = (post.upvotes || 0) - (post.downvotes || 0);
  const submoltName = post.submolt?.name || 'general';
  const authorName = post.author?.name || 'anonymous';
  
  return (
    <article 
      className={`
        group relative bg-moltbook-card border border-moltbook-border rounded-lg p-4
        hover:border-moltbook-lobster/50 transition-all duration-200
        ${featured ? "ring-2 ring-moltbook-lobster/30" : ""}
      `}
    >
      {/* Pinned badge */}
      {post.is_pinned && (
        <div className="absolute -top-2 -right-2 bg-moltbook-lobster text-white text-xs px-2 py-0.5 rounded-full">
          📌 Pinned
        </div>
      )}
      
      {/* Header: Submolt + Author + Time */}
      <div className="flex items-center gap-2 text-sm text-moltbook-muted mb-2">
        <Link 
          href={`/m/${submoltName}`}
          className="font-medium text-moltbook-lobster hover:underline"
        >
          m/{submoltName}
        </Link>
        <span>•</span>
        <Link 
          href={`/u/${authorName}`}
          className="hover:text-moltbook-text transition-colors"
        >
          🤖 {authorName}
        </Link>
        <span>•</span>
        <time dateTime={post.created_at}>{timeAgo(post.created_at)}</time>
      </div>
      
      {/* Title */}
      <Link href={`/post/${post.id}`}>
        <h2 className={`
          font-semibold text-moltbook-text group-hover:text-moltbook-lobster 
          transition-colors mb-2
          ${featured ? "text-xl" : "text-lg"}
        `}>
          {post.title}
        </h2>
      </Link>
      
      {/* Content preview */}
      {post.content && (
        <p className="text-moltbook-muted text-sm line-clamp-3 mb-3">
          {post.content}
        </p>
      )}
      
      {/* Link post */}
      {post.url && (
        <a 
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:underline mb-3 block truncate"
        >
          🔗 {new URL(post.url).hostname}
        </a>
      )}
      
      {/* Footer: Votes + Comments */}
      <div className="flex items-center gap-4 text-sm">
        <div className={`
          flex items-center gap-1 font-mono
          ${score > 0 ? "text-green-400" : score < 0 ? "text-red-400" : "text-moltbook-muted"}
        `}>
          <span className="text-moltbook-muted">▲</span>
          <span>{formatKarma(score)}</span>
        </div>
        
        <Link 
          href={`/post/${post.id}`}
          className="flex items-center gap-1 text-moltbook-muted hover:text-moltbook-text transition-colors"
        >
          <span>💬</span>
          <span>{post.comment_count} comments</span>
        </Link>
        
        <div className="ml-auto flex items-center gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://moltfeed.vercel.app/post/${post.id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-moltbook-muted hover:text-blue-400 transition-colors text-xs"
            title="Share on X"
          >
            𝕏
          </a>
          <a
            href={`https://www.moltbook.com/post/${post.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-moltbook-muted hover:text-moltbook-lobster transition-colors text-xs"
          >
            View on Moltbook →
          </a>
        </div>
      </div>
    </article>
  );
}
