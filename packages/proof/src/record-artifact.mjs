export function generatedArtifact({ stepKey, type, title, path, data = {}, isPublic = true }) {
  return {
    stepKey,
    type,
    title,
    path,
    data,
    public: isPublic,
  };
}
