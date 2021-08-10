using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH4.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Sunrise
{
    [TestClass]
    public sealed class SunriseServiceManagementProviderTests
    {
        private static readonly Fixture Fixture = new Fixture();

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSunriseServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SunriseService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sunriseService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenMapperNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { Mapper = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "mapper"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetLspGroupsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IList<LspGroup>> Action() => await provider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<LspGroup>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetLspGroupsAsync_WithNegativeStartIndex_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var startIndex = -1;
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IList<LspGroup>>> action = async () => await provider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(startIndex), -1, startIndex));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetLspGroupsAsync_WithInvalidMaxResults_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var startIndex = Fixture.Create<int>();
            var maxResults = -1;

            // Act.
            Func<Task<IList<LspGroup>>> action = async () => await provider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetAuctionBlocklistAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IList<AuctionBlocklistEntry>> Action() => await provider.GetAuctionBlocklistAsync(maxResults).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<AuctionBlocklistEntry>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetAuctionBlocklistAsync_WithInvalidMaxResults_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var maxResults = -1;

            // Act.
            Func<Task<IList<AuctionBlocklistEntry>>> action = async () => await provider.GetAuctionBlocklistAsync(maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void AddAuctionBlocklistEntriesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var blocklistEntries = Fixture.Create<IList<AuctionBlocklistEntry>>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.AddAuctionBlocklistEntriesAsync(blocklistEntries).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void AddAuctionBlocklistEntriesAsync_WithNullBlocklistEntries_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.AddAuctionBlocklistEntriesAsync(null).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "blocklistEntries"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteAuctionBlocklistEntriesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var carIds = Fixture.Create<IList<int>>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.DeleteAuctionBlocklistEntriesAsync(carIds).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteAuctionBlocklistEntriesAsync_WithNullCarIds_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.DeleteAuctionBlocklistEntriesAsync(null).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "carIds"));
            }
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SunriseService.GetUserGroupsAsync(Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<UserManagementService.GetUserGroupsOutput>());
                this.SunriseService.GetAuctionBlockListAsync(Arg.Any<int>()).Returns(Fixture.Create<AuctionManagementService.GetAuctionBlocklistOutput>());
                this.Mapper.Map<IList<LspGroup>>(Arg.Any<ForzaUserGroup[]>()).Returns(Fixture.Create<IList<LspGroup>>());
                this.Mapper.Map<IList<AuctionBlocklistEntry>>(Arg.Any<ForzaAuctionBlocklistEntry[]>()).Returns(Fixture.Create<IList<AuctionBlocklistEntry>>());
            }

            public ISunriseService SunriseService { get; set; } = Substitute.For<ISunriseService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public SunriseServiceManagementProvider Build() => new SunriseServiceManagementProvider(this.SunriseService, this.Mapper);
        }
    }
}
