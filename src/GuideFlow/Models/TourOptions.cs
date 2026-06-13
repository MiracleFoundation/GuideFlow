using GuideFlow.Enums;

namespace GuideFlow.Models;

/// <summary>
/// Configuration options for a guided tour.
/// </summary>
public class TourOptions
{
    // === Overlay ===

    /// <summary>
    /// Whether to show a semi-transparent overlay behind the active step.
    /// Default: true
    /// </summary>
    public bool Overlay { get; set; } = true;

    /// <summary>
    /// Opacity of the overlay (0.0 to 1.0).
    /// Default: 0.5
    /// </summary>
    public double OverlayOpacity { get; set; } = 0.5;

    /// <summary>
    /// Color of the overlay backdrop.
    /// Default: null (uses black)
    /// </summary>
    public string? OverlayColor { get; set; }

    /// <summary>
    /// Whether clicking the overlay or close button is allowed.
    /// Default: true
    /// </summary>
    public bool AllowClose { get; set; } = true;

    /// <summary>
    /// Action when the overlay backdrop is clicked.
    /// Default: Close
    /// </summary>
    public OverlayClickBehavior OverlayClickBehavior { get; set; } = OverlayClickBehavior.Close;

    // === Navigation ===

    /// <summary>
    /// Whether to enable keyboard navigation (Arrow keys, Enter, Escape).
    /// Default: true
    /// </summary>
    public bool AllowKeyboardControl { get; set; } = true;

    // === Progress ===

    /// <summary>
    /// Whether to show a progress indicator (e.g., "2 of 5").
    /// Default: false
    /// </summary>
    public bool ShowProgress { get; set; } = false;

    /// <summary>
    /// Template for progress text. Use {{current}} and {{total}} as placeholders.
    /// Default: "{{current}} of {{total}}"
    /// </summary>
    public string ProgressText { get; set; } = "{{current}} of {{total}}";

    /// <summary>
    /// Whether to show a visual progress bar in addition to text.
    /// Default: false
    /// </summary>
    public bool ShowProgressBar { get; set; } = false;

    // === Animation ===

    /// <summary>
    /// Whether to animate the tour (transitions between steps).
    /// Default: true
    /// </summary>
    public bool Animate { get; set; } = true;

    /// <summary>
    /// Duration of animations in milliseconds.
    /// Default: 300
    /// </summary>
    public int AnimationDuration { get; set; } = 300;

    /// <summary>
    /// Whether to animate the overlay cutout when switching steps.
    /// Default: true
    /// </summary>
    public bool AnimateCutout { get; set; } = true;

    /// <summary>
    /// Default animation type for step popovers.
    /// Extended: Fade, Slide, Bounce, None
    /// Default: Fade
    /// </summary>
    public AnimationType AnimationType { get; set; } = AnimationType.Fade;

    // === Scroll ===

    /// <summary>
    /// Whether to smooth scroll to the highlighted element.
    /// Default: false
    /// </summary>
    public bool SmoothScroll { get; set; } = false;

    /// <summary>
    /// How to scroll to the target element. Smooth, Instant, or None.
    /// Default: Smooth
    /// </summary>
    public ScrollBehavior ScrollBehavior { get; set; } = ScrollBehavior.Smooth;

    /// <summary>
    /// ScrollIntoView block option: Center, Start, End, Nearest.
    /// Default: Center
    /// </summary>
    public ScrollBlock ScrollBlock { get; set; } = ScrollBlock.Center;

    // === Stage / Highlight ===

    /// <summary>
    /// Padding around the highlighted element in pixels.
    /// Default: 10
    /// </summary>
    public int StagePadding { get; set; } = 10;

    /// <summary>
    /// Border radius of the highlighted area in pixels.
    /// Default: 5
    /// </summary>
    public int StageRadius { get; set; } = 5;

    /// <summary>
    /// Shape of the highlighted area.
    /// Extended: RoundedRect, Rectangle, Circle, Ellipse
    /// Default: RoundedRect
    /// </summary>
    public HighlightShape HighlightShape { get; set; } = HighlightShape.RoundedRect;

    /// <summary>
    /// Overlay rendering mode: Cutout (SVG mask) or Stage (4 panels).
    /// Default: Cutout
    /// </summary>
    public OverlayMode OverlayMode { get; set; } = OverlayMode.Cutout;

    /// <summary>
    /// z-index for the tour overlay and popovers.
    /// Default: 10000
    /// </summary>
    public int ZIndex { get; set; } = 10000;

    // === Popover ===

    /// <summary>
    /// CSS theme class applied to the tour popover.
    /// Built-in: "gf-theme-light", "gf-theme-dark", "gf-theme-high-contrast".
    /// Default: null (uses CSS custom properties)
    /// </summary>
    public string? PopoverClass { get; set; }

    /// <summary>
    /// Distance between the popover and the target element in pixels.
    /// Default: 10
    /// </summary>
    public int PopoverOffset { get; set; } = 10;

    /// <summary>
    /// Default display mode for steps: Bubble (near target) or Modal (centered).
    /// Default: Bubble
    /// </summary>
    public StepMode StepMode { get; set; } = StepMode.Bubble;

    // === Focus ===

    /// <summary>
    /// Whether to trap focus within the active step popover.
    /// Default: true
    /// </summary>
    public bool TrapFocus { get; set; } = true;

    // === Interaction ===

    /// <summary>
    /// Whether to disable interaction with the highlighted element globally.
    /// Can be overridden per step.
    /// Default: false
    /// </summary>
    public bool DisableActiveInteraction { get; set; } = false;

    // === Auto ===

    /// <summary>
    /// Whether to auto-reposition popover on window resize/scroll.
    /// Default: true
    /// </summary>
    public bool AutoReposition { get; set; } = true;

    /// <summary>
    /// Whether to track and visually mark visited steps.
    /// Default: true
    /// </summary>
    public bool TrackVisited { get; set; } = true;

    /// <summary>
    /// CSS class added to the highlighted target element while step is active.
    /// Default: "gf-highlight-active"
    /// </summary>
    public string HighlightClass { get; set; } = Constants.DefaultHighlightClass;

    /// <summary>
    /// Whether to auto-reposition stage overlay panels on resize/scroll.
    /// Default: true (only applies when OverlayMode is Stage)
    /// </summary>
    public bool StageAutoUpdate { get; set; } = true;

    /// <summary>
    /// Whether to render step content lazily (only when step becomes active).
    /// Default: false
    /// </summary>
    public bool LazyRender { get; set; } = false;

    // === Buttons ===

    /// <summary>
    /// Array of buttons to show in the popover.
    /// Default: [ButtonType.Next, ButtonType.Previous, ButtonType.Close]
    /// </summary>
    public ButtonType[]? ShowButtons { get; set; }

    /// <summary>
    /// Array of buttons to disable (visible but not clickable).
    /// Default: null
    /// </summary>
    public ButtonType[]? DisableButtons { get; set; }

    // === Button Text ===

    /// <summary>
    /// Default text for the "Next" button.
    /// Default: "Next"
    /// </summary>
    public string NextBtnText { get; set; } = "Next";

    /// <summary>
    /// Default text for the "Previous" button.
    /// Default: "Back"
    /// </summary>
    public string PrevBtnText { get; set; } = "Back";

    /// <summary>
    /// Default text for the "Skip" button.
    /// Default: "Skip"
    /// </summary>
    public string SkipBtnText { get; set; } = "Skip";

    /// <summary>
    /// Default text for the "Done" button on the last step.
    /// Default: "Done"
    /// </summary>
    public string DoneBtnText { get; set; } = "Done";

    // === State ===

    /// <summary>
    /// Whether to auto-save/load tour state to localStorage.
    /// Default: false
    /// </summary>
    public bool PersistState { get; set; } = false;

    /// <summary>
    /// Custom storage key for state persistence. If null, uses tour name.
    /// </summary>
    public string? StorageKey { get; set; }
}
