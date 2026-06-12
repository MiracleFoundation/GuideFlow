namespace GuideFlow.Enums;

/// <summary>
/// Shape of the highlighted area around the target element.
/// </summary>
public enum HighlightShape
{
    /// <summary>
    /// Rounded rectangle (default).
    /// </summary>
    RoundedRect,

    /// <summary>
    /// Rectangle with no border radius.
    /// </summary>
    Rectangle,

    /// <summary>
    /// Circle/ellipse centered on the target.
    /// </summary>
    Circle,

    /// <summary>
    /// Ellipse that matches the target's aspect ratio.
    /// </summary>
    Ellipse
}
