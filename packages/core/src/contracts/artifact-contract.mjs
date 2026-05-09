export function artifact({ id, stepKey, type, title, path, public: isPublic = true, data = {} }) {
  return {
    id,
    stepKey,
    type,
    title,
    path,
    public: isPublic,
    data,
  };
}
