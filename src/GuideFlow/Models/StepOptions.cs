using GuideFlow.Enums;

namespace GuideFlow.Models;

/// <summary>
/// Configuration for an individual tour step. Used when defining steps programmatically.
/// </summary>
public class StepOptions
{
    /// <summary>
    /// CSS selector for the target element to highlight.
    /// Driver.js: element
    /// </summary>
    public string Element { get; set; } = string.Empty;

    /// <summary>
    /// Title displayed in the step popover header.
    /// Driver.js: popover.title
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Text content of the step. For simple text only; use ChildContent for rich content.
    /// Driver.js: popover.description
    /// </summary>
    public string? Text { get; set; }

    /// <summary>
    /// Which side of the target element the popover appears on.
    /// Driver.js: popover.side
    /// Default: Bottom
    /// </summary>
    public Placement Side { get; set; } = Placement.Bottom;

    /// <summary>
    /// Popover alignment relative to the target edge.
    /// Driver.js: popover.align
    /// Default: null (uses Center)
    /// </summary>
    public PopoverAlign? Align { get; set; }

    /// <summary>
    /// Order of this step in the tour sequence. Steps are sorted by this value.
    /// Default: 0
    /// </summary>
    public int Order { get; set; }

    /// <summary>
    /// Unique identifier for this step.
    /// </summary>
    public string? StepId { get; set; }

    /// <summary>
    /// Whether to show the "Back" button on this step.
    /// Overrides the tour-level setting if set.
    /// </summary>
    public bool? ShowBack { get; set; }

    /// <summary>
    /// Whether to show the "Next" button on this step.
    /// Overrides the tour-level setting if set.
    /// </summary>
    public bool? ShowNext { get; set; }

    /// <summary>
    /// Whether to show the "Skip" button on this step.
    /// Overrides the tour-level setting if set.
    /// </summary>
    public bool? ShowSkip { get; set; }

    /// <summary>
    /// CSS class for the popover.
    /// Driver.js: popover.popoverClass
    /// </summary>
    public string? PopoverClass { get; set; }

    /// <summary>
    /// Whether this step should be skipped (e.g., target element not found).
    /// </summary>
    public bool Disabled { get; set; }

    /// <summary>
    /// Whether to disable interaction with the highlighted element.
    /// Driver.js: disableActiveInteraction
    /// </summary>
    public bool DisableActiveInteraction { get; set; }
}
