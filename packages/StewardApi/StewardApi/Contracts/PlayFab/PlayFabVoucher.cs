using System;
using System.Collections.Generic;

#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.PlayFab
{
    /// <summary>
    ///     PlayFab voucher
    /// </summary>
    public class PlayFabVoucher
    {
        public string ContentType { get; set; }

        public Dictionary<string, string> Description { get; set; }

        public DateTime? EndDate { get; set; }

        public string Id { get; set; }

        public DateTime? StartDate { get; set; }

        public Dictionary<string, string> Title { get; set; }

        public string Type { get; set; }
    }
}
