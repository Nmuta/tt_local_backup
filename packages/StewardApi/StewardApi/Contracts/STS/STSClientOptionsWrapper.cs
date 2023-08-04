using Microsoft.Extensions.Options;
using System;
using Turn10.Contracts.STS;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Contracts.STS
{
    /// <inheritdoc />
    /// <remarks>This class is required to instantiate an STSClient.</remarks>
    public class STSClientOptionsWrapper : IOptionsMonitor<STSClientOptions>
    {
        private STSClientOptions options;

        /// <summary>
        ///     Initializes a new instance of the <see cref="STSClientOptionsWrapper"/> class.
        /// </summary>
        public STSClientOptionsWrapper(Uri stsUrl)
        {
            this.options = new STSClientOptions
            {
                BaseUri = stsUrl,
            };
        }

        /// <inheritdoc />
        public STSClientOptions CurrentValue => this.options;

        /// <inheritdoc />
        public STSClientOptions Get(string name) => this.options;

        /// <inheritdoc />
        public IDisposable OnChange(Action<STSClientOptions, string> listener)
        {
            throw new UnknownFailureStewardException("OnChange should not be called in STSClientOptionsWrapper");
        }
    }
}
