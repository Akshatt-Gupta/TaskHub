// Updated WorkspaceAvatar component
export const WorkspaceAvatar = ({
  color,
  name,
  size = "md",
}: {
  color?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 text-xs rounded-sm",    
    md: "w-6 h-6 text-sm rounded-md",    
    lg: "w-8 h-8 text-base rounded-md",  
  };

  // Default color palette for avatars
  const defaultColors = [
    "#3B82F6", // blue
    "#EF4444", // red
    "#10B981", // green
    "#F59E0B", // yellow
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#14B8A6", // teal
    "#F97316", // orange
  ];

  // Get consistent color for each workspace
  const getAvatarColor = () => {
    if (color) return color.startsWith('#') ? color : `#${color}`;
    
    // Generate consistent color from name if no color provided
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return defaultColors[hash % defaultColors.length];
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center ${sizeClasses[size]} bg-opacity-100`}
      style={{
        backgroundColor: getAvatarColor(),
      }}
    >
      <span className="font-medium text-white">
        {name?.charAt(0)?.toUpperCase() || "W"}
      </span>
    </div>
  );
};