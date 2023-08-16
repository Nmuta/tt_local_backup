using System;
using Microsoft.Extensions.Options;
using Turn10.Contracts.STS;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Contracts.STS
{
    /// <inheritdoc />
    /// <remarks>This class is required to instantiate an STSClient.</remarks>
    public class STSClientOptionsWrapper : IOptionsMonitor<STSClientOptions>
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="STSClientOptionsWrapper"/> class.
        /// </summary>
        public STSClientOptionsWrapper(Uri stsUrl) => this.CurrentValue = new STSClientOptions
        {
            BaseUri = stsUrl,
        };

        /// <inheritdoc />
        public STSClientOptions CurrentValue { get; }

        /// <inheritdoc />
        public STSClientOptions Get(string name) => this.CurrentValue;

        /// <inheritdoc />
        public IDisposable OnChange(Action<STSClientOptions, string> listener) => throw new UnknownFailureStewardException("OnChange should not be called in STSClientOptionsWrapper");
    }
}
