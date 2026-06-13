# Migration Guide

GuideFlow's API is aligned with [Driver.js](https://driverjs.com) for easy migration.

## Driver.js → GuideFlow

### Tour Configuration

```js
// Driver.js
const driverObj = driver({
  animate: true,
  overlayColor: "#000",
  overlayOpacity: 0.5,
  allowClose: true,
  overlayClickBehavior: "close",
  allowKeyboardControl: true,
  smoothScroll: true,
  stagePadding: 10,
  stageRadius: 5,
  showProgress: true,
  progressText: "Step {{current}} of {{total}}",
  nextBtnText: "Next",
  prevBtnText: "Back",
  doneBtnText: "Done",
  showButtons: ["next", "previous", "close"],
  popoverClass: "my-class",
  popoverOffset: 10,
  onHighlightStarted: (el, step) => { },
  onHighlighted: (el, step) => { },
  onDeselected: (el, step) => { },
  onDestroyStarted: () => { },
  onDestroyed: () => { },
  onNextClick: (el, step) => { },
  onPrevClick: (el, step) => { },
  onCloseClick: (el, step) => { },
});
```

```razor
<!-- GuideFlow -->
<GuideFlowTour TourOptions="options"
               OnStart="OnStart" OnComplete="OnComplete" OnCancel="OnCancel"
               OnBeforeDestroy="OnBeforeDestroy" OnDestroyed="OnDestroyed"
               OnNextClick="OnTourNext" OnPrevClick="OnTourPrev" OnCloseClick="OnTourClose">
    <GuideFlowStep Element="#el" Title="Hello" Order="0"
                   OnBeforeShow="OnBefore" OnAfterShow="OnAfter"
                   OnNextClick="OnNext" OnPrevClick="OnPrev" OnCloseClick="OnClose">
        <p>Step content</p>
    </GuideFlowStep>
</GuideFlowTour>

@code {
    private TourOptions options = new()
    {
        Animate = true,                            // animate
        OverlayColor = "#000",                     // overlayColor
        OverlayOpacity = 0.5,                      // overlayOpacity
        AllowClose = true,                         // allowClose
        OverlayClickBehavior = OverlayClickBehavior.Close,  // overlayClickBehavior
        AllowKeyboardControl = true,               // allowKeyboardControl
        SmoothScroll = true,                       // smoothScroll
        StagePadding = 10,                         // stagePadding
        StageRadius = 5,                           // stageRadius
        ShowProgress = true,                       // showProgress
        NextBtnText = "Next",                      // nextBtnText
        PrevBtnText = "Back",                      // prevBtnText
        DoneBtnText = "Done",                      // doneBtnText
        PopoverClass = "my-class",                 // popoverClass
        PopoverOffset = 10,                        // popoverOffset
    };
}
```

### Steps

```js
// Driver.js
const steps = [
  {
    element: "#target",
    popover: {
      title: "Welcome",
      description: "Hello world",
      side: "bottom",
      align: "center",
      showButtons: ["next", "previous"],
      nextBtnText: "Continue",
      popoverClass: "custom",
    },
    disableActiveInteraction: false,
    onHighlightStarted: () => { },
    onHighlighted: () => { },
    onDeselected: () => { },
  },
];

driverObj.drive(steps);
```

```razor
<!-- GuideFlow -->
<GuideFlowStep Element="#target" Title="Welcome" Order="0"
               Side="Placement.Bottom"
               Align="PopoverAlign.Center"
               ShowButtons='new[] { "next", "previous" }'
               NextBtnText="Continue"
               PopoverClass="custom"
               DisableActiveInteraction="false"
               OnBeforeShow="OnBefore" OnAfterShow="OnAfter" OnAfterHide="OnAfterHide">
    <p>Hello world</p>
</GuideFlowStep>
```

### Methods

| Driver.js | GuideFlow | Backward-compatible alias |
|-----------|-----------|---------------------------|
| `driverObj.drive()` | `tour.DriveAsync()` | `tour.StartAsync()` |
| `driverObj.drive(index)` | `tour.DriveAsync(index)` | `tour.StartAsync(index)` |
| `driverObj.moveNext()` | `tour.MoveNextAsync()` | `tour.NextAsync()` |
| `driverObj.movePrevious()` | `tour.MovePreviousAsync()` | `tour.BackAsync()` |
| `driverObj.moveTo(index)` | `tour.MoveToAsync(index)` | `tour.GoToStepAsync(index)` |
| `driverObj.destroy()` | `tour.DestroyAsync()` | `tour.CancelAsync()` / `tour.ExitAsync()` |
| `driverObj.highlight(step)` | `tour.HighlightAsync(selector)` | — |
| `driverObj.hasNextStep()` | `tour.HasNextStep()` | — |
| `driverObj.hasPreviousStep()` | `tour.HasPreviousStep()` | — |
| `driverObj.isFirstStep()` | `tour.IsFirstStep()` | — |
| `driverObj.isLastStep()` | `tour.IsLastStep()` | — |
| `driverObj.getActiveIndex()` | `tour.GetActiveIndex()` | `tour.CurrentStepIndex` |
| `driverObj.getActiveStep()` | `tour.GetActiveStep()` | — |
| `driverObj.getPreviousStep()` | `tour.GetPreviousStep()` | — |
| `driverObj.getActiveElement()` | `tour.GetActiveElement()` | — |
| `driverObj.getPreviousElement()` | `tour.GetPreviousElement()` | — |
| `driverObj.getState()` | `tour.GetState()` | `tour.ExportState()` |
| `driverObj.getConfig()` | `tour.GetConfig()` | `tour.TourOptions` |
| `driverObj.setConfig(opts)` | `tour.SetConfig(opts)` | — |
| `driverObj.setSteps(steps)` | `tour.SetSteps(steps)` | — |
| `driverObj.refresh()` | `tour.Refresh()` | — |

---

## Property Name Reference

| Driver.js | GuideFlow | Notes |
|-----------|-----------|-------|
| `element` | `Element` | CSS selector for target |
| `popover.title` | `Title` | |
| `popover.description` | `Text` / `Description` | `Description` is alias for `Text` |
| `popover.side` | `Side` | `Placement` enum (Top/Bottom/Left/Right/etc.) |
| `popover.align` | `Align` | `PopoverAlign` enum (Start/Center/End) |
| `popover.showButtons` | `ShowButtons` | string array |
| `popover.disableButtons` | `DisableButtons` | string array |
| `popover.nextBtnText` | `NextBtnText` | |
| `popover.prevBtnText` | `PrevBtnText` | |
| `popover.doneBtnText` | `DoneBtnText` | |
| `popover.popoverClass` | `PopoverClass` | |
| `popover.showProgress` | `ShowProgress` | |
| `popover.progressText` | `ProgressText` | |
| `popover.onNextClick` | `OnNextClick` | per-step |
| `popover.onPrevClick` | `OnPrevClick` | per-step |
| `popover.onCloseClick` | `OnCloseClick` | per-step |
| `popover.onPopoverRender` | — | Not yet implemented |
| `animate` | `Animate` | bool, or `AnimationType` for extended control |
| `overlay` | `Overlay` | |
| `overlayColor` | `OverlayColor` | |
| `overlayOpacity` | `OverlayOpacity` | |
| `allowClose` | `AllowClose` | |
| `overlayClickBehavior` | `OverlayClickBehavior` | enum: Close/NextStep/None |
| `allowKeyboardControl` | `AllowKeyboardControl` | |
| `smoothScroll` | `SmoothScroll` | or `ScrollBehavior` for extended control |
| `stagePadding` | `StagePadding` | |
| `stageRadius` | `StageRadius` | |
| `showProgress` | `ShowProgress` | |
| `popoverOffset` | `PopoverOffset` | |
| `showButtons` | `ShowButtons` | tour-level default |
| `disableButtons` | `DisableButtons` | tour-level default |
| `popoverClass` | `PopoverClass` | tour-level default |
| `nextBtnText` | `NextBtnText` | tour-level default |
| `prevBtnText` | `PrevBtnText` | tour-level default |
| `doneBtnText` | `DoneBtnText` | tour-level default |
| `disableActiveInteraction` | `DisableActiveInteraction` | per-step |
| `onHighlightStarted` | `OnBeforeShow` | per-step |
| `onHighlighted` | `OnAfterShow` | per-step |
| `onDeselected` | `OnAfterHide` | per-step |
| `onDestroyStarted` | `OnBeforeDestroy` | tour-level |
| `onDestroyed` | `OnDestroyed` | tour-level |
| `onNextClick` | `OnNextClick` | tour-level or per-step |
| `onPrevClick` | `OnPrevClick` | tour-level or per-step |
| `onCloseClick` | `OnCloseClick` | tour-level or per-step |

---

## GuideFlow Extensions (not in Driver.js)

These features exist in GuideFlow but not in Driver.js:

| Feature | GuideFlow | Description |
|---------|-----------|-------------|
| Declarative components | `<GuideFlowStep>` | Razor component-based tour definition |
| RenderFragment content | `ChildContent` | Rich HTML content beyond string |
| Modal mode | `StepMode.Modal` | Centered modal popover |
| Stage overlay | `OverlayMode.Stage` | 4-panel spotlight effect |
| Highlight shapes | `HighlightShape` | Circle, Ellipse, Rectangle, RoundedRect |
| Animation types | `AnimationType` | Fade, Slide, Bounce, None |
| Focus trapping | `TrapFocus` | Trap Tab key within popover |
| State persistence | `PersistState` | Auto-save/load to localStorage |
| Visited tracking | `TrackVisited` | Track and mark visited steps |
| Async content | `OnLoadContent` / `ContentUrl` | Lazy-load step content |
| Standalone tooltip | `GuideFlowTooltip` | Independent tooltip component |
| Fluent builder | `GuideFlowBuilder` | C# fluent API for tours |
| Server-Side Blazor | — | Full SSR support |
| Auto-reposition | `AutoReposition` | Automatic reposition on resize/scroll |

---

## Shepherd.js → GuideFlow

### Tour Configuration

```js
// Shepherd.js
const tour = new Tour({
  defaultStepOptions: {
    cancelIcon: { enabled: true },
    classes: "shepherd-theme-custom",
    scrollTo: true,
  },
  useModalOverlay: true,
  exitOnEsc: true,
  exitOnOverlayClick: true,
  keyboardNavigation: true,
});
```

```razor
<!-- GuideFlow -->
<GuideFlowTour TourOptions="options">
    <!-- steps -->
</GuideFlowTour>

@code {
    private TourOptions options = new()
    {
        Overlay = true,                            // useModalOverlay
        AllowClose = true,                         // exitOnEsc + exitOnOverlayClick + cancelIcon
        AllowKeyboardControl = true,               // keyboardNavigation
        SmoothScroll = true,                       // scrollTo
        PopoverClass = "shepherd-theme-custom",    // defaultStepOptions.classes
    };
}
```

### Steps

```js
// Shepherd.js
tour.addStep({
  id: "step-1",
  title: "Welcome",
  text: "Hello world",
  attachTo: { element: "#target", on: "bottom" },
  buttons: [
    { text: "Back", action: tour.back },
    { text: "Next", action: tour.next },
  ],
  classes: "custom-step",
  scrollTo: true,
  when: {
    show: () => console.log("shown"),
    hide: () => console.log("hidden"),
  },
});
```

```razor
<!-- GuideFlow -->
<GuideFlowStep Element="#target"
               Title="Welcome"
               Description="Hello world"
               Side="Placement.Bottom"
               StepId="step-1"
               PopoverClass="custom-step"
               OnAfterShow="OnShow" OnAfterHide="OnHide">
    <ButtonsContent>
        <button class="gf-btn gf-btn--back" @onclick="() => tour.MovePreviousAsync()">Back</button>
        <button class="gf-btn gf-btn--next" @onclick="() => tour.MoveNextAsync()">Next</button>
    </ButtonsContent>
</GuideFlowStep>
```

### Methods

| Shepherd.js | GuideFlow |
|-------------|-----------|
| `tour.start()` | `tour.DriveAsync()` |
| `tour.next()` | `tour.MoveNextAsync()` |
| `tour.back()` | `tour.MovePreviousAsync()` |
| `tour.cancel()` | `tour.DestroyAsync()` |
| `tour.complete()` | `tour.CompleteAsync()` |
| `tour.show(stepId)` | `tour.MoveToAsync(index)` |

### Events

| Shepherd.js | GuideFlow |
|-------------|-----------|
| `tour.on("start", fn)` | `OnStart` |
| `tour.on("complete", fn)` | `OnComplete` |
| `tour.on("cancel", fn)` | `OnCancel` |
| `tour.on("show", fn)` | `OnAfterShow` (per step) |
| `tour.on("hide", fn)` | `OnAfterHide` (per step) |
