using System;
using System.Linq;
using System.Reflection;
using Castle.DynamicProxy;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Proxies
{
    /// <summary>
    ///     Produces a proxy interceptor for a given class.
    ///     Matches method-names 1:1.
    /// </summary>
    /// <typeparam name="TClass">The target class instance.</typeparam>
    public class ProxyInterceptor<TClass> : IInterceptor
        where TClass : class
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProxyInterceptor{TClass}"/> class.
        /// </summary>
        private ProxyInterceptor(TClass target)
        {
            this.Target = target;
        }

        private TClass Target { get; }

        /// <summary>
        ///     Creates a proxy without verifying against an interface.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1000:Do not declare static members on generic types", Justification = "This is clearer.")]
        public static ProxyInterceptor<TClass> Create(TClass target)
        {
            return new ProxyInterceptor<TClass>(target);
        }

        /// <summary>
        ///     Creates a proxy, verifying against a target interface.
        /// </summary>
        /// <typeparam name="TTargetInterface">The target interface to verify against.</typeparam>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1000:Do not declare static members on generic types", Justification = "This is clearer.")]
        public static ProxyInterceptor<TClass> CreateVerified<TTargetInterface>(TClass target)
            where TTargetInterface : class
        {
            var proxy = Create(target);
            proxy.Verify<TTargetInterface>();
            return proxy;
        }

        /// <inheritdoc/>
        public void Intercept(IInvocation invocation)
        {
            var method = this.FindMethod(invocation);
            if (method == null)
            {
                throw new InvalidOperationException("Proxy: Could not find matching method");
            }

            if (method.ReturnType != null)
            {
                try
                {
                    invocation.ReturnValue = method.Invoke(this.Target, invocation.Arguments);
                }
                catch (Exception ex)
                {
                    throw new LspFailureStewardException($"Failed to invoke LSP call: {method.Name}", ex);
                }
            }
            else
            {
                try
                {
                    method.Invoke(this.Target, invocation.Arguments);
                }
                catch (Exception ex)
                {
                    throw new LspFailureStewardException($"Failed to invoke LSP call: {method.Name}", ex);
                }
            }
        }

        /// <summary>
        ///     Verifies the Target against a given interface, checking that all declared interface methods can be found in the Target.
        /// </summary>
        /// <typeparam name="TTargetInterface">The target interface to verify against.</typeparam>
        public void Verify<TTargetInterface>()
            where TTargetInterface : class
        {
            var interfaceMethods = typeof(TTargetInterface).GetMethods();
            foreach (var interfaceMethod in interfaceMethods)
            {
                var targetMethod = this.FindMethod(interfaceMethod);
                if (targetMethod == null)
                {
                    throw new InvalidOperationException($"Target is missing method {this.MethodIdentifier(interfaceMethod)}.");
                }

                if (targetMethod.ReturnType != interfaceMethod.ReturnType)
                {
                    throw new InvalidOperationException($"Return Types do not match on method {this.MethodIdentifier(interfaceMethod)}.");
                }
            }
        }

        private MethodInfo FindMethod(IInvocation invocation) => this.FindMethod(invocation.Method);

        private MethodInfo FindMethod(MethodInfo methodInfo)
        {
            var targetType = this.Target.GetType();

            var methodName = methodInfo.Name;
            var parameters = methodInfo.GetParameters();
            var parameterTypes = parameters.Select(x => x.ParameterType).ToArray();

            // This is another axis on which we can specify methods, but it wasn't immediately clear how to
            // make it work, and LSP doesn't use generics anyway, so I didn't bother. 2022-04-21
            ////var genericArgumentCount = methodInfo.GetGenericArguments().Length;

            return targetType.GetMethod(methodName, parameterTypes);
        }

        private string MethodIdentifier(MethodInfo methodInfo)
        {
            var methodParametersCsv = string.Join(", ", methodInfo.GetParameters()?.Select(p => $"{p.Name}:{p.ParameterType}")?.ToArray() ?? Array.Empty<string>());
            var methodArgumentsCsv = string.Join(",", methodInfo.GetGenericArguments()?.ToArray() ?? Array.Empty<object>());
            var methodArgumentsTag = methodParametersCsv.Length > 0 ? $"<{methodArgumentsCsv}>" : string.Empty;
            return $"'{methodInfo.Name}{methodArgumentsTag}' with parameters: {methodParametersCsv}";
        }
    }
}
