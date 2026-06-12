namespace GuideFlow;

/// <summary>
/// Shared constants used across GuideFlow. Avoids magic strings.
/// </summary>
internal static class Constants
{
    /// <summary>Default tour name when none is specified.</summary>
    public const string DefaultTourName = "default";

    /// <summary>Default CSS class added to highlighted target elements.</summary>
    public const string DefaultHighlightClass = "gf-highlight-active";

    /// <summary>Default scrollIntoView block option.</summary>
    public const string DefaultScrollBlock = "center";

    /// <summary>Default placement for popovers and arrows.</summary>
    public const string DefaultPlacement = "bottom";

    /// <summary>JS module path for GuideFlow.</summary>
    public const string JsModulePath = "./_content/GuideFlow/guideflow.module.js";

    /// <summary>Prefix for localStorage keys.</summary>
    public const string StorageKeyPrefix = "guideflow_";
}
