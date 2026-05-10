namespace QuizGame.Api.Models;

public record Quiz(
    string QuizId,
    string Title,
    string Topic,
    string Description,
    string Version,
    List<Question> Questions
);
