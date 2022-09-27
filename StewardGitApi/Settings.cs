using System.Diagnostics.CodeAnalysis;

using Microsoft.VisualStudio.Services.Common;

namespace StewardGitApi
{
    public class Settings
    {
        private readonly Dictionary<string, object> cache = new ();
        private readonly Guid projectId;
        private readonly Guid repoId;

        internal static Settings Default => new (Guid.Empty, Guid.Empty);

        internal (Guid projectId, Guid repoId) Ids => (projectId, repoId);

        private Settings()
        {
        }

        public Settings(Guid projectId, Guid repoId)
        {
            this.projectId = Guid.TryParseExact(projectId.ToString(), "D", out Guid pid)
                ? pid : throw new ArgumentException("Malformed Guid", nameof(projectId));

            this.repoId = Guid.TryParseExact(repoId.ToString(), "D", out Guid rid)
                ? rid : throw new ArgumentException("Malformed Guid", nameof(repoId));
        }

        public bool TryGetValue<T>(string key, out T value)
        {
            return cache.TryGetValue<T>(key, out value);
        }

        public T GetValue<T>(string key)
        {
            return (T)cache[key];
        }

        public void CacheValue<T>(string key, T value)
        {
            cache[key] = value;
        }

        public void RemoveValue(string name)
        {
            cache.Remove(name);
        }

        public override bool Equals([NotNullWhen(true)] object? obj)
        {
            return obj is Settings other && this.Equals(other);
        }

        public bool Equals(Settings other)
        {
            return other.projectId == projectId && other.repoId == repoId;
        }

        public static bool operator ==(Settings lhs, Settings rhs)
        {
            return lhs.Equals(rhs);
        }

        public static bool operator !=(Settings lhs, Settings rhs)
        {
            return !(lhs == rhs);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(repoId, projectId);
        }
    }
}
