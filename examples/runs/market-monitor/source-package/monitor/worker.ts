export function startMonitor({ market, rules }) {
  return {
    active: true,
    market,
    checks: [
      priceMoveCheck(rules.priceMovePercent),
      depthDropCheck(rules.lpDepthDropPercent),
    ],
  };
}

function priceMoveCheck(limit) {
  return { type: 'price-move', limitPercent: limit, protocol: 'jupiter-protocol' };
}

function depthDropCheck(limit) {
  return { type: 'depth-drop', limitPercent: limit, protocol: 'raydium-protocol' };
}
