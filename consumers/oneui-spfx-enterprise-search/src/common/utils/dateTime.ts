export const formatRelativeDate = (value?: string): string => {
  if (!value) {
    return "Updated recently";
  }

  const target = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - target.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) {
    return "Updated today";
  }

  if (diffDays === 1) {
    return "Updated yesterday";
  }

  if (diffDays < 30) {
    return `Updated ${diffDays} days ago`;
  }

  return target.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

