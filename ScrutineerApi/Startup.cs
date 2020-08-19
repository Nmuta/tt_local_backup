using CsvHelper.Configuration;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using static Turn10.LiveOps.ScrutineerApi.ApplicationSettings;

namespace Turn10.LiveOps.ScrutineerApi
{
    /// <summary>
    ///     Entry point for the app.
    /// </summary>
    public sealed class Startup
    {
        private readonly IConfiguration configuration;

        /// <summary>
        ///     Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        ///     Configures the services.
        /// </summary>
        /// <param name="services">The services.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMicrosoftWebApiAuthentication(this.configuration, "AzureAd");
            services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
            {
                // Use the groups claim for populating roles
                options.TokenValidationParameters.RoleClaimType = "roles";
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(AuthorizationPolicy.AssignmentToLiveOpsAdminRoleRequired, policy => policy.RequireRole(AppRole.LiveOpsAdmin));
                options.AddPolicy(AuthorizationPolicy.AssignmentToLiveOpsAgentRoleRequired, policy => policy.RequireRole(AppRole.LiveOpsAgent));
            });
            services.AddControllers();
            services.AddSwaggerGen();
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });
        }

        /// <summary>
        ///     Configures the app.
        /// </summary>
        /// <param name="applicationBuilder">The application builder.</param>
        /// <param name="webHostEnvironment">The web host environment.</param>
        public void Configure(IApplicationBuilder applicationBuilder, IWebHostEnvironment webHostEnvironment)
        {
            if (webHostEnvironment.IsDevelopment())
            {
                applicationBuilder.UseDeveloperExceptionPage();
            }

            applicationBuilder.UseCors("CorsPolicy");
            applicationBuilder.UseSwagger();
            applicationBuilder.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            applicationBuilder.UseHttpsRedirection();
            applicationBuilder.UseAuthentication();
            applicationBuilder.UseRouting();
            applicationBuilder.UseAuthorization();
            applicationBuilder.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
