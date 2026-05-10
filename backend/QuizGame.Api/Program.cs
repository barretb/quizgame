using QuizGame.Api.Models;
using QuizGame.Api.Repositories;
using QuizGame.Api.Services;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// JSON: camelCase serialization for all API responses
builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);

// Memory cache for quiz files (1-hour absolute expiry)
builder.Services.AddMemoryCache();

// CORS — origins configured in appsettings.json
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
    options.AddPolicy("QuizGamePolicy", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()));

// OpenAPI (dev only — served at /openapi/v1.json)
builder.Services.AddOpenApi();

// Domain services
builder.Services.AddSingleton<IQuizService, QuizService>();
builder.Services.AddSingleton<IScoreRepository, InMemoryScoreRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("QuizGamePolicy");

// ── Health ────────────────────────────────────────────────────────────────────

app.MapGet("/health", () =>
    Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
   .WithName("GetHealth");

// ── Quizzes ───────────────────────────────────────────────────────────────────

app.MapGet("/api/quizzes", async (IQuizService quizService) =>
    Results.Ok(await quizService.GetSummariesAsync()))
   .WithName("GetQuizzes");

app.MapGet("/api/quizzes/{id}", async (string id, IQuizService quizService) =>
{
    var quiz = await quizService.GetByIdAsync(id);
    return quiz is null ? Results.NotFound() : Results.Ok(quiz);
}).WithName("GetQuizById");

// ── Scores ────────────────────────────────────────────────────────────────────

app.MapPost("/api/scores", async (ScoreRequest request, IQuizService quizService, IScoreRepository scoreRepo) =>
{
    if (request.Answers is null || request.Answers.Count == 0)
        return Results.BadRequest(new { error = "Answers array must not be empty." });

    if (request.Answers.Any(a => a.SelectedIndex < 0 || a.SelectedIndex > 3))
        return Results.BadRequest(new { error = "Each selectedIndex must be between 0 and 3." });

    var quiz = await quizService.GetByIdAsync(request.QuizId);
    if (quiz is null)
        return Results.NotFound(new { error = $"Quiz '{request.QuizId}' not found." });

    var questionMap = quiz.Questions.ToDictionary(q => q.QuestionId);

    var questionResults = request.Answers
        .Where(a => questionMap.ContainsKey(a.QuestionId))
        .Select(a =>
        {
            var q = questionMap[a.QuestionId];
            return new QuestionResult(a.QuestionId, a.SelectedIndex, q.CorrectIndex, a.SelectedIndex == q.CorrectIndex);
        })
        .ToList();

    var correctCount = questionResults.Count(r => r.IsCorrect);
    var total = quiz.Questions.Count;
    var percentage = total > 0 ? Math.Round((double)correctCount / total * 100, 1) : 0.0;
    var passed = percentage >= 60.0;

    var result = new ScoreResult(request.QuizId, total, correctCount, percentage, passed, questionResults);

    await scoreRepo.AddAsync(new ScoreRecord(request.QuizId, correctCount, total, percentage, DateTime.UtcNow));

    return Results.Ok(result);
}).WithName("PostScore");

app.Run();
