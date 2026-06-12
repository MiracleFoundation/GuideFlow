namespace GuideFlow.Enums;

/// <summary>
/// Controls what happens when the user clicks the overlay backdrop.
/// Driver.js: overlayClickBehavior
/// </summary>
public enum OverlayClickBehavior
{
    /// <summary>
    /// Close/destroy the tour when overlay is clicked.
    /// </summary>
    Close,

    /// <summary>
    /// Advance to the next step when overlay is clicked.
    /// </summary>
    NextStep,

    /// <summary>
    /// Do nothing when overlay is clicked.
    /// </summary>
    None
}
