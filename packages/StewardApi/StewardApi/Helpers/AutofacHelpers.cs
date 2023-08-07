using System;
using System.Reflection;
using Autofac;
using Autofac.Core;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Useful extensions for dealing with Autofac.
    /// </summary>
    public static class AutofacHelpers
    {
        /// <summary>
        ///     Produces a <see cref="ResolvedParameter"/> predicate that matches by name.
        /// </summary>
        public static Func<ParameterInfo, IComponentContext, bool> Named(string name)
            => (paramInfo, context) => paramInfo.Name == name;

        /// <summary>
        ///     Produces a <see cref="ResolvedParameter"/> resolver that resolves by name.
        /// </summary>
        public static Func<ParameterInfo, IComponentContext, object> With<T>(string name)
            => (paramInfo, context) => context.ResolveNamed<T>(name);
    }
}
