using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args); // creating the backend

// Add services to the container. (uses dependency injection)

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in the box below",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme, Array.Empty<string>()
        }
    });
});
// lambda will reference the method
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
//Cross Origin Resource Sharing - in case client and back end are on two different domains. browser will otherwise deny request
builder.Services.AddCors();
// Will give us numerous tables related to roles
builder.Services.AddIdentityCore<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();

// For swagger 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
            .GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    });
builder.Services.AddAuthorization();
// 3 options - addscoped (scope of request, is alive for duration of http request)
// addtransient not kept alive for length of request
// addsingleton - kept alive for entire lifetime of application - create 1 instance to keep using then destroy when done
// WILL USE THIS SERVICE IN ACCOUNTCONTROLLER SORRY THE CAPS
builder.Services.AddScoped<TokenService>();


var app = builder.Build(); // build our application into a variable called app
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });
}

// app.UseHttpsRedirection(); //redirects http to https

/// 
/// MiddleWare
///
app.UseCors(opt =>
{
    //AllowCredentials() - for passing cookies between domains
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});

// must authenticate then authorize
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// for getting dbcontext object and allowing framework to handle cleanup, see bottom of file
var scope   = app.Services.CreateScope(); // creates separate instances
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger  = scope.ServiceProvider.GetRequiredService<ILogger<Program>>(); // Program class being logged

try
{
    await context.Database.MigrateAsync();
    // async Task
    await DbInitializer.Initialize(context, userManager);
}
catch (Exception ex)
{
    // use logger to conviently get useful debug info in terminal/debug info
	logger.LogError(ex, "A problem occured during migration");
}

app.Run();


/* We need to get hold of a service without using Dependancy injection as that is not available to us in the Program class.    So we create a scope (how long do we need the service for and something to dispose of when we have finished with the service), then we go and get the service we need, in this case the StoreContext and the Logger.*/