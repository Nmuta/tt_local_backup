using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;

namespace Turn10.LiveOps.StewardTest.Unit.JsonConverters
{
    [TestClass]
    public sealed class StringFlagsEnumConverterTests
    {
        [TestMethod]
        [UnitTest]
        public void Serialization_RoundTrip_WithDefaultValue()
        {
            // Arrange.
            var initial = default(AuctionDataAuctionAction);

            // Act.
            var serialized = JsonConvert.SerializeObject(initial);
            var deserialized = JsonConvert.DeserializeObject<AuctionDataAuctionAction>(serialized);

            // Assert.
            Enum.GetValues(typeof(AuctionDataAuctionAction))
                .Cast<AuctionDataAuctionAction>()
                .ToList()
                .ForEach(f =>
                {
                    deserialized.HasFlag(f).Should().Be(initial.HasFlag(f));
                });
            serialized.Should().Contain(default(AuctionDataAuctionAction).ToString());
        }

        [TestMethod]
        [UnitTest]
        public void Serialization_RoundTrip_WithSingleValue()
        {
            // Arrange.
            var initial = AuctionDataAuctionAction.ResolveWon;

            // Act.
            var serialized = JsonConvert.SerializeObject(initial);
            var deserialized = JsonConvert.DeserializeObject<AuctionDataAuctionAction>(serialized);

            // Assert.
            Enum.GetValues(typeof(AuctionDataAuctionAction))
                .Cast<AuctionDataAuctionAction>()
                .ToList()
                .ForEach(f =>
                {
                    deserialized.HasFlag(f).Should().Be(initial.HasFlag(f));
                });
            serialized.Should().NotContain(default(AuctionDataAuctionAction).ToString());
        }

        [TestMethod]
        [UnitTest]
        public void Serialization_RoundTrip_WithMultipleValues()
        {
            // Arrange.
            var initial = AuctionDataAuctionAction.ResolveWon | AuctionDataAuctionAction.Cancel;

            // Act.
            var serialized = JsonConvert.SerializeObject(initial);
            var deserialized = JsonConvert.DeserializeObject<AuctionDataAuctionAction>(serialized);

            // Assert.
            Enum.GetValues(typeof(AuctionDataAuctionAction))
                .Cast<AuctionDataAuctionAction>()
                .ToList()
                .ForEach(f =>
                {
                    deserialized.HasFlag(f).Should().Be(initial.HasFlag(f));
                });
            serialized.Should().NotContain(default(AuctionDataAuctionAction).ToString());
        }
    }
}
