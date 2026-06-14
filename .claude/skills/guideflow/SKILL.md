# GuideFlow - Blazor Guided Tour Library

GuideFlow is a Blazor component library for building accessible, animated guided tours. Use this skill to generate correct GuideFlow code for Blazor WebAssembly and Blazor Server projects.

## Quick Reference

| What | How |
|------|-----|
| Install | `dotnet add package GuideFlow` |
| Register | `builder.Services.AddGuideFlow()` in Program.cs |
| CSS/JS | `<link href="_content/GuideFlow/guideflow.css" />` and `<script src="_content/GuideFlow/guideflow.module.js"></script>` |
| Namespaces | `@using GuideFlow.Components`, `@using GuideFlow.Enums`, `@using GuideFlow.Models`, `@using GuideFlow.Services` |

## Setup

Every GuideFlow project needs these 4 steps:

### 1. Install NuGet package
```bash
dotnet add package GuideFlow
```

### 2. Register service in Program.cs
```csharp
using GuideFlow.Services;

builder.Services.AddGuideFlow();
```

### 3. Add CSS and JS in index.html or _Host.cshtml
```html
<link href="_content/GuideFlow/guideflow.css" rel="stylesheet" />
<script src="_content/GuideFlow/guideflow.module.js"></script>
```

### 4. Import namespaces in _Imports.razor
```razor
@using GuideFlow.Components
@using GuideFlow.Enums
@using GuideFlow.Models
@using GuideFlow.Services
```

## Declarative Tour (Razor Markup)

Use `GuideFlowTour` + `GuideFlowStep` for tours defined in Razor markup.

### Basic Pattern
```razor
<button id="btn-start" @onclick="StartTour">Start Tour</button>
<div id="section-a">Section A</div>
<div id="section-b">Section B</div>

<GuideFlowTour @ref="tour" TourOptions="options">
    <GuideFlowStep Element="#btn-start" Title="Welcome" Order="0">
        <p>Click here to begin.</p>
    </GuideFlowStep>

    <GuideFlowStep Element="#section-a" Title="Section A" Order="1" Side="Placement.Bottom">
        <p>This is section A.</p>
    </GuideFlowStep>

    <GuideFlowStep Element="#section-b" Title="Section B" Order="2" Side="Placement.Right">
        <p>This is section B.</p>
    </GuideFlowStep>
</GuideFlowTour>

@code {
    private GuideFlowTour? tour;
    private TourOptions options = new()
    {
        Overlay = true,
        ShowProgress = true,
    };

    private async Task StartTour()
    {
        if (tour != null) await tour.DriveAsync();
    }
}
```

### GuideFlowStep Key Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Element` | string | required | CSS selector for the target element |
| `Title` | string | required | Popover title |
| `Order` | int | 0 | Step sequence order (0-based) |
| `Side` | Placement | Bottom | Popover position relative to target |
| `Align` | PopoverAlign? | Center | Popover alignment along the edge |
| `Mode` | StepMode? | Bubble | Bubble (near target) or Modal (centered) |
| `Animation` | AnimationType? | (inherits tour) | Animation for this step |
| `ShowBack` | bool | true | Show "Back" button |
| `ShowNext` | bool | true | Show "Next" button |
| `ShowSkip` | bool | false | Show "Skip" button |
| `ShowClose` | bool | true | Show "Close" button |
| `ShowArrow` | bool | true | Show arrow pointing to target |
| `ShowProgress` | bool | true | Show progress text |
| `ShowProgressBar` | bool | true | Show progress bar |
| `Disabled` | bool | false | Skip this step |
| `PopoverClass` | string? | null | Custom CSS class for popover |
| `DisableActiveInteraction` | bool? | null | Disable interaction with highlighted element |
| `ShowButtons` | ButtonType[]? | null | Which buttons to show on this step |
| `DisableButtons` | ButtonType[]? | null | Which buttons to disable (visible but grayed out) |
| `ButtonsContent` | RenderFragment? | null | Custom button content (replaces default buttons) |
| `NextBtnText` | string? | null | Override Next button text for this step |
| `PrevBtnText` | string? | null | Override Back button text for this step |
| `DoneBtnText` | string? | null | Override Done button text for this step |

### GuideFlowStep Events

| Event | Type | When |
|-------|------|------|
| `OnBeforeShow` | EventCallback\<TourContext\> | Before step is shown |
| `OnAfterShow` | EventCallback\<TourContext\> | After step is shown |
| `OnBeforeHide` | EventCallback\<TourContext\> | Before step is hidden |
| `OnAfterHide` | EventCallback\<TourContext\> | After step is hidden |
| `OnNextClick` | EventCallback\<TourContext\> | Override Next button behavior |
| `OnPrevClick` | EventCallback\<TourContext\> | Override Back button behavior |
| `OnCloseClick` | EventCallback\<TourContext\> | Override Close button behavior |
| `OnPopoverRender` | EventCallback\<TourContext\> | After popover DOM is rendered (fires with OnAfterShow) |

### GuideFlowTour Events

| Event | Type | When |
|-------|------|------|
| `OnStart` | EventCallback | Tour starts |
| `OnComplete` | EventCallback | Tour completes |
| `OnCancel` | EventCallback | Tour is cancelled |
| `OnStepChange` | EventCallback\<StepChangeEventArgs\> | Active step changes |
| `OnBeforeStepChange` | EventCallback\<BeforeStepChangeEventArgs\> | Before step change (set Cancel=true to block) |
| `OnDestroyStarted` | Func\<Task\<bool\>\>? | Return false to prevent tour exit (confirm on exit) |
| `OnNextClick` | EventCallback\<TourContext\> | Override all Next button clicks |
| `OnPrevClick` | EventCallback\<TourContext\> | Override all Back button clicks |
| `OnCloseClick` | EventCallback\<TourContext\> | Override all Close button clicks |

### GuideFlowTour Methods

```csharp
await tour.DriveAsync();           // Start from first step
await tour.DriveAsync(2);          // Start from step index 2
await tour.MoveNextAsync();        // Go to next step
await tour.MovePreviousAsync();    // Go to previous step
await tour.MoveToAsync(3);         // Go to step index 3
await tour.SkipAsync();            // Skip current step
await tour.DestroyAsync();         // Destroy tour and clean up
await tour.CompleteAsync();        // Complete the tour
await tour.ResetAsync();           // Reset to initial state
await tour.HighlightAsync("#el");  // Highlight element (no popover)
await tour.HighlightAsync("#el", "Title", "Description");  // Highlight with popover
await tour.ShowPopoverAsync("Title", "Description");       // Modal popover, no target
var state = tour.GetState();       // Get current state as JSON
var config = tour.GetConfig();     // Get TourOptions
tour.SetConfig(newOptions);        // Replace TourOptions at runtime
tour.SetSteps(steps);              // Replace steps at runtime
```

## Programmatic Tour (C# Fluent API)

Use `GuideFlowBuilder` + `ProgrammaticTour` for tours defined entirely in C#.

### Basic Pattern
```razor
<ProgrammaticTour @ref="tour" Builder="builder" />

@code {
    private ProgrammaticTour? tour;

    private GuideFlowBuilder builder = new GuideFlowBuilder()
        .WithName("my-tour")
        .WithOptions(o =>
        {
            o.ShowProgress = true;
            o.Overlay = true;
        })
        .AddStep("#element-1", "Step 1", "Description for step 1.", Placement.Bottom)
        .AddStep("#element-2", "Step 2", "Description for step 2.", Placement.Top);

    private async Task StartTour()
    {
        if (tour != null) await tour.DriveAsync();
    }
}
```

### GuideFlowBuilder Methods

```csharp
new GuideFlowBuilder()
    .WithName("tour-name")                          // Set tour name
    .WithOptions(o => { /* configure */ })           // Configure via callback
    .WithOptions(tourOptions)                        // Set options directly
    .AddStep(                                        // Add a step
        "#selector",                                 // CSS selector
        "Title",                                     // Step title
        "Description text",                          // Step description
        Placement.Bottom,                            // Popover placement
        0,                                           // Order (optional)
        step => step                                 // StepBuilder callback (optional)
            .WithSide(Placement.Right)
            .ShowSkip(true)
            .WithAnimation(AnimationType.Slide)
    );
```

### StepBuilder Methods

```csharp
step => step
    .WithText("description")
    .WithSide(Placement.Top)
    .WithAlign(PopoverAlign.Start)
    .WithMode(StepMode.Modal)
    .WithAnimation(AnimationType.Fade)
    .WithStepId("step-1")
    .WithPopoverClass("custom-class")
    .ShowBack(false)
    .ShowNext(true)
    .ShowSkip(true)
    .ShowClose(false)
    .ShowArrow(false)
    .ShowProgress(false)
    .WithProgressText("{current} / {total}")
    .WithButtons(next: "Continue", back: "Previous", skip: "Skip", finish: "Done")
    .DisableActiveInteraction(true)
    .WithContentUrl("/api/step-content/1")
    .OnBeforeShow(async () => { /* ... */ })
    .OnAfterShow(async () => { /* ... */ });
```

## TourOptions Reference

### Overlay
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Overlay` | bool | true | Show overlay backdrop |
| `OverlayOpacity` | double | 0.5 | Overlay opacity (0.0 - 1.0) |
| `OverlayColor` | string? | black | Overlay backdrop color |
| `AllowClose` | bool | true | Allow closing via overlay click or close button |
| `OverlayClickBehavior` | OverlayClickBehavior | Close | Action on overlay click |

### Animation
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Animate` | bool | true | Enable animations |
| `AnimationDuration` | int | 300 | Animation duration in ms |
| `AnimateCutout` | bool | true | Animate the overlay cutout |
| `AnimationType` | AnimationType | Fade | Default animation type |

### Progress
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ShowProgress` | bool | false | Show progress text |
| `ProgressText` | string | "{{current}} of {{total}}" | Progress text template |
| `ShowProgressBar` | bool | false | Show progress bar |

### Navigation
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `AllowKeyboardControl` | bool | true | Enable keyboard navigation (arrows, Escape) |
| `TrapFocus` | bool | true | Trap focus within active popover |

### Scroll
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ScrollBehavior` | ScrollBehavior | Smooth | How to scroll to target |
| `ScrollBlock` | ScrollBlock | Center | Vertical alignment after scroll |

### Stage / Highlight
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `StagePadding` | int | 10 | Padding around highlighted element (px) |
| `StageRadius` | int | 5 | Border radius of highlighted area (px) |
| `HighlightShape` | HighlightShape | RoundedRect | Shape of highlighted area |
| `OverlayMode` | OverlayMode | Cutout | Overlay rendering mode |
| `HighlightClass` | string | "gf-highlight-active" | CSS class on highlighted element |

### Popover
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `PopoverClass` | string? | null | CSS theme class for popovers |
| `PopoverOffset` | int | 10 | Distance between popover and target (px) |
| `StepMode` | StepMode | Bubble | Default step display mode |
| `ZIndex` | int | 10000 | z-index for overlay and popovers |

### Buttons
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `NextBtnText` | string | "Next" | Next button text |
| `PrevBtnText` | string | "Back" | Back button text |
| `SkipBtnText` | string | "Skip" | Skip button text |
| `DoneBtnText` | string | "Done" | Done button text |
| `ShowButtons` | ButtonType[]? | null | Which buttons to show |
| `DisableButtons` | ButtonType[]? | null | Which buttons to disable |

### State
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `PersistState` | bool | false | Save/load tour state to localStorage |
| `StorageKey` | string? | null | Custom storage key for persistence |
| `TrackVisited` | bool | true | Track and visually mark visited steps |

### Advanced
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `AutoReposition` | bool | true | Auto-reposition on resize/scroll |
| `DisableActiveInteraction` | bool | false | Disable interaction with highlighted element globally |
| `StageAutoUpdate` | bool | true | Auto-reposition stage overlay panels |
| `LazyRender` | bool | false | Render step content lazily |

## Key Types

### TourContext
Passed to step-level event callbacks.
```csharp
public class TourContext
{
    public TourOptions Config { get; set; }
    public GuideFlowState State { get; set; }
    public GuideFlowTour Driver { get; set; }  // The tour component instance
}
```

### StepChangeEventArgs
Passed to `OnStepChange`.
```csharp
public class StepChangeEventArgs : EventArgs
{
    public int PreviousStepIndex { get; set; }
    public int ActiveIndex { get; set; }
    public int TotalSteps { get; set; }
    public string? StepId { get; set; }
    public string? Selector { get; set; }
}
```

### BeforeStepChangeEventArgs
Passed to `OnBeforeStepChange`. Set `Cancel = true` to block the step change.
```csharp
public class BeforeStepChangeEventArgs : EventArgs
{
    public int ActiveIndex { get; set; }
    public int TargetStepIndex { get; set; }
    public bool Cancel { get; set; }
}
```

## Enums

### Placement
Popover position relative to target element.
```
Top, TopStart, TopEnd
Bottom, BottomStart, BottomEnd
Left, LeftStart, LeftEnd
Right, RightStart, RightEnd
Auto
```

### AnimationType
Popover appearance animation.
```
Fade      - Fade in with slight upward movement (default)
Slide     - Slide in from placement direction
Bounce    - Bounce in effect
None      - No animation
```

### OverlayMode
How the overlay renders around the highlighted element.
```
Cutout    - Full-screen overlay with cutout hole (default)
Stage     - Four panels around the target (spotlight effect)
```

### StepMode
How the popover is displayed.
```
Bubble    - Popover near the target element (default)
Modal     - Popover centered on screen
```

### ScrollBehavior
How the tour scrolls to bring targets into view.
```
Smooth    - Smooth scroll (default)
Instant   - Instant scroll
None      - No scrolling
```

### HighlightShape
Shape of the highlighted area.
```
RoundedRect  - Rounded rectangle (default)
Rectangle    - Sharp rectangle
Circle       - Circle/ellipse centered on target
Ellipse      - Ellipse matching target aspect ratio
```

### PopoverAlign
Popover alignment along the target edge.
```
Start     - Align to start of edge
Center    - Align to center of edge (default)
End       - Align to end of edge
```

### OverlayClickBehavior
What happens when the overlay is clicked.
```
Close     - Close/destroy tour (default)
NextStep  - Advance to next step
None      - Do nothing
```

### ButtonType
Button identifiers.
```
Next, Previous, Close, Skip
```

## Theming

### Built-in Themes
```razor
<GuideFlowTour TourOptions="options">
    @* steps *@
</GuideFlowTour>

@code {
    private TourOptions options = new()
    {
        PopoverClass = "gf-theme-dark"  // or "gf-theme-light", "gf-theme-high-contrast"
    };
}
```

### Custom Theme via CSS Variables
```css
.my-custom-theme {
    --gf-popover-bg: #1a1a2e;
    --gf-popover-radius: 8px;
    --gf-title-color: #e94560;
    --gf-text-color: #eee;
    --gf-btn-primary-bg: #e94560;
    --gf-btn-primary-color: #fff;
    --gf-btn-secondary-bg: #16213e;
    --gf-btn-secondary-color: #eee;
    --gf-progress-color: #e94560;
}
```

Then apply: `PopoverClass = "my-custom-theme"`

### Available CSS Variables

**Popover:** `--gf-popover-max-width`, `--gf-popover-bg`, `--gf-popover-radius`, `--gf-popover-shadow`, `--gf-font-family`, `--gf-title-size`, `--gf-title-color`, `--gf-text-size`, `--gf-text-color`

**Modal:** `--gf-modal-max-width`, `--gf-modal-radius`, `--gf-modal-shadow`

**Buttons:** `--gf-btn-radius`, `--gf-btn-primary-bg`, `--gf-btn-primary-color`, `--gf-btn-secondary-bg`, `--gf-btn-secondary-color`

**Progress:** `--gf-progress-bg`, `--gf-progress-color`

**Highlight:** `--gf-highlight-zindex`, `--gf-highlight-shadow`, `--gf-highlight-radius`

**Other:** `--gf-visited-color`, `--gf-animation-duration`

## Common Patterns

### Onboarding Tour (first-time users)
```razor
<GuideFlowTour @ref="tour" TourOptions="options">
    <GuideFlowStep Element="#dashboard" Title="Dashboard" Order="0" Side="Placement.Bottom">
        <p>Welcome! This is your dashboard.</p>
    </GuideFlowStep>
    <GuideFlowStep Element="#nav-menu" Title="Navigation" Order="1" Side="Placement.Right">
        <p>Use this menu to navigate between sections.</p>
    </GuideFlowStep>
    <GuideFlowStep Element="#settings-btn" Title="Settings" Order="2" Side="Placement.Bottom">
        <p>Customize your experience here.</p>
    </GuideFlowStep>
</GuideFlowTour>

@code {
    private GuideFlowTour? tour;
    private TourOptions options = new()
    {
        Overlay = true,
        ShowProgress = true,
        ShowProgressBar = true,
        PersistState = true,
        StorageKey = "onboarding-tour"
    };

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender && tour != null)
        {
            await tour.DriveAsync();
        }
    }
}
```

### Single Element Highlight (no full tour)
```razor
<button id="new-feature" @onclick="HighlightFeature">New Feature</button>

<GuideFlowTour @ref="tour" TourOptions="options">
    <GuideFlowStep Element="#new-feature" Title="New!" Order="0" Side="Placement.Bottom">
        <p>Check out this new feature.</p>
    </GuideFlowStep>
</GuideFlowTour>

@code {
    private GuideFlowTour? tour;
    private TourOptions options = new() { Overlay = true };

    private async Task HighlightFeature()
    {
        if (tour != null) await tour.DriveAsync();
    }
}
```

### Custom Buttons (ButtonsContent)
```razor
<GuideFlowStep Element="#target" Title="Review" Order="0">
    <ButtonsContent>
        <button class="my-btn" @onclick="Approve">Approve</button>
        <button class="my-btn" @onclick="Reject">Reject</button>
    </ButtonsContent>
    <ChildContent>
        <p>Custom buttons replace the default navigation buttons.</p>
    </ChildContent>
</GuideFlowStep>
```

### Disable Specific Buttons
```razor
<GuideFlowTour TourOptions="options">
    <GuideFlowStep Element="#target" Title="Step" Order="0"
        DisableButtons="new[] { ButtonType.Previous }">
        <p>Previous button is grayed out on this step.</p>
    </GuideFlowStep>
</GuideFlowTour>

@code {
    private TourOptions options = new()
    {
        // Or disable globally:
        DisableButtons = new[] { ButtonType.Previous },
    };
}
```

### Confirm on Exit
```razor
<GuideFlowTour @ref="tour" TourOptions="options"
    OnDestroyStarted="OnDestroyStarted">
    @* steps *@
</GuideFlowTour>

@code {
    private GuideFlowTour? tour;
    private TourOptions options = new();

    private async Task<bool> OnDestroyStarted()
    {
        return await JS.InvokeAsync<bool>("confirm", "Are you sure you want to exit?");
        // Return true = proceed with destroy, false = cancel
    }
}
```

### Async Content Loading
```razor
<GuideFlowTour @ref="tour" TourOptions="options">
    <GuideFlowStep Element="#section" Title="Info" Order="0"
        ContentUrl="/api/tour-content/1">
    </GuideFlowStep>
</GuideFlowTour>
```

### Modal Steps (centered popovers)
```razor
<GuideFlowStep Element="#intro" Title="Welcome" Order="0" Mode="StepMode.Modal">
    <p>This step appears as a centered modal.</p>
</GuideFlowStep>
```

### Stage Overlay (spotlight effect)
```csharp
private TourOptions options = new()
{
    OverlayMode = OverlayMode.Stage,
    StagePadding = 20,
    StageRadius = 10
};
```

## Best Practices

1. **Use stable CSS selectors** - Prefer IDs (`#my-element`) or data attributes (`[data-tour="step1"]`) over class selectors that may change.

2. **Set Order explicitly** - Always set `Order` on each step to control sequence reliably.

3. **Enable keyboard navigation** - Keep `AllowKeyboardControl = true` (default) for accessibility.

4. **Use PersistState for onboarding** - Set `PersistState = true` with a `StorageKey` so returning users don't see the tour again.

5. **Provide meaningful content** - Keep step descriptions concise but informative. Use `ChildContent` for rich HTML content.

6. **Test with keyboard only** - Verify the tour works with Tab, Enter, Escape, and arrow keys.

7. **Use appropriate Placement** - Choose `Side` based on element position to avoid popover going off-screen. Use `Auto` when unsure.

8. **Handle events for custom logic** - Use `OnBeforeStepChange` to validate, `OnComplete` to mark onboarding as done.

9. **Theme consistently** - Use CSS custom properties to match your app's design system.

10. **Don't block the user** - Set `AllowClose = true` (default) so users can exit the tour at any time.

## Anti-patterns to Avoid

- **Missing setup** - Forgetting `AddGuideFlow()`, CSS, JS, or namespace imports
- **Fragile selectors** - Using auto-generated class names (e.g., `.b-abc123`) as element selectors
- **No escape hatch** - Setting `AllowClose = false` without a way to exit
- **Too many steps** - Tours with 10+ steps overwhelm users. Keep it under 7.
- **Overlapping highlights** - Steps targeting elements that are close together can cause visual conflicts
- **No mobile consideration** - Test popover positioning on small screens
- **Forgetting Order** - Not setting `Order` leads to unpredictable step sequence

## IGuideFlowService (Dependency Injection)

For controlling tours from services or non-component classes:

```csharp
@inject IGuideFlowService GuideFlowService

// Start tour
await GuideFlowService.DriveAsync();

// Navigation
await GuideFlowService.MoveNextAsync();
await GuideFlowService.MovePreviousAsync();
await GuideFlowService.MoveToAsync(2);

// State
var isActive = GuideFlowService.IsActive;
var index = GuideFlowService.ActiveIndex;
var total = GuideFlowService.TotalSteps;

// Persistence
await GuideFlowService.SaveStateAsync();
var state = await GuideFlowService.LoadStateAsync("my-tour");
await GuideFlowService.ClearStateAsync("my-tour");

// Events
GuideFlowService.OnTourStarted += () => { };
GuideFlowService.OnTourCompleted += () => { };
GuideFlowService.OnStepChanged += (args) => { };
```

## Resources

- Docs: https://miraclefoundation.github.io/GuideFlow
- GitHub: https://github.com/MiracleFoundation/GuideFlow
- NuGet: https://www.nuget.org/packages/GuideFlow
