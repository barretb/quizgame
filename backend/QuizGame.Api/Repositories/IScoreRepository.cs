using QuizGame.Api.Models;

namespace QuizGame.Api.Repositories;

public interface IScoreRepository
{
    Task AddAsync(ScoreRecord record);
    Task<IEnumerable<ScoreRecord>> GetAllAsync();
}
