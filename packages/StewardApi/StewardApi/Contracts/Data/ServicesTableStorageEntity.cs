using System;
using Newtonsoft.Json.Linq;

#pragma warning disable SA1600 // Elements should be documented
namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    public class ServicesTableStorageEntity
    {
        public ServicesTableStorageEntity(string rowKey, string partitionKey, DateTimeOffset timestampUtc, JObject properties)
        {
            RowKey = rowKey;
            PartitionKey = partitionKey;
            TimestampUtc = timestampUtc;
            Properties = properties;
        }

        public string RowKey { get; set; }

        public string PartitionKey { get; set; }

        public DateTimeOffset TimestampUtc { get; set; }

        public JObject Properties { get; set; }
    }
}
