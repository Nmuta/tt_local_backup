import { ObligationKustoDataActivity } from './obligation-kusto-data-activity';
import { ObligationKustoRestateOMaticDataActivity } from './obligation-kusto-restate-o-matic-data-activity';
import { ObligationPrincipal } from './obligation-principal';

/** Represents the information required to create an Obligation pipeline. */
export interface SimplifiedObligationPipeline {
  pipelineName: string;
  pipelineDescription: string;
  kustoDataActivities: ObligationKustoDataActivity[];
  kustoRestateOMaticDataActivities: ObligationKustoRestateOMaticDataActivity[];
  principals: ObligationPrincipal[];
}
