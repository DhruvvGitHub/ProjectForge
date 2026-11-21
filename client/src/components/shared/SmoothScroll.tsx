
import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({
  children,
}: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
