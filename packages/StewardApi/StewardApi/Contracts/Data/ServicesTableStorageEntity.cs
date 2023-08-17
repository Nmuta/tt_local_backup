﻿using System;
using Newtonsoft.Json.Linq;

#pragma warning disable SA1600 // Elements should be documented
namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     DTO for objects stored in Services Table Storage
    /// </summary>
    public class ServicesTableStorageEntity
    {
        public ServicesTableStorageEntity(string rowKey, string partitionKey, DateTimeOffset timestampUtc, JObject properties)
        {
            this.RowKey = rowKey;
            this.PartitionKey = partitionKey;
            this.TimestampUtc = timestampUtc;
            this.Properties = properties;
        }

        public string RowKey { get; set; }

        public string PartitionKey { get; set; }

        public DateTimeOffset TimestampUtc { get; set; }

        public JObject Properties { get; set; }
    }
}
