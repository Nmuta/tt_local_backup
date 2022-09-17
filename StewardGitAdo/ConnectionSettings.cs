using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.VisualStudio.Services.Common;

namespace StewardGitClient
{
    public class ConnectionSettings
    {
        private readonly Dictionary<string, object> _properties = new();

        internal static ConnectionSettings Default => new(Guid.Empty, Guid.Empty);

        public ConnectionSettings(Guid projectId, Guid repoId)
        {
            // TODO sanity checks
            _properties.Add(projectId.ToString("D"), projectId);
            _properties.Add(repoId.ToString("D"), repoId);
        }

        internal void SetIfUnset(string projectId = null, string repoId = null)
        {
            if (GetValue<Guid>(projectId) == Guid.Empty
                && Guid.TryParseExact(projectId, "D", out Guid result1))
            {
                _properties[projectId] = result1;
            }

            if (GetValue<Guid>(repoId) == Guid.Empty
                && Guid.TryParseExact(repoId, "D", out Guid result2))
            {
                _properties[repoId] = result2;
            }
        }

        public bool TryGetValue<T>(string key, out T value)
        {
            return _properties.TryGetValue<T>(key, out value);
        }

        public T GetValue<T>(string key)
        {
            return (T)_properties[key];
        }

        public void SetValue<T>(string key, T value)
        {
            _properties[key] = value;
        }

        public void RemoveValue(string name)
        {
            _properties.Remove(name);
        }
    }
}
