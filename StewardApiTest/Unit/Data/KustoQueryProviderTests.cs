using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos.Table;
using Turn10.Data.Azure;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardTest.Unit.Data
{
    [TestClass]
    public sealed class KustoQueryProviderTests
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
        public void Ctor_WhenTableStorageClientFactoryNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { TableStorageClientFactory = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "tableStorageClientFactory"));
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
        public void Ctor_WhenConfigurationNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { Configuration = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "configuration"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenKeyVaultProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { KeyVaultProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "keyVaultProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SaveKustoQueryAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var kustoQuery = Fixture.Create<KustoQuery>();
            var name = Fixture.Create<string>();
            var title = Fixture.Create<string>();
            var query = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SaveKustoQueryAsync(kustoQuery).ConfigureAwait(false),
                async () => await provider.SaveKustoQueryAsync(name, title, query).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SaveKustoQueryAsync_WithNullKustoQuery_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            Func<Task> action = async () => await provider.SaveKustoQueryAsync(null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "kustoQuery"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SaveKustoQueryAsync_WithNullEmptyWhitespaceName_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var title = Fixture.Create<string>();
            var query = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SaveKustoQueryAsync(null, title, query).ConfigureAwait(false),
                async () => await provider.SaveKustoQueryAsync(TestConstants.Empty, title, query).ConfigureAwait(false),
                async () => await provider.SaveKustoQueryAsync(TestConstants.WhiteSpace, title, query).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "name"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SaveKustoQueryAsync_WithNullEmptyWhitespaceTitle_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var name = Fixture.Create<string>();
            var query = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SaveKustoQueryAsync(name, null, query).ConfigureAwait(false),
                async () => await provider.SaveKustoQueryAsync(name, TestConstants.Empty, query).ConfigureAwait(false),
                async () => await provider.SaveKustoQueryAsync(name, TestConstants.WhiteSpace, query).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "title"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SaveKustoQueryAsync_WithNullEmptyWhitespaceQuery_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var name = Fixture.Create<string>();
            var title = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SaveKustoQueryAsync(name, title, null).ConfigureAwait(false),
                async () => await provider.SaveKustoQueryAsync(name, title, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.SaveKustoQueryAsync(name, title, TestConstants.WhiteSpace).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "query"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetKustoQueriesAsync_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            async Task<IList<KustoQuery>> Action() => await provider.GetKustoQueriesAsync().ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<KustoQuery>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteKustoQueryAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var name = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.DeleteKustoQueryAsync(name).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteKustoQueryAsync_WithNullEmptyWhitespaceQueryId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.DeleteKustoQueryAsync(null).ConfigureAwait(false),
                async () => await provider.DeleteKustoQueryAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.DeleteKustoQueryAsync(TestConstants.WhiteSpace).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "queryId"));
            }
        }

        internal sealed class Dependencies
        {
            public Dependencies()
            {
                this.TableStorageClientFactory.CreateTableStorageClient(Arg.Any<TableStorageProperties>()).Returns(TableStorageClient);
                this.TableStorageClient.ExecuteQueryAsync(Arg.Any<TableQuery<KustoQueryInternal>>()).Returns(Fixture.Create<IList<KustoQueryInternal>>());
                this.Mapper.Map<IList<KustoQuery>>(Arg.Any<IList<KustoQueryInternal>>()).Returns(Fixture.Create<IList<KustoQuery>>());
            }

            public ITableStorageClientFactory TableStorageClientFactory { get; set; } = Substitute.For<ITableStorageClientFactory>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public IKeyVaultProvider KeyVaultProvider { get; set; } = Substitute.For<IKeyVaultProvider>();

            private ITableStorageClient TableStorageClient { get; set; } = Substitute.For<ITableStorageClient>();
            
            public KustoQueryProvider Build() => new KustoQueryProvider(TableStorageClientFactory, Mapper, Configuration, KeyVaultProvider);
        }
    }
}
