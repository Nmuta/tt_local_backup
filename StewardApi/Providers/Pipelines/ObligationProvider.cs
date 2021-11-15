using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Pipelines;
using Turn10.LiveOps.StewardApi.Obligation;
using Turn10.LiveOps.StewardApi.Obligation.UpstreamModels;

namespace Turn10.LiveOps.StewardApi.Providers.Pipelines
{
    /// <inheritdoc />
    public sealed class ObligationProvider : IObligationProvider
    {
        private readonly IObligationAuthoringClient obligationAuthoringClient;

        private readonly ConfigQualifier configQualifier = new ConfigQualifier
        {
            Cluster = Clusters.Turn10GDE,
            Tenant = "turn10",
            Attitude = "developer"
        };

        private readonly IList<ObligationPrincipal> standardPrincipals = new List<ObligationPrincipal>
        {
            new ObligationPrincipal("emersonf@microsoft.com", PrincipalTypes.User, Roles.Admin),
            new ObligationPrincipal("mharri@microsoft.com", PrincipalTypes.User, Roles.Reader),
            new ObligationPrincipal("miahern@microsoft.com", PrincipalTypes.User, Roles.Reader),
            new ObligationPrincipal("47aa81e5-aed4-4d42-b4d6-9f0eca08cc68", PrincipalTypes.Group, Roles.Admin)
        };

        /// <summary>
        ///     Initializes a new instance of the <see cref="ObligationProvider"/> class.
        /// </summary>
        public ObligationProvider(IObligationAuthoringClient obligationAuthoringClient)
        {
            obligationAuthoringClient.ShouldNotBeNull(nameof(obligationAuthoringClient));

            this.obligationAuthoringClient = obligationAuthoringClient;
        }

        /// <inheritdoc/>
        public async Task<IList<ObligationPipelinePartial>> GetPipelinesAsync()
        {
            return await this.obligationAuthoringClient.GetPipelinesAsync().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<Guid> SafeUpdatePipelineAsync(SimplifiedObligationPipeline obligationPipeline)
        {
            var pipeline = this.BuildPipeline(obligationPipeline);

            var response = await this.obligationAuthoringClient.SafeUpdatePipelineAsync(pipeline).ConfigureAwait(false);

            return response;
        }

        /// <inheritdoc/>
        public async Task<Guid> UpsertPipelineAsync(SimplifiedObligationPipeline obligationPipeline, bool requireNew)
        {
            var pipeline = this.BuildPipeline(obligationPipeline);

            var response = await this.obligationAuthoringClient.UpsertPipelineAsync(pipeline, requireNew: requireNew).ConfigureAwait(false);

            return response;
        }

        /// <inheritdoc/>
        public async Task<Guid> DeletePipelineAsync(string pipelineName)
        {
            pipelineName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(pipelineName));

            var result = await this.obligationAuthoringClient.DeletePipelineAsync(pipelineName).ConfigureAwait(false);

            return result;
        }

        /// <inheritdoc/>
        public async Task<SimplifiedObligationPipeline> GetPipelineAsync(string pipelineName)
        {
            var result = await this.obligationAuthoringClient.GetPipelineAsync(pipelineName).ConfigureAwait(false);
            var kustoDataActivities = result.DataActivities
                .OfType<KustoDataActivity>()
                .Select(resultDataActivity =>
                    new ObligationKustoDataActivity
                    {
                        ActivityName = resultDataActivity.Name,
                        KustoTableName = resultDataActivity.KustoTable,
                        KustoFunction = BuildKustoFunction(resultDataActivity.KustoQuery, resultDataActivity.NumBucketsPreSplitHint),
                        DestinationDatabase = resultDataActivity.KustoDatabase,
                        StartDateUtc = resultDataActivity.TimeRange.Start.UtcDateTime,
                        EndDateUtc = resultDataActivity.TimeRange.End.UtcDateTime,
                        MaxExecutionSpan = resultDataActivity.MaxExecutionSpan,
                        ExecutionInterval = resultDataActivity.ExecutionInterval,
                        ExecutionDelay = resultDataActivity.Delay,
                        IsTimeAgnostic = resultDataActivity.IsTimeAgnostic,
                        DataActivityDependencyNames = resultDataActivity.Dependencies?.Select(d => d.DataActivityDependencyName).ToList(),
                        ParallelismLimit = resultDataActivity.ParallelismLimitTags.Select(p => p.Limit).FirstOrDefault(),
                        CreationBehavior = resultDataActivity.CreationBehavior,
                    })
                .ToList();

            var kustoRestatOMaticDataActivities = result.DataActivities
                .OfType<KustoRestateOMaticDataActivity>()
                .Select(resultDataActivity =>
                    new ObligationKustoRestateOMaticDataActivity
                    {
                        ActivityName = resultDataActivity.Name,
                        KustoFunction = BuildKustoFunction(resultDataActivity.KustoQuery, resultDataActivity.NumBucketsPreSplitHint),
                        DestinationDatabase = resultDataActivity.KustoDatabase,
                        StartDateUtc = resultDataActivity.TimeRange.Start.UtcDateTime,
                        EndDateUtc = resultDataActivity.TimeRange.End.UtcDateTime,
                        MaxExecutionSpan = resultDataActivity.MaxExecutionSpan,
                        ExecutionInterval = resultDataActivity.ExecutionInterval,
                        ExecutionDelay = resultDataActivity.Delay,
                        DataActivityDependencyNames = resultDataActivity.Dependencies?.Select(d => d.DataActivityDependencyName).ToList(),
                        ParallelismLimit = resultDataActivity.ParallelismLimitTags.Select(p => p.Limit).FirstOrDefault(),
                        IncludeChildren = resultDataActivity.IncludeChildren,
                        TargetDataActivity = resultDataActivity.TargetDataActivity,
                        KustoDatabase = resultDataActivity.KustoDatabase,
                        KustoQuery = resultDataActivity.KustoQuery,
                        CreationBehavior = resultDataActivity.CreationBehavior,
                    })
                .ToList();

            var obligationRequest = new SimplifiedObligationPipeline
            {
                PipelineName = result.Name,
                PipelineDescription = result.Description,
                KustoDataActivities = kustoDataActivities,
                KustoRestateOMaticDataActivities = kustoRestatOMaticDataActivities,
                Principals = result.Principals
                    .Where(resultPrincipal => !this.standardPrincipals.Select(s => s.Value).Contains(resultPrincipal.Value)).ToList()
            };

            return obligationRequest;
        }

        /// <inheritdoc/>
        public async Task<Guid> RenamePipelineAsync(PatchOperation patchOperation)
        {
            var response = await this.obligationAuthoringClient.RenamePipelineAsync(patchOperation).ConfigureAwait(false);

            return response;
        }

        private static string BuildInitializationQuery(ObligationKustoDataActivity obligationPipeline)
        {
            var queryBase = $".set-or-append {obligationPipeline.KustoTableName} <| {obligationPipeline.KustoFunction.Name}(now()";
            var stringBuilder = new StringBuilder();
            stringBuilder.Append(queryBase);

            if (obligationPipeline.KustoFunction.UseEndDate)
            {
                stringBuilder.Append(", now()");
            }

            if (obligationPipeline.KustoFunction.UseSplitting)
            {
                stringBuilder.Append(", 1, 0");
            }

            stringBuilder.Append(" ) | take 0");

            var initializationQuery = stringBuilder.ToString();

            return initializationQuery;
        }

        private static KustoFunction BuildKustoFunction(string query, int? numBucketsPreSplitHint)
        {
            var regex = new Regex(@"^(\w+)\((.*?)\)$");
            var regexResult = regex.Match(query);
            if (regexResult.Success)
            {
                var name = regexResult.Groups[1].Value;
                var parameters = regexResult.Groups[2].Value;
                return new KustoFunction
                {
                    Name = name,
                    MakeFunctionCall = true,
                    UseSplitting = parameters.Contains("NumBuckets", StringComparison.OrdinalIgnoreCase),
                    UseEndDate = parameters.Contains("EndDate", StringComparison.OrdinalIgnoreCase),
                    NumberOfBuckets = numBucketsPreSplitHint,
                };
            }

            return new KustoFunction
            {
                Name = query,
                MakeFunctionCall = true,
                UseSplitting = false,
                UseEndDate = false,
                NumberOfBuckets = numBucketsPreSplitHint,
            };
        }

        private static string BuildFunctionDefinition(KustoFunction kustoFunction)
        {
            if (!kustoFunction.MakeFunctionCall)
            {
                return kustoFunction.Name;
            }

            var stringBuilder = new StringBuilder();
            stringBuilder.Append(kustoFunction.Name);
            stringBuilder.Append("(datetime('{StartDate:o}')");

            if (kustoFunction.UseEndDate)
            {
                stringBuilder.Append(", datetime('{EndDate:o}') ");
            }

            if (kustoFunction.UseSplitting)
            {
                stringBuilder.Append(", {NumBuckets}, {Bucket}");
            }

            stringBuilder.Append(')');

            var functionDefinition = stringBuilder.ToString();

            return functionDefinition;
        }

        private static List<Dependency> BuildDependencies(IList<string> dependencyNames)
        {
            return dependencyNames?.Select(d => new Dependency("striped_on_sealed", d)).ToList();
        }

        private ObligationPipeline BuildPipeline(SimplifiedObligationPipeline obligationRequest)
        {
            var principals = obligationRequest.Principals?.ToList() ?? new List<ObligationPrincipal>();

            principals.AddRange(this.standardPrincipals);

            var pipeline = new ObligationPipeline
            {
                ConfigContext = this.configQualifier,
                Name = obligationRequest.PipelineName,
                Description = obligationRequest.PipelineDescription,
                Principals = principals,
                DataActivities = new List<DataActivityBase>()
            };

            foreach (var obligationDataActivity in obligationRequest.KustoDataActivities)
            {
                var startDate = new DateTimeOffset(obligationDataActivity.StartDateUtc);
                var endDate = new DateTimeOffset(obligationDataActivity.EndDateUtc);

                var dataActivity = new KustoDataActivity
                {
                    Name = obligationDataActivity.ActivityName,
                    MinExecutionSpan = obligationDataActivity.ExecutionInterval,
                    MaxExecutionSpan = obligationDataActivity.MaxExecutionSpan,
                    ExecutionInterval = obligationDataActivity.ExecutionInterval,
                    IsTimeAgnostic = obligationDataActivity.IsTimeAgnostic,
                    Delay = obligationDataActivity.ExecutionDelay,
                    TimeRange = new TimeRange(startDate, endDate),
                    KustoDatabase = obligationDataActivity.DestinationDatabase,
                    KustoTable = obligationDataActivity.KustoTableName,
                    KustoQuery = BuildFunctionDefinition(obligationDataActivity.KustoFunction),
                    InitializationQuery = BuildInitializationQuery(obligationDataActivity),
                    NumBucketsPreSplitHint = obligationDataActivity.KustoFunction.NumberOfBuckets,
                    Dependencies = BuildDependencies(obligationDataActivity.DataActivityDependencyNames),
                    CreationBehavior = obligationDataActivity.CreationBehavior,
                }.AddParallelismLimit(obligationDataActivity.ParallelismLimit, this.configQualifier.Tenant, obligationRequest.PipelineName);

                pipeline.DataActivities.Add(dataActivity);
            }

            foreach (var obligationRestateOMaticDataActivity in obligationRequest.KustoRestateOMaticDataActivities)
            {
                var startDate = new DateTimeOffset(obligationRestateOMaticDataActivity.StartDateUtc);
                var endDate = new DateTimeOffset(obligationRestateOMaticDataActivity.EndDateUtc);

                var dataActivity = new KustoRestateOMaticDataActivity
                {
                    Name = obligationRestateOMaticDataActivity.ActivityName,
                    MinExecutionSpan = obligationRestateOMaticDataActivity.ExecutionInterval,
                    MaxExecutionSpan = obligationRestateOMaticDataActivity.MaxExecutionSpan,
                    ExecutionInterval = obligationRestateOMaticDataActivity.ExecutionInterval,
                    Delay = obligationRestateOMaticDataActivity.ExecutionDelay,
                    TimeRange = new TimeRange(startDate, endDate),
                    KustoDatabase = obligationRestateOMaticDataActivity.DestinationDatabase,
                    KustoQuery = BuildFunctionDefinition(obligationRestateOMaticDataActivity.KustoFunction),
                    NumBucketsPreSplitHint = obligationRestateOMaticDataActivity.KustoFunction.NumberOfBuckets,
                    Dependencies = BuildDependencies(obligationRestateOMaticDataActivity.DataActivityDependencyNames),
                    IncludeChildren = obligationRestateOMaticDataActivity.IncludeChildren,
                    TargetDataActivity = obligationRestateOMaticDataActivity.TargetDataActivity,
                    CreationBehavior = obligationRestateOMaticDataActivity.CreationBehavior,
                }.AddParallelismLimit(
                    obligationRestateOMaticDataActivity.ParallelismLimit,
                    this.configQualifier.Tenant,
                    obligationRequest.PipelineName);

                pipeline.DataActivities.Add(dataActivity);
            }

            return pipeline;
        }
    }
}
