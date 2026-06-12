using GuideFlow.Enums;
using GuideFlow.Models;

namespace GuideFlow.Services;

/// <summary>
/// Fluent builder for creating tours programmatically without Razor markup.
/// </summary>
public class GuideFlowBuilder
{
    private readonly List<ProgrammaticStep> _steps = new();
    private TourOptions _options = new();
    private string _tourName = Constants.DefaultTourName;

    /// <summary>
    /// Set tour name for identification and state persistence.
    /// </summary>
    public GuideFlowBuilder WithName(string name)
    {
        _tourName = name;
        return this;
    }

    /// <summary>
    /// Configure tour options.
    /// </summary>
    public GuideFlowBuilder WithOptions(Action<TourOptions> configure)
    {
        configure(_options);
        return this;
    }

    /// <summary>
    /// Set tour options directly.
    /// </summary>
    public GuideFlowBuilder WithOptions(TourOptions options)
    {
        _options = options;
        return this;
    }

    /// <summary>
    /// Add a step to the tour.
    /// </summary>
    /// <param name="element">CSS selector for target element. Driver.js: element</param>
    /// <param name="title">Popover title. Driver.js: popover.title</param>
    /// <param name="text">Popover description. Driver.js: popover.description</param>
    /// <param name="side">Popover side. Driver.js: popover.side</param>
    /// <param name="order">Step order for sorting.</param>
    /// <param name="configure">Optional step configuration callback.</param>
    public GuideFlowBuilder AddStep(string element, string title, string? text = null,
        Placement side = Placement.Bottom, int order = -1, Action<StepBuilder>? configure = null)
    {
        var builder = new StepBuilder(element, title);
        builder.WithText(text);
        builder.WithSide(side);

        if (order >= 0) builder.WithOrder(order);
        else builder.WithOrder(_steps.Count);

        configure?.Invoke(builder);
        _steps.Add(builder.Build());
        return this;
    }

    /// <summary>
    /// Build the programmatic step list. Used internally by ProgrammaticTour component.
    /// </summary>
    internal (string TourName, TourOptions Options, IReadOnlyList<ProgrammaticStep> Steps) Build()
    {
        return (_tourName, _options, _steps.AsReadOnly());
    }
}

/// <summary>
/// Builder for individual steps in a programmatic tour.
/// </summary>
public class StepBuilder
{
    private readonly ProgrammaticStep _step;

    internal StepBuilder(string element, string title)
    {
        _step = new ProgrammaticStep
        {
            Element = element,
            Title = title,
            Order = 0,
            Side = Placement.Bottom,
        };
    }

    public StepBuilder WithText(string? text) { _step.Text = text; return this; }

    /// <summary>Driver.js / Shepherd.js alias for WithText (popover.description).</summary>
    public StepBuilder WithDescription(string? description) { _step.Text = description; return this; }

    /// <summary>Shepherd.js alias: attachTo element selector.</summary>
    public StepBuilder WithAttachTo(string element) { _step.Element = element; return this; }

    /// <summary>Set popover side. Driver.js: popover.side</summary>
    public StepBuilder WithSide(Placement side) { _step.Side = side; return this; }

    /// <summary>Alias for WithSide (backward-compatible).</summary>
    public StepBuilder WithPlacement(Placement placement) { _step.Side = placement; return this; }

    /// <summary>Set popover alignment. Driver.js: popover.align</summary>
    public StepBuilder WithAlign(PopoverAlign align) { _step.Align = align; return this; }

    public StepBuilder WithOrder(int order) { _step.Order = order; return this; }
    public StepBuilder WithStepId(string id) { _step.StepId = id; return this; }
    public StepBuilder ShowBack(bool show) { _step.ShowBack = show; return this; }
    public StepBuilder ShowNext(bool show) { _step.ShowNext = show; return this; }
    public StepBuilder ShowSkip(bool show) { _step.ShowSkip = show; return this; }
    public StepBuilder ShowClose(bool show) { _step.ShowClose = show; return this; }
    public StepBuilder ShowArrow(bool show) { _step.ShowArrow = show; return this; }
    public StepBuilder ShowProgress(bool show) { _step.ShowProgress = show; return this; }
    public StepBuilder WithProgressText(string template) { _step.ProgressText = template; return this; }

    /// <summary>Set CSS class for popover. Driver.js: popover.popoverClass</summary>
    public StepBuilder WithPopoverClass(string css) { _step.PopoverClass = css; return this; }

    /// <summary>Alias for WithPopoverClass (backward-compatible).</summary>
    public StepBuilder WithCssClass(string css) { _step.PopoverClass = css; return this; }

    public StepBuilder Disabled(bool disabled) { _step.Disabled = disabled; return this; }
    public StepBuilder WithMode(StepMode mode) { _step.Mode = mode; return this; }
    public StepBuilder WithAnimation(AnimationType animation) { _step.Animation = animation; return this; }
    public StepBuilder WithContentUrl(string url) { _step.ContentUrl = url; return this; }

    /// <summary>Driver.js: disableActiveInteraction</summary>
    public StepBuilder DisableActiveInteraction(bool disable = true) { _step.DisableActiveInteraction = disable; return this; }

    /// <summary>
    /// Set custom button labels for this step.
    /// </summary>
    public StepBuilder WithButtons(string? next = null, string? back = null, string? skip = null, string? finish = null)
    {
        _step.NextBtnText = next;
        _step.PrevBtnText = back;
        _step.SkipBtnText = skip;
        _step.DoneBtnText = finish;
        return this;
    }

    /// <summary>
    /// Set lifecycle callbacks for this step.
    /// </summary>
    public StepBuilder OnBeforeShow(Func<Task> handler) { _step.OnBeforeShow = handler; return this; }
    public StepBuilder OnAfterShow(Func<Task> handler) { _step.OnAfterShow = handler; return this; }
    public StepBuilder OnBeforeHide(Func<Task> handler) { _step.OnBeforeHide = handler; return this; }
    public StepBuilder OnAfterHide(Func<Task> handler) { _step.OnAfterHide = handler; return this; }
    public StepBuilder OnPopoverRender(Func<Task> handler) { _step.OnPopoverRender = handler; return this; }

    internal ProgrammaticStep Build() => _step;
}

/// <summary>
/// Represents a step created via the programmatic API.
/// </summary>
public class ProgrammaticStep
{
    /// <summary>CSS selector for target element. Driver.js: element</summary>
    public string Element { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    /// <summary>Popover description. Driver.js: popover.description</summary>
    public string? Text { get; set; }

    /// <summary>Popover side. Driver.js: popover.side</summary>
    public Placement Side { get; set; } = Placement.Bottom;

    /// <summary>Popover alignment. Driver.js: popover.align</summary>
    public PopoverAlign? Align { get; set; }

    public int Order { get; set; }
    public string? StepId { get; set; }
    public bool ShowBack { get; set; } = true;
    public bool ShowNext { get; set; } = true;
    public bool ShowSkip { get; set; }
    public bool ShowClose { get; set; } = true;
    public bool ShowArrow { get; set; } = true;
    public bool ShowProgress { get; set; }
    public string? ProgressText { get; set; }
    public bool Disabled { get; set; }

    /// <summary>CSS class for popover. Driver.js: popover.popoverClass</summary>
    public string? PopoverClass { get; set; }

    public StepMode? Mode { get; set; }
    public AnimationType? Animation { get; set; }
    public string? ContentUrl { get; set; }

    /// <summary>Driver.js: disableActiveInteraction</summary>
    public bool DisableActiveInteraction { get; set; }

    public string? NextBtnText { get; set; }
    public string? PrevBtnText { get; set; }
    public string? SkipBtnText { get; set; }
    public string? DoneBtnText { get; set; }
    public Func<Task>? OnBeforeShow { get; set; }
    public Func<Task>? OnAfterShow { get; set; }
    public Func<Task>? OnBeforeHide { get; set; }
    public Func<Task>? OnAfterHide { get; set; }
    public Func<Task>? OnPopoverRender { get; set; }
}
