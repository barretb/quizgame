using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using QuizGame.Api.Tests.Helpers;
using System.Net;
using System.Net.Http.Json;

namespace QuizGame.Api.Tests;

/// <summary>
/// Integration tests for the QuizGame REST API endpoints.
/// Uses WebApplicationFactory to spin up the API in-process.
///
/// NOTE: Uncomment and adjust once QuizGame.Api project is referenced.
/// All tests are stubs pending QuizGame.Api project scaffold.
/// </summary>
public class ApiEndpointTests // : IClassFixture<WebApplicationFactory<Program>>
{
    // private readonly HttpClient _client;
    //
    // public ApiEndpointTests(WebApplicationFactory<Program> factory)
    // {
    //     _client = factory.WithWebHostBuilder(builder =>
    //     {
    //         builder.ConfigureServices(services =>
    //         {
    //             // Override quiz data directory to point at test fixtures
    //         });
    //     }).CreateClient();
    // }

    // ---------------------------------------------------------------------------
    // GET /api/quizzes
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task GetQuizzes_Returns200WithList()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Seed test quiz data (2+ valid quiz files)
        // - Expected: 200 OK, JSON array of quiz summaries (no questions array)

        // Act
        // var response = await _client.GetAsync("/api/quizzes");

        // Assert
        // response.StatusCode.Should().Be(HttpStatusCode.OK);
        // var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        // body.GetArrayLength().Should().BeGreaterThan(0);
        Assert.True(false, "Not implemented");
    }

    // ---------------------------------------------------------------------------
    // GET /api/quizzes/{id}
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task GetQuizById_ValidId_Returns200WithCorrectIndex()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Seed a quiz with id "sample-quiz"
        // - Expected: 200 OK, quiz object including questions with correctIndex field

        // Act
        // var response = await _client.GetAsync("/api/quizzes/sample-quiz");

        // Assert
        // response.StatusCode.Should().Be(HttpStatusCode.OK);
        // var quiz = await response.Content.ReadFromJsonAsync<Quiz>();
        // quiz.Should().NotBeNull();
        // quiz!.Questions.Should().AllSatisfy(q => q.CorrectIndex.Should().BeInRange(0, 3));
        Assert.True(false, "Not implemented");
    }

    [Fact]
    public async Task GetQuizById_InvalidId_Returns404()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Request a quiz id that does not exist

        // Act
        // var response = await _client.GetAsync("/api/quizzes/does-not-exist");

        // Assert
        // response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        Assert.True(false, "Not implemented");
    }

    // ---------------------------------------------------------------------------
    // POST /api/scores
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task PostScores_ValidPayload_Returns200WithResults()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - Seed a valid 10-question quiz
        // - Build a ScoreRequest with answers for all 10 questions
        // - Expected: 200 OK, ScoreResult with totalQuestions=10, correctCount, percentage, passed, questionResults

        // var quiz = QuizFixtures.MakeQuiz(questionCount: 10);
        // var request = new ScoreRequest(quiz.QuizId, QuizFixtures.AllCorrectAnswers(quiz));

        // Act
        // var response = await _client.PostAsJsonAsync("/api/scores", request);

        // Assert
        // response.StatusCode.Should().Be(HttpStatusCode.OK);
        // var result = await response.Content.ReadFromJsonAsync<ScoreResult>();
        // result.Should().NotBeNull();
        // result!.TotalQuestions.Should().Be(10);
        // result.Percentage.Should().Be(100.0);
        // result.Passed.Should().BeTrue();
        // result.QuestionResults.Should().HaveCount(10);
        Assert.True(false, "Not implemented");
    }

    // ---------------------------------------------------------------------------
    // GET /health
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task GetHealth_Returns200()
    {
        // Arrange
        // TODO: implement when scaffold is available
        // - No setup needed — health endpoint has no dependencies

        // Act
        // var response = await _client.GetAsync("/health");

        // Assert
        // response.StatusCode.Should().Be(HttpStatusCode.OK);
        Assert.True(false, "Not implemented");
    }
}
