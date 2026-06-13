using System.Text.RegularExpressions;

namespace GuideFlow.Enums;

/// <summary>
/// Extension methods for converting GuideFlow enums to CSS-compatible lowercase strings.
/// </summary>
internal static partial class EnumExtensions
{
    /// <summary>
    /// Converts a Placement enum value to its CSS-compatible lowercase string (e.g., "top-start").
    /// </summary>
    public static string ToCssString(this Placement value) => InsertHyphens(value.ToString());

    /// <summary>
    /// Converts a ScrollBlock enum value to its CSS-compatible lowercase string (e.g., "center").
    /// </summary>
    public static string ToCssString(this ScrollBlock value) => value.ToString().ToLowerInvariant();

    /// <summary>
    /// Converts a ButtonType enum value to its CSS-compatible lowercase string (e.g., "next").
    /// </summary>
    public static string ToCssString(this ButtonType value) => value.ToString().ToLowerInvariant();

    /// <summary>
    /// Converts a ScrollBehavior enum value to its CSS-compatible lowercase string (e.g., "smooth").
    /// </summary>
    public static string ToCssString(this ScrollBehavior value) => value.ToString().ToLowerInvariant();

    /// <summary>
    /// Inserts hyphens before uppercase letters and lowercases the result.
    /// "TopStart" → "top-start", "Bottom" → "bottom", "Auto" → "auto"
    /// </summary>
    private static string InsertHyphens(string value) =>
        HyphenPattern().Replace(value, "-$1").TrimStart('-').ToLowerInvariant();

    [GeneratedRegex("([A-Z])")]
    private static partial Regex HyphenPattern();
}
