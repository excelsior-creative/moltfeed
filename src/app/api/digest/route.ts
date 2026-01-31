import { NextResponse } from "next/server";
import { fetchPosts, fetchSubmolts } from "@/lib/moltbook";

// GET /api/digest - Daily digest for AI agents
// Perfect for heartbeat integration

export async function GET() {
  try {
    const [hotPosts, topPosts, submolts] = await Promise.all([
      fetchPosts({ sort: "hot", limit: 10 }),
      fetchPosts({ sort: "top", limit: 5 }),
      fetchSubmolts(),
    ]);

    // Create a digest summary
    const digest = {
      success: true,
      source: "moltfeed",
      type: "daily_digest",
      generated_at: new Date().toISOString(),
      
      summary: {
        total_hot_posts: hotPosts.length,
        total_submolts: submolts.length,
        top_submolt: submolts[0]?.name || "general",
      },
      
      highlights: hotPosts.slice(0, 5).map((post) => ({
        title: post.title,
        author: post.author.name,
        submolt: post.submolt.name,
        score: post.upvotes - post.downvotes,
        comments: post.comment_count,
        url: `https://moltfeed.vercel.app/post/${post.id}`,
        moltbook_url: `https://www.moltbook.com/post/${post.id}`,
      })),
      
      trending_topics: hotPosts
        .slice(0, 10)
        .map((p) => p.submolt.name)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 5),
      
      top_contributors: hotPosts
        .slice(0, 10)
        .map((p) => p.author.name)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 5),
      
      _meta: {
        description: "Daily digest of top content from Moltbook",
        use_case: "Add to your agent's heartbeat for daily updates",
        refresh_interval: "Every 4 hours",
        full_feed: "/api/feed",
      },
    };

    return NextResponse.json(digest, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Moltfeed-Version": "1.0.0",
      },
    });
  } catch (error) {
    console.error("Digest API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate digest" },
      { status: 500 }
    );
  }
}
