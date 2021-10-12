using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH5.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock
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
        public void SearchUGCItemsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var ugcType = UGCType.Livery;
            var filters = Fixture.Create<UGCFilters>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            Func<Task<IList<UGCItem>>> act = async () => await provider.SearchUGCItems(ugcType, filters, endpointKey).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SearchUGCItemsAsync_WithUnknownUgcType_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var filters = Fixture.Create<UGCFilters>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUGCItems(UGCType.Unknown, filters, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<InvalidArgumentsStewardException>().WithMessage("Invalid UGC item type to search: Unknown");
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SearchUGCItemsAsync_WithNullUgcFilters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var ugcType = Fixture.Create<UGCType>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SearchUGCItems(ugcType, null, endpointKey).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "filters"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUGCLiveryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var liveryId = Fixture.Create<Guid>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            Func<Task<UGCItem>> act = async () => await provider.GetUGCLivery(liveryId, endpointKey).ConfigureAwait(false);

            // Assert.
            act().Result.Should().BeOfType<UGCItem>();
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
            Func<Task<UGCItem>> act = async () => await provider.GetUGCPhoto(photoId, endpointKey).ConfigureAwait(false);

            // Assert.
            act().Result.Should().BeOfType<UGCItem>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUGCFeaturedStatusAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var contentId = Fixture.Create<Guid>();
            var featured = Fixture.Create<bool>();
            var endpointKey = Fixture.Create<string>();

            // Act.
            Func<Task> act = async () => await provider.SetUGCFeaturedStatus(contentId, featured, null, endpointKey).ConfigureAwait(false);

            // Assert.
            act.Should().NotThrow();
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.WoodstockService.SearchUgcLiveries(Arg.Any<ForzaUGCSearchRequest>(), Arg.Any<ForzaUGCContentType>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.SearchUGCOutput>());
                this.WoodstockService.GetPlayerLivery(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCLiveryOutput>());
                this.WoodstockService.GetPlayerPhoto(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<StorefrontManagementService.GetUGCPhotoOutput>());
                this.Mapper.Map<IList<UGCItem>>(Arg.Any<ForzaPhotoData[]>()).Returns(Fixture.Create<IList<UGCItem>>());
                this.Mapper.Map<IList<UGCItem>>(Arg.Any<ForzaLiveryData[]>()).Returns(Fixture.Create<IList<UGCItem>>());
                this.Mapper.Map<UGCItem>(Arg.Any<ForzaPhotoData>()).Returns(Fixture.Create<UGCItem>());
                this.Mapper.Map<UGCItem>(Arg.Any<ForzaLiveryData>()).Returns(Fixture.Create<UGCItem>());
            }

            public IWoodstockService WoodstockService { get; set; } = Substitute.For<IWoodstockService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public WoodstockStorefrontProvider Build() => new WoodstockStorefrontProvider(this.WoodstockService, this.Mapper);
        }
    }
}
