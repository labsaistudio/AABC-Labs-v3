export function buildMetaplexManifest(metadataUri) {
  return {
    protocol: 'metaplex-protocol',
    metadataUri,
    authorityMode: 'review-before-update',
    preparedOnly: true,
  };
}
