﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH4.Generated;
using Forza.UserInventory.FH4.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using static Forza.LiveOps.FH4.Generated.UserInventoryService;
using static Forza.WebServices.FH4.Generated.LiveOpsService;
using static Forza.WebServices.FH4.Generated.RareCarShopService;
using WebServicesContracts = Forza.WebServices.FH4.Generated;

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
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<SunrisePlayerInventory>>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid, endpoint).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(profileId, endpoint).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                var response = action();
                response.Result.Should().BeOfType<SunrisePlayerInventory>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetInventoryProfilesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<IList<SunriseInventoryProfile>>> action = async () => await provider.GetInventoryProfilesAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<List<SunriseInventoryProfile>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetAccountInventoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<SunriseAccountInventory>> action = async () => await provider.GetAccountInventoryAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<SunriseAccountInventory>();
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
            var gift = Fixture.Create<SunriseGift>();
            var groupGift = Fixture.Create<SunriseGroupGift>();
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
        public void UpdatePlayerInventoryAsync_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var requesterObjectId = Fixture.Create<string>();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, null, requesterObjectId, useAdminCreditLimit, endpoint).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithNullSunriseGift_Throws()
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
        public void UpdateGroupInventoriesAsync_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var requesterObjectId = Fixture.Create<string>();
            var useAdminCreditLimit = Fixture.Create<bool>();
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
        public void UpdatePlayerInventoriesAsync_WithNullEmptyWhitespaceRequesterObjectId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var groupId = Fixture.Create<int>();
            var gift = Fixture.Create<SunriseGift>();
            var groupGift = Fixture.Create<SunriseGroupGift>();
            var useAdminCreditLimit = Fixture.Create<bool>();
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
            var groupGift = Fixture.Create<SunriseGroupGift>();
            groupGift.Xuids = null;
            var requesterObjectId = Fixture.Create<string>();
            var useAdminCreditLimit = Fixture.Create<bool>();
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
                this.SunriseService.GetAdminUserInventoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GetAdminUserInventoryOutput>());
                this.SunriseService.GetAdminUserInventoryByProfileIdAsync(Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetAdminUserInventoryByProfileIdOutput>());
                this.SunriseService.GetAdminUserProfilesAsync(Arg.Any<ulong>(), Arg.Any<uint>(), Arg.Any<string>()).Returns(Fixture.Create<GetAdminUserProfilesOutput>());
                this.SunriseService.GetUserGroupsAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetUserGroupsOutput>());
                this.SunriseService.GetLiveOpsUserDataByGamerTagAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<GetLiveOpsUserDataByGamerTagOutput>());
                this.SunriseService.GetTokenBalanceAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<AdminGetTokenBalanceOutput>());
                this.Mapper.Map<SunrisePlayerInventory>(Arg.Any<AdminForzaUserInventorySummary>()).Returns(Fixture.Create<SunrisePlayerInventory>());
                this.Mapper.Map<IList<SunriseInventoryProfile>>(Arg.Any<AdminForzaProfile[]>()).Returns(Fixture.Create<IList<SunriseInventoryProfile>>());
                this.Mapper.Map<IList<LspGroup>>(Arg.Any<ForzaUserGroup[]>()).Returns(Fixture.Create<IList<LspGroup>>());
                this.Mapper.Map<SunriseGift>(Arg.Any<SunriseGroupGift>()).Returns(Fixture.Create<SunriseGift>());
                this.Mapper.Map<SunriseAccountInventory>(Arg.Any<WebServicesContracts.RareCarTicketBalance>()).Returns(Fixture.Create<SunriseAccountInventory>());
            }

            public ISunriseService SunriseService { get; set; } = Substitute.For<ISunriseService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IRefreshableCacheStore RefreshableCacheStore { get; set; } = Substitute.For<IRefreshableCacheStore>();

            public ISunriseGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<ISunriseGiftHistoryProvider>();

            public SunrisePlayerInventoryProvider Build() => new SunrisePlayerInventoryProvider(
                this.SunriseService,
                this.Mapper,
                this.RefreshableCacheStore,
                this.GiftHistoryProvider);
        }
    }
}
