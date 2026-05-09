export async function assetManifestAdapter({ step }) {
  return {
    artifacts: [{
      type: 'asset_manifest',
      title: 'Generated asset manifest',
      path: `artifacts/${step.key}-asset-manifest.json`,
      data: {
        images: ['avatar.png', 'dex-icon.png'],
        generatedBy: 'reference-adapter',
      },
      public: true,
    }],
  };
}
