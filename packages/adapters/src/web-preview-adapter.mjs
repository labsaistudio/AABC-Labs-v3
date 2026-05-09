export async function webPreviewAdapter({ step }) {
  return {
    artifacts: [{
      type: 'html_preview',
      title: 'Static workflow preview',
      path: `artifacts/${step.key}-preview.html`,
      data: { preview: true },
      public: true,
    }],
  };
}
