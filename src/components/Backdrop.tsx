const BOKEH = [
  { x: "8%", y: "18%", s: 120, c: "rgba(150,215,255,.35)", d: 0 },
  { x: "78%", y: "10%", s: 170, c: "rgba(190,230,255,.28)", d: 2 },
  { x: "60%", y: "48%", s: 90, c: "rgba(120,190,255,.3)", d: 4 },
  { x: "20%", y: "62%", s: 150, c: "rgba(170,225,255,.25)", d: 1 },
  { x: "88%", y: "72%", s: 110, c: "rgba(200,238,255,.3)", d: 3 },
  { x: "40%", y: "30%", s: 70, c: "rgba(255,255,255,.2)", d: 5 },
  { x: "6%", y: "88%", s: 100, c: "rgba(140,205,255,.3)", d: 2.5 },
];

/** Общий ледяной фон: градиент, северное сияние и боке */
export function Backdrop() {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,#041236 0%,#082a68 28%,#0f4a9c 58%,#2b86d8 82%,#8fd0fa 100%)",
        }}
      />
      {/* северное сияние */}
      <div
        className="absolute -left-1/4 top-[8%] h-[40%] w-[90%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(80,200,255,.5), transparent)", animation: "aurora 14s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-1/4 top-[30%] h-[38%] w-[85%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(120,150,255,.45), transparent)", animation: "aurora 18s ease-in-out infinite reverse" }}
      />
      {/* боке */}
      {BOKEH.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-[6px]"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            background: `radial-gradient(circle at 35% 30%, ${b.c}, transparent 70%)`,
            animation: `bokeh ${12 + i * 2}s ease-in-out ${-b.d}s infinite`,
          }}
        />
      ))}
      {/* виньетка */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(2,10,40,.55) 100%)" }}
      />
    </div>
  );
}
