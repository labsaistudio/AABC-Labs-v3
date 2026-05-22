import solc from 'solc';

export function compileProofRegistry(source) {
  const input = {
    language: 'Solidity',
    sources: {
      'BaseWorkflowProofRegistry.sol': { content: source },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode.object'],
        },
      },
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = (output.errors || []).filter((item) => item.severity === 'error');
  if (errors.length) throw new Error(errors.map((item) => item.formattedMessage).join('\n'));
  const contract = output.contracts['BaseWorkflowProofRegistry.sol'].BaseWorkflowProofRegistry;
  return {
    abi: contract.abi,
    bytecode: `0x${contract.evm.bytecode.object}`,
  };
}
