using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.TeamFoundation.Build.WebApi;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json.Linq;
using SteelheadLiveOpsContent;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.BuildersCup;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.Services.Diagnostics;
using Turn10.Services.Orm;
using Turn10.Services.Storage.Table;
using static Forza.WebServices.FM8.Generated.LiveOpsService;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Services table storage.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/servicesTableStorage")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.TableStorage, Target.Lsp)]
    public class ServicesTableStorageController : V2SteelheadControllerBase
    {
        private readonly IMapper mapper;
        private readonly ISteelheadPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ServicesTableStorageController"/> class for Steelhead.
        /// </summary>
        public ServicesTableStorageController(IMapper mapper, ISteelheadPegasusService pegasusService)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.mapper = mapper;
            this.pegasusService = pegasusService;
        }

        /// <summary>
        ///     Gets table storage.
        /// </summary>
        [HttpGet("player/{xuid}/externalProfileId/{externalProfileId}")]
        [SwaggerResponse(200, type: typeof(IList<ServicesTableStorageEntity>))]
        public async Task<IActionResult> GetTableStorageConfig(ulong xuid, string externalProfileId)
        {
            if (!Guid.TryParse(externalProfileId, out var externalProfileIdGuid))
            {
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: (externalProfileId: {externalProfileId})");
            }

            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            var xuidAndProfId = xuid.ToString() + '_' + externalProfileId;

            try
            {
                var response = await this.Services.ConfigurationManagementService.GetTableConfiguration().ConfigureAwait(true);
                var connectionStrings = response.tableConfiguration.tBaseConnectionStrings;
                var tableName = this.GetTableName(response.tableConfiguration.instanceName);

                var tableProviderFactory = new TableProviderFactory(connectionStrings, tableName, null);

                var atp = tableProviderFactory.GetAzureTableProvider();

                var xuidResponse = await atp.RetrieveAllFromPartitionAsync<DynamicTableEntity>(xuid.ToString()).ConfigureAwait(true);
                var xuidAndProfIdResponse = await atp.RetrieveAllFromPartitionAsync<DynamicTableEntity>(xuidAndProfId).ConfigureAwait(true);

                var combinedResponse = xuidResponse.Concat(xuidAndProfIdResponse);

                var finalResponse = new List<ServicesTableStorageEntity>();
                foreach (var entry in combinedResponse)
                {
                    var properties = new JObject();
                    foreach (var property in entry.Properties)
                    {
                        properties.Add(property.Key, this.EntityPropertyDeserializer(property.Value));
                    }

                    var convertedEntry = new ServicesTableStorageEntity(entry.RowKey, entry.PartitionKey, entry.Timestamp, properties);

                    finalResponse.Add(convertedEntry);
                }

                return this.Ok(finalResponse);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No table storage data found for {TitleConstants.SteelheadFullName}", ex);
            }
        }

        private string GetTableName(string instanceName)
        {
            Regex invalidTableNameCharacters = new Regex("[^a-zA-Z0-9]");
            if (!string.IsNullOrEmpty(instanceName))
            {
                return invalidTableNameCharacters.Replace(instanceName, string.Empty).ToLowerInvariant();
            }
            else
            {
                return invalidTableNameCharacters.Replace(Environment.MachineName, string.Empty).ToLowerInvariant();
            }
        }

        private JToken EntityPropertyDeserializer( EntityProperty property)
        {
            switch (property.PropertyType)
            {
                case EdmType.Binary:
                    return JProperty.FromObject(property.BinaryValue);
                case EdmType.Boolean:
                    return JProperty.FromObject(property.BooleanValue);
                case EdmType.DateTime:
                    return JProperty.FromObject(property.DateTime);
                case EdmType.Double:
                    return JProperty.FromObject(property.DoubleValue);
                case EdmType.Guid:
                    return JProperty.FromObject(property.GuidValue);
                case EdmType.Int32:
                    return JProperty.FromObject(property.Int32Value);
                case EdmType.Int64:
                    return JProperty.FromObject(property.Int64Value);
                case EdmType.String: // Need to do checks for values as strings, as well as arrays/jObject stored as strings.
                    return JProperty.FromObject(property.StringValue);
                default:
                    throw new ConversionFailedStewardException($"Failed to deserialize property value: {property.PropertyAsObject}");
            }
        }
    }
}
