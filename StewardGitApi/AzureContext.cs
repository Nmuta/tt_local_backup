using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitApi
{
    /// <summary>
    ///     Represents state information for the <see cref="AzureDevOpsManager"/>.
    /// </summary>
    public class AzureContext : IDisposable
    {
        private readonly VssBasicCredential credential;
        private VssConnection connection;
        private bool alreadyDisposed;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AzureContext"/> class.
        /// </summary>
        public AzureContext(Uri organizationUrl, VssBasicCredential vssBasicCredential, RepoSettings connectionSettings)
        {
            this.credential = vssBasicCredential ?? throw new VssCredentialException("No credentials provided");

            if (connectionSettings == RepoSettings.Default)
            {
                throw new ArgumentException($"No connection settings provided in {nameof(AzureContext)}");
            }

            this.Url = organizationUrl.CheckForNull(nameof(organizationUrl));
            this.Settings = connectionSettings.CheckForNull(nameof(connectionSettings));

            this.Connection = new VssConnection(organizationUrl, vssBasicCredential);

            // Test connection
            this.Connection.ConnectAsync().SyncResult();
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="AzureContext"/> class.
        /// </summary>
        private AzureContext()
        {
        }

        /// <summary>
        ///     Gets the manager settings.
        /// </summary>
        public RepoSettings Settings { get; }

        /// <summary>
        ///     Gets the organization url.
        /// </summary>
        public Uri Url { get; }

        /// <summary>
        ///     Gets the connection.
        /// </summary>
        internal VssConnection Connection
        {
            get => this.connection;
            private set
            {
                this.connection.Disconnect();
                this.connection = value;
            }
        }

        /// <summary>
        ///     Disposes of managed objects.
        /// </summary>
        public void Dispose()
        {
            // Do not change this code.
            // Put cleanup code in 'Dispose(bool disposing)' method
            this.Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        ///     If <paramref name="disposing"/> is true,
        ///     disconnects and disposes of managed connection.
        ///     If false, free unmanaged resources and override finalizer.
        /// </summary>
        protected virtual void Dispose(bool disposing)
        {
            if (!this.alreadyDisposed)
            {
                if (disposing)
                {
                    this.connection.Disconnect();
                    ((IDisposable)this.connection).Dispose();
                }

                this.alreadyDisposed = true;
            }
        }
    }
}
