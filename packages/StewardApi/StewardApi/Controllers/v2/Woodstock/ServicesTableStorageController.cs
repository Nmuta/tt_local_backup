using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Data;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>
    ///     Controller for Services table storage.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/servicesTableStorage")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Topic.TableStorage, Target.Lsp)]
    public class ServicesTableStorageController : V2WoodstockControllerBase
    {
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ServicesTableStorageController"/> class for Woodstock.
        /// </summary>
        public ServicesTableStorageController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets table storage.
        /// </summary>
        [HttpGet("player/{xuid}/externalProfileId/{externalProfileId}")]
        [SwaggerResponse(200, type: typeof(IList<ServicesTableStorageEntity>))]
        public async Task<IActionResult> GetTableStorageConfig(ulong xuid, string externalProfileId, [FromQuery] bool filterResults = true)
        {
            if (!Guid.TryParse(externalProfileId, out var externalProfileIdGuid))
            {
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: (externalProfileId: {externalProfileId})");
            }

            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            var xuidAndProfId = xuid.ToInvariantString() + '_' + externalProfileId;

            var response = await this.Services.ConfigurationManagementService.GetTableConfiguration().ConfigureAwait(true);
            var connectionStrings = response.tableConfiguration.tBaseConnectionStrings;
            var tableName = this.GetTableName(response.tableConfiguration.instanceName);

            var tableProviderFactory = new TableProviderFactory(connectionStrings, tableName, null);

            var atp = tableProviderFactory.GetAzureTableProvider();

            var xuidResponse = await atp.RetrieveAllFromPartitionAsync<DynamicTableEntity>(xuid.ToInvariantString()).ConfigureAwait(true);
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

            // Some results have the external profile ID as part of the row key instead of the partition key.
            // If that guid doesn't match the external profile ID we're using, we need to filter them out.
            var guidPattern = @"([a-f0-9]{8}[-][a-f0-9]{4}[-][a-f0-9]{4}[-][a-f0-9]{4}[-][a-f0-9]{12})";

            var filteredResponse = filterResults ? finalResponse.Where(entry =>
            {
                var rowKeyGuids = Regex.Matches(entry.RowKey, guidPattern);
                var partitionKeyGuids = Regex.Matches(entry.PartitionKey, guidPattern);
                var rowKeyContainsGuid = rowKeyGuids.Count > 0;
                var partitionKeyNoGuid = partitionKeyGuids.Count == 0;
                var rowKeyGuidMatchProfileId = rowKeyGuids.All(guid => guid.Value == externalProfileIdGuid.ToString());

                if (rowKeyContainsGuid && partitionKeyNoGuid && !rowKeyGuidMatchProfileId)
                {
                    return false;
                }

                return true;
            }) : finalResponse;

            return this.Ok(filteredResponse);
        }

        private string GetTableName(string instanceName)
        {
            var invalidTableNameCharacters = new Regex("[^a-zA-Z0-9]");
            if (!string.IsNullOrEmpty(instanceName))
            {
                return invalidTableNameCharacters.Replace(instanceName, string.Empty).ToLowerInvariant();
            }
            else
            {
                return invalidTableNameCharacters.Replace(Environment.MachineName, string.Empty).ToLowerInvariant();
            }
        }

        private JToken EntityPropertyDeserializer(EntityProperty property)
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
