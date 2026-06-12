using GuideFlow.Components;

namespace GuideFlow.Models;

/// <summary>
/// Current state of a GuideFlow tour.
/// Passed to hooks and callbacks, similar to Driver.js State.
/// Different from TourState (used for persistence).
/// </summary>
public class GuideFlowState
{
    /// <summary>Whether the tour is currently active.
    /// Driver.js: isInitialized</summary>
    public bool IsInitialized { get; set; }

    /// <summary>Index of the currently active step.
    /// Driver.js: activeIndex</summary>
    public int ActiveIndex { get; set; }

    /// <summary>CSS selector of the currently active step's target element.
    /// Driver.js: activeElement (returns selector in Blazor)</summary>
    public string? ActiveElement { get; set; }

    /// <summary>The currently active step component.
    /// Driver.js: activeStep</summary>
    public GuideFlowStep? ActiveStep { get; set; }

    /// <summary>CSS selector of the previously active step's target element.
    /// Driver.js: previousElement</summary>
    public string? PreviousElement { get; set; }

    /// <summary>The previously active step component.
    /// Driver.js: previousStep</summary>
    public GuideFlowStep? PreviousStep { get; set; }
}

/// <summary>
/// Context passed to hooks and callbacks.
/// Matches Driver.js: { config, state, driver }
/// </summary>
public class TourContext
{
    /// <summary>Current tour configuration.
    /// Driver.js: options.config</summary>
    public TourOptions Config { get; set; } = new();

    /// <summary>Current tour state.
    /// Driver.js: options.state</summary>
    public GuideFlowState State { get; set; } = new();

    /// <summary>Reference to the tour component.
    /// Driver.js: options.driver</summary>
    public GuideFlowTour Driver { get; set; } = null!;
}
