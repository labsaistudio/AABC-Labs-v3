import { validateOutcomeContract } from '../contracts/outcome-contract.mjs';
import { validateSourcePackage } from '../contracts/source-package.mjs';

export function validateWorkflow(workflow) {
  validateOutcomeContract(workflow);
  validateSourcePackage(workflow.sourcePackage);
  return true;
}
