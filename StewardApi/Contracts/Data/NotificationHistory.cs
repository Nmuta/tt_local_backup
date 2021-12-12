using System;
using System.Data;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Kusto)
#pragma warning disable CS1591 // XML Comments (POCO mapped from Kusto)

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a notification history.
    /// </summary>
    public sealed class NotificationHistory
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public string Message { get; set; }

        public string RequesterObjectId { get; set; }

        public string RecipientId { get; set; }

        public string Type { get; set; }

        public string RecipientType { get; set; }

        public string DeviceType { get; set; }

        public string GiftType { get; set; }

        public string BatchReferenceId { get; set; }

        public string Action { get; set; }

        public string Endpoint { get; set; }

        public DateTime CreatedDateUtc { get; set; }

        public DateTime ExpireDateUtc { get; set; }

        /// <remarks>Used for tracking human friendly data for PowerBi, use chars to split metadata info.</remarks>
        public string Metadata { get; set; }

        /// <summary>
        ///     Makes a query for ban history that this model can read.
        /// </summary>
        public static string MakeQuery(string notificationId, string title, string endpoint)
        {
            return $"NotificationHistory | where Id == '{notificationId}' and Title == '{title}' and Endpoint == '{endpoint}' | project Id, Title, Message, RequesterObjectId, RecipientId, Type, RecipientType, DeviceType, GiftType, BatchReferenceId, Action, Endpoint, CreatedDateUtc, ExpireDateUtc, column_ifexists('Metadata', '')";
        }

        /// <summary>
        ///     Parses query results into a notification history object.
        /// </summary>
        public static NotificationHistory FromQueryResult(IDataReader reader)
        {
            return new NotificationHistory
            {
                Id = reader.Get<string>(nameof(Id)),
                Title = reader.Get<string>(nameof(Title)),
                Message = reader.Get<string>(nameof(Message)),
                RequesterObjectId = reader.Get<string>(nameof(RequesterObjectId)),
                RecipientId = reader.Get<string>(nameof(RecipientId)),
                Type = reader.Get<string>(nameof(Type)),
                RecipientType = reader.Get<string>(nameof(RecipientType)),
                DeviceType = reader.Get<string>(nameof(DeviceType)),
                GiftType = reader.Get<string>(nameof(GiftType)),
                BatchReferenceId = reader.Get<string>(nameof(BatchReferenceId)),
                Action = reader.Get<string>(nameof(Action)),
                Endpoint = reader.Get<string>(nameof(Endpoint)),
                CreatedDateUtc = reader.Get<DateTime>(nameof(CreatedDateUtc)),
                ExpireDateUtc = reader.Get<DateTime>(nameof(ExpireDateUtc)),
                Metadata = reader.Get<string>(nameof(Metadata)),
            };
        }
    }
}
