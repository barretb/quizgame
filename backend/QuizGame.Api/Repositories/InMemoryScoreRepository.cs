using QuizGame.Api.Models;
using System.Collections.Concurrent;

namespace QuizGame.Api.Repositories;

public class InMemoryScoreRepository : IScoreRepository
{
    private readonly ConcurrentDictionary<Guid, ScoreRecord> _scores = new();

    public Task AddAsync(ScoreRecord record)
    {
        _scores[Guid.NewGuid()] = record;
        return Task.CompletedTask;
    }

    public Task<IEnumerable<ScoreRecord>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<ScoreRecord>>(_scores.Values);
    }
}
