using Microsoft.Extensions.Caching.Memory;
using QuizGame.Api.Models;
using System.Text.Json;

namespace QuizGame.Api.Services;

public class QuizService : IQuizService
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<QuizService> _logger;
    private readonly string _quizDirectory;
    private const string CacheKey = "all_quizzes";

    private static readonly JsonSerializerOptions FileSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    public QuizService(IMemoryCache cache, IWebHostEnvironment env, ILogger<QuizService> logger)
    {
        _cache = cache;
        _logger = logger;
        _quizDirectory = Path.Combine(env.ContentRootPath, "Data", "Quizzes");
    }

    public async Task<IEnumerable<Quiz>> GetAllAsync()
    {
        if (_cache.TryGetValue(CacheKey, out List<Quiz>? cached) && cached != null)
            return cached;

        var quizzes = await LoadQuizzesFromDiskAsync();
        _cache.Set(CacheKey, quizzes, TimeSpan.FromHours(1));
        return quizzes;
    }

    public async Task<IEnumerable<QuizSummary>> GetSummariesAsync()
    {
        var quizzes = await GetAllAsync();
        return quizzes.Select(q => new QuizSummary(q.QuizId, q.Title, q.Topic, q.Description, q.Questions.Count));
    }

    public async Task<Quiz?> GetByIdAsync(string id)
    {
        var quizzes = await GetAllAsync();
        return quizzes.FirstOrDefault(q => q.QuizId == id);
    }

    private async Task<List<Quiz>> LoadQuizzesFromDiskAsync()
    {
        var quizzes = new List<Quiz>();

        if (!Directory.Exists(_quizDirectory))
        {
            _logger.LogWarning("Quiz directory not found: {Dir}", _quizDirectory);
            return quizzes;
        }

        foreach (var file in Directory.GetFiles(_quizDirectory, "*.json"))
        {
            try
            {
                var json = await File.ReadAllTextAsync(file);
                var quiz = JsonSerializer.Deserialize<Quiz>(json, FileSerializerOptions);

                if (quiz is null)
                {
                    _logger.LogWarning("Skipping {File}: failed to deserialize", file);
                    continue;
                }

                var expectedId = Path.GetFileNameWithoutExtension(file);
                if (quiz.QuizId != expectedId)
                {
                    _logger.LogWarning(
                        "Skipping {File}: quizId '{QuizId}' does not match filename '{Expected}'",
                        file, quiz.QuizId, expectedId);
                    continue;
                }

                if (quiz.Questions.Count < 10)
                {
                    _logger.LogWarning(
                        "Skipping {File}: only {Count} question(s) — minimum 10 required",
                        file, quiz.Questions.Count);
                    continue;
                }

                quizzes.Add(quiz);
                _logger.LogInformation("Loaded quiz: {QuizId} ({Count} questions)", quiz.QuizId, quiz.Questions.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load quiz from {File}", file);
            }
        }

        return quizzes;
    }
}
