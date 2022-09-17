using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitClient
{
    public class AzureContext : IDisposable
    {
        private VssConnection _connection;

        public Uri Url { get; private set; }

        protected VssCredentials Credentials { get; private set; }

        internal ConnectionSettings ConnectionSettings { get; }

        public VssConnection Connection
        {
            get
            {
                _connection ??= new VssConnection(Url, Credentials);

                return _connection;
            }
            private set
            {
                Connection.Disconnect();
                _connection = value;
            }
        }

        public AzureContext(Uri organizationUrl, VssCredentials credentials) 
            : this(organizationUrl, credentials, null)
        {
        }

        public AzureContext(Uri organizationUrl, VssCredentials credentials, ConnectionSettings connectionSettings)
        {
            Url = Check.ForNull(organizationUrl, nameof(organizationUrl));
            Credentials = Check.ForNull(credentials, nameof(credentials));
            ConnectionSettings = connectionSettings ?? ConnectionSettings.Default;

            Connection = new VssConnection(organizationUrl, Credentials);

            // test connection, blocking
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
