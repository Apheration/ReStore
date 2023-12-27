using API.Data;
using API.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args); // creating the backend

// Add services to the container. (uses dependency injection)

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// lambda will reference the method
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
//Cross Origin Resource Sharing - in case client and back end are on two different domains. browser will otherwise deny request
builder.Services.AddCors();

var app = builder.Build(); // build our application into a variable called app
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); //redirects http to https

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
});

app.UseAuthorization();

app.MapControllers();

// for getting dbcontext object and allowing framework to handle cleanup, see bottom of file
var scope   = app.Services.CreateScope(); // creates separate instances
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger  = scope.ServiceProvider.GetRequiredService<ILogger<Program>>(); // Program class being logged

try
{
    context.Database.Migrate();
    DbInitializer.Initialize(context);
}
catch (Exception ex)
{
    // use logger to conviently get useful debug info in terminal/debug info
	logger.LogError(ex, "A problem occured during migration");
}

app.Run();


/* We need to get hold of a service without using Dependancy injection as that is not available to us in the Program class.    So we create a scope (how long do we need the service for and something to dispose of when we have finished with the service), then we go and get the service we need, in this case the StoreContext and the Logger.*/