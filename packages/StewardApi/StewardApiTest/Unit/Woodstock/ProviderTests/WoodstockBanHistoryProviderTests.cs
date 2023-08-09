using AutoFixture;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ProviderTests
{
    [TestClass]
    public sealed class WoodstockBanHistoryProviderTests
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
        public void UpdateBanHistoryAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var banEntryId = Fixture.Create<int>();
            var title = Fixture.Create<string>();
            var requesterObjectId = Fixture.Create<string>();
            var banParameters = Fixture.Create<V2BanParametersInput>();
            var banResult = Fixture.Create<BanResult>();
            var endpoint = Fixture.Create<string>();
            var featureAreas = Fixture.Create<string>();

            // Act.
            Func<Task> act = async () => await provider.UpdateBanHistoryAsync(xuid, banEntryId, title, requesterObjectId, banParameters, banResult, endpoint, featureAreas).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateBanHistoryAsync_WithNullEmptyWhitespaceTitle_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var banEntryId = Fixture.Create<int>();
            var requesterObjectId = Fixture.Create<string>();
            var banParameters = Fixture.Create<V2BanParametersInput>();
            var banResult = Fixture.Create<BanResult>();
            var endpoint = Fixture.Create<string>();
            var featureAreas = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateBanHistoryAsync(xuid, banEntryId, null, requesterObjectId, banParameters, banResult, endpoint, featureAreas).ConfigureAwait(false),
                async () => await provider.UpdateBanHistoryAsync(xuid, banEntryId, TestConstants.Empty, requesterObjectId, banParameters, banResult, endpoint, featureAreas).ConfigureAwait(false),
                async () => await provider.UpdateBanHistoryAsync(xuid, banEntryId, TestConstants.WhiteSpace, requesterObjectId, banParameters, banResult, endpoint, featureAreas).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "title"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateBanHistoryAsync_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var banEntryId = Fixture.Create<int>();
            var title = Fixture.Create<string>();
            var banParameters = Fixture.Create<V2BanParametersInput>();
            var banResult = Fixture.Create<BanResult>();
            var endpoint = Fixture.Create<string>();
            var featureAreas = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateBanHistoryAsync(xuid, banEntryId, title, null, banParameters, banResult, endpoint, featureAreas).ConfigureAwait(false),
                async () => await provider.UpdateBanHistoryAsync(xuid, banEntryId, title, TestConstants.Empty, banParameters, banResult, endpoint, featureAreas).ConfigureAwait(false),
                async () => await provider.UpdateBanHistoryAsync(xuid, banEntryId, title, TestConstants.WhiteSpace, banParameters, banResult, endpoint, featureAreas).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requesterObjectId"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateBanHistoryAsync_WithNullBanParameters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var banEntryId = Fixture.Create<int>();
            var title = Fixture.Create<string>();
            var requesterObjectId = Fixture.Create<string>();
            var banResult = Fixture.Create<BanResult>();
            var endpoint = Fixture.Create<string>();
            var featureAreas = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.UpdateBanHistoryAsync(xuid, banEntryId, title, requesterObjectId, null, banResult, endpoint, featureAreas).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banParameters"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetBanHistoriesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var title = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<LiveOpsBanHistory>> Action() => await provider.GetBanHistoriesAsync(xuid, title, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<LiveOpsBanHistory>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetBanHistoriesAsync_WithNullEmptyWhitespaceTitle_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetBanHistoriesAsync(xuid, null, endpoint).ConfigureAwait(false),
                async () => await provider.GetBanHistoriesAsync(xuid, TestConstants.Empty, endpoint).ConfigureAwait(false),
                async () => await provider.GetBanHistoriesAsync(xuid, TestConstants.WhiteSpace, endpoint).ConfigureAwait(false)
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

            public WoodstockBanHistoryProvider Build() => new WoodstockBanHistoryProvider(this.KustoStreamingLogger, this.KustoProvider, this.Configuration);
        }
    }
}
