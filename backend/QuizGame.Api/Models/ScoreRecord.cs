namespace QuizGame.Api.Models;

public record ScoreRecord(
    string QuizId,
    int CorrectCount,
    int TotalQuestions,
    double Percentage,
    DateTime SubmittedAt
);
