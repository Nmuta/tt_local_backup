using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.VisualStudio.Services.Common;

namespace StewardGitClient
{
    public class ConnectionSettings
    {
        private readonly Dictionary<string, object> _cache = new();

        internal static ConnectionSettings Default => new(Guid.Empty, Guid.Empty);

        public Guid ProjectId { get; set; }
        public Guid RepoId { get; set; }

        private ConnectionSettings() 
        { 
        }

        public ConnectionSettings(Guid projectId, Guid repoId)
        {
            ProjectId = Guid.TryParseExact(projectId.ToString(), "D", out Guid pid) 
                ? pid : throw new ArgumentException("Malformed Guid", nameof(projectId));

            RepoId = Guid.TryParseExact(repoId.ToString(), "D", out Guid rid)
                ? rid : throw new ArgumentException("Malformed Guid", nameof(repoId));
        }

        internal void SetIfUnset(string projectId = "", string repoId = "")
        {
            if (GetValue<Guid>(projectId) == Guid.Empty
                && Guid.TryParseExact(projectId, "D", out Guid result1))
            {
                _cache[projectId] = result1;
            }

            if (GetValue<Guid>(repoId) == Guid.Empty
                && Guid.TryParseExact(repoId, "D", out Guid result2))
            {
                _cache[repoId] = result2;
            }
        }

        public bool TryGetValue<T>(string key, out T value)
        {
            return _cache.TryGetValue<T>(key, out value);
        }

        public T GetValue<T>(string key)
        {
            return (T)_cache[key];
        }

        public void SetValue<T>(string key, T value)
        {
            _cache[key] = value;
        }

        public void RemoveValue(string name)
        {
            _cache.Remove(name);
        }

        public override bool Equals([NotNullWhen(true)] object? obj)
        {
            return obj is ConnectionSettings other && this.Equals(other);
        }

        public bool Equals(ConnectionSettings other)
        {
            return other.ProjectId == ProjectId && other.RepoId == RepoId;
        }

        public static bool operator==(ConnectionSettings lhs, ConnectionSettings rhs)
        {
            return lhs.Equals(rhs);
        }

        public static bool operator!=(ConnectionSettings lhs, ConnectionSettings rhs)
        {
            return !(lhs == rhs);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(RepoId, ProjectId);
        }
    }
}
