using Xunit;
using QuizGame.Api.Tests.Helpers;

namespace QuizGame.Api.Tests;

/// <summary>
/// Unit tests for score calculation logic.
///
/// The score calculator receives a quiz and a list of answer submissions and returns a ScoreResult.
/// Key contract: percentage = (correctCount / totalQuestions) * 100, passed = percentage >= 60.
/// All tests are stubs pending QuizGame.Api project scaffold.
/// </summary>
public class ScoreCalculatorTests
{
    // ---------------------------------------------------------------------------
    // Percentage calculations
    // ---------------------------------------------------------------------------

    [Fact]
    public void CalculateScore_AllCorrect_Returns100Percent()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Build a 10-question quiz with correctIndex = 0 for all questions
        // - Submit all answers with selectedIndex = 0

        // var quiz = QuizFixtures.MakeQuiz(questionCount: 10);
        // var answers = QuizFixtures.AllCorrectAnswers(quiz);
        // var calculator = new ScoreCalculator(); // or the DI equivalent

        // Act
        // var result = calculator.Calculate(quiz, answers);

        // Assert
        // result.Percentage.Should().Be(100.0);
        // result.CorrectCount.Should().Be(10);
        // result.Passed.Should().BeTrue();
        Assert.True(false, "Not implemented");
    }

    [Fact]
    public void CalculateScore_AllWrong_Returns0Percent()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Submit all answers with selectedIndex != correctIndex

        // var quiz = QuizFixtures.MakeQuiz(questionCount: 10);
        // var answers = QuizFixtures.AllWrongAnswers(quiz);
        // var calculator = new ScoreCalculator();

        // Act
        // var result = calculator.Calculate(quiz, answers);

        // Assert
        // result.Percentage.Should().Be(0.0);
        // result.CorrectCount.Should().Be(0);
        // result.Passed.Should().BeFalse();
        Assert.True(false, "Not implemented");
    }

    [Fact]
    public void CalculateScore_HalfCorrect_Returns50Percent()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - 10-question quiz; 5 answered correctly, 5 wrong

        // var quiz = QuizFixtures.MakeQuiz(questionCount: 10);
        // var answers = QuizFixtures.HalfCorrectAnswers(quiz);
        // var calculator = new ScoreCalculator();

        // Act
        // var result = calculator.Calculate(quiz, answers);

        // Assert
        // result.Percentage.Should().Be(50.0);
        // result.CorrectCount.Should().Be(5);
        // result.Passed.Should().BeFalse(); // 50 < 60 threshold
        Assert.True(false, "Not implemented");
    }

    // ---------------------------------------------------------------------------
    // Per-question result accuracy
    // ---------------------------------------------------------------------------

    [Fact]
    public void CalculateScore_CorrectIndexMatchesExpected()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Build a quiz where each question has a distinct correctIndex (0, 1, 2, 3, 0, ...)
        // - Submit a mix of correct and incorrect answers
        // - Verify each QuestionResult carries the right correctIndex from the quiz definition

        // var questions = new[]
        // {
        //     QuizFixtures.MakeQuestion(0, correctIndex: 0),
        //     QuizFixtures.MakeQuestion(1, correctIndex: 2),
        //     QuizFixtures.MakeQuestion(2, correctIndex: 3),
        // };
        // var quiz = quiz with { Questions = questions };
        // var answers = new[] { new AnswerSubmission("q0", 0), new AnswerSubmission("q1", 1), new AnswerSubmission("q2", 3) };

        // Act
        // var result = calculator.Calculate(quiz, answers);

        // Assert
        // result.QuestionResults[0].CorrectIndex.Should().Be(0);
        // result.QuestionResults[0].IsCorrect.Should().BeTrue();
        // result.QuestionResults[1].CorrectIndex.Should().Be(2);
        // result.QuestionResults[1].IsCorrect.Should().BeFalse();
        // result.QuestionResults[2].CorrectIndex.Should().Be(3);
        // result.QuestionResults[2].IsCorrect.Should().BeTrue();
        Assert.True(false, "Not implemented");
    }
}
