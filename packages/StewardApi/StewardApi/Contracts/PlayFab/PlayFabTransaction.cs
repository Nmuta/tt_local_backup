﻿using System;
using System.Collections.Generic;
using PlayFab.EconomyModels;

#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.PlayFab
{
    public class PlayFabTransaction
    {
        public string ItemType { get; set; }

        public List<PlayFabTransactionOperation> Operations { get; set; }

        public string OperationType { get; set; }

        public TransactionPurchaseDetails PurchaseDetails { get; set; }

        public TransactionRedeemDetails RedeemDetails { get; set; }

        public DateTime TimestampUtc { get; set; }

        public string TransactionId { get; set; }

        public TransactionTransferDetails TransferDetails { get; set; }
    }
}
