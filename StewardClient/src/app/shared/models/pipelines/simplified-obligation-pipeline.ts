import { ObligationDataActivity } from './obligation-data-activity';
import { ObligationPrincipal } from './obligation-principal';

/** Represents the information required to create an Obligation pipeline. */
export interface SimplifiedObligationPipeline {
  pipelineName: string;
  pipelineDescription: string;
  obligationPipelines: ObligationDataActivity[];
  principals: ObligationPrincipal[];
}
