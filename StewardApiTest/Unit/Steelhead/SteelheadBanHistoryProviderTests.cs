using System;
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
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;

namespace Turn10.LiveOps.StewardTest.Unit.Steelhead
{
    [TestClass]
    public sealed class SteelheadBanHistoryProviderTests
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
            var title = Fixture.Create<string>();
            var requestingAgent = Fixture.Create<string>();
            var banParameters = Fixture.Create<SteelheadBanParameters>();

            // Act.
            Func<Task> act = async () => await provider.UpdateBanHistoryAsync(xuid, title, requestingAgent, banParameters).ConfigureAwait(false);

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
            var requestingAgent = Fixture.Create<string>();
            var banParameters = Fixture.Create<SteelheadBanParameters>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateBanHistoryAsync(xuid, null, requestingAgent, banParameters).ConfigureAwait(false),
                async () => await provider.UpdateBanHistoryAsync(xuid, TestConstants.Empty, requestingAgent, banParameters).ConfigureAwait(false),
                async () => await provider.UpdateBanHistoryAsync(xuid, TestConstants.WhiteSpace, requestingAgent, banParameters).ConfigureAwait(false)
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
            var title = Fixture.Create<string>();
            var banParameters = Fixture.Create<SteelheadBanParameters>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateBanHistoryAsync(xuid, title, null, banParameters).ConfigureAwait(false),
                async () => await provider.UpdateBanHistoryAsync(xuid, title, TestConstants.Empty, banParameters).ConfigureAwait(false),
                async () => await provider.UpdateBanHistoryAsync(xuid, title, TestConstants.WhiteSpace, banParameters).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateBanHistoryAsync_WithNullBanParameters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var title = Fixture.Create<string>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.UpdateBanHistoryAsync(xuid, title, requestingAgent, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banParameters"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetBanHistoriesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var title = Fixture.Create<string>();

            // Act.
            Func<Task<IList<LiveOpsBanHistory>>> act = async () => await provider.GetBanHistoriesAsync(xuid, title).ConfigureAwait(false);

            // Assert.
            act().Result.Should().BeOfType<List<LiveOpsBanHistory>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetBanHistoriesAsync_WithNullEmptyWhitespaceTitle_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetBanHistoriesAsync(xuid, null).ConfigureAwait(false),
                async () => await provider.GetBanHistoriesAsync(xuid, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetBanHistoriesAsync(xuid, TestConstants.WhiteSpace).ConfigureAwait(false)
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

            public SteelheadBanHistoryProvider Build() => new SteelheadBanHistoryProvider(this.KustoStreamingLogger, this.KustoProvider, this.Configuration);
        }
    }
}
