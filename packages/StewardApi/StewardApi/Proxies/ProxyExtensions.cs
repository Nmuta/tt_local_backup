using Castle.DynamicProxy;

namespace Turn10.LiveOps.StewardApi.Proxies
{
    /// <summary>
    ///     Extensions for generating class proxies.
    /// </summary>
    public static class ProxyExtensions
    {
        private static ProxyGenerator Generator { get; } = new ProxyGenerator();

        /// <summary>
        ///     Generates a proxy for TClass which pretends to implement TInterface. Methods must match.
        /// </summary>
        /// <typeparam name="TClass">The target class.</typeparam>
        /// <typeparam name="TInterface">The "fake" interface.</typeparam>
        /// <param name="source">Source class.</param>
        public static TInterface ProxyInterface<TClass, TInterface>(this TClass source)
            where TInterface : class
            where TClass : class
        {
            var interceptor = ProxyInterceptor<TClass>.CreateVerified<TInterface>(source);
            var proxy = Generator.CreateInterfaceProxyWithoutTarget<TInterface>(interceptor.ToInterceptor());
            return proxy;
        }
    }
}
