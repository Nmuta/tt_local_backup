using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using Autofac;
using Autofac.Core;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using Azure.Identity;
using Kusto.Cloud.Platform.Utils;
using Microsoft.ApplicationInsights.AspNetCore.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.Documents.SystemFunctions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Bson;
using Newtonsoft.Json.Converters;
using StewardGitApi;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.JsonConverters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Hubs;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Middleware;
using Turn10.LiveOps.StewardApi.Obligation;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.BigCat;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.MsGraph;
using Turn10.LiveOps.StewardApi.Providers.MsTeams;
using Turn10.LiveOps.StewardApi.Providers.Opus;
using Turn10.LiveOps.StewardApi.Providers.Opus.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Pipelines;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.LiveOps.StewardApi.Validation.Apollo;
using Turn10.LiveOps.StewardApi.Validation.Steelhead;
using Turn10.LiveOps.StewardApi.Validation.Sunrise;
using Turn10.LiveOps.StewardApi.Validation.Woodstock;
using Turn10.Services.CMSRetrieval;
using Turn10.Services.Diagnostics;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using Turn10.Services.Storage.Blob;
using static Turn10.LiveOps.StewardApi.Common.ApplicationSettings;
using static Turn10.LiveOps.StewardApi.Helpers.AutofacHelpers;
using AppRole = Turn10.LiveOps.StewardApi.Common.ApplicationSettings.AppRole;
using SteelheadV2Providers = Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;

namespace Turn10.LiveOps.StewardApi
{
    /// <summary>
    ///     Entry point for the app.
    /// </summary>
    [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "This can't be avoided.")]
    public sealed class Startup
    {
        private readonly IConfiguration configuration;

        private IServiceCollection allServices;

        /// <summary>
        ///     Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        ///     Gets the autofac container.
        /// </summary>
        public ILifetimeScope AutofacContainer { get; private set; }

        /// <summary>
        ///     Configures the services.
        /// </summary>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();

            // If you are setting "redacted due to PII" when debugging certificates/dates/identities, enable this.
            // IdentityModelEventSource.ShowPII = true;
            services.AddControllers();
            services.AddMvc(options => options.Filters.Add(new ServiceExceptionFilter()));
            services.AddApiVersioning(o =>
            {
                o.AssumeDefaultVersionWhenUnspecified = true;
                o.DefaultApiVersion = new ApiVersion(1, 0);
                o.ReportApiVersions = true;
                o.UseApiBehavior = false;
            });

            services.AddVersionedApiExplorer(o =>
            {
                o.GroupNameFormat = "'v'VVV";
                o.SubstituteApiVersionInUrl = true;
                o.AssumeDefaultVersionWhenUnspecified = true;
                o.DefaultApiVersion = new ApiVersion(1, 0);
            });

            services.AddSwaggerGen();
            services.AddSwaggerGenNewtonsoftSupport();
            services.ConfigureOptions<ConfigureSwaggerOptions>();

            services.AddMemoryCache();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            });
            services.AddMicrosoftIdentityWebApiAuthentication(this.configuration);
            services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                var existingOnMessageReceivedHandler = options.Events.OnMessageReceived;
                options.Events.OnMessageReceived = async context =>
                {
                    await existingOnMessageReceivedHandler(context).ConfigureAwait(false);

                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs", StringComparison.InvariantCulture))
                    {
                        context.Token = accessToken;
                    }
                };
            });
            services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
            {
                // Use the groups claim for populating roles
                options.TokenValidationParameters.RoleClaimType = "roles";
                options.TokenValidationParameters.NameClaimType = "name";
            });

            services.Configure<IISServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            services.AddHttpClient("STS")
                .ConfigurePrimaryHttpMessageHandler((Func<IServiceProvider, HttpMessageHandler>)delegate
                {
                    HttpClientHandler httpClientHandler = new HttpClientHandler
                    {
                        AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate,
                    };

                    var keyVaultProvider = new KeyVaultProvider(new KeyVaultClientFactory());

                    var certificateSecret = keyVaultProvider.GetSecretAsync(
                        this.configuration[ConfigurationKeyConstants.KeyVaultUrl],
                        this.configuration[ConfigurationKeyConstants.StsSecretName]).GetAwaiter().GetResult();

                    var stsForgeryCertificate = StsClientWrapper.ConvertToCertificate(certificateSecret);
                    httpClientHandler.ClientCertificates.Add(stsForgeryCertificate);

                    return httpClientHandler;
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(ApplicationSettings.AuthorizationPolicy.AssignmentToLiveOpsAdminRoleRequired, policy => policy.RequireRole(AppRole.LiveOpsAdmin));
                options.AddPolicy(ApplicationSettings.AuthorizationPolicy.AssignmentToLiveOpsAgentRoleRequired, policy => policy.RequireRole(AppRole.LiveOpsAgent));

                // All policies get registered here
                UserAttributeValues.AllAttributes().ToList().ForEach(attr => options.AddPolicy(attr, policy => policy.Requirements.Add(new AttributeRequirement(attr))));
            });

            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.Converters = new List<JsonConverter>
                {
                    new TimeSpanConverter(),
                    new StringEnumConverter()
                };
            });

            services.AddSignalR().AddNewtonsoftJsonProtocol();

            services.AddApplicationInsightsTelemetry(
                new ApplicationInsightsServiceOptions
                {
                    EnableAdaptiveSampling = false,
                });

            services.AddCors(options =>
            {
                options.AddPolicy(
                    "CorsPolicy",
                    builder =>
                        builder
                            .WithOrigins(
                                "http://localhost:4200",
                                "https://steward-ui-dev.azurewebsites.net",
                                "https://steward-ui-dev-staging.azurewebsites.net",
                                "https://steward-ui-prod.azurewebsites.net",
                                "https://steward-ui-prod-staging.azurewebsites.net")
                            .AllowCredentials()
                            .AllowAnyMethod()
                            .AllowAnyHeader());
            });

            this.allServices = services;
        }

        /// <summary>
        ///     Register directly with Autofac.
        /// </summary>
        public void ConfigureContainer(ContainerBuilder builder)
        {
            var keyVaultProvider = new KeyVaultProvider(new KeyVaultClientFactory());

            ProviderRegistrations.Register(builder);
            ProxyRegistrations.Register(builder);
            this.RegisterForzaClients(builder);
            this.RegisterWoodstockTypes(builder);
            this.RegisterSunriseTypes(builder);
            this.RegisterOpusTypes(builder);
            this.RegisterSteelheadTypes(builder);
            this.RegisterApolloTypes(builder);

            // This is the first place we pull from KV. Errors here may be related to needing to
            // re-verify your VS account. Click File -> Account Settings -> Check under "All Accounts"
            var keyVaultConfig = KeyVaultConfig.FromKeyVaultUrlAsync(this.configuration).GetAwaiter().GetResult();
            builder.Register(c => keyVaultConfig).As<KeyVaultConfig>().SingleInstance();

            // Kusto
            var kustoClientSecret = keyVaultConfig.KustoClientSecret;

            var kustoLoggerConfiguration = new KustoConfiguration();

            this.configuration.Bind("KustoLoggerConfiguration", kustoLoggerConfiguration);
            kustoLoggerConfiguration.ClientSecret = kustoClientSecret;
            var kustoStreamingLogger = new KustoStreamingLogger(new KustoFactory(kustoLoggerConfiguration));
            builder.Register(c => kustoStreamingLogger).As<IKustoStreamingLogger>().SingleInstance();

            var kustoConfiguration = new KustoConfiguration();
            this.configuration.Bind("KustoConfiguration", kustoConfiguration);
            kustoConfiguration.ClientSecret = kustoClientSecret;
            var kustoProvider = new KustoProvider(new KustoFactory(kustoConfiguration), new LocalCacheStore(), this.configuration);
            builder.Register(c => kustoProvider).As<IKustoProvider>().SingleInstance();

            // MS Graph Service
            var tenantId = this.configuration[ConfigurationKeyConstants.AzureTenantId];
            var clientId = this.configuration[ConfigurationKeyConstants.AzureClientId];
            var servicePrincipalId = this.configuration[ConfigurationKeyConstants.AzureServicePrincipalId];
            var clientSecret = keyVaultConfig.AzureAuthClientSecret;

            var clientSecretCredential = new ClientSecretCredential(tenantId, clientId, clientSecret);
            var scopes = new[] { "https://graph.microsoft.com/.default" };
            var graphServiceClient = new GraphServiceClient(clientSecretCredential, scopes);
            builder.Register(c => new MsGraphService(graphServiceClient, servicePrincipalId)).As<IMsGraphService>().SingleInstance();

            // MS Teams Service
            var teamsHelpChannelWebhook = keyVaultConfig.TeamsHelpChannelWebhook;
            builder.Register(c => new MsTeamsService(teamsHelpChannelWebhook)).As<IMsTeamsService>().SingleInstance();

            builder.Register(c => this.configuration).As<IConfiguration>().SingleInstance();
            builder.RegisterType<KeyVaultClientFactory>().As<IKeyVaultClientFactory>().SingleInstance();
            builder.RegisterType<KeyVaultProvider>().As<IKeyVaultProvider>().SingleInstance();
            builder.RegisterType<ObligationAuthoringClient>().As<IObligationAuthoringClient>().SingleInstance();
            builder.RegisterType<ObligationProvider>().As<IObligationProvider>().SingleInstance();
            builder.RegisterType<UserIdProvider>().As<IUserIdProvider>().SingleInstance();

            var mappingConfiguration = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new OpusProfileMapper());
                mc.AddProfile(new SunriseProfileMapper());
                mc.AddProfile(new ApolloProfileMapper());
                mc.AddProfile(new SteelheadProfileMapper());
                mc.AddProfile(new WoodstockProfileMapper());
                mc.AddProfile(new DataProfileMapper());
                mc.AllowNullCollections = true;
                mc.IgnoreUnmapped(); // TODO: Should we remove this and correct all the mappings: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1347837
            });
            mappingConfiguration.AssertConfigurationIsValid();
            var mapper = mappingConfiguration.CreateMapper();
            builder.Register(c => mapper).As<IMapper>().SingleInstance();

            // Woodstock PlayFab Service
            var woodstockPlayFabConfig = new WoodstockPlayFabConfig();
            woodstockPlayFabConfig.Environments.Add(WoodstockPlayFabEnvironment.Dev, new PlayFabConfig()
            {
                TitleId = keyVaultConfig.WoodstockPlayFabDevTitleId,
                Key = keyVaultConfig.WoodstockPlayFabDevKey,
            });
            woodstockPlayFabConfig.Environments.Add(WoodstockPlayFabEnvironment.Retail, new PlayFabConfig()
            {
                TitleId = keyVaultConfig.WoodstockPlayFabProdTitleId,
                Key = keyVaultConfig.WoodstockPlayFabProdKey,
            });
            builder.Register(c => new WoodstockPlayFabService(woodstockPlayFabConfig, mapper)).As<IWoodstockPlayFabService>().SingleInstance();

            builder.RegisterType<KeyVaultProvider>().As<IKeyVaultProvider>().SingleInstance();
            builder.RegisterType<StsClientWrapper>().As<IStsClient>().SingleInstance();
            builder.RegisterType<LoggingService>().As<ILoggingService>().SingleInstance();

            builder.RegisterType<TaskExecutionScheduler>().As<IScheduler>().SingleInstance();
            builder.RegisterType<LocalCacheStore>().As<IRefreshableCacheStore>().SingleInstance();
            builder.RegisterType<KeyVaultClientFactory>().As<IKeyVaultClientFactory>().SingleInstance();
            builder.RegisterType<TableStorageClientFactory>().As<ITableStorageClientFactory>().SingleInstance();
            builder.RegisterType<NotificationHistoryProvider>().As<INotificationHistoryProvider>().SingleInstance();
            builder.RegisterType<BlobStorageProvider>().As<IBlobStorageProvider>().SingleInstance();
            builder.RegisterType<AzureDevOpsFactory>().As<IAzureDevOpsFactory>().SingleInstance();

            var blobConnectionString = keyVaultConfig.BlobConnectionString;
            var blobRepo = new BlobRepository(new CloudBlobProxy(blobConnectionString));
            builder.Register(c => blobRepo).As<IBlobRepository>().SingleInstance();

            builder.RegisterType<HubManager>().SingleInstance();
            builder.RegisterType<JobTracker>().AsImplementedInterfaces().SingleInstance();
            builder.RegisterType<PlayFabBuildLocksProvider>().AsImplementedInterfaces().SingleInstance();
            builder.RegisterType<KustoQueryProvider>().AsImplementedInterfaces().SingleInstance();
            builder.RegisterType<StewardUserProvider>().AsImplementedInterfaces().SingleInstance();
            builder.RegisterType<BigCatService>().AsImplementedInterfaces().SingleInstance();
            builder.RegisterType<AuthorizationAttributeHandler>().As<IAuthorizationHandler>().SingleInstance();
            builder.RegisterType<PolicyResultAuthorizationMiddleware>().As<IAuthorizationMiddlewareResultHandler>().SingleInstance();
            builder.RegisterType<ForumBanHistoryProvider>().As<IForumBanHistoryProvider>().SingleInstance();

            var pegasusProvider = PegasusCmsProvider.SetupPegasusCmsProvider(this.configuration, keyVaultProvider);
            builder.Register(c => pegasusProvider).As<PegasusCmsProvider>().SingleInstance();

            // Scoped items
            builder.RegisterType<ActionData>().InstancePerLifetimeScope();
            builder.RegisterType<ActionLogger>().As<IActionLogger>().InstancePerLifetimeScope();
        }

        /// <summary>
        ///     Configures the app.
        /// </summary>
        public void Configure(IApplicationBuilder applicationBuilder, IWebHostEnvironment webHostEnvironment, IApiVersionDescriptionProvider provider)
        {
            // initialize everything
            var componentContext = applicationBuilder.ApplicationServices.GetService<IComponentContext>();
            var initializeableServices = componentContext.Resolve<IEnumerable<IInitializeable>>();
            var initializationTasks = initializeableServices
                .Select(s => s.InitializeAsync())
                .ToList();
            Task.WhenAll(initializationTasks).GetAwaiter().GetResult();

            if (webHostEnvironment.IsDevelopment())
            {
                applicationBuilder.UseDeveloperExceptionPage();
            }

            applicationBuilder.UseCors("CorsPolicy");
            applicationBuilder.UseMiddleware<EasyAuthSwaggerMiddleware>();
            applicationBuilder.UseSwagger();
            applicationBuilder.UseSwaggerUI(c =>
            {
                c.OAuthScopes(new[] { $"api://{this.configuration[ConfigurationKeyConstants.AzureClientId]}/api_access" });
                foreach (var description in provider.ApiVersionDescriptions.Reverse())
                {
                    c.SwaggerEndpoint(
                        $"/swagger/{description.GroupName}/swagger.json",
                        description.GroupName.ToUpperInvariant());
                }

                c.OAuthClientId(this.configuration[ConfigurationKeyConstants.AzureClientId]);
                c.OAuthScopeSeparator(" ");
                c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
            });

            applicationBuilder.UseHttpsRedirection();
            applicationBuilder.UseAuthentication();
            applicationBuilder.UseRouting();
            applicationBuilder.UseAuthorization();

            applicationBuilder.Use(next => context =>
            {
                context.Request.EnableBuffering();
                return next(context);
            });

            applicationBuilder.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<NotificationsHub>("/hubs/notifications");
            });

            applicationBuilder.UseMiddleware<JournalMiddleware>();
        }

        private void RegisterForzaClients(ContainerBuilder builder)
        {
            builder.RegisterType<Client>().Named<Client>("woodstockClientProdLiveSteward")
                .WithParameter(Named("logonMessageCryptoProvider"), (p, c) => new CleartextMessageCryptoProvider())
                .WithParameter(Named("defaultMessageCryptoProvider"), (p, c) => new CleartextMessageCryptoProvider())
                .WithParameter(Named("clientVersion"), (p, c) => c.Resolve<WoodstockSettings>().ClientVersion)
                .WithParameter(Named("cmsInstance"), (p, c) => this.GenerateCmsOverrideString(WoodstockPegasusEnvironment.Prod, WoodstockPegasusSlot.LiveSteward));

            builder.RegisterType<Client>().Named<Client>("woodstockClientDevLiveSteward")
                .WithParameter(Named("logonMessageCryptoProvider"), (p, c) => new CleartextMessageCryptoProvider())
                .WithParameter(Named("defaultMessageCryptoProvider"), (p, c) => new CleartextMessageCryptoProvider())
                .WithParameter(Named("clientVersion"), (p, c) => c.Resolve<WoodstockSettings>().ClientVersion)
                .WithParameter(Named("cmsInstance"), (p, c) => this.GenerateCmsOverrideString(WoodstockPegasusEnvironment.Dev, WoodstockPegasusSlot.LiveSteward));
        }

        private string GenerateCmsOverrideString(string environment, string slot)
        {
            return $"{environment}-x{slot}";
        }

        private void RegisterSteelheadTypes(ContainerBuilder builder)
        {
            builder.RegisterType<SteelheadServiceWrapper>().As<ISteelheadService>().SingleInstance();
            builder.RegisterType<SteelheadPegasusService>().As<ISteelheadPegasusService>().SingleInstance();
            builder.RegisterType<SteelheadServiceFactory>().As<ISteelheadServiceFactory>().SingleInstance();
            builder.RegisterType<SteelheadPlayerDetailsProvider>().As<ISteelheadPlayerDetailsProvider>().SingleInstance();
            builder.RegisterType<SteelheadPlayerInventoryProvider>().As<ISteelheadPlayerInventoryProvider>().SingleInstance();
            builder.RegisterType<SteelheadServiceManagementProvider>().As<ISteelheadServiceManagementProvider>().SingleInstance();
            builder.RegisterType<SteelheadNotificationProvider>().As<ISteelheadNotificationProvider>().SingleInstance();
            builder.RegisterType<SteelheadBanHistoryProvider>().As<ISteelheadBanHistoryProvider>().SingleInstance();
            builder.RegisterType<SteelheadGiftHistoryProvider>().As<ISteelheadGiftHistoryProvider>().SingleInstance();

            // V2 Providers
            builder.RegisterType<SteelheadV2Providers.SteelheadItemsProvider>().As<SteelheadV2Providers.ISteelheadItemsProvider>().SingleInstance();
            builder.RegisterType<SteelheadV2Providers.SteelheadGiftHistoryProvider>().As<SteelheadV2Providers.ISteelheadGiftHistoryProvider>().SingleInstance();
            builder.RegisterType<SteelheadV2Providers.SteelheadPlayerInventoryProvider>().As<SteelheadV2Providers.ISteelheadPlayerInventoryProvider>().SingleInstance();
            builder.RegisterType<SteelheadV2Providers.SteelheadServiceManagementProvider>().As<SteelheadV2Providers.ISteelheadServiceManagementProvider>().SingleInstance();

            builder.RegisterType<SteelheadBanParametersRequestValidator>().As<IRequestValidator<SteelheadBanParametersInput>>().SingleInstance();
            builder.RegisterType<SteelheadGroupGiftRequestValidator>().As<IRequestValidator<SteelheadGroupGift>>().SingleInstance();
            builder.RegisterType<SteelheadGiftRequestValidator>().As<IRequestValidator<SteelheadGift>>().SingleInstance();
            builder.RegisterType<SteelheadMasterInventoryRequestValidator>().As<IRequestValidator<SteelheadMasterInventory>>().SingleInstance();
            builder.RegisterType<SteelheadPlayerInventoryItemUpdateRequestValidator>().As<IRequestValidator<SteelheadPlayerInventory>>().SingleInstance();
            builder.RegisterType<SteelheadUserFlagsRequestValidator>().As<IRequestValidator<SteelheadUserFlagsInput>>().SingleInstance();
        }

        private void RegisterApolloTypes(ContainerBuilder builder)
        {
            builder.RegisterType<ApolloServiceWrapper>().As<IApolloService>().SingleInstance();
            builder.RegisterType<ApolloPlayerDetailsProvider>().As<IApolloPlayerDetailsProvider>().SingleInstance();
            builder.RegisterType<ApolloPlayerInventoryProvider>().As<IApolloPlayerInventoryProvider>().SingleInstance();
            builder.RegisterType<ApolloBanHistoryProvider>().As<IApolloBanHistoryProvider>().SingleInstance();
            builder.RegisterType<ApolloServiceManagementProvider>().As<IApolloServiceManagementProvider>().SingleInstance();
            builder.RegisterType<ApolloGiftHistoryProvider>().As<IApolloGiftHistoryProvider>().SingleInstance();
            builder.RegisterType<ApolloStorefrontProvider>().As<IApolloStorefrontProvider>().SingleInstance();

            builder.RegisterType<ApolloBanParametersRequestValidator>().As<IRequestValidator<ApolloBanParametersInput>>().SingleInstance();
            builder.RegisterType<ApolloMasterInventoryRequestValidator>().As<IRequestValidator<ApolloMasterInventory>>().SingleInstance();
            builder.RegisterType<ApolloUserFlagsRequestValidator>().As<IRequestValidator<ApolloUserFlagsInput>>().SingleInstance();
            builder.RegisterType<ApolloGiftRequestValidator>().As<IRequestValidator<ApolloGift>>().SingleInstance();
            builder.RegisterType<ApolloGroupGiftRequestValidator>().As<IRequestValidator<ApolloGroupGift>>().SingleInstance();
        }

        private void RegisterWoodstockTypes(ContainerBuilder builder)
        {
            builder.RegisterType<WoodstockServiceWrapper>().As<IWoodstockService>().SingleInstance();
            builder.RegisterType<WoodstockPegasusService>().As<IWoodstockPegasusService>().SingleInstance();
            builder.RegisterType<LiveProjectionWoodstockServiceFactory>().As<ILiveProjectionWoodstockServiceFactory>().SingleInstance();
            builder.RegisterType<StewardProjectionWoodstockServiceFactory>().As<IStewardProjectionWoodstockServiceFactory>().SingleInstance();
            builder.RegisterType<WoodstockPlayerDetailsProvider>().As<IWoodstockPlayerDetailsProvider>().SingleInstance();
            builder.RegisterType<WoodstockPlayerInventoryProvider>().As<IWoodstockPlayerInventoryProvider>().SingleInstance();
            builder.RegisterType<WoodstockServiceManagementProvider>().As<IWoodstockServiceManagementProvider>().SingleInstance();
            builder.RegisterType<WoodstockNotificationProvider>().As<IWoodstockNotificationProvider>().SingleInstance();
            builder.RegisterType<WoodstockBanHistoryProvider>().As<IWoodstockBanHistoryProvider>().SingleInstance();
            builder.RegisterType<WoodstockGiftHistoryProvider>().As<IWoodstockGiftHistoryProvider>().SingleInstance();
            builder.RegisterType<WoodstockStorefrontProvider>().As<IWoodstockStorefrontProvider>().SingleInstance();
            builder.RegisterType<WoodstockLeaderboardProvider>().As<IWoodstockLeaderboardProvider>().SingleInstance();
            builder.RegisterType<WoodstockItemsProvider>().As<IWoodstockItemsProvider>().SingleInstance();

            builder.RegisterType<WoodstockBanParametersRequestValidator>().As<IRequestValidator<WoodstockBanParametersInput>>().SingleInstance();
            builder.RegisterType<WoodstockGroupGiftRequestValidator>().As<IRequestValidator<WoodstockGroupGift>>().SingleInstance();
            builder.RegisterType<WoodstockGiftRequestValidator>().As<IRequestValidator<WoodstockGift>>().SingleInstance();
            builder.RegisterType<WoodstockMasterInventoryRequestValidator>().As<IRequestValidator<WoodstockMasterInventory>>().SingleInstance();
            builder.RegisterType<WoodstockUserFlagsRequestValidator>().As<IRequestValidator<WoodstockUserFlagsInput>>().SingleInstance();
        }

        private void RegisterSunriseTypes(ContainerBuilder builder)
        {
            builder.RegisterType<SunriseServiceWrapper>().As<ISunriseService>().SingleInstance();
            builder.RegisterType<SunriseServiceFactory>().As<ISunriseServiceFactory>().SingleInstance();
            builder.RegisterType<SunrisePlayerDetailsProvider>().As<ISunrisePlayerDetailsProvider>().SingleInstance();
            builder.RegisterType<SunrisePlayerInventoryProvider>().As<ISunrisePlayerInventoryProvider>().SingleInstance();
            builder.RegisterType<SunriseServiceManagementProvider>().As<ISunriseServiceManagementProvider>().SingleInstance();
            builder.RegisterType<SunriseNotificationProvider>().As<ISunriseNotificationProvider>().SingleInstance();
            builder.RegisterType<SunriseGiftHistoryProvider>().As<ISunriseGiftHistoryProvider>().SingleInstance();
            builder.RegisterType<SunriseBanHistoryProvider>().As<ISunriseBanHistoryProvider>().SingleInstance();
            builder.RegisterType<SunriseStorefrontProvider>().As<ISunriseStorefrontProvider>().SingleInstance();

            builder.RegisterType<SunriseMasterInventoryRequestValidator>().As<IRequestValidator<SunriseMasterInventory>>().SingleInstance();
            builder.RegisterType<SunriseBanParametersRequestValidator>().As<IRequestValidator<SunriseBanParametersInput>>().SingleInstance();
            builder.RegisterType<SunriseUserFlagsRequestValidator>().As<IRequestValidator<SunriseUserFlagsInput>>().SingleInstance();
            builder.RegisterType<SunriseGiftRequestValidator>().As<IRequestValidator<SunriseGift>>().SingleInstance();
            builder.RegisterType<SunriseGroupGiftRequestValidator>().As<IRequestValidator<SunriseGroupGift>>().SingleInstance();
        }

        private void RegisterOpusTypes(ContainerBuilder builder)
        {
            builder.RegisterType<OpusServiceWrapper>().As<IOpusService>().SingleInstance();
            builder.RegisterType<OpusPlayerDetailsProvider>().As<IOpusPlayerDetailsProvider>().SingleInstance();
            builder.RegisterType<OpusPlayerInventoryProvider>().As<IOpusPlayerInventoryProvider>().SingleInstance();
        }
    }

    /// <summary>
    /// Startup used for testing.
    /// </summary>
    public sealed class ControllerTestStartup
    {
        /// <summary>
        ///     Configures the services.
        /// </summary>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
        }

        /// <summary>
        ///     Configures the app.
        /// </summary>
        public void Configure(IApplicationBuilder applicationBuilder, IWebHostEnvironment webHostEnvironment, IApiVersionDescriptionProvider provider) { }
    }
}
