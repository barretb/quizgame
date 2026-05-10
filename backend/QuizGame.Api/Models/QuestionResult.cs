namespace QuizGame.Api.Models;

public record QuestionResult(
    string QuestionId,
    int SelectedIndex,
    int CorrectIndex,
    bool IsCorrect
);
