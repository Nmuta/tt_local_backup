using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Autofac;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Middleware.ApiKeyAuth;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Filters
{
    /// <summary>
    ///     Attribute used to control action logging in Steward.
    /// </summary>
    [SuppressMessage("Performance", "CA1813:Avoid unsealed attributes", Justification = "By design, inherited from")]
    public class AutoActionLoggingAttribute : ActionFilterAttribute
    {
        private readonly bool logOnCompletion;
        private readonly TitleCodeName title;
        private readonly StewardAction action;
        private readonly StewardSubject subject;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AutoActionLoggingAttribute"/> class.
        /// </summary>
        public AutoActionLoggingAttribute(TitleCodeName title, StewardAction action, StewardSubject subject, bool logOnCompletion = true)
        {
            subject.ShouldNotBeNull(nameof(subject));
            action.ShouldNotBeNull(nameof(action));

            this.title = title;
            this.action = action;
            this.subject = subject;
            this.logOnCompletion = logOnCompletion;
        }

        /// <inheritdoc/>
        public override async Task OnActionExecutionAsync(
            ActionExecutingContext context,
            ActionExecutionDelegate next)
        {
            await this.LogSetupAsync(context).ConfigureAwait(false);
            var resultContext = await next().ConfigureAwait(false);
            await this.LogResultAsync(resultContext).ConfigureAwait(false);
        }

        private async Task LogSetupAsync(ActionExecutingContext context)
        {
            var componentContext = context.HttpContext.RequestServices.GetService<IComponentContext>();
            var actionData = componentContext.Resolve<ActionData>();
            actionData.ShouldNotBeNull(nameof(actionData));

            var routeDictionary = context.HttpContext.GetRouteData().Values;
            var recipientDictionary = new Dictionary<string, string>();
            foreach (var key in routeDictionary.Keys)
            {
                var shouldLog = key != "controller";

                if (routeDictionary.TryGetValue(key, out var value) && shouldLog)
                {
                    recipientDictionary.Add(key, value.ToString());
                }
            }

            actionData.RouteData = recipientDictionary;
            actionData.Action = this.action;
            actionData.Subject = this.subject;
            actionData.HttpMethod = context.HttpContext.Request.Method;
            actionData.RequestPath = context.HttpContext.Request.Path;
            actionData.Title = this.title.ToString();
            actionData.Endpoint = context.HttpContext.Request.GetEndpoint(this.title);

            // Requestor info: Check for user claims and API key
            // If neither are available, throw exception
            var userClaims = context.HttpContext.User.UserClaims();
            var hasUserClaims = userClaims.ObjectId != null;

            var methodInfo = (context.ActionDescriptor as ControllerActionDescriptor).MethodInfo;
            var controllerInfo = methodInfo.DeclaringType;
            var methodApiKeyAttribute = methodInfo.GetCustomAttributes<RequireApiKeyAttribute>().FirstOrDefault();
            var controllerApiKeyAttribute = controllerInfo.GetCustomAttributes<RequireApiKeyAttribute>().FirstOrDefault();
            var hasApiKey = methodApiKeyAttribute != null || controllerApiKeyAttribute != null;

            if (!hasUserClaims && !hasApiKey)
            {
                throw new ForbiddenStewardException("No user claim or API key found in request.");
            }

            if (hasUserClaims)
            {
                actionData.RequesterObjectId = userClaims.ObjectId;
                actionData.RequesterRole = userClaims.Role;
            }

            if (hasApiKey)
            {
                var apiKeyAttribute = methodApiKeyAttribute ?? controllerApiKeyAttribute;
                actionData.RequesterApiKeyName = apiKeyAttribute.ApiKeyName();
            }

            var body = await this.ReadBodyAsStringAsync(context.HttpContext.Request).ConfigureAwait(false);
            if (body.Length > 0)
            {
                actionData.Metadata = body.ToJson();
            }
        }

        private async Task LogResultAsync(ActionExecutedContext context)
        {
            var componentContext = context.HttpContext.RequestServices.GetService<IComponentContext>();
            var actionLogger = componentContext.Resolve<IActionLogger>();

            if (this.logOnCompletion && context.ModelState.IsValid && context.Exception == null)
            {
                await actionLogger.UpdateActionTrackingTableAsync().ConfigureAwait(false);
            }
        }

        private async Task<string> ReadBodyAsStringAsync(HttpRequest request)
        {
            var requestBody = string.Empty;
            var originalBody = request.Body;

            try
            {
                request.Body.Position = 0;
                using var requestStreamReader = new StreamReader(request.Body);
                requestBody = await requestStreamReader.ReadToEndAsync().ConfigureAwait(false);
            }
            finally
            {
                request.Body = originalBody;
            }

            return requestBody;
        }
    }
}
