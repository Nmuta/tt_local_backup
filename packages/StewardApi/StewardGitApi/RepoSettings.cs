using Microsoft.VisualStudio.Services.Common;
using System.Diagnostics.CodeAnalysis;

namespace StewardGitApi
{
    /// <summary>
    ///     Represents settings for the current connection.
    /// </summary>
    public class RepoSettings
    {
        private readonly Dictionary<string, object> cache = new();
        private readonly Guid projectId;
        private readonly Guid repoId;

        /// <summary>
        ///     Initializes a new instance of the <see cref="RepoSettings"/> class.
        /// </summary>
        public RepoSettings(Guid projectId, Guid repoId)
        {
            this.projectId = Guid.TryParseExact(projectId.ToString(), "D", out Guid pid)
                ? pid : throw new ArgumentException("Malformed Guid", nameof(projectId));

            this.repoId = Guid.TryParseExact(repoId.ToString(), "D", out Guid rid)
                ? rid : throw new ArgumentException("Malformed Guid", nameof(repoId));
        }

        private RepoSettings()
        {
        }

        /// <summary>
        ///     Gets a tuple of project and repo ids.
        /// </summary>
        public (Guid projectId, Guid repoId) Ids => (this.projectId, this.repoId);

        /// <summary>
        ///     Gets an empty settings object.
        /// </summary>
        internal static RepoSettings Default => new(Guid.Empty, Guid.Empty);

        public static bool operator ==(RepoSettings lhs, RepoSettings rhs)
        {
            return lhs.Equals(rhs);
        }

        public static bool operator !=(RepoSettings lhs, RepoSettings rhs)
        {
            return !(lhs == rhs);
        }

        /// <summary>
        ///     Retrieves cached values.
        /// </summary>
        /// <typeparam name="T">Type of value.</typeparam>
        public bool TryGetValue<T>(string key, out T value)
        {
            return this.cache.TryGetValue<T>(key, out value);
        }

        /// <summary>
        ///     Retrives cached values.
        /// </summary>
        /// <typeparam name="T">Type of value.</typeparam>
        public T GetValue<T>(string key)
        {
            return (T)this.cache[key];
        }

        /// <summary>
        ///     Caches custom values.
        /// </summary>
        /// <typeparam name="T">Type of value.</typeparam>
        public void CacheValue<T>(string key, T value)
        {
            this.cache[key] = value;
        }

        /// <summary>
        ///     Removes value from cache.
        /// </summary>
        public void RemoveValue(string name)
        {
            this.cache.Remove(name);
        }

        /// <summary>
        ///     Test whether two <see cref="RepoSettings"/> objects are equal.
        /// </summary>
        public override bool Equals([NotNullWhen(true)] object obj)
        {
            return obj is RepoSettings other && this.Equals(other);
        }

        /// <summary>
        ///     Tests whether two <see cref="RepoSettings"/> objects are equal.
        /// </summary>
        public bool Equals(RepoSettings other)
        {
            return other.projectId == this.projectId && other.repoId == this.repoId;
        }

        /// <summary>
        ///     The hashcode.
        /// </summary>
        public override int GetHashCode()
        {
            return HashCode.Combine(this.repoId, this.projectId);
        }
    }
}
