namespace QuizGame.Api.Models;

public record AnswerSubmission(
    string QuestionId,
    int SelectedIndex
);

public record ScoreRequest(
    string QuizId,
    List<AnswerSubmission> Answers
);
