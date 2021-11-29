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
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;
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
        public void Ctor_WhenApolloServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ApolloService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "apolloService"));
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
        public async Task GetPlayerInventoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<int>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<ApolloPlayerInventory>>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid, endpoint).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(profileId, endpoint).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                var result = await action().ConfigureAwait(false);
                result.Should().BeOfType<ApolloPlayerInventory>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetInventoryProfilesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<ApolloInventoryProfile>> Action() => await provider.GetInventoryProfilesAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<ApolloInventoryProfile>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var groupId = Fixture.Create<int>();
            var gift = Fixture.Create<ApolloGift>();
            var groupGift = Fixture.Create<ApolloGroupGift>();
            groupGift.Xuids = Fixture.Create<List<ulong>>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, requesterObjectId, useAdminCreditLimit, endpoint).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, requesterObjectId, useAdminCreditLimit, endpoint).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, requesterObjectId, useAdminCreditLimit, endpoint).ConfigureAwait(false)
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
            var useAdminCreditLimit = Fixture.Create<bool>();
            var groupId = Fixture.Create<int>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateGroupInventoriesAsync(groupId, null, requesterObjectId, useAdminCreditLimit, endpoint).ConfigureAwait(false)
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
            var useAdminCreditLimit = Fixture.Create<bool>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoriesAsync(null, requesterObjectId, useAdminCreditLimit, endpoint).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithNullEmptyWhitespaceRequesterObjectId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var xuid = Fixture.Create<ulong>();
            var groupId = Fixture.Create<int>();
            var gift = Fixture.Create<ApolloGift>();
            var groupGift = Fixture.Create<ApolloGroupGift>();
            groupGift.Xuids = Fixture.Create<List<ulong>>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, null, useAdminCreditLimit, endpoint).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, TestConstants.Empty, useAdminCreditLimit, endpoint).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, TestConstants.WhiteSpace, useAdminCreditLimit, endpoint).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, null, useAdminCreditLimit, endpoint).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, TestConstants.Empty, useAdminCreditLimit, endpoint).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, TestConstants.WhiteSpace, useAdminCreditLimit, endpoint).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, null, useAdminCreditLimit, endpoint).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, TestConstants.Empty, useAdminCreditLimit, endpoint).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, TestConstants.WhiteSpace, useAdminCreditLimit, endpoint).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requesterObjectId"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithNullXuids_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var groupGift = Fixture.Create<ApolloGroupGift>();
            groupGift.Xuids = null;
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.UpdatePlayerInventoriesAsync(groupGift, requesterObjectId, useAdminCreditLimit, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "xuids"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.ApolloService.GetAdminUserInventoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GetAdminUserInventoryOutput>());
                this.ApolloService.GetAdminUserInventoryByProfileIdAsync(Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetAdminUserInventoryByProfileIdOutput>());
                this.ApolloService.GetAdminUserProfilesAsync(Arg.Any<ulong>(), Arg.Any<uint>(), Arg.Any<string>()).Returns(Fixture.Create<GetAdminUserProfilesOutput>());
                this.ApolloService.LiveOpsGetUserDataByGamertagAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<UserService.LiveOpsGetUserDataByGamertagOutput>());
                this.Mapper.Map<IList<ApolloInventoryProfile>>(Arg.Any<AdminForzaProfile[]>()).Returns(Fixture.Create<IList<ApolloInventoryProfile>>());
                this.Mapper.Map<ApolloGift>(Arg.Any<ApolloGroupGift>()).Returns(Fixture.Create<ApolloGift>());
                this.Mapper.Map<ApolloPlayerInventory>(Arg.Any<AdminForzaUserInventorySummary>()).Returns(Fixture.Create<ApolloPlayerInventory>());
            }

            public IApolloService ApolloService { get; set; } = Substitute.For<IApolloService>();

            public IApolloGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<IApolloGiftHistoryProvider>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public ApolloPlayerInventoryProvider Build() => new ApolloPlayerInventoryProvider(
                this.ApolloService,
                this.GiftHistoryProvider,
                this.Mapper);
        }
    }
}
