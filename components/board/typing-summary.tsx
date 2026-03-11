"use client";

import { useEffect, useState } from "react";

export function TypingSummary({ text }: { text: string }) {
  const [visible, setVisible] = useState("");

  useEffect(() => {
    let frame = 0;
    const interval = window.setInterval(() => {
      frame += 3;
      setVisible(text.slice(0, frame));

      if (frame >= text.length) {
        window.clearInterval(interval);
      }
    }, 24);

    return () => window.clearInterval(interval);
  }, [text]);

  return <p className="text-base leading-8 text-slate-200">{visible}</p>;
}
