# GuideFlow

Accessible, animated guided tour component library for Blazor.

## Features

- 🎯 **Targeted Steps** — Highlight any element via CSS selector with cutout overlay
- ⌨️ **Keyboard Navigation** — Arrow keys, Enter, Escape, Tab cycling
- ♿ **Accessible** — ARIA attributes, focus trapping, screen reader support
- 🎨 **Customizable** — CSS custom properties for theming
- ✨ **Animated** — Smooth transitions, fade in/out, animated cutout
- 📍 **Smart Positioning** — Auto-flip, viewport-aware placement
- 💾 **State Persistence** — Save/restore tour progress via localStorage
- 📦 **Lightweight** — No external JS dependencies (Floating UI logic inlined)

## Installation

```bash
dotnet add package GuideFlow
```

## Quick Start

### 1. Register Services

```csharp
// Program.cs
using GuideFlow.Services;

builder.Services.AddGuideFlow();
```

### 2. Add Imports

```razor
@* _Imports.razor *@
@using GuideFlow.Components
@using GuideFlow.Enums
@using GuideFlow.Models
```

### 3. Create a Tour

```razor
<button id="my-button" @onclick="StartTour">Start Tour</button>

<div id="section-a">...</div>
<div id="section-b">...</div>

<GuideFlowTour @ref="tour" TourOptions="options">
    <GuideFlowStep Selector="#section-a"
                   Title="Step 1"
                   Order="0"
                   Placement="Placement.Bottom">
        <p>This highlights section A.</p>
    </GuideFlowStep>

    <GuideFlowStep Selector="#section-b"
                   Title="Step 2"
                   Order="1"
                   Placement="Placement.Right">
        <p>This highlights section B.</p>
    </GuideFlowStep>
</GuideFlowTour>

@code {
    private GuideFlowTour? tour;
    private TourOptions options = new() { Overlay = true, ShowProgress = true };

    private async Task StartTour() => await tour!.StartAsync();
}
```

## Tour Options

| Property | Type | Default | Description |
|---|---|---|---|
| `Overlay` | `bool` | `true` | Show overlay behind active step |
| `OverlayOpacity` | `double` | `0.5` | Overlay opacity (0.0–1.0) |
| `CancelOnOverlayClick` | `bool` | `true` | Cancel tour when clicking overlay |
| `CancelOnEscape` | `bool` | `true` | Cancel tour on Escape key |
| `AllowKeyboardNavigation` | `bool` | `true` | Enable keyboard nav (arrows, Enter, Escape) |
| `ShowProgress` | `bool` | `true` | Show "2 of 5" progress indicator |
| `ShowCloseButton` | `bool` | `true` | Show close button on each step |
| `SmoothScroll` | `bool` | `true` | Smooth scroll to target element |
| `AnimationDuration` | `int` | `300` | Animation duration in ms |
| `AnimateCutout` | `bool` | `true` | Animate overlay cutout between steps |
| `HighlightPadding` | `int` | `8` | Padding around highlighted element (px) |
| `HighlightRadius` | `int` | `4` | Border radius of highlight cutout (px) |
| `ZIndex` | `int` | `10000` | z-index for overlay/popovers |
| `PersistState` | `bool` | `false` | Auto-save/load state to localStorage |
| `TrapFocus` | `bool` | `true` | Trap Tab focus within active step |
| `NextButtonText` | `string` | `"Next"` | Default "Next" button text |
| `BackButtonText` | `string` | `"Back"` | Default "Back" button text |
| `SkipButtonText` | `string` | `"Skip"` | Default "Skip" button text |
| `FinishButtonText` | `string` | `"Done"` | Default "Done" button text |

## Step Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `Selector` | `string` | — | CSS selector for target element (required) |
| `Title` | `string` | — | Step title |
| `Text` | `string` | — | Simple text content |
| `ChildContent` | `RenderFragment` | — | Rich Blazor content |
| `Placement` | `Placement` | `Bottom` | Popover placement |
| `Order` | `int` | `0` | Step order in tour |
| `StepId` | `string` | — | Unique step identifier |
| `ShowBack` | `bool` | `true` | Show back button |
| `ShowNext` | `bool` | `true` | Show next button |
| `ShowSkip` | `bool` | `false` | Show skip button |
| `ShowClose` | `bool` | `true` | Show close button |
| `ShowArrow` | `bool` | `true` | Show arrow pointing to target |
| `ShowProgress` | `bool` | `true` | Show progress indicator |
| `Disabled` | `bool` | `false` | Skip this step |
| `CssClass` | `string` | — | Custom CSS classes |

## Events

```razor
<GuideFlowTour OnStart="HandleStart"
               OnComplete="HandleComplete"
               OnCancel="HandleCancel"
               OnStepChange="HandleStepChange">
```

| Event | Type | Description |
|---|---|---|
| `OnStart` | `EventCallback` | Tour started |
| `OnComplete` | `EventCallback` | Tour completed |
| `OnCancel` | `EventCallback` | Tour cancelled |
| `OnStepChange` | `EventCallback<StepChangeEventArgs>` | Active step changed |

## Placements

`Top`, `TopStart`, `TopEnd`, `Bottom`, `BottomStart`, `BottomEnd`, `Left`, `LeftStart`, `LeftEnd`, `Right`, `RightStart`, `RightEnd`, `Auto`

## Theming

Override CSS custom properties:

```css
:root {
    --gf-overlay-color: rgba(0, 0, 0, 0.6);
    --gf-popover-bg: #ffffff;
    --gf-popover-radius: 12px;
    --gf-popover-max-width: 420px;
    --gf-title-color: #1a1a2e;
    --gf-title-size: 1.2rem;
    --gf-text-color: #4a4a6a;
    --gf-btn-primary-bg: #6366f1;
    --gf-btn-primary-color: #ffffff;
    --gf-btn-secondary-bg: #f3f4f6;
    --gf-animation-duration: 250ms;
    --gf-highlight-padding: 12px;
    --gf-highlight-radius: 8px;
}
```

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `→` / `Enter` | Next step |
| `←` | Previous step |
| `Escape` | Cancel tour |
| `Tab` | Cycle focus within step |

## License

MIT
