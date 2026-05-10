// Test fixtures and helpers shared across test classes.
// Once QuizGame.Api project exists, add the ProjectReference in the .csproj and remove the placeholder stubs below.

namespace QuizGame.Api.Tests.Helpers;

/// <summary>
/// Placeholder model stubs — will be replaced by real models from QuizGame.Api once scaffold is available.
/// </summary>
public record QuizQuestion(
    string QuestionId,
    string Text,
    string[] Options,
    int CorrectIndex,
    string Explanation);

public record Quiz(
    string QuizId,
    string Title,
    string Topic,
    string Description,
    string Version,
    QuizQuestion[] Questions);

public record AnswerSubmission(string QuestionId, int SelectedIndex);

public record ScoreRequest(string QuizId, AnswerSubmission[] Answers);

public record QuestionResult(
    string QuestionId,
    int SelectedIndex,
    int CorrectIndex,
    bool IsCorrect);

public record ScoreResult(
    string QuizId,
    int TotalQuestions,
    int CorrectCount,
    double Percentage,
    bool Passed,
    QuestionResult[] QuestionResults);

/// <summary>
/// Factory methods for building valid test quizzes.
/// </summary>
public static class QuizFixtures
{
    public static QuizQuestion MakeQuestion(int index = 0, int correctIndex = 0) =>
        new(
            QuestionId: $"q{index}",
            Text: $"Sample question {index}?",
            Options: ["Option A", "Option B", "Option C", "Option D"],
            CorrectIndex: correctIndex,
            Explanation: $"Explanation for question {index}.");

    /// <summary>Builds a quiz with the given number of questions.</summary>
    public static Quiz MakeQuiz(string id = "quiz-1", int questionCount = 10) =>
        new(
            QuizId: id,
            Title: $"Quiz {id}",
            Topic: "General",
            Description: "A test quiz",
            Version: "1.0",
            Questions: Enumerable.Range(0, questionCount)
                                 .Select(i => MakeQuestion(i, correctIndex: 0))
                                 .ToArray());

    /// <summary>Builds answers where every question is answered correctly (selectedIndex = correctIndex = 0).</summary>
    public static AnswerSubmission[] AllCorrectAnswers(Quiz quiz) =>
        quiz.Questions.Select(q => new AnswerSubmission(q.QuestionId, q.CorrectIndex)).ToArray();

    /// <summary>Builds answers where every question is answered wrong (selectedIndex != correctIndex).</summary>
    public static AnswerSubmission[] AllWrongAnswers(Quiz quiz) =>
        quiz.Questions.Select(q => new AnswerSubmission(q.QuestionId, (q.CorrectIndex + 1) % 4)).ToArray();

    /// <summary>Builds answers where exactly half are correct.</summary>
    public static AnswerSubmission[] HalfCorrectAnswers(Quiz quiz)
    {
        var answers = new List<AnswerSubmission>();
        for (int i = 0; i < quiz.Questions.Length; i++)
        {
            var q = quiz.Questions[i];
            answers.Add(i % 2 == 0
                ? new AnswerSubmission(q.QuestionId, q.CorrectIndex)
                : new AnswerSubmission(q.QuestionId, (q.CorrectIndex + 1) % 4));
        }
        return [.. answers];
    }
}
