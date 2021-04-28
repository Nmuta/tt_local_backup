﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;

namespace Turn10.LiveOps.StewardTest.Unit.Steelhead
{
    [TestClass]
    public sealed class SteelheadGiftHistoryProviderTests
    {
        private static readonly Fixture Fixture = new Fixture();

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_DoesNotThrow()
        {
            // Arrange.
            var dependencies = new Dependencies();

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenKustoStreamingLoggerNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { KustoStreamingLogger = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "kustoStreamingLogger"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenKustoProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { KustoProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "kustoProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenConfigurationValuesNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies(false);

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentException>().WithMessage($"{TestConstants.ArgumentExceptionMissingSettingMessagePartial}{ConfigurationKeyConstants.KustoLoggerDatabase}");
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateGiftHistoryAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var id = Fixture.Create<string>();
            var title = Fixture.Create<string>();
            var requestingAgent = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();
            var giftInventory = Fixture.Create<SteelheadGift>();

            // Act.
            Func<Task> act = async () =>
                await provider.UpdateGiftHistoryAsync(id, title, requestingAgent, antecedent, giftInventory).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateGiftHistoryAsync_WithNullEmptyWhitespaceId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var title = Fixture.Create<string>();
            var requestingAgent = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();
            var giftInventory = Fixture.Create<SteelheadGift>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateGiftHistoryAsync(null, title, requestingAgent, antecedent, giftInventory).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(TestConstants.Empty, title, requestingAgent, antecedent, giftInventory).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(TestConstants.WhiteSpace, title, requestingAgent, antecedent, giftInventory).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateGiftHistoryAsync_WithNullEmptyWhitespaceTitle_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var id = Fixture.Create<string>();
            var requestingAgent = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();
            var giftInventory = Fixture.Create<SteelheadGift>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateGiftHistoryAsync(id, null, requestingAgent, antecedent, giftInventory).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(id, TestConstants.Empty, requestingAgent, antecedent, giftInventory).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(id, TestConstants.WhiteSpace, requestingAgent, antecedent, giftInventory).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "title"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateGiftHistoryAsync_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var id = Fixture.Create<string>();
            var title = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();
            var giftInventory = Fixture.Create<SteelheadGift>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateGiftHistoryAsync(id, title, null, antecedent, giftInventory).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(id, title, TestConstants.Empty, antecedent, giftInventory).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(id, title, TestConstants.WhiteSpace, antecedent, giftInventory).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateGiftHistoryAsync_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var id = Fixture.Create<string>();
            var title = Fixture.Create<string>();
            var requestingAgent = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();

            // Act.
            Func<Task> action = async () => await provider.UpdateGiftHistoryAsync(id, title, requestingAgent, antecedent, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetGiftHistoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var id = Fixture.Create<string>();
            var title = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();

            // Act.
            Func<Task<IList<SteelheadGiftHistory>>> act = async () =>
                await provider.GetGiftHistoriesAsync(id, title, antecedent).ConfigureAwait(false);

            // Assert.
            act().Result.Should().BeOfType<List<SteelheadGiftHistory>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetGiftHistoryAsync_WithNullEmptyWhitespaceId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var title = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetGiftHistoriesAsync(null, title, antecedent).ConfigureAwait(false),
                async () => await provider.GetGiftHistoriesAsync(TestConstants.WhiteSpace, title, antecedent).ConfigureAwait(false),
                async () => await provider.GetGiftHistoriesAsync(TestConstants.WhiteSpace, title, antecedent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetGiftHistoryAsync_WithNullEmptyWhitespaceTitle_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var id = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetGiftHistoriesAsync(id, null, antecedent).ConfigureAwait(false),
                async () => await provider.GetGiftHistoriesAsync(id, TestConstants.Empty, antecedent).ConfigureAwait(false),
                async () => await provider.GetGiftHistoriesAsync(id, TestConstants.WhiteSpace, antecedent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "title"));
            }
        }

        private sealed class Dependencies
        {
            public Dependencies(bool validConfiguration = true)
            {
                if (validConfiguration)
                {
                    this.Configuration[Arg.Any<string>()].Returns(Fixture.Create<string>());
                }
                else
                {
                    this.Configuration[Arg.Any<string>()].ReturnsNull();
                }
            }

            public IKustoStreamingLogger KustoStreamingLogger { get; set; } = Substitute.For<IKustoStreamingLogger>();

            public IKustoProvider KustoProvider { get; set; } = Substitute.For<IKustoProvider>();

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public SteelheadGiftHistoryProvider Build() => new SteelheadGiftHistoryProvider(this.KustoStreamingLogger, this.KustoProvider, this.Configuration);
        }
    }
}
