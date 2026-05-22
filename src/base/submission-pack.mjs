export function buildBaseSubmissionPack(input) {
  const evidence = [
    evidenceLink('repository', input.repositoryUrl),
    evidenceLink('demo', input.demoUrl),
    evidenceLink('x402_endpoint', input.x402EndpointUrl),
    evidenceLink('proof', input.proofUrl),
    evidenceLink('explorer', input.explorerUrl),
  ];
  return {
    product: 'AABC Base Agent Fund Pack',
    ecosystem: 'base',
    summary: 'Onchain agent execution, payments, and proof on Base.',
    evidence,
    readinessChecks: evidence.map((item) => readinessCheck(item)),
    fundingTargets: [
      'weekly-rewards',
      'builder-grants',
      'op-retro-funding',
    ],
  };
}

function evidenceLink(type, url) {
  if (!url) throw new Error(`missing_submission_evidence:${type}`);
  if (!url.startsWith('https://')) throw new Error(`https_required:${type}`);
  return { type, url, status: evidenceStatus(url) };
}

function readinessCheck(item) {
  return {
    id: item.type,
    status: item.status,
    url: item.url,
  };
}

function evidenceStatus(url) {
  if (url.includes('/base-demo')) return 'placeholder';
  if (url.includes('/api/agent-report')) return 'placeholder';
  if (url.includes('/proof/base-agent-fund-pack')) return 'placeholder';
  if (/0x0{64}$/i.test(url)) return 'placeholder';
  return 'ready';
}
