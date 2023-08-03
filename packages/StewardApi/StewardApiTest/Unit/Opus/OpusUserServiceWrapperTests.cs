using System;
using AutoFixture;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Providers.Opus.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Opus
{
    [TestClass]
    public sealed class OpusUserServiceWrapperTests
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
        public void Ctor_WhenKeyVaultConfigNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { KeyVaultConfig = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "keyVaultConfig"));
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
            act.Should().Throw<ArgumentException>().WithMessage($"{TestConstants.ArgumentExceptionMissingSettingsMessagePartial}{ConfigurationKeyConstants.OpusUri},{ConfigurationKeyConstants.OpusClientVersion},{ConfigurationKeyConstants.OpusAdminXuid},{ConfigurationKeyConstants.OpusCertificateKeyVaultName},{ConfigurationKeyConstants.OpusCertificateSecretName}");
        }

        private sealed class Dependencies
        {
            public Dependencies(bool validConfiguration = true)
            {
                this.KeyVaultConfig.OpusCertificateSecret = TestConstants.TestCertificateString;
                if (validConfiguration)
                {
                    this.Configuration[Arg.Any<string>()].Returns(Fixture.Create<string>());
                    this.Configuration["OpusEnvironment:AdminXuid"].Returns("1234567890");
                }
                else
                {
                    this.Configuration[Arg.Any<string>()].ReturnsNull();
                }
            }

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public KeyVaultConfig KeyVaultConfig { get; set; } = Substitute.For<KeyVaultConfig>();

            public OpusServiceWrapper Build() => new OpusServiceWrapper(this.Configuration, this.KeyVaultConfig);
        }
    }
}