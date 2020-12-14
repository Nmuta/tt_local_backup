﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FH4.master.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Xls.WebServices.FH4.master.Generated;
using static Forza.WebServices.FH4.master.Generated.UserService;
using static Xls.WebServices.FH4.master.Generated.UserService;

namespace Turn10.LiveOps.StewardTest.Unit.Sunrise
{
    [TestClass]
    public sealed class SunrisePlayerDetailsProviderTests
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
        public void Ctor_WhenSunriseEnforcementServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SunriseEnforcementService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sunriseEnforcementService"));
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
        public void Ctor_WhenRefreshableCacheStoreNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { RefreshableCacheStore = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "refreshableCacheStore"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetailsAsync_WithNullEmptyWhitespaceGamertag_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetPlayerDetailsAsync(null).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void EnsurePlayerExistsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gamertag = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<bool>>>
            {
                async () => await provider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsAsync(gamertag).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeTrue();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void EnsurePlayerExistsAsync_WithNullEmptyWhitespaceGamertag_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.EnsurePlayerExistsAsync(null).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsAsync(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetConsolesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IList<SunriseConsoleDetails>>> action = async () => await provider.GetConsolesAsync(xuid, maxResults).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<List<SunriseConsoleDetails>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetConsoleBanStatusAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var banStatus = Fixture.Create<bool>();

            // Act.
            Func<Task> action = async () => await provider.SetConsoleBanStatusAsync(xuid, banStatus).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetSharedConsoleUsersAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IList<SunriseSharedConsoleUser>>> action = async () => await provider.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<List<SunriseSharedConsoleUser>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUserFlagsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<SunriseUserFlags>> action = async () => await provider.GetUserFlagsAsync(xuid).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<SunriseUserFlags>();
            action().Result.ShouldNotBeNull();
            action().Result.IsCommunityManager.Should().Be(false);
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUserFlagsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var userFlags = Fixture.Create<SunriseUserFlags>();

            // Act.
            Func<Task> action = async () => await provider.SetUserFlagsAsync(xuid, userFlags).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUserFlagsAsync_WithNullUserFlags_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task> action = async () => await provider.SetUserFlagsAsync(xuid, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "userFlags"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetProfileSummaryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<SunriseProfileSummary>> action = async () => await provider.GetProfileSummaryAsync(xuid).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<SunriseProfileSummary>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetCreditUpdatesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IList<SunriseCreditUpdate>>> action = async () => await provider.GetCreditUpdatesAsync(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<List<SunriseCreditUpdate>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanUsersAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var banParameters = GenerateBanParameters();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IList<SunriseBanResult>>> action = async () => await provider.BanUsersAsync(banParameters, requestingAgent).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<List<SunriseBanResult>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanUsersAsync_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var banParameters = GenerateBanParameters();

            // Act.
            var actions = new List<Func<Task<IList<SunriseBanResult>>>>
            {
                async () => await provider.BanUsersAsync(banParameters, null).ConfigureAwait(false),
                async () => await provider.BanUsersAsync(banParameters, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.BanUsersAsync(banParameters, TestConstants.Empty).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanUsersAsync_WithNullBanParameters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            Func<Task<IList<SunriseBanResult>>> action = async () => await provider.BanUsersAsync(null, requestingAgent).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banParameters"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUserBanSummariesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuids = Fixture.Create<List<ulong>>();

            // Act.
            Func<Task<IList<SunriseBanSummary>>> action = async () => await provider.GetUserBanSummariesAsync(xuids).ConfigureAwait(false);

            // Assert.
            action().Result.Should().BeOfType<List<SunriseBanSummary>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUserBanHistoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gamertag = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<IList<LiveOpsBanHistory>>>>
            {
                async () => await provider.GetUserBanHistoryAsync(xuid).ConfigureAwait(false),
                async () => await provider.GetUserBanHistoryAsync(gamertag).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeOfType<List<LiveOpsBanHistory>>();
            }
        }

        private SunriseBanParameters GenerateBanParameters()
        {
            return new SunriseBanParameters
            {
                Xuids = new List<ulong> { 111 },
                Gamertags = new List<string> { "gamerT1" },
                FeatureArea = "Matchmaking",
                Reason = "Disgusting license plate.",
                StartTimeUtc = DateTime.UtcNow,
                ExpireTimeUtc = DateTime.UtcNow.AddSeconds(1),
                BanAllConsoles = false,
                BanAllPcs = false,
                DeleteLeaderboardEntries = false,
                SendReasonNotification = false
            };
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SunriseUserService.GetLiveOpsUserDataByGamerTagAsync(Arg.Any<string>()).Returns(Fixture.Create<GetLiveOpsUserDataByGamerTagOutput>());
                this.SunriseUserService.GetLiveOpsUserDataByGamerTagAsync("gamerT1").Returns(this.GenerateGetLiveOpsUserDataByGamerTagOutPut());
                this.SunriseUserService.GetLiveOpsUserDataByXuidAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetLiveOpsUserDataByXuidOutput>());
                this.SunriseUserService.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>()).Returns(Fixture.Create<GetConsolesOutput>());
                this.SunriseUserService.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<GetSharedConsoleUsersOutput>());
                this.SunriseUserService.GetUserGroupMembershipsAsync(Arg.Any<ulong>(), Arg.Any<int[]>(), Arg.Any<int>()).Returns(Fixture.Create<GetUserGroupMembershipsOutput>());
                this.SunriseUserService.GetIsUnderReviewAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetIsUnderReviewOutput>());
                this.SunriseUserService.GetProfileSummaryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetProfileSummaryOutput>());
                this.SunriseUserService.GetCreditUpdateEntriesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<GetCreditUpdateEntriesOutput>());
                this.RefreshableCacheStore.GetItem<IList<SunriseCreditUpdate>>(Arg.Any<string>()).Returns((IList<SunriseCreditUpdate>)null);
                this.SunriseEnforcementService.BanUsersAsync(Arg.Any<ulong[]>(), Arg.Any<int>(), Arg.Any<ForzaUserBanParameters>()).Returns(this.GenerateBanUsersOutput());
                this.SunriseEnforcementService.GetUserBanSummariesAsync(Arg.Any<ulong[]>(), Arg.Any<int>()).Returns(Fixture.Create<GetUserBanSummariesOutput>());
                this.SunriseEnforcementService.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(this.GenerateGetUserBanHistoryOutput());
                this.Mapper.Map<SunrisePlayerDetails>(Arg.Any<UserData>()).Returns(Fixture.Create<SunrisePlayerDetails>());
                this.Mapper.Map<IList<SunriseConsoleDetails>>(Arg.Any<ForzaConsole[]>()).Returns(Fixture.Create<IList<SunriseConsoleDetails>>());
                this.Mapper.Map<IList<SunriseSharedConsoleUser>>(Arg.Any<ForzaSharedConsoleUser[]>()).Returns(Fixture.Create<IList<SunriseSharedConsoleUser>>());
                this.Mapper.Map<SunriseProfileSummary>(Arg.Any<ForzaProfileSummary>()).Returns(Fixture.Create<SunriseProfileSummary>());
                this.Mapper.Map<IList<SunriseCreditUpdate>>(Arg.Any<ForzaCredityUpdateEntry[]>()).Returns(Fixture.Create<IList<SunriseCreditUpdate>>());
                this.Mapper.Map<IList<SunriseBanResult>>(Arg.Any<ForzaUserBanResult[]>()).Returns(Fixture.Create<IList<SunriseBanResult>>());
                this.Mapper.Map<IList<SunriseBanSummary>>(Arg.Any<ForzaUserBanSummary[]>()).Returns(Fixture.Create<IList<SunriseBanSummary>>());
                this.Mapper.Map<List<SunriseBanDescription>>(Arg.Any<ForzaUserBanDescription[]>()).Returns(Fixture.Create<IList<SunriseBanDescription>>());
            }

            public ISunriseUserService SunriseUserService { get; set; } = Substitute.For<ISunriseUserService>();

            public ISunriseEnforcementService SunriseEnforcementService { get; set; } = Substitute.For<ISunriseEnforcementService>();

            public ISunriseBanHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<ISunriseBanHistoryProvider>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IRefreshableCacheStore RefreshableCacheStore { get; set; } = Substitute.For<IRefreshableCacheStore>();

            public SunrisePlayerDetailsProvider Build() => new SunrisePlayerDetailsProvider(
                                                                                            this.SunriseUserService,
                                                                                            this.SunriseEnforcementService,
                                                                                            this.GiftHistoryProvider,
                                                                                            this.Mapper,
                                                                                            this.RefreshableCacheStore);

            private GetUserBanHistoryOutput GenerateGetUserBanHistoryOutput()
            {
                // Cannot use random uint value for feature area, we must build our own valid fake data
                Random rnd = new Random();
                var fakeBanHistories = new List<ForzaUserBanDescription>();
                var numberOfFakeBanHistories = rnd.Next(1, 10);
                for (var i = 0; i < numberOfFakeBanHistories; i++)
                {
                    fakeBanHistories.Add(Fixture.Build<ForzaUserBanDescription>().With(x => x.FeatureAreas, (uint)2).Create());
                }

                return Fixture.Build<GetUserBanHistoryOutput>().With(x => x.bans, fakeBanHistories.ToArray()).Create();
            }

            private BanUsersOutput GenerateBanUsersOutput()
            {
                var fakeBanResults = new List<ForzaUserBanResult>();
                fakeBanResults.Add(Fixture.Build<ForzaUserBanResult>().With(x => x.Xuid, (ulong)111).Create());

                return Fixture.Build<BanUsersOutput>().With(x => x.banResults, fakeBanResults.ToArray()).Create();
            }

            private GetLiveOpsUserDataByGamerTagOutput GenerateGetLiveOpsUserDataByGamerTagOutPut()
            {
                var fakeUser = Fixture.Build<UserData>().With(x => x.qwXuid, (ulong) 111).Create();

                return Fixture.Build<GetLiveOpsUserDataByGamerTagOutput>().With(x => x.userData, fakeUser).Create();
            }
        }
    }
}
