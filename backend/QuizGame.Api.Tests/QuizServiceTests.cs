using Xunit;
using QuizGame.Api.Tests.Helpers;

namespace QuizGame.Api.Tests;

/// <summary>
/// Unit tests for QuizService — quiz loading, validation, and retrieval.
///
/// Dependencies: QuizService, IMemoryCache, file system (or abstraction).
/// All tests are stubs pending QuizGame.Api project scaffold.
/// </summary>
public class QuizServiceTests
{
    // ---------------------------------------------------------------------------
    // LoadQuizzesAsync
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task LoadQuizzesAsync_ReturnsAllQuizzes()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Create a temp directory with 3 valid *.quiz.json files (10+ questions each)
        // - Instantiate QuizService with that directory path and a mock IMemoryCache
        // - Expected: all 3 quizzes returned

        // Act
        // var result = await quizService.LoadQuizzesAsync();

        // Assert
        // result.Should().HaveCount(3);
        Assert.True(false, "Not implemented");
    }

    [Fact]
    public async Task LoadQuizzesAsync_QuizWithFewerThan10Questions_IsExcluded()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Directory has 2 files: one valid (10 questions), one invalid (9 questions)
        // - Expected: only the valid quiz is returned

        // Act
        // var result = await quizService.LoadQuizzesAsync();

        // Assert
        // result.Should().HaveCount(1);
        // result.First().Questions.Should().HaveCountGreaterThanOrEqualTo(10);
        Assert.True(false, "Not implemented");
    }

    // ---------------------------------------------------------------------------
    // GetQuizByIdAsync
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task GetQuizByIdAsync_ValidId_ReturnsFullQuiz()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Load a quiz service with a known quiz file
        // - Expected: quiz returned with all fields populated (quizId, title, topic,
        //   description, version, questions with correctIndex included)

        // Act
        // var result = await quizService.GetQuizByIdAsync("quiz-1");

        // Assert
        // result.Should().NotBeNull();
        // result!.QuizId.Should().Be("quiz-1");
        // result.Questions.Should().AllSatisfy(q => q.CorrectIndex.Should().BeInRange(0, 3));
        Assert.True(false, "Not implemented");
    }

    [Fact]
    public async Task GetQuizByIdAsync_InvalidId_ReturnsNull()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Load quiz service with no quiz matching "nonexistent-id"

        // Act
        // var result = await quizService.GetQuizByIdAsync("nonexistent-id");

        // Assert
        // result.Should().BeNull();
        Assert.True(false, "Not implemented");
    }

    // ---------------------------------------------------------------------------
    // GetQuizSummaries (list endpoint — no questions in payload)
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task GetQuizSummaries_DoesNotIncludeQuestions()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Verify the list response (GET /api/quizzes) omits the questions array
        //   (or returns an empty array) to keep the payload lightweight.
        // - Summaries should include: quizId, title, topic, description, version

        // Act
        // var summaries = await quizService.GetQuizSummariesAsync();

        // Assert
        // summaries.Should().AllSatisfy(s =>
        //     s.Should().NotHaveProperty("Questions")
        //     // OR: s.Questions.Should().BeNullOrEmpty()
        // );
        Assert.True(false, "Not implemented");
    }
}
