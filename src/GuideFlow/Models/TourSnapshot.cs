namespace GuideFlow.Models;

/// <summary>
/// Serializable snapshot of the current tour state, used by GuideFlowTour.GetState().
/// Replaces anonymous types to support IL trimming via JSON source generation.
/// </summary>
public sealed class TourSnapshot
{
    public string? TourName { get; init; }
    public bool IsActive { get; init; }
    public int ActiveIndex { get; init; }
    public int TotalSteps { get; init; }
    public string Status { get; init; } = string.Empty;
    public List<string> VisitedSteps { get; init; } = new();
    public List<TourSnapshotStep> Steps { get; init; } = new();
}

/// <summary>
/// Serializable snapshot of a single step within a TourSnapshot.
/// </summary>
public sealed class TourSnapshotStep
{
    public string Element { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public int Order { get; init; }
    public string? StepId { get; init; }
    public Enums.Placement Side { get; init; }
    public bool IsVisited { get; init; }
}
