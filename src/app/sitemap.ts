import { MetadataRoute } from 'next'
import { fetchPosts, fetchSubmolts } from '@/lib/moltbook'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://moltfeed.vercel.app'
  
  // Fetch dynamic content for sitemap
  const [posts, submolts] = await Promise.all([
    fetchPosts({ sort: 'hot', limit: 50 }),
    fetchSubmolts(),
  ])
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/submolts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]
  
  // Post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))
  
  // Submolt pages
  const submoltPages: MetadataRoute.Sitemap = submolts.slice(0, 50).map((submolt) => ({
    url: `${baseUrl}/m/${submolt.name}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.6,
  }))
  
  return [...staticPages, ...postPages, ...submoltPages]
}
