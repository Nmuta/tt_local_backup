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
            services.AddMicrosoftWebApiAuthentication(this.configuration);
            services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
            {
                // Use the groups claim for populating roles
                options.TokenValidationParameters.RoleClaimType = "roles";
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(AuthorizationPolicies.AssignmentToLiveOpsAdminRoleRequired, policy => policy.RequireRole(AppRole.LiveOpsAdmin));
                options.AddPolicy(AuthorizationPolicies.AssignmentToLiveOpsAgentRoleRequired, policy => policy.RequireRole(AppRole.LiveOpsAgent));
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
        /// <param name="app">The app.</param>
        /// <param name="webHostEnvironment">The web host environment.</param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment webHostEnvironment)
        {
            if (webHostEnvironment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();
            app.UseCors("CorsPolicy");
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
