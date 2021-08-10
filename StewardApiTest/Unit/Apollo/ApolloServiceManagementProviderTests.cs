using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using NSubstitute.ExceptionExtensions;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;
using Xls.WebServices.FM7.Generated;

namespace Turn10.LiveOps.StewardTest.Unit.Apollo
{
    [TestClass]
    public sealed class ApolloServiceManagementProviderTests
    {
        private static readonly Fixture Fixture = new Fixture();

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
        public void GetLspGroupsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IList<LspGroup>> Action() => await provider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<LspGroup>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetLspGroupsAsync_WithNegativeStartIndex_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var startIndex = -1;
            var maxResults = Fixture.Create<int>();

            // Act.
            Func<Task<IList<LspGroup>>> action = async () => await provider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(startIndex), -1, startIndex));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetLspGroupsAsync_WithInvalidMaxResults_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var startIndex = Fixture.Create<int>();
            var maxResults = -1;

            // Act.
            Func<Task<IList<LspGroup>>> action = async () => await provider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, nameof(maxResults), 0, maxResults));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.ApolloService.GetUserGroupsAsync(Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<UserService.GetUserGroupsOutput>());
                this.Mapper.Map<IList<LspGroup>>(Arg.Any<ForzaUserGroup[]>()).Returns(Fixture.Create<IList<LspGroup>>());
            }

            public IApolloService ApolloService { get; set; } = Substitute.For<IApolloService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public ApolloServiceManagementProvider Build() => new ApolloServiceManagementProvider(this.ApolloService, this.Mapper);
        }
    }
}
