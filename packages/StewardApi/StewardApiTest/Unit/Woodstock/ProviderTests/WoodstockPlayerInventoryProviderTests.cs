using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardTest.Unit.Woodstock.Helpers;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Forza.WebServices.FH5_main.Generated.LiveOpsService;
using static Forza.WebServices.FH5_main.Generated.RareCarShopService;
using AdminForzaUserInventorySummary = Forza.UserInventory.FH5_main.Generated.AdminForzaUserInventorySummary;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ProviderTests
{
    [TestClass]
    public sealed class WoodstockPlayerInventoryProviderTests
    {
        private static readonly Fixture Fixture = new Fixture();

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
        public void Ctor_WhenWoodstockServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockService"));
        }

        [TestMethod]
        [UnitTest]
        public void Ctor_WhenWoodstockRefreshableCacheStoreNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { RefreshableCacheStore = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "refreshableCacheStore"));
        }

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
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
        [UnitTest]
        public void Ctor_WhenNotificationHistoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { NotificationHistoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "notificationHistoryProvider"));
        }

        [TestMethod]
        [UnitTest]
        public async Task GetPlayerInventoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var profileId = Fixture.Create<int>();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<WoodstockPlayerInventory>>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid, endpoint).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(profileId, endpoint).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                var result = await action().ConfigureAwait(false);
                result.Should().BeOfType<WoodstockPlayerInventory>();
            }
        }

        [TestMethod]
        [UnitTest]
        public async Task GetInventoryProfilesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<WoodstockInventoryProfile>> Action() => await provider.GetInventoryProfilesAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<WoodstockInventoryProfile>>();
        }

        [TestMethod]
        [UnitTest]
        public async Task GetAccountInventoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<WoodstockAccountInventory> Action() => await provider.GetAccountInventoryAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<WoodstockAccountInventory>();
        }

        [TestMethod]
        [UnitTest]
        public void UpdatePlayerInventoriesAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var dependencies = new Dependencies();
            var provider = dependencies.Build();
            var xuid = Fixture.Create<ulong>();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var groupId = Fixture.Create<int>();
            var gift = Fixture.Create<WoodstockGift>();
            var groupGift = Fixture.Create<WoodstockGroupGift>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, requesterObjectId, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, requesterObjectId, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, requesterObjectId, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [UnitTest]
        public void UpdatePlayerInventoryAsync_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies();
            var provider = dependencies.Build();
            var xuid = Fixture.Create<ulong>();
            var requesterObjectId = Fixture.Create<string>();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, null, requesterObjectId, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void UpdatePlayerInventoriesAsync_WithNullWoodstockGift_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies();
            var provider = dependencies.Build();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoriesAsync(null, requesterObjectId, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void UpdateGroupInventoriesAsync_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies();
            var provider = dependencies.Build();
            var groupId = Fixture.Create<int>();
            var requesterObjectId = Fixture.Create<string>();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateGroupInventoriesAsync(groupId, null, requesterObjectId, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void UpdatePlayerInventoriesAsync_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies();
            var provider = dependencies.Build();
            var xuid = Fixture.Create<ulong>();
            var groupId = Fixture.Create<int>();
            var gift = Fixture.Create<WoodstockGift>();
            var groupGift = Fixture.Create<WoodstockGroupGift>();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, null, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, TestConstants.Empty, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, TestConstants.WhiteSpace, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, null, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, TestConstants.Empty, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, TestConstants.WhiteSpace, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, null, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, TestConstants.Empty, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, TestConstants.WhiteSpace, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requesterObjectId"));
            }
        }

        [TestMethod]
        [UnitTest]
        public void UpdatePlayerInventoriesAsync_WithNullXuids_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies();
            var provider = dependencies.Build();
            var groupGift = Fixture.Create<WoodstockGroupGift>();
            groupGift.Xuids = null;
            var requesterObjectId = Fixture.Create<string>();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.UpdatePlayerInventoriesAsync(groupGift, requesterObjectId, useAdminCreditLimit, dependencies.MockProxyBundle).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "xuids"));
        }

        [TestMethod]
        [UnitTest]
        public void SendCarLiveryAsync_ToUserGroup_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var dependencies = new Dependencies();
            var provider = dependencies.Build();
            var gift = Fixture.Create<ExpirableGift>();
            var groupId = Fixture.Create<int>();
            var livery = Fixture.Create<UgcItem>();
            var requesterId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<GiftResponse<int>>> action = async () => await provider.SendCarLiveryAsync(gift, groupId, livery, requesterId, dependencies.MockProxyBundle).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<GiftResponse<int>>();
        }

        [TestMethod]
        [UnitTest]
        public void SendCarLiveryAsync_ToUserGroup_WithNullRequesterId_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies();
            var provider = dependencies.Build();
            var gift = Fixture.Create<ExpirableGift>();
            var groupId = Fixture.Create<int>();
            var livery = Fixture.Create<UgcItem>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<GiftResponse<int>>> action = async () => await provider.SendCarLiveryAsync(gift, groupId, livery, null, dependencies.MockProxyBundle).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requesterObjectId"));
        }

        [TestMethod]
        [UnitTest]
        public void SendCarLiveryAsync_ToPlayers_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var dependencies = new Dependencies();
            var provider = dependencies.Build();
            var groupGift = Fixture.Create<ExpirableGroupGift>();
            var livery = Fixture.Create<UgcItem>();
            var requesterId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<IList<GiftResponse<ulong>>>> action = async () => await provider.SendCarLiveryAsync(groupGift, livery, requesterId, dependencies.MockProxyBundle).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<List<GiftResponse<ulong>>>();
        }

        [TestMethod]
        [UnitTest]
        public void SendCarLiveryAsync_ToPlayers_WithNullRequesterId_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies();
            var provider = dependencies.Build();
            var groupGift = Fixture.Create<ExpirableGroupGift>();
            var livery = Fixture.Create<UgcItem>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<IList<GiftResponse<ulong>>>> action = async () => await provider.SendCarLiveryAsync(groupGift, livery, null, dependencies.MockProxyBundle).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requesterObjectId"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.MockProxyBundle = ProxyControllerHelper.CreateWoodstockProxyBundle(Fixture);
                this.WoodstockService.SendCarLiveryAsync(Arg.Any<ulong[]>(), Arg.Any<Guid>(), Arg.Any<bool>(), Arg.Any<uint>(), Arg.Any<string>()).Returns(Fixture.Create<GiftingManagementService.AdminSendLiveryGiftOutput>());
                this.WoodstockService.SendCarLiveryAsync(Arg.Any<int>(), Arg.Any<Guid>(), Arg.Any<bool>(), Arg.Any<uint>(), Arg.Any<string>()).Returns(Fixture.Create<GiftingManagementService.AdminSendGroupLiveryGiftOutput>());
                this.Mapper.SafeMap<IList<GiftResponse<ulong>>>(Arg.Any<ForzaLiveryGiftResult[]>()).Returns(Fixture.Create<IList<GiftResponse<ulong>>>());
                this.WoodstockService.GetAdminUserInventoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GetAdminUserInventoryOutput>());
                this.WoodstockService.GetAdminUserInventoryByProfileIdAsync(Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetAdminUserInventoryByProfileIdOutput>());
                this.WoodstockService.GetAdminUserProfilesAsync(Arg.Any<ulong>(), Arg.Any<uint>(), Arg.Any<string>()).Returns(Fixture.Create<UserInventoryManagementService.GetAdminUserProfilesOutput>());
                this.WoodstockService.GetTokenBalanceAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<AdminGetTokenBalanceOutput>());
                this.NotificationHistoryProvider.UpdateNotificationHistoryAsync(Arg.Any<NotificationHistory>());
                this.Mapper.SafeMap<WoodstockPlayerInventory>(Arg.Any<AdminForzaUserInventorySummary>()).Returns(Fixture.Create<WoodstockPlayerInventory>());
                this.Mapper.SafeMap<IList<WoodstockInventoryProfile>>(Arg.Any<AdminForzaProfile[]>()).Returns(Fixture.Create<IList<WoodstockInventoryProfile>>());
                this.Mapper.SafeMap<IList<LspGroup>>(Arg.Any<ForzaUserGroup[]>()).Returns(Fixture.Create<IList<LspGroup>>());
                this.Mapper.SafeMap<WoodstockGift>(Arg.Any<WoodstockGroupGift>()).Returns(Fixture.Create<WoodstockGift>());
                this.Mapper.SafeMap<WoodstockAccountInventory>(Arg.Any<RareCarTicketBalance>()).Returns(Fixture.Create<WoodstockAccountInventory>());
            }

            public WoodstockProxyBundle MockProxyBundle { get; set; }

            public IWoodstockService WoodstockService { get; set; } = Substitute.For<IWoodstockService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IRefreshableCacheStore RefreshableCacheStore { get; set; } =
                Substitute.For<IRefreshableCacheStore>();

            public IWoodstockGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<IWoodstockGiftHistoryProvider>();

            public INotificationHistoryProvider NotificationHistoryProvider { get; set; } = Substitute.For<INotificationHistoryProvider>();

            public WoodstockPlayerInventoryProvider Build() => new WoodstockPlayerInventoryProvider(
                this.WoodstockService,
                this.Mapper,
                this.RefreshableCacheStore,
                this.GiftHistoryProvider,
                this.NotificationHistoryProvider);
        }
    }
}
