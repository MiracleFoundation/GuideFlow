namespace GuideFlow.Enums;

/// <summary>
/// Controls the alignment of the popover relative to the target element.
/// Used with Side to determine exact popover positioning.
/// </summary>
public enum PopoverAlign
{
    /// <summary>
    /// Align popover to the start of the target edge.
    /// </summary>
    Start,

    /// <summary>
    /// Align popover to the center of the target edge (default).
    /// </summary>
    Center,

    /// <summary>
    /// Align popover to the end of the target edge.
    /// </summary>
    End
}
