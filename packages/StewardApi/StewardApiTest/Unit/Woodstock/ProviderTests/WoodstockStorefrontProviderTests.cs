using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.UGC.Contracts;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ProviderTests
{
    [TestClass]
    public sealed class WoodstockStorefrontProviderTests
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
        [UnitTest]
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
        [UnitTest]
        public void SearchUgcItemsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var filters = Fixture.Create<ServicesLiveOps.ForzaUGCSearchRequest>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUgcContentAsync(UgcType.Livery, filters, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UgcType.Photo, filters, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UgcType.Tune, filters, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [UnitTest]
        public void SearchUgcItemsAsync_WithUnknownUgcType_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var filters = Fixture.Create<ServicesLiveOps.ForzaUGCSearchRequest>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.SearchUgcContentAsync(UgcType.Unknown, filters, endpointKey).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<InvalidArgumentsStewardException>().WithMessage("Invalid UGC item type to search: Unknown");
        }

        [TestMethod]
        [UnitTest]
        public void SearchUgcItemsAsync_WithNullUgcFilters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUgcContentAsync(UgcType.Livery, null, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UgcType.Photo, null, endpointKey).ConfigureAwait(false),
                async () => await provider.SearchUgcContentAsync(UgcType.Tune, null, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "filters"));
            }
        }

        [TestMethod]
        [UnitTest]
        public async Task GetUGCLiveryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var liveryId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            async Task<WoodstockUgcLiveryItem> Action() => await provider.GetUgcLiveryAsync(liveryId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<WoodstockUgcLiveryItem>();
        }

        [TestMethod]
        [UnitTest]
        public void GetUGCPhotoAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var photoId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            Func<Task<WoodstockUgcItem>> act = async () => await provider.GetUgcPhotoAsync(photoId, endpointKey).ConfigureAwait(false);

            // Assert.
            act().Result.Should().BeOfType<WoodstockUgcItem>();
        }

        [TestMethod]
        [UnitTest]
        public async Task GetUGCTuneAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var tuneId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            async Task<WoodstockUgcItem> Action() => await provider.GetUgcTuneAsync(tuneId, endpointKey).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<WoodstockUgcItem>();
        }

        [TestMethod]
        [UnitTest]
        public void SetUGCFeaturedStatusAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();
            var featured = Fixture.Create<bool>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> act = async () => await provider.SetUgcFeaturedStatusAsync(contentId, featured, null, null, endpoint).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.WoodstockService.SearchUgcContentAsync(Arg.Any<ServicesLiveOps.ForzaUGCSearchRequest>(), Arg.Any<ServicesLiveOps.ForzaUGCContentType>(), Arg.Any<string>()).Returns(Fixture.Create<ServicesLiveOps.StorefrontManagementService.SearchUGCOutput>());
                this.WoodstockService.GetPlayerLiveryAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<ServicesLiveOps.StorefrontManagementService.GetUGCLiveryOutput>());
                this.WoodstockService.GetPlayerPhotoAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<ServicesLiveOps.StorefrontManagementService.GetUGCPhotoOutput>());
                this.WoodstockService.GetPlayerTuneAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<ServicesLiveOps.StorefrontManagementService.GetUGCTuneOutput>());
                this.Mapper.SafeMap<IList<HideableUgc>>(Arg.Any<List<ForzaStorefrontFile>>()).Returns(Fixture.Create<IList<HideableUgc>>());
                var ugcItem = Fixture.Create<WoodstockUgcItem>();
                var ugcLiveryItem = Fixture.Create<WoodstockUgcLiveryItem>();
                ugcItem.GameTitle = (int)GameTitle.FH5;
                ugcLiveryItem.GameTitle = (int)GameTitle.FH5;
                this.Mapper.SafeMap<WoodstockUgcItem>(Arg.Any<ServicesLiveOps.ForzaPhotoData>()).Returns(ugcItem);
                this.Mapper.SafeMap<WoodstockUgcLiveryItem>(Arg.Any<ServicesLiveOps.ForzaLiveryData>()).Returns(ugcLiveryItem);
                this.Mapper.SafeMap<WoodstockUgcItem>(Arg.Any<ServicesLiveOps.ForzaTuneData>()).Returns(ugcItem);
            }

            public IWoodstockService WoodstockService { get; set; } = Substitute.For<IWoodstockService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public WoodstockStorefrontProvider Build() => new WoodstockStorefrontProvider(this.WoodstockService, this.Mapper);
        }
    }
}
