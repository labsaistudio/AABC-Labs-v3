import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSourcePackage } from '../packages/core/src/contracts/source-package.mjs';

test('source package requires reviewable files', () => {
  assert.equal(validateSourcePackage({
    root: 'source-package',
    files: [{ path: 'src/index.ts', kind: 'source', content: 'export {};\n' }],
  }), true);
  assert.equal(validateSourcePackage({
    root: 'source-package',
    files: [{ path: 'src/index.ts', kind: 'source', sourcePath: 'source/index.ts' }],
  }), true);
  assert.throws(() => validateSourcePackage({ root: 'source-package', files: [] }));
  assert.throws(() => validateSourcePackage({
    root: 'source-package',
    files: [{ path: 'src/index.ts', kind: 'source' }],
  }));
});
