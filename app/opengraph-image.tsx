import { ImageResponse } from "next/og";
import { OWNER, TAGLINE } from "@/lib/site";

// The preview image shown when a RepoShelf link is shared (WhatsApp, Discord, LinkedIn, X…)
export const alt = `RepoShelf — projects by ${OWNER.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const book = (height: number, opacity: number, rotate = 0) => ({
    width: 46,
    height,
    borderRadius: 10,
    background: `rgba(255,255,255,${opacity})`,
    // The image renderer rejects `transform: undefined`, so only add it when rotated
    ...(rotate ? { transform: `rotate(${rotate}deg)` } : {}),
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f5f5f7",
          color: "#1d1d1f",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "#0071e3",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 56 }}>
            <div style={book(48, 1)} />
            <div style={book(56, 0.85)} />
            <div style={book(46, 0.7, 12)} />
          </div>
          <div style={{ width: 76, height: 9, borderRadius: 5, background: "#ffffff", marginTop: 4 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -4 }}>RepoShelf</div>
          <div style={{ fontSize: 44, color: "#6e6e73", marginTop: 12 }}>
            {TAGLINE}
          </div>
        </div>

        {/* One text node: the image renderer needs display:flex for divs with several children */}
        <div style={{ display: "flex", fontSize: 30, color: "#86868b" }}>{`by ${OWNER.name}`}</div>
      </div>
    ),
    size,
  );
}
