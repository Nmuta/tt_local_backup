using System;

#pragma warning disable SA1516 // Blank Lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    public sealed class StewardActionLog
    {
        public string Id { get; set; }
        public string Action { get; set; }
        public string Subject { get; set; }
        public string RequestPath { get; set; }
        public string RequesterObjectId { get; set; }
        public string RequesterRole { get; set; }
        public string HttpMethod { get; set; }
        public string RouteData { get; set; }
        //public string RecipientId { get; set; }
        //public string RecipientType { get; set; }
        public string Title { get; set; }
        public string Endpoint { get; set; }
        public DateTime CreatedDateUtc { get; set; }
        public string BatchReferenceId { get; set; }
        public string Metadata { get; set; }
    }
}
