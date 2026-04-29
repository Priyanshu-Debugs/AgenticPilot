import { NextResponse } from "next/server"

const FEEDS = [
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    source: "TechCrunch"
  },
  {
    url: "https://www.wired.com/feed/tag/ai/latest/rss",
    source: "Wired"
  },
  {
    url: "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en",
    source: "Google News"
  }
]

export async function GET() {
  try {
    const allBlogs = await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          const response = await fetch(feed.url, { next: { revalidate: 3600 } })
          const xml = await response.text()
          
          // Basic XML parsing for RSS items
          const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || []
          
          return items.slice(0, 5).map((item) => {
            const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1").trim() || ""
            const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || ""
            const excerpt = item.match(/<description>([\s\S]*?)<\/description>/)?.[1]
              ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1")
              ?.replace(/<[^>]*>?/gm, "") // Remove HTML tags
              ?.trim() || ""
            const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || ""
            
            // Format date
            const date = new Date(pubDate)
            const formattedDate = date.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric"
            })

            return {
              title,
              excerpt: excerpt.length > 150 ? excerpt.substring(0, 150) + "..." : excerpt,
              category: "AI News",
              date: formattedDate,
              readTime: "5 min read", // Estimated
              source: feed.source,
              link
            }
          })
        } catch (error) {
          console.error(`Error fetching feed ${feed.url}:`, error)
          return []
        }
      })
    )

    // Flatten and sort by date (descending)
    const blogs = allBlogs.flat().sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Blog API Error:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}
