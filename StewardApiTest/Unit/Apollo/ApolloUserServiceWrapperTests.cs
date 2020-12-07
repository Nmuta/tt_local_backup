using System;
using AutoFixture;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;

namespace Turn10.LiveOps.StewardTest.Unit.Apollo
{
    [TestClass]
    public sealed class ApolloUserServiceWrapperTests
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
        public void Ctor_WhenConfigurationValuesNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies(false);

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentException>().WithMessage($"{TestConstants.ArgumentExceptionMissingSettingsMessagePartial}{ConfigurationKeyConstants.ApolloUri},{ConfigurationKeyConstants.ApolloClientVersion},{ConfigurationKeyConstants.ApolloAdminXuid},{ConfigurationKeyConstants.ApolloCertificateKeyVaultName},{ConfigurationKeyConstants.ApolloCertificateSecretName}");
        }

        private sealed class Dependencies
        {
            public Dependencies(bool validConfiguration = true)
            {
                this.KeyVaultProvider.GetSecretAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(TestConstants.TestCertificateString);
                if (validConfiguration)
                {
                    this.Configuration[Arg.Any<string>()].Returns(Fixture.Create<string>());
                    this.Configuration["ApolloEnvironment:AdminXuid"].Returns("1234567890");
                }
                else
                {
                    this.Configuration[Arg.Any<string>()].ReturnsNull();
                }
            }

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public IKeyVaultProvider KeyVaultProvider { get; set; } = Substitute.For<IKeyVaultProvider>();

            public ApolloUserServiceWrapper Build() => new ApolloUserServiceWrapper(this.Configuration, this.KeyVaultProvider);
        }
    }
}
