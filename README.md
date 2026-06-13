# GuideFlow

Accessible, animated guided tour component library for Blazor.

- 🎯 Target any element with a CSS-selector cutout overlay
- ⌨️ Keyboard navigation (arrows, Enter, Escape, Tab)
- ♿ ARIA attributes, focus trapping, screen reader support
- 🎨 Themable via CSS custom properties
- ✨ Smooth animated transitions and cutout
- 📍 Auto-flip, viewport-aware positioning
- 💾 Optional localStorage state persistence
- 📦 Zero external JS dependencies

## Install

```bash
dotnet add package GuideFlow
```

## Usage

**Program.cs**
```csharp
builder.Services.AddGuideFlow();
```

**_Imports.razor**
```razor
@using GuideFlow.Components
@using GuideFlow.Enums
@using GuideFlow.Models
```

**Component**
```razor
<button @onclick="StartTour">Start Tour</button>

<div id="section-a">...</div>
<div id="section-b">...</div>

<GuideFlowTour @ref="tour" TourOptions="options">
    <GuideFlowStep Selector="#section-a" Title="Step 1" Order="0" Placement="Placement.Bottom">
        <p>Highlights section A.</p>
    </GuideFlowStep>
    <GuideFlowStep Selector="#section-b" Title="Step 2" Order="1" Placement="Placement.Right">
        <p>Highlights section B.</p>
    </GuideFlowStep>
</GuideFlowTour>

@code {
    private GuideFlowTour? tour;
    private TourOptions options = new() { Overlay = true, ShowProgress = true };
    private async Task StartTour() => await tour!.StartAsync();
}
```

## Documentation

Full docs — options, step parameters, events, theming, keyboard shortcuts:  
👉 [https://miraclefoundation.github.io/GuideFlow](https://miraclefoundation.github.io/GuideFlow)

## Contributing

PRs welcome! See [open pull requests](https://github.com/MiracleFoundation/GuideFlow/pulls).

## License

[MIT](LICENSE.txt)
