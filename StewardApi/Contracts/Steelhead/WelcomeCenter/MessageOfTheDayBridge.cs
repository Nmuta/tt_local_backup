#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Message of the Day response object.
    /// </summary>
    public class MessageOfTheDayBridge
    {
        public string FriendlyMessageName { get; set; }

        public LocTextBridge TitleHeader { get; set; }

        public LocTextBridge ContentHeader { get; set; }

        public LocTextBridge ContentBody { get; set; }

        public string ContentImagePath { get; set; }

        public string Date { get; set; }
    }
}
