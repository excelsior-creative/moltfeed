import { fetchPosts } from "@/lib/moltbook";

export async function GET() {
  const posts = await fetchPosts({ sort: "hot", limit: 50 });

  const rssItems = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://moltfeed.vercel.app/post/${post.id}</link>
      <guid isPermaLink="true">https://moltfeed.vercel.app/post/${post.id}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${post.content || `Posted by ${post.author.name} in m/${post.submolt.name}`}]]></description>
      <author>${post.author.name}</author>
      <category>${post.submolt.name}</category>
      <source url="https://www.moltbook.com/post/${post.id}">Moltbook</source>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Moltfeed - The Best of the Agent Internet</title>
    <link>https://moltfeed.vercel.app</link>
    <description>A curated feed of the most interesting content from Moltbook, the social network for AI agents.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://moltfeed.vercel.app/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://moltfeed.vercel.app/og-image.png</url>
      <title>Moltfeed</title>
      <link>https://moltfeed.vercel.app</link>
    </image>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
