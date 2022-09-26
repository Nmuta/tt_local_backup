using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitApi
{
    public class AzureContext : IDisposable
    {
        private VssConnection _connection;
        private readonly VssBasicCredential _credential;

        public Uri Url { get; private set; }

        internal Settings Settings { get; }

        public VssConnection Connection
        {
            get
            {
                _connection ??= new VssConnection(Url, _credential);
                return _connection;
            }
            private set
            {
                Connection.Disconnect();
                _connection = value;
            }
        }

        private AzureContext()
        {
        }

        public AzureContext(Uri organizationUrl, VssBasicCredential credential, Settings connectionSettings)
        {
            _credential = Check.ForNull(credential, nameof(credential));
            Url = Check.ForNull(organizationUrl, nameof(organizationUrl));
            Settings = Check.ForNull(connectionSettings, nameof(connectionSettings));

            if (connectionSettings == Settings.Default)
                throw new InvalidOperationException($"No connection settings provided in {nameof(AzureContext)}");

            Connection = new VssConnection(organizationUrl, credential);

            // Test connection
            Connection.ConnectAsync().SyncResult();
        }

        public void Dispose()
        {
            if (_connection != null)
            {
                _connection.Disconnect();
                ((IDisposable)_connection).Dispose();
            }

            GC.SuppressFinalize(this);
        }
    }
}
