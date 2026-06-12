namespace GuideFlow.Enums;

/// <summary>
/// Controls how the overlay is rendered around the highlighted element.
/// </summary>
public enum OverlayMode
{
    /// <summary>
    /// Full-screen overlay with a cutout hole around the target (default).
    /// </summary>
    Cutout,

    /// <summary>
    /// Four separate panels around the target, leaving the target area completely clear.
    /// Provides a "stage" spotlight effect.
    /// </summary>
    Stage
}
