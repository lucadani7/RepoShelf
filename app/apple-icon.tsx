import { ImageResponse } from "next/og";

// Home-screen icon for iPhone/iPad (same design as app/icon.svg)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const book = (height: number, opacity: number, rotate = 0) => ({
    width: 22,
    height,
    borderRadius: 6,
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
          background: "#0071e3",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 9, height: 86 }}>
          <div style={book(74, 1)} />
          <div style={book(86, 0.85)} />
          <div style={book(70, 0.7, 12)} />
        </div>
        <div style={{ width: 114, height: 14, borderRadius: 7, background: "#ffffff", marginTop: 6 }} />
      </div>
    ),
    size,
  );
}
