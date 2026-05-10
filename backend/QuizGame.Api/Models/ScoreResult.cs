namespace QuizGame.Api.Models;

public record ScoreResult(
    string QuizId,
    int TotalQuestions,
    int CorrectCount,
    double Percentage,
    bool Passed,
    List<QuestionResult> QuestionResults
);
