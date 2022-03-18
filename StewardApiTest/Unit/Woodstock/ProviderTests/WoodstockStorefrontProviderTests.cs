using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH5_main.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.UGC.Contracts;
using FileType = Forza.UserGeneratedContent.FH5_main.Generated.FileType;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ProviderTests
{
    [TestClass]
    public sealed class WoodstockStorefrontProviderTests
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
        public void Ctor_WhenWoodstockServiceIsNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenMapperIsNull_Throws()
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
        public void SearchUgcItemsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var filters = Fixture.Create<UGCFilters>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUgcContentAsync(UGCType.Livery, filters, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UGCType.Photo, filters, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UGCType.Tune, filters, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SearchUgcItemsAsync_WithUnknownUgcType_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var filters = Fixture.Create<UGCFilters>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.SearchUgcContentAsync(UGCType.Unknown, filters, endpointKey).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<InvalidArgumentsStewardException>().WithMessage("Invalid UGC item type to search: Unknown");
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SearchUgcItemsAsync_WithNullUgcFilters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUgcContentAsync(UGCType.Livery, null, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UGCType.Photo, null, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UGCType.Tune, null, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "filters"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUGCLiveryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var liveryId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            async Task<UgcItem> Action() => await provider.GetUGCLiveryAsync(liveryId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<UgcItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUGCPhotoAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var photoId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            Func<Task<UgcItem>> act = async () => await provider.GetUGCPhotoAsync(photoId, endpointKey).ConfigureAwait(false);

            // Assert.
            act().Result.Should().BeOfType<UgcItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUGCTuneAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var tuneId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            async Task<UgcItem> Action() => await provider.GetUGCTuneAsync(tuneId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<UgcItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUGCFeaturedStatusAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();
            var featured = Fixture.Create<bool>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> act = async () => await provider.SetUGCFeaturedStatusAsync(contentId, featured, null, endpoint).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetHiddenUGCForUser_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> act = async () => await provider.GetHiddenUGCForUserAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void HideUgc_WithValidInputs_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var ugcId = Fixture.Create<Guid>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.HideUGCAsync(ugcId, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UnhideUgc_WithValidInputs_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var ugcId = Fixture.Create<Guid>();
            var fileType = Fixture.Create<FileType>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.UnhideUGCAsync(xuid, ugcId, fileType, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.WoodstockService.SearchUgcContentAsync(Arg.Any<ForzaUGCSearchRequest>(), Arg.Any<ForzaUGCContentType>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.SearchUGCOutput>());
                this.WoodstockService.GetPlayerLiveryAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCLiveryOutput>());
                this.WoodstockService.GetPlayerPhotoAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCPhotoOutput>());
                this.WoodstockService.GetPlayerTuneAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCTuneOutput>());
                this.WoodstockService.GetHiddenUgcForUserAsync(Arg.Any<int>(), Arg.Any<ulong>(), Arg.Any<Forza.UserGeneratedContent.FH5_main.Generated.FileType>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontService.GetHiddenUGCForUserOutput>());
                this.Mapper.Map<IList<UgcItem>>(Arg.Any<ForzaPhotoData[]>()).Returns(Fixture.Create<IList<UgcItem>>());
                this.Mapper.Map<IList<UgcItem>>(Arg.Any<ForzaLiveryData[]>()).Returns(Fixture.Create<IList<UgcItem>>());
                this.Mapper.Map<IList<UgcItem>>(Arg.Any<ForzaTuneData[]>()).Returns(Fixture.Create<IList<UgcItem>>());
                this.Mapper.Map<IList<HideableUgc>>(Arg.Any<List<ForzaStorefrontFile>>()).Returns(Fixture.Create<IList<HideableUgc>>());
                var ugcItem = Fixture.Create<UgcItem>();
                ugcItem.GameTitle = (int)GameTitle.FH5;
                this.Mapper.Map<UgcItem>(Arg.Any<ForzaPhotoData>()).Returns(ugcItem);
                this.Mapper.Map<UgcItem>(Arg.Any<ForzaLiveryData>()).Returns(ugcItem);
                this.Mapper.Map<UgcItem>(Arg.Any<ForzaTuneData>()).Returns(ugcItem);
            }
            
            public IWoodstockService WoodstockService { get; set; } = Substitute.For<IWoodstockService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public WoodstockStorefrontProvider Build() => new WoodstockStorefrontProvider(this.WoodstockService, this.Mapper);
        }
    }
}
