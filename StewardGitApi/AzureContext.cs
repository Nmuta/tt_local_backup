using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitApi
{
    public class AzureContext : IDisposable
    {
        private VssConnection connection;
        private readonly VssBasicCredential credential;

        internal Settings Settings { get; }

        public Uri Url { get; private set; }

        public VssConnection Connection
        {
            get => connection;
            private set
            {
                connection.Disconnect();
                connection = value;
            }
        }

        private AzureContext()
        {
        }

        public AzureContext(Uri organizationUrl, VssBasicCredential vssBasicCredential, Settings connectionSettings)
        {
            credential = vssBasicCredential ?? throw new VssCredentialException("No credentials provided");

            if (connectionSettings == Settings.Default)
                throw new ArgumentException($"No connection settings provided in {nameof(AzureContext)}");

            Url = Check.ForNull(organizationUrl, nameof(organizationUrl));
            Settings = Check.ForNull(connectionSettings, nameof(connectionSettings));

            Connection = new VssConnection(organizationUrl, vssBasicCredential);

            // Test connection
            Connection.ConnectAsync().SyncResult();
        }

        public void Dispose()
        {
            if (connection != null)
            {
                connection.Disconnect();
                ((IDisposable)connection).Dispose();
            }

            GC.SuppressFinalize(this);
        }
    }
}
