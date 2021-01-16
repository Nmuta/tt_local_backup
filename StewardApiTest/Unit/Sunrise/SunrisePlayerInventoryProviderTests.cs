using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FH4.master.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Xls.WebServices.FH4.master.Generated;
using static Forza.WebServices.FH4.master.Generated.UserInventoryService;
using static Xls.WebServices.FH4.master.Generated.UserService;

namespace Turn10.LiveOps.StewardTest.Unit.Sunrise
{
    [TestClass]
    public sealed class SunrisePlayerInventoryProviderTests
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
        public void Ctor_WhenSunriseUserInventoryServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SunriseUserInventoryService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sunriseUserInventoryService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSunriseGiftingServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SunriseGiftingService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sunriseGiftingService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSunriseUserServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SunriseUserService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sunriseUserService"));
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
        public void Ctor_WhenGiftHistoryProviderStoreNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GiftHistoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "giftHistoryProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerInventoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var profileId = Fixture.Create<int>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<SunrisePlayerInventory>>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeOfType<SunrisePlayerInventory>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetInventoryProfilesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<IList<SunriseInventoryProfile>>> action = async () => await provider.GetInventoryProfilesAsync(xuid).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<List<SunriseInventoryProfile>>();
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
            Func<Task<IList<SunriseLspGroup>>> action = async () => await provider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<List<SunriseLspGroup>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var xuids = Fixture.Create<List<ulong>>();
            var gamertags = Fixture.Create<List<string>>();
            var groupId = Fixture.Create<int>();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, playerInventory, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(xuids, playerInventory, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(gamertags, playerInventory, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, playerInventory, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var xuids = Fixture.Create<List<ulong>>();
            var gamertags = Fixture.Create<List<string>>();
            var groupId = Fixture.Create<int>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, null, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(xuids, null, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(gamertags, null, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, null, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerInventory"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var xuids = Fixture.Create<List<ulong>>();
            var gamertags = Fixture.Create<List<string>>();
            var groupId = Fixture.Create<int>();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, playerInventory, null).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(xuid, playerInventory, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(xuid, playerInventory, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(xuids, playerInventory, null).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(xuids, playerInventory, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(xuids, playerInventory, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(gamertags, playerInventory, null).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(gamertags, playerInventory, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(gamertags, playerInventory, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, playerInventory, null).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, playerInventory, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, playerInventory, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithNullXuids_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.UpdatePlayerInventoriesAsync((IList<ulong>)null, playerInventory, requestingAgent).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "xuids"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithNullGamertags_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var playerInventory = Fixture.Create<SunrisePlayerInventory>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.UpdatePlayerInventoriesAsync((IList<string>)null, playerInventory, requestingAgent).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertags"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SunriseUserInventoryService.GetAdminUserInventoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetAdminUserInventoryOutput>());
                this.SunriseUserInventoryService.GetAdminUserInventoryByProfileIdAsync(Arg.Any<int>()).Returns(Fixture.Create<GetAdminUserInventoryByProfileIdOutput>());
                this.SunriseUserInventoryService.GetAdminUserProfilesAsync(Arg.Any<ulong>(), Arg.Any<uint>()).Returns(Fixture.Create<GetAdminUserProfilesOutput>());
                this.SunriseUserService.GetUserGroupsAsync(Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<GetUserGroupsOutput>());
                this.SunriseUserService.GetLiveOpsUserDataByGamerTagAsync(Arg.Any<string>()).Returns(Fixture.Create<GetLiveOpsUserDataByGamerTagOutput>());
                this.Mapper.Map<SunrisePlayerInventory>(Arg.Any<AdminForzaUserInventorySummary>()).Returns(Fixture.Create<SunrisePlayerInventory>());
                this.Mapper.Map<IList<SunriseInventoryProfile>>(Arg.Any<AdminForzaProfile[]>()).Returns(Fixture.Create<IList<SunriseInventoryProfile>>());
                this.Mapper.Map<IList<SunriseLspGroup>>(Arg.Any<ForzaUserGroup[]>()).Returns(Fixture.Create<IList<SunriseLspGroup>>());
            }

            public ISunriseUserInventoryService SunriseUserInventoryService { get; set; } = Substitute.For<ISunriseUserInventoryService>();

            public ISunriseGiftingService SunriseGiftingService { get; set; } = Substitute.For<ISunriseGiftingService>();

            public ISunriseUserService SunriseUserService { get; set; } = Substitute.For<ISunriseUserService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public ISunriseGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<ISunriseGiftHistoryProvider>();

            public SunrisePlayerInventoryProvider Build() => new SunrisePlayerInventoryProvider(
                                                                                            this.SunriseUserInventoryService,
                                                                                            this.SunriseGiftingService,
                                                                                            this.SunriseUserService,
                                                                                            this.Mapper,
                                                                                            this.GiftHistoryProvider);
        }
    }
}
