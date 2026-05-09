import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

export async function writeSourcePackage({ outDir, sourcePackage }) {
  const root = join(outDir, 'source-package');
  const written = [];
  for (const file of sourcePackage.files) {
    const target = join(root, file.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, await fileContent({ file, sourcePackage }));
    written.push(target);
  }
  return written;
}

async function fileContent({ file, sourcePackage }) {
  if (Object.hasOwn(file, 'content')) return file.content;
  if (!file.sourcePath) throw new Error(`source_package_content_required:${file.path}`);
  if (!sourcePackage.baseDir) throw new Error(`source_package_base_dir_required:${file.path}`);
  const sourceFile = resolve(sourcePackage.baseDir, file.sourcePath);
  const baseDir = resolve(sourcePackage.baseDir);
  if (!sourceFile.startsWith(`${baseDir}/`)) throw new Error(`source_package_source_path_invalid:${file.path}`);
  return readFile(sourceFile, 'utf8');
}
