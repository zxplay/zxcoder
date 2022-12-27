using System.Text.Json;
using Serilog;
using Serilog.Events;
using SteveR.Auth;
using SteveR.Auth.Repositories;

// Configure Serilog.
Log.Logger = new LoggerConfiguration()
#if DEBUG
    .MinimumLevel.Debug()
#else
    .MinimumLevel.Information()
#endif
    // Write streamlined request completion events, instead of the more verbose ones from the framework.
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .Enrich.WithMachineName() // Adds MachineName based on either %COMPUTERNAME% (Windows) or $HOSTNAME (macOS, Linux)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();

builder.Configuration.AddEnvironmentVariables(prefix: "AUTH_");

// Add repositories.
builder.Services.AddTransient<CookieRepository>();
builder.Services.AddTransient<SessionRepository>();
builder.Services.AddTransient<UserRepository>();

builder.Services.AddCors();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

var corsOrigin = app.Configuration["CorsOrigin"];

#if DEBUG

if (corsOrigin == null)
{
    corsOrigin = Codespaces.GetCorsOrigin();
}

#endif

if (corsOrigin != null)
{
    app.UseCors(
        options => options
            .WithOrigins(JsonSerializer.Deserialize<List<string>>(corsOrigin)!.ToArray())
            .AllowCredentials()
            .AllowAnyMethod()
    );
}

// app.UseAuthorization();

app.MapControllers();

app.Run();