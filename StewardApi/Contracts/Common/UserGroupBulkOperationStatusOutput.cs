using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a user group bulk operation status.
    /// </summary>
    #pragma warning disable CS1591
    #pragma warning disable SA1600
    public class UserGroupBulkOperationStatusOutput
    {
        public int? UserGroupId { get; set; }

        public Guid? BlobId { get; set; }

        public int Completed { get; set; }

        public int Remaining { get; set; }

        public UserGroupBulkOperationType? BulkOperationType { get; set; }

        public UserGroupBulkOperationStatus? Status { get; set; }
    }
}
