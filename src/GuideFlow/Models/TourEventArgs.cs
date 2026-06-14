namespace GuideFlow.Models;

/// <summary>
/// Event arguments for tour lifecycle events.
/// </summary>
public class TourEventArgs : EventArgs
{
    public string? TourName { get; set; }
    public int CurrentStepIndex { get; set; }
    public int TotalSteps { get; set; }
}

/// <summary>
/// Event arguments when the active step changes.
/// </summary>
public class StepChangeEventArgs : EventArgs
{
    public int PreviousStepIndex { get; set; }
    public int ActiveIndex { get; set; }
    public int TotalSteps { get; set; }
    public string? StepId { get; set; }
    public string? Selector { get; set; }
}

/// <summary>
/// Event arguments before a step is shown. Can be used to cancel.
/// </summary>
public class BeforeStepChangeEventArgs : EventArgs
{
    public int CurrentStepIndex { get; set; }
    public int TargetStepIndex { get; set; }

    /// <summary>
    /// Set to true to prevent the step change.
    /// </summary>
    public bool Cancel { get; set; }
}
