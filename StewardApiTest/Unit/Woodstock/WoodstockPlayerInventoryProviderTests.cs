﻿using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH5_master.Generated;
using Forza.UserInventory.FH5_master.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using static Forza.LiveOps.FH5_master.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock
{
    [TestClass]
    public sealed class WoodstockPlayerInventoryProviderTests
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
        public void Ctor_WhenWoodstockUserInventoryServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockUserInventoryService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockUserInventoryService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenWoodstockGiftingServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockGiftingService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockGiftingService"));
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
            var actions = new List<Func<Task<WoodstockMasterInventory>>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                var response = action();
                response.Result.Should().BeOfType<WoodstockMasterInventory>();
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
            Func<Task<IList<WoodstockInventoryProfile>>> action = async () => await provider.GetInventoryProfilesAsync(xuid).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<List<WoodstockInventoryProfile>>();
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
            var gift = Fixture.Create<WoodstockGift>();
            var groupGift = Fixture.Create<WoodstockGroupGift>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, requestingAgent, useAdminCreditLimit).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, requestingAgent, useAdminCreditLimit).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, requestingAgent, useAdminCreditLimit).ConfigureAwait(false)
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
            var requestingAgent = Fixture.Create<string>();
            var useAdminCreditLimit = Fixture.Create<bool>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, null, requestingAgent, useAdminCreditLimit).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoriesAsync_WithNullWoodstockGift_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var useAdminCreditLimit = Fixture.Create<bool>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoriesAsync(null, requestingAgent, useAdminCreditLimit).ConfigureAwait(false),
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
            var requestingAgent = Fixture.Create<string>();
            var useAdminCreditLimit = Fixture.Create<bool>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdateGroupInventoriesAsync(groupId, null, requestingAgent, useAdminCreditLimit).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
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
            var gift = Fixture.Create<WoodstockGift>();
            var groupGift = Fixture.Create<WoodstockGroupGift>();
            var useAdminCreditLimit = Fixture.Create<bool>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, null, useAdminCreditLimit).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, TestConstants.Empty, useAdminCreditLimit).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(xuid, gift, TestConstants.WhiteSpace, useAdminCreditLimit).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, null, useAdminCreditLimit).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, TestConstants.Empty, useAdminCreditLimit).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoriesAsync(groupGift, TestConstants.WhiteSpace, useAdminCreditLimit).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, null, useAdminCreditLimit).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, TestConstants.Empty, useAdminCreditLimit).ConfigureAwait(false),
                async () => await provider.UpdateGroupInventoriesAsync(groupId, gift, TestConstants.WhiteSpace, useAdminCreditLimit).ConfigureAwait(false)
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
            var groupGift = Fixture.Create<WoodstockGroupGift>();
            groupGift.Xuids = null;
            var requestingAgent = Fixture.Create<string>();
            var useAdminCreditLimit = Fixture.Create<bool>();

            // Act.
            Func<Task> action = async () => await provider.UpdatePlayerInventoriesAsync(groupGift, requestingAgent, useAdminCreditLimit).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "xuids"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.WoodstockUserInventoryService.GetAdminUserInventoryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetAdminUserInventoryOutput>());
                this.WoodstockUserInventoryService.GetAdminUserInventoryByProfileIdAsync(Arg.Any<int>()).Returns(Fixture.Create<GetAdminUserInventoryByProfileIdOutput>());
                this.WoodstockUserInventoryService.GetAdminUserProfilesAsync(Arg.Any<ulong>(), Arg.Any<uint>()).Returns(Fixture.Create<GetAdminUserProfilesOutput>());
                this.Mapper.Map<WoodstockMasterInventory>(Arg.Any<AdminForzaUserInventorySummary>()).Returns(Fixture.Create<WoodstockMasterInventory>());
                this.Mapper.Map<IList<WoodstockInventoryProfile>>(Arg.Any<AdminForzaProfile[]>()).Returns(Fixture.Create<IList<WoodstockInventoryProfile>>());
                this.Mapper.Map<IList<LspGroup>>(Arg.Any<ForzaUserGroup[]>()).Returns(Fixture.Create<IList<LspGroup>>());
                this.Mapper.Map<WoodstockGift>(Arg.Any<WoodstockGroupGift>()).Returns(Fixture.Create<WoodstockGift>());
            }

            public IWoodstockUserInventoryService WoodstockUserInventoryService { get; set; } = Substitute.For<IWoodstockUserInventoryService>();

            public IWoodstockGiftingService WoodstockGiftingService { get; set; } = Substitute.For<IWoodstockGiftingService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IWoodstockGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<IWoodstockGiftHistoryProvider>();

            public WoodstockPlayerInventoryProvider Build() => new WoodstockPlayerInventoryProvider(
                                                                                            this.WoodstockUserInventoryService,
                                                                                            this.WoodstockGiftingService,
                                                                                            this.Mapper,
                                                                                            this.GiftHistoryProvider);
        }
    }
}
