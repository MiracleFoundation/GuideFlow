using GuideFlow.Components;

namespace GuideFlow.Models;

/// <summary>
/// Current state of a GuideFlow tour.
/// Passed to hooks and callbacks.
/// Different from TourState (used for persistence).
/// </summary>
public class GuideFlowState
{
    /// <summary>Whether the tour is currently active.</summary>
    public bool IsInitialized { get; set; }

    /// <summary>Index of the currently active step.</summary>
    public int ActiveIndex { get; set; }

    /// <summary>CSS selector of the currently active step's target element.</summary>
    public string? ActiveElement { get; set; }

    /// <summary>The currently active step component.</summary>
    public GuideFlowStep? ActiveStep { get; set; }

    /// <summary>CSS selector of the previously active step's target element.</summary>
    public string? PreviousElement { get; set; }

    /// <summary>The previously active step component.</summary>
    public GuideFlowStep? PreviousStep { get; set; }
}

/// <summary>
/// Context passed to hooks and callbacks.
/// </summary>
public class TourContext
{
    /// <summary>Current tour configuration.</summary>
    public TourOptions Config { get; set; } = new();

    /// <summary>Current tour state.</summary>
    public GuideFlowState State { get; set; } = new();

    /// <summary>Reference to the tour component.</summary>
    public GuideFlowTour Driver { get; set; } = null!;
}
