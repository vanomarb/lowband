"use client";

import { useEffect, useState } from "react";
import Demo from "../../Demo";
import WebPlayer from "../../web/WebPlayer";

const isPhone = () => document.documentElement.dataset.device === "phone";

// One address for both: phones get the phone app, everything else the web player. phone.ts marks phones
// before the first paint (or fires "lowband:device" once "Desktop site" mode reveals the real width).
export default function Play() {
  const [phone, setPhone] = useState<boolean | null>(null);
  useEffect(() => {
    const update = () => setPhone(isPhone());
    update();
    addEventListener("lowband:device", update);
    return () => removeEventListener("lowband:device", update);
  }, []);
  if (phone === null) return null;
  return phone ? <Demo homeHref="/" /> : <WebPlayer appHref="/app" />;
}
