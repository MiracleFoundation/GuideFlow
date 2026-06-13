namespace GuideFlow.Enums;

/// <summary>
/// Identifies a button in the tour popover footer.
/// Used for ShowButtons and DisableButtons configuration.
/// </summary>
public enum ButtonType
{
    /// <summary>
    /// The "Next" / "Done" button that advances the tour.
    /// </summary>
    Next,

    /// <summary>
    /// The "Back" / "Previous" button that goes to the prior step.
    /// </summary>
    Previous,

    /// <summary>
    /// The "Close" button that cancels the tour.
    /// </summary>
    Close,

    /// <summary>
    /// The "Skip" button that skips the current step.
    /// </summary>
    Skip
}
