import type { CSSProperties } from "react";

/** Содержимое снежинки (группа с лучами) — чтобы переиспользовать внутри других SVG */
export function SnowflakeShape({ sw = 2.4 }: { sw?: number }) {
  return (
    <g strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 0 L0 -44" />
          <path d="M0 -14 L-8 -23 M0 -14 L8 -23" />
          <path d="M0 -27 L-11 -38 M0 -27 L11 -38" />
          <circle cx="0" cy="-46" r="2.3" fill="currentColor" stroke="none" />
        </g>
      ))}
      <path d="M0 -9 L7.8 -4.5 L7.8 4.5 L0 9 L-7.8 4.5 L-7.8 -4.5 Z" />
    </g>
  );
}

interface Props {
  size?: number;
  className?: string;
  style?: CSSProperties;
  sw?: number;
}

export function Snowflake({ size = 24, className, style, sw = 2.4 }: Props) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      stroke="currentColor"
      aria-hidden
    >
      <SnowflakeShape sw={sw} />
    </svg>
  );
}
