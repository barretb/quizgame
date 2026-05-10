namespace QuizGame.Api.Models;

public record QuizSummary(
    string Id,
    string Title,
    string Topic,
    string Description,
    int QuestionCount
);
