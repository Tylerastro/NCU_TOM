import { StarField } from "./StarField";

interface BackgroundEffectsProps {
  backgroundImage?: string;
}

export default function BackgroundEffects({
  backgroundImage = "/Dalle-observatory.png",
}: BackgroundEffectsProps) {
  return (
    <>
      {/* Observatory background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/80 to-[#030712]" />

      {/* Animated star field */}
      <StarField count={100} />

      {/* Coordinate grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(217, 119, 6, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217, 119, 6, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
    </>
  );
}
