export function getDisplayStoneName(name?: string | null) {
  const originalName = name?.trim() ?? "";

  if (!originalName) {
    return "";
  }

  const nameWithoutExtension = originalName.replace(
    /\.(?:avif|gif|jpe?g|png|svg|webp)$/i,
    ""
  );
  const displayName = nameWithoutExtension
    .replace(/[\s_-]+\d+(?:\.\d+)?$/g, "")
    .trim();

  return displayName || nameWithoutExtension;
}
