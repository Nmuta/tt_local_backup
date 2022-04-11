﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Gravity;

namespace Turn10.LiveOps.StewardTest.Unit.Gravity
{
    [TestClass]
    public sealed class GravityGiftHistoryProviderTests
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
            var requesterObjectId = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();
            var gift = Fixture.Create<GravityGift>();

            // Act.
            Func<Task> act = async () =>
                await provider.UpdateGiftHistoryAsync(id, title, requesterObjectId, antecedent, gift).ConfigureAwait(false);

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
            var requesterObjectId = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();
            var gift = Fixture.Create<GravityGift>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateGiftHistoryAsync(null, title, requesterObjectId, antecedent, gift).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(TestConstants.Empty, title, requesterObjectId, antecedent, gift).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(TestConstants.WhiteSpace, title, requesterObjectId, antecedent, gift).ConfigureAwait(false)
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
            var requesterObjectId = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();
            var gift = Fixture.Create<GravityGift>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateGiftHistoryAsync(id, null, requesterObjectId, antecedent, gift).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(id, TestConstants.Empty, requesterObjectId, antecedent, gift).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(id, TestConstants.WhiteSpace, requesterObjectId, antecedent, gift).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "title"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateGiftHistoryAsync_WithNullEmptyWhitespaceRequesterObjectId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var id = Fixture.Create<string>();
            var title = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();
            var gift = Fixture.Create<GravityGift>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateGiftHistoryAsync(id, title, null, antecedent, gift).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(id, title, TestConstants.Empty, antecedent, gift).ConfigureAwait(false),
                async () => await provider.UpdateGiftHistoryAsync(id, title, TestConstants.WhiteSpace, antecedent, gift).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requesterObjectId"));
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
            var requesterObjectId = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();

            // Act.
            Func<Task> action = async () => await provider.UpdateGiftHistoryAsync(id, title, requesterObjectId, antecedent, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGiftHistoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var id = Fixture.Create<string>();
            var title = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();
            var startDate = Fixture.Create<DateTimeOffset>();
            var endDate = startDate.AddDays(10);

            // Act.
            async Task<IList<GravityGiftHistory>> Action() => await provider.GetGiftHistoriesAsync(id, title, antecedent, startDate, endDate).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<GravityGiftHistory>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetGiftHistoryAsync_WithNullEmptyWhitespaceId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var title = Fixture.Create<string>();
            var antecedent = Fixture.Create<GiftIdentityAntecedent>();
            var startDate = Fixture.Create<DateTimeOffset>();
            var endDate = startDate.AddDays(10);

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetGiftHistoriesAsync(null, title, antecedent, startDate, endDate).ConfigureAwait(false),
                async () => await provider.GetGiftHistoriesAsync(TestConstants.WhiteSpace, title, antecedent, startDate, endDate).ConfigureAwait(false),
                async () => await provider.GetGiftHistoriesAsync(TestConstants.WhiteSpace, title, antecedent, startDate, endDate).ConfigureAwait(false)
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
            var startDate = Fixture.Create<DateTimeOffset>();
            var endDate = startDate.AddDays(10);

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetGiftHistoriesAsync(id, null, antecedent, startDate, endDate).ConfigureAwait(false),
                async () => await provider.GetGiftHistoriesAsync(id, TestConstants.Empty, antecedent, startDate, endDate).ConfigureAwait(false),
                async () => await provider.GetGiftHistoriesAsync(id, TestConstants.WhiteSpace, antecedent, startDate, endDate).ConfigureAwait(false)
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

            public GravityGiftHistoryProvider Build() => new GravityGiftHistoryProvider(this.KustoStreamingLogger, this.KustoProvider, this.Configuration);
        }
    }
}
