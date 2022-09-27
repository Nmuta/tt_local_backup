﻿using System.Diagnostics.CodeAnalysis;

using Microsoft.VisualStudio.Services.Common;

namespace StewardGitApi
{
    public class Settings
    {
        private readonly Dictionary<string, object> _cache = new();

        internal static Settings Default => new(Guid.Empty, Guid.Empty);

        internal (Guid projectId, Guid repoId) Ids => (ProjectId, RepoId);

        public Guid ProjectId { get; set; }
        public Guid RepoId { get; set; }

        private Settings()
        {
        }

        public Settings(Guid projectId, Guid repoId)
        {
            ProjectId = Guid.TryParseExact(projectId.ToString(), "D", out Guid pid)
                ? pid : throw new ArgumentException("Malformed Guid", nameof(projectId));

            RepoId = Guid.TryParseExact(repoId.ToString(), "D", out Guid rid)
                ? rid : throw new ArgumentException("Malformed Guid", nameof(repoId));
        }

        public bool TryGetValue<T>(string key, out T value)
        {
            return _cache.TryGetValue<T>(key, out value);
        }

        public T GetValue<T>(string key)
        {
            return (T)_cache[key];
        }

        public void CacheValue<T>(string key, T value)
        {
            _cache[key] = value;
        }

        public void RemoveValue(string name)
        {
            _cache.Remove(name);
        }

        public override bool Equals([NotNullWhen(true)] object? obj)
        {
            return obj is Settings other && this.Equals(other);
        }

        public bool Equals(Settings other)
        {
            return other.ProjectId == ProjectId && other.RepoId == RepoId;
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
            return HashCode.Combine(RepoId, ProjectId);
        }
    }
}
