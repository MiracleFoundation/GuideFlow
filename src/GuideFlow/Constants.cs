using GuideFlow.Enums;

namespace GuideFlow;

/// <summary>
/// Shared constants used across GuideFlow. Avoids magic strings.
/// </summary>
internal static class Constants
{
    // --- Tour ---

    /// <summary>Default tour name when none is specified.</summary>
    public const string DefaultTourName = "default";

    /// <summary>Default CSS class added to highlighted target elements.</summary>
    public const string DefaultHighlightClass = "gf-highlight-active";

    /// <summary>Default scrollIntoView block option.</summary>
    public const ScrollBlock DefaultScrollBlock = ScrollBlock.Center;

    /// <summary>Default placement for popovers and arrows.</summary>
    public const Placement DefaultPlacement = Placement.Bottom;

    /// <summary>JS module path for GuideFlow.</summary>
    public const string JsModulePath = "./_content/GuideFlow/guideflow.module.js";

    /// <summary>Prefix for localStorage keys.</summary>
    public const string StorageKeyPrefix = "guideflow_";

    // --- CSS Body Classes ---

    /// <summary>Body class applied when a tour is active.</summary>
    public const string BodyClassActive = "gf-active";

    /// <summary>Body class applied when animations are enabled.</summary>
    public const string BodyClassAnimate = "gf-animate";

    /// <summary>Body class applied when animations are disabled.</summary>
    public const string BodyClassNoAnimate = "gf-no-animate";

    // --- Default Button Text ---

    /// <summary>Default "Next" button text.</summary>
    public const string DefaultNextText = "Next";

    /// <summary>Default "Back" button text.</summary>
    public const string DefaultBackText = "Back";

    /// <summary>Default "Skip" button text.</summary>
    public const string DefaultSkipText = "Skip";

    /// <summary>Default "Done" button text.</summary>
    public const string DefaultDoneText = "Done";

    /// <summary>Default close button aria-label.</summary>
    public const string DefaultCloseLabel = "Close tour";

    /// <summary>Default step aria-label prefix.</summary>
    public const string DefaultStepAriaLabel = "Tour step";

    /// <summary>Default progress text template.</summary>
    public const string DefaultProgressTemplate = "{0} of {1}";
}
