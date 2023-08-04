using System;
using System.Collections.Generic;
using PlayFab.MultiplayerModels;

#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.PlayFab
{
    public class PlayFabTransactionOperation
    {
        public int? Amount;

        public string ItemId;

        public string ItemType;

        public string StackId;

        public string Type;
    }
}
