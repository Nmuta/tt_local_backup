using System;
using System.Collections.Generic;
using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using StewardGitApi;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.Services.CMSRetrieval;
using Turn10.Services.Storage.Blob;

namespace Turn10.LiveOps.StewardTest.Unit.Steelhead.ServiceTests
{
    [TestClass]
    public sealed class SteelheadPegasusServiceTests
    {
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
        public void Ctor_WhenPegasusCmsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { PegasusCmsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "pegasusCmsProvider"));
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
        public void Ctor_WhenConfigurationValuesNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies(false);

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentException>().WithMessage($"{TestConstants.ArgumentExceptionMissingSettingsMessagePartial}{ConfigurationKeyConstants.PegasusCmsDefaultSteelhead},{ConfigurationKeyConstants.KeyVaultUrl},{ConfigurationKeyConstants.SteelheadContentAccessToken},{ConfigurationKeyConstants.SteelheadContentOrganizationUrl},{ConfigurationKeyConstants.SteelheadContentProjectId},{ConfigurationKeyConstants.SteelheadContentRepoId}");
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenLoggingServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { LoggingService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "loggingService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenAzureDevOpsFactoryNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { AzureDevOpsFactory = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "azureDevOpsFactory"));
        }


        private sealed class Dependencies
        {
            public Dependencies(bool validConfiguration = true)
            {
                this.PegasusCmsProvider.Helpers.Add(TitleConstants.SteelheadCodeName, new CMSRetrievalHelper("", new Dictionary<string, IAzureBlobProvider>()));

                if (validConfiguration)
                {
                    this.Configuration[ConfigurationKeyConstants.PegasusCmsDefaultSteelhead].Returns("1234567890");
                    this.Configuration[ConfigurationKeyConstants.SteelheadContentProjectId].Returns("12345678-1234-1234-1234-123456789012");
                    this.Configuration[ConfigurationKeyConstants.SteelheadContentRepoId].Returns("12345678-1234-1234-1234-123456789012");
                    this.Configuration[ConfigurationKeyConstants.KeyVaultUrl].Returns("1234567890");
                    this.Configuration[ConfigurationKeyConstants.SteelheadContentAccessToken].Returns("1234567890");
                    this.Configuration[ConfigurationKeyConstants.SteelheadContentOrganizationUrl].Returns("1234567890");
                }
                else
                {
                    this.Configuration[ConfigurationKeyConstants.PegasusCmsDefaultSteelhead].ReturnsNull();
                    this.Configuration[ConfigurationKeyConstants.SteelheadContentProjectId].ReturnsNull();
                    this.Configuration[ConfigurationKeyConstants.SteelheadContentRepoId].ReturnsNull();
                    this.Configuration[ConfigurationKeyConstants.KeyVaultUrl].ReturnsNull();
                    this.Configuration[ConfigurationKeyConstants.SteelheadContentAccessToken].ReturnsNull();
                    this.Configuration[ConfigurationKeyConstants.SteelheadContentOrganizationUrl].ReturnsNull();
                }
            }

            public PegasusCmsProvider PegasusCmsProvider { get; set; } = new PegasusCmsProvider();
            public IRefreshableCacheStore RefreshableCacheStore { get; set; } = Substitute.For<IRefreshableCacheStore>();
            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();
            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();
            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();
            public IKeyVaultProvider KeyVaultProvider { get; set; } = Substitute.For<IKeyVaultProvider>();
            public IAzureDevOpsFactory AzureDevOpsFactory { get; set; } = Substitute.For<IAzureDevOpsFactory>();

            public SteelheadPegasusService Build() => new SteelheadPegasusService(this.PegasusCmsProvider, this.AzureDevOpsFactory, this.KeyVaultProvider, this.RefreshableCacheStore, this.Mapper, this.Configuration, this.LoggingService);
        }
    }
}
