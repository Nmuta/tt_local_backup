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
    public class ConnectionSettings
    {
        public Guid ProjectId { get; private set; }
        public Guid RepoId { get; private set; }

        internal static ConnectionSettings Default
            => new(Guid.Empty, Guid.Empty);

        public ConnectionSettings(Guid projectId, Guid repoId)
        {
            // TODO sanity checks
            ProjectId = projectId;
            RepoId = repoId;
        }

        internal void SetIfUnset(string projectId = null, string repoId = null)
        {
            if (ProjectId == Guid.Empty 
                && Guid.TryParseExact(projectId, "D", out Guid result1))
            {
                ProjectId = result1;
            }

            if (RepoId == Guid.Empty 
                && Guid.TryParseExact(repoId, "D", out Guid result2))
            {
                RepoId = result2;
            }
        }
    }

    public class AzureContext : IDisposable
    {
        private VssConnection _connection;

        public Uri Url { get; private set; }

        protected VssCredentials Credentials { get; private set; }

        internal ConnectionSettings ConnectionSettings { get; }

        protected Dictionary<string, object> Properties { get; set; } 
            = new Dictionary<string, object>();

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

        public bool TryGetValue<T>(string key, out T value)
        {
            return Properties.TryGetValue<T>(key, out value);
        }

        public T GetValue<T>(string key)
        {
            return (T)Properties[key];
        }

        public void SetValue<T>(string key, T value)
        {
            Properties[key] = value;
        }

        public void RemoveValue(string name)
        {
            Properties.Remove(name);
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
