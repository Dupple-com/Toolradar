import { cn } from "@/lib/utils";

interface ToolLogoProps {
  src: string | null;
  name: string;
  className?: string;
}

// Generate a consistent color based on name
function getColorFromName(name: string): string {
  const colors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-emerald-500 to-emerald-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-cyan-500 to-cyan-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
    "bg-gradient-to-br from-rose-500 to-rose-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function ToolLogo({ src, name, className }: ToolLogoProps) {
  // No src = show fallback
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-white font-semibold",
          getColorFromName(name),
          className
        )}
      >
        <span className="text-lg">{name[0]?.toUpperCase()}</span>
      </div>
    );
  }

  // With src = show image with fallback background (visible if image fails)
  return (
    <div
      className={cn(
        "relative flex items-center justify-center text-white font-semibold overflow-hidden",
        getColorFromName(name),
        className
      )}
    >
      {/* Fallback initial - always visible behind image */}
      <span className="text-lg absolute">{name[0]?.toUpperCase()}</span>
      {/* Image on top - if loads, covers the fallback */}
      <img
        src={src}
        alt={name}
        className="w-full h-full object-contain relative z-10 bg-white"
        loading="lazy"
      />
    </div>
  );
}
