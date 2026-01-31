// Moltbook API client for Moltfeed
// Note: We're reading publicly available data - no auth needed for read-only ops

const MOLTBOOK_API = "https://www.moltbook.com/api/v1";

export interface MoltbookPost {
  id: string;
  title: string;
  content?: string;
  url?: string;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  created_at: string;
  is_pinned?: boolean;
  author: {
    name: string;
    avatar_url?: string;
    karma?: number;
  };
  submolt: {
    name: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface MoltbookComment {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  author: {
    name: string;
    avatar_url?: string;
  };
  replies?: MoltbookComment[];
}

export interface MoltbookSubmolt {
  name: string;
  display_name: string;
  description: string;
  subscriber_count: number;
  post_count: number;
  avatar_url?: string;
  banner_url?: string;
  created_at: string;
}

export interface MoltbookAgent {
  name: string;
  description: string;
  karma: number;
  follower_count: number;
  following_count: number;
  avatar_url?: string;
  created_at: string;
  last_active?: string;
  owner?: {
    x_handle?: string;
    x_name?: string;
    x_avatar?: string;
  };
}

export type SortOption = "hot" | "new" | "top" | "rising";

// Fetch posts from Moltbook (public read)
export async function fetchPosts(options: {
  sort?: SortOption;
  limit?: number;
  submolt?: string;
}): Promise<MoltbookPost[]> {
  const { sort = "hot", limit = 25, submolt } = options;
  
  const params = new URLSearchParams({
    sort,
    limit: limit.toString(),
    ...(submolt && { submolt }),
  });
  
  try {
    const res = await fetch(`${MOLTBOOK_API}/posts?${params}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!res.ok) {
      throw new Error(`Moltbook API error: ${res.status}`);
    }
    
    const data = await res.json();
    return data.posts || data.data?.posts || [];
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

// Fetch a single post with comments
export async function fetchPost(postId: string): Promise<{
  post: MoltbookPost | null;
  comments: MoltbookComment[];
}> {
  try {
    const [postRes, commentsRes] = await Promise.all([
      fetch(`${MOLTBOOK_API}/posts/${postId}`, { next: { revalidate: 30 } }),
      fetch(`${MOLTBOOK_API}/posts/${postId}/comments?sort=top`, { next: { revalidate: 30 } }),
    ]);
    
    const postData = postRes.ok ? await postRes.json() : null;
    const commentsData = commentsRes.ok ? await commentsRes.json() : { comments: [] };
    
    return {
      post: postData?.post || postData?.data?.post || null,
      comments: commentsData?.comments || commentsData?.data?.comments || [],
    };
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return { post: null, comments: [] };
  }
}

// Fetch submolts
export async function fetchSubmolts(): Promise<MoltbookSubmolt[]> {
  try {
    const res = await fetch(`${MOLTBOOK_API}/submolts`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.submolts || data.data?.submolts || [];
  } catch (error) {
    console.error("Failed to fetch submolts:", error);
    return [];
  }
}

// Search posts semantically
export async function searchPosts(query: string, limit = 20): Promise<MoltbookPost[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      type: "posts",
      limit: limit.toString(),
    });
    
    const res = await fetch(`${MOLTBOOK_API}/search?${params}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to search:", error);
    return [];
  }
}

// Fetch top agents
export async function fetchTopAgents(limit = 10): Promise<MoltbookAgent[]> {
  try {
    const res = await fetch(`${MOLTBOOK_API}/agents?sort=karma&limit=${limit}`, {
      next: { revalidate: 300 },
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.agents || data.data?.agents || [];
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return [];
  }
}

// Calculate relative time
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

// Format karma score
export function formatKarma(score: number): string {
  if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
  if (score >= 1000) return `${(score / 1000).toFixed(1)}k`;
  return score.toString();
}
