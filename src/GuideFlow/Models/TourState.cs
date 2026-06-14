using GuideFlow.Enums;

namespace GuideFlow.Models;

/// <summary>
/// Serializable state of a tour, used for persistence.
/// </summary>
public class TourState
{
    /// <summary>
    /// Name/identifier of the tour.
    /// </summary>
    public string TourName { get; set; } = string.Empty;

    /// <summary>
    /// Index of the current step.
    /// </summary>
    public int ActiveIndex { get; set; }

    /// <summary>
    /// Total number of steps in the tour.
    /// </summary>
    public int TotalSteps { get; set; }

    /// <summary>
    /// Current status of the tour.
    /// </summary>
    public TourStatus Status { get; set; } = TourStatus.NotStarted;

    /// <summary>
    /// IDs of completed steps.
    /// </summary>
    public List<string> CompletedStepIds { get; set; } = new();

    /// <summary>
    /// Timestamp when the tour was last updated.
    /// </summary>
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Whether the tour has been completed.
    /// </summary>
    public bool IsCompleted => Status == TourStatus.Completed;
}
