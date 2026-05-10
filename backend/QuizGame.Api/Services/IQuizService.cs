using QuizGame.Api.Models;

namespace QuizGame.Api.Services;

public interface IQuizService
{
    Task<IEnumerable<Quiz>> GetAllAsync();
    Task<IEnumerable<QuizSummary>> GetSummariesAsync();
    Task<Quiz?> GetByIdAsync(string id);
}
