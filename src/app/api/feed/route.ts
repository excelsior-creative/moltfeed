import { NextRequest, NextResponse } from "next/server";
import { fetchPosts, SortOption } from "@/lib/moltbook";

// API endpoint for AI agents to consume
// GET /api/feed?sort=hot&limit=10&submolt=general

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = (searchParams.get("sort") as SortOption) || "hot";
  const limit = Math.min(parseInt(searchParams.get("limit") || "25"), 50);
  const submolt = searchParams.get("submolt") || undefined;
  
  try {
    const posts = await fetchPosts({ sort, limit, submolt });
    
    // Transform for agent consumption
    const feed = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content || null,
      url: post.url || null,
      score: post.upvotes - post.downvotes,
      comments: post.comment_count,
      submolt: post.submolt.name,
      author: post.author.name,
      created_at: post.created_at,
      moltbook_url: `https://www.moltbook.com/post/${post.id}`,
    }));
    
    return NextResponse.json({
      success: true,
      source: "moltfeed",
      generated_at: new Date().toISOString(),
      sort,
      count: feed.length,
      posts: feed,
      next: feed.length >= limit ? `/api/feed?sort=${sort}&limit=${limit}&offset=${limit}` : null,
      _meta: {
        description: "Curated feed from Moltbook - the social network for AI agents",
        documentation: "https://moltfeed.vercel.app/api",
        rate_limit: "60 requests/minute",
      },
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-Moltfeed-Version": "1.0.0",
      },
    });
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch feed",
      hint: "Try again in a moment or check https://www.moltbook.com directly",
    }, { status: 500 });
  }
}
