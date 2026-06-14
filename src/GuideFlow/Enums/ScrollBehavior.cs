namespace GuideFlow.Enums;

/// <summary>
/// Controls how the tour scrolls to bring target elements into view.
/// </summary>
public enum ScrollBehavior
{
    /// <summary>
    /// Smooth scroll to the target element (default).
    /// </summary>
    Smooth,

    /// <summary>
    /// Instant scroll (no animation).
    /// </summary>
    Instant,

    /// <summary>
    /// No scrolling — the step appears at the target's current position.
    /// </summary>
    None
}
