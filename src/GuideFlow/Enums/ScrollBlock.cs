namespace GuideFlow.Enums;

/// <summary>
/// Controls the vertical alignment of the target element within the viewport after scrolling.
/// Maps to the CSS scrollIntoView block option.
/// </summary>
public enum ScrollBlock
{
    /// <summary>
    /// Target is centered in the viewport. Default behavior.
    /// </summary>
    Center,

    /// <summary>
    /// Target aligns to the top of the viewport.
    /// </summary>
    Start,

    /// <summary>
    /// Target aligns to the bottom of the viewport.
    /// </summary>
    End,

    /// <summary>
    /// Scrolls the minimum amount needed to make the target visible.
    /// </summary>
    Nearest
}
