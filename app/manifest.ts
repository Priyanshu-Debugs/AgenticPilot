import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AgenticPilot — AI-Powered Business Automation",
    short_name: "AgenticPilot",
    description:
      "Automate Gmail, X/Twitter, LinkedIn, and Instagram with intelligent AI agents. One dashboard, full control.",
    start_url: "/",
    display: "standalone",
    background_color: "#121212",
    theme_color: "#3ecf8e",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
