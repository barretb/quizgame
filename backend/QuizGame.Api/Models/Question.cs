namespace QuizGame.Api.Models;

public record Question(
    string QuestionId,
    string Text,
    List<string> Options,
    int CorrectIndex,
    string Explanation
);
