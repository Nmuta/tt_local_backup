using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitClient
{
    public abstract class ContextBase
    {
        public AzureContext Context { get; set; }
    }

    public class AzureContext
    {
        private VssConnection _connection;

        protected VssCredentials Credentials { get; private set; }

        public Uri Url { get; private set; }

        protected Dictionary<string, object> Properties { get; set; } = new();

        public VssConnection Connection
        {
            get
            {
                _connection ??= new VssConnection(Url, Credentials);

                return _connection;
            }
            private set
            {
                _connection = value;
            }
        }

        public AzureContext(Uri organizationUrl, VssCredentials credentials)
        {
            Url = organizationUrl;
            Credentials = credentials ?? throw new VssCredentialsException("No credential provided");
            Connection = new VssConnection(organizationUrl, Credentials);
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
    }
}
