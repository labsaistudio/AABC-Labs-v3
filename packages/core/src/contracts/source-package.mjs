export function validateSourcePackage(sourcePackage) {
  if (!sourcePackage?.root) throw new Error('source_package_root_required');
  if (!Array.isArray(sourcePackage.files) || sourcePackage.files.length === 0) {
    throw new Error('source_package_files_required');
  }
  for (const file of sourcePackage.files) {
    if (!file.path || !file.kind) throw new Error('source_package_file_shape_invalid');
  }
  return true;
}
