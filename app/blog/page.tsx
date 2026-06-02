import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  Clock,
  BrainCircuit,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { BlogClientWrapper } from "./BlogClientWrapper";

interface Blog {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  source: string;
  link: string;
}

const FEEDS = [
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    source: "TechCrunch",
  },
  {
    url: "https://www.wired.com/feed/tag/ai/latest/rss",
    source: "Wired",
  },
  {
    url: "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en",
    source: "Google News",
  },
];

async function fetchBlogs(): Promise<Blog[]> {
  try {
    const allBlogs = await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          const response = await fetch(feed.url, {
            next: { revalidate: 3600 },
          });
          const xml = await response.text();

          const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

          return items.slice(0, 5).map((item) => {
            const title =
              item
                .match(/<title>([\s\S]*?)<\/title>/)?.[1]
                ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1")
                .trim() || "";
            const link =
              item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
            const excerpt =
              item
                .match(/<description>([\s\S]*?)<\/description>/)?.[1]
                ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1")
                ?.replace(/<[^>]*>?/gm, "")
                ?.trim() || "";
            const pubDate =
              item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";

            const date = new Date(pubDate);
            const formattedDate = date.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            });

            return {
              title,
              excerpt:
                excerpt.length > 150
                  ? excerpt.substring(0, 150) + "..."
                  : excerpt,
              category: "AI News",
              date: formattedDate,
              readTime: "5 min read",
              source: feed.source,
              link,
            };
          });
        } catch (error) {
          console.error(`Error fetching feed ${feed.url}:`, error);
          return [];
        }
      })
    );

    return allBlogs.flat().sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await fetchBlogs();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogClientWrapper>
        {/* Ambient background styling */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute right-[10%] top-[10%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute left-[20%] bottom-[20%] w-[25%] h-[25%] rounded-full bg-primary/10 blur-[100px]" />
        </div>

        <main className="relative z-10 container-padding py-32 lg:py-40">
          <div className="max-w-5xl mx-auto gap-y-16">
            {/* Header Section */}
            <div className="gap-y-6">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <BookOpen className="size-4 mr-2" />
                Agentic Insights
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Thoughts on{" "}
                <span className="text-gradient-static">AI &amp; Automation</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Dive deep into the engineering, design, and architecture behind
                the next generation of autonomous business software. Explore the
                latest in AI automation, agentic AI, and intelligent workflow tools.
              </p>
            </div>

            {blogs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  Unable to load latest blogs. Please try again later.
                </p>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                <Card variant="glow" padding="none" className="overflow-hidden border-primary/30">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 bg-gradient-to-br from-primary/20 via-accent/10 to-background p-10 flex items-center justify-center border-b md:border-b-0 md:border-r border-border/50">
                      <BrainCircuit className="size-32 text-primary opacity-80" />
                    </div>
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-x-4 mb-4 text-xs font-medium text-muted-foreground">
                        <span className="text-primary uppercase tracking-wider">
                          {blogs[0].category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="size-3 mr-1" />{" "}
                          {blogs[0].date}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        {blogs[0].title}
                      </h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {blogs[0].excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-end">
                        <Link
                          href={blogs[0].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                        >
                          Read Original{" "}
                          <ExternalLink className="ml-1 size-4 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Grid Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.slice(1).map((blog, index) => (
                    <article key={index} className="h-full">
                      <Card className="h-full p-6 flex flex-col hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                          <span className="text-accent font-semibold">
                            {blog.category}
                          </span>
                          <span className="flex items-center">
                            <Clock className="size-3 mr-1" /> {blog.readTime}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        <div className="mt-auto flex items-center justify-end pt-4 border-t border-border/30">
                          <Link
                            href={blog.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                          >
                            Read{" "}
                            <ExternalLink className="ml-1 size-4 transition-transform group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </Card>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </BlogClientWrapper>
    </div>
  );
}
