using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FM7.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using static Forza.WebServices.FM7.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardTest.Unit.Apollo
{
    [TestClass]
    public sealed class ApolloPlayerInventoryProviderTests
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
        public void Ctor_WhenApolloUserInventoryServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ApolloUserInventoryService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "apolloUserInventoryService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenApolloGiftingServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ApolloGiftingService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "apolloGiftingService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenApolloUserServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ApolloUserService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "apolloUserService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenGiftHistoryProviderNull_Throws()
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
        public void GetPlayerInventoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<int>();

            // Act.
            var actions = new List<Func<Task<ApolloPlayerInventory>>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeOfType<ApolloPlayerInventory>();
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
            async Task<IList<ApolloInventoryProfile>> xuidAct() => await provider.GetInventoryProfilesAsync(xuid).ConfigureAwait(false);

            // Assert.
            xuidAct().Result.Should().BeOfType<List<ApolloInventoryProfile>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var groupId = Fixture.Create<int>();
            var gift = Fixture.Create<ApolloGift>();
            var groupGift = Fixture.Create<ApolloGroupGift>();
            groupGift.Xuids = Fixture.Create<List<ulong>>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdateGroupInventoriesAsync_WithNullGift_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var xuids = Fixture.Create<List<ulong>>();
            var groupId = Fixture.Create<int>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateGroupInventoriesAsync(groupId, null, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithNullGift_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var xuids = Fixture.Create<List<ulong>>();
            var groupId = Fixture.Create<int>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoriesAsync(null, requestingAgent).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var groupId = Fixture.Create<int>();
            var gift = Fixture.Create<ApolloGift>();
            var groupGift = Fixture.Create<ApolloGroupGift>();
            groupGift.Xuids = Fixture.Create<List<ulong>>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, null).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, null).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, null).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task UpdatePlayerInventoriesAsync_WithNullXuids_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var groupGift = Fixture.Create<ApolloGroupGift>();
            groupGift.Xuids = null;
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.UpdatePlayerInventoriesAsync(groupGift, requestingAgent).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "xuids"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.ApolloUserInventoryService.GetAdminUserInventoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetAdminUserInventoryOutput>());
                this.ApolloUserInventoryService.GetAdminUserInventoryByProfileIdAsync(Arg.Any<int>()).Returns(Fixture.Create<GetAdminUserInventoryByProfileIdOutput>());
                this.ApolloUserInventoryService.GetAdminUserProfilesAsync(Arg.Any<ulong>(), Arg.Any<uint>()).Returns(Fixture.Create<GetAdminUserProfilesOutput>());
                this.ApolloUserService.LiveOpsGetUserDataByGamertagAsync(Arg.Any<string>()).Returns(Fixture.Create<UserService.LiveOpsGetUserDataByGamertagOutput>());
                this.Mapper.Map<ApolloPlayerInventory>(Arg.Any<AdminForzaUserInventorySummary>()).Returns(Fixture.Create<ApolloPlayerInventory>());
                this.Mapper.Map<IList<ApolloInventoryProfile>>(Arg.Any<AdminForzaProfile[]>()).Returns(Fixture.Create<IList<ApolloInventoryProfile>>());
                this.Mapper.Map<ApolloGift>(Arg.Any<ApolloGroupGift>()).Returns(Fixture.Create<ApolloGift>());
            }

            public IApolloUserInventoryService ApolloUserInventoryService { get; set; } = Substitute.For<IApolloUserInventoryService>();

            public IApolloGiftingService ApolloGiftingService { get; set; } = Substitute.For<IApolloGiftingService>();

            public IApolloUserService ApolloUserService { get; set; } = Substitute.For<IApolloUserService>();

            public IApolloGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<IApolloGiftHistoryProvider>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public ApolloPlayerInventoryProvider Build() => new ApolloPlayerInventoryProvider(
                                                                                              this.ApolloUserInventoryService,
                                                                                              this.ApolloGiftingService,
                                                                                              this.ApolloUserService,
                                                                                              this.GiftHistoryProvider,
                                                                                              this.Mapper);
        }
    }
}
