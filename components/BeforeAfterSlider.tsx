"use client";

import { useState } from "react";

export default function BeforeAfterSlider({
  before,
  after,
  labelBefore,
  labelAfter,
  altBefore,
  altAfter,
}: {
  before: string;
  after: string;
  labelBefore: string;
  labelAfter: string;
  altBefore: string;
  altAfter: string;
}) {
  const [v, setV] = useState(50);

  return (
    <div className="ba-card reveal">
      <div className="ba-img">
        <img src={before} alt={altBefore} />
      </div>
      <div className="ba-img ba-after" style={{ clipPath: `inset(0 0 0 ${v}%)` }}>
        <img src={after} alt={altAfter} />
      </div>
      <div className="ba-handle" style={{ left: `${v}%` }}></div>
      <span className="ba-label before">{labelBefore}</span>
      <span className="ba-label after">{labelAfter}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={v}
        className="ba-slider"
        aria-label="Comparer avant / après"
        onChange={(e) => setV(Number(e.target.value))}
      />
    </div>
  );
}
