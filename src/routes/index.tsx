import { createFileRoute } from "@tanstack/react-router";
import { WeddingInvitation } from "@/components/WeddingInvitation";

export const Route = createFileRoute("/")({
  component: WeddingInvitation,
  head: () => ({
    meta: [
      { title: "Thasleema & Ashik — Nikah" },
      { name: "description", content: "Join Thasleema M and Ashik Ashraf for their Nikah on 28 November 2026 at Crown Palace, Kuzhalmannam." },
      { property: "og:title", content: "Thasleema & Ashik — Nikah" },
      { property: "og:description", content: "Together with our families, we invite you to celebrate with us on 28 November 2026." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Event",
        name: "Thasleema M & Ashik Ashraf — Nikah",
        startDate: "2026-11-28T11:30:00+05:30",
        endDate: "2026-11-28T12:00:00+05:30",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "Place", name: "Crown Palace", address: "Kuzhalmannam, Palakkad, Kerala, India" },
      }),
    }],
  }),
});
