import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SimplifiedObligationPipeline } from '@models/pipelines/simplified-obligation-pipeline';
import { faker } from '@interceptors/fake-api/utility';
import { ObligationPrincipal } from '@models/pipelines/obligation-principal';
import { ObligationKustoDataActivity } from '@models/pipelines/obligation-kusto-data-activity';
import { Duration } from 'luxon';
import { toDateTime } from '@helpers/luxon';

/** Fake API for GETing a single pipeline. */
export class PipelineGetFakeApi extends FakeApiBase {
  private pipelineName: string = null;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    if (this.request.method.toLowerCase() !== 'get') {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/pipeline\/(.+)$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.pipelineName = match[1];
    return true;
  }

  /** Produces a sample API response. */
  public handle(): SimplifiedObligationPipeline {
    return PipelineGetFakeApi.make(this.pipelineName);
  }

  /** Generates a sample object */
  public static make(name: string): SimplifiedObligationPipeline {
    return {
      pipelineName: name ?? faker.name.jobDescriptor(),
      pipelineDescription: faker.lorem.lines(1),
      principals: new Array(faker.datatype.number(5)).fill(undefined).map(_ => {
        return <ObligationPrincipal>{
          principal_type: faker.datatype.uuid(),
          principal_value: faker.datatype.uuid(),
          role: faker.name.jobTitle(),
        };
      }),
      kustoRestateOMaticDataActivities: [],
      kustoDataActivities: new Array(faker.datatype.number(5)).fill(undefined).map(_ => {
        return <ObligationKustoDataActivity>{
          activityName: faker.name.jobTitle(),
          dataActivityDependencyNames: new Array(faker.datatype.number(5))
            .fill(undefined)
            .map(_ => faker.name.firstName()),
          destinationDatabase: faker.datatype.uuid(),
          endDateUtc: toDateTime(faker.date.future(1)),
          startDateUtc: toDateTime(faker.date.past(1)),
          executionDelay: Duration.fromObject({
            minutes: faker.datatype.number({ min: 30, max: 2880 }),
          }),
          executionInterval: Duration.fromObject({
            minutes: faker.datatype.number({ min: 30, max: 1440 }),
          }),
          maxExecutionSpan: Duration.fromObject({
            minutes: faker.datatype.number({ min: 30, max: 1440 }),
          }),
          kustoFunction: {
            name: faker.lorem.words(5).replace(' ', '_').toLowerCase(),
            numberOfBuckets: faker.datatype.boolean()
              ? new BigNumber(faker.datatype.number({ min: 1, max: 5 }))
              : null,
            useEndDate: faker.datatype.boolean(),
            useSplitting: faker.datatype.boolean(),
          },
          kustoTableName: faker.lorem.words(5).replace(' ', '_').toLowerCase(),
          parallelismLimit: new BigNumber(faker.datatype.number({ min: 1, max: 5 })),
        };
      }),
    };
  }
}
