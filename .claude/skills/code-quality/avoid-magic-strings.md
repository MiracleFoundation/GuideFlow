# Skill: Avoid Magic Strings — Use Enums & Constants

## Purpose

Eliminate magic strings from C# codebase by replacing them with type-safe enums and constants. This prevents typos, enables IDE refactoring, and makes code self-documenting.

---

## When to Apply

ALWAYS apply this skill when:
- Writing new C# code with string literals that represent fixed sets of values
- Reviewing code that uses string comparisons or string-based configuration
- Refactoring existing code

---

## Pattern Recognition — What is a Magic String?

A magic string is any string literal that:
1. Represents a fixed set of valid values (e.g., "center" | "start" | "end")
2. Is used in comparisons (`if (mode == "active")`)
3. Is used as configuration keys or identifiers
4. Is repeated in multiple places
5. Could cause runtime errors if misspelled

### Examples of Magic Strings Found

```csharp
// ❌ BAD — Magic string for scroll behavior
public string ScrollBlock { get; set; } = "center";

// ❌ BAD — Magic string array for button types
public string[] ShowButtons { get; set; } = new[] { "next", "previous", "close" };

// ❌ BAD — Magic string for CSS class
await JS.InvokeVoidAsync("addBodyClass", "gf-active");

// ❌ BAD — Magic string for status
Status = _isActive ? "Active" : "Inactive";

// ❌ BAD — Magic string for default text
private string ResolvedNextText => NextBtnText ?? "Next";

// ❌ BAD — Magic string for placement
[Parameter] public string Placement { get; set; } = "bottom";
```

---

## Solution Patterns

### Pattern 1: Enum for Fixed Value Sets

When a property can only be one of a fixed set of values, use an enum.

```csharp
// ✅ GOOD — Type-safe enum
public enum ScrollBlock
{
    Center,
    Start,
    End,
    Nearest
}

public ScrollBlock ScrollBlock { get; set; } = ScrollBlock.Center;
```

**When to create an enum:**
- Property has 2+ distinct valid values
- Values are mutually exclusive
- Values represent states, modes, or types
- Values are used in switch statements or if-else chains

### Pattern 2: Enum Arrays for Multiple Selection

When a property accepts multiple values from a fixed set, use enum arrays.

```csharp
// ✅ GOOD — Type-safe enum array
public enum ButtonType
{
    Next,
    Previous,
    Close,
    Skip
}

public ButtonType[]? ShowButtons { get; set; }
public ButtonType[]? DisableButtons { get; set; }
```

### Pattern 3: Constants for Shared Strings

When strings are shared across files or represent defaults, use constants.

```csharp
// ✅ GOOD — Centralized constants
internal static class Constants
{
    // CSS Classes
    public const string BodyClassActive = "gf-active";
    public const string BodyClassAnimate = "gf-animate";
    public const string BodyClassNoAnimate = "gf-no-animate";

    // Default Text
    public const string DefaultNextText = "Next";
    public const string DefaultBackText = "Back";
    public const string DefaultSkipText = "Skip";
    public const string DefaultDoneText = "Done";

    // Labels
    public const string DefaultCloseLabel = "Close tour";
    public const string DefaultStepAriaLabel = "Tour step";
    public const string DefaultProgressTemplate = "{0} of {1}";
}
```

**When to use constants:**
- String is used in 2+ places
- String represents a CSS class name
- String represents default/localization fallback text
- String is a configuration key or path

### Pattern 4: Enum with ToString() for JS Interop

When passing enum values to JavaScript, convert explicitly.

```csharp
// ✅ GOOD — Explicit conversion for JS interop
var placement = step.Side.ToString().ToLower();
await JS.InvokeVoidAsync("positionStep", placement);

// ✅ GOOD — ScrollBlock enum to string
TourOptions.ScrollBlock.ToString().ToLower()
```

---

## Implementation Checklist

When writing or reviewing code, check:

- [ ] **String literals in properties** → Convert to enum if fixed value set
- [ ] **String arrays with known values** → Convert to enum arrays
- [ ] **Repeated string literals** → Extract to constants
- [ ] **CSS class name strings** → Extract to constants
- [ ] **Default/fallback text strings** → Extract to constants
- [ ] **String comparisons** → Use enum comparisons instead
- [ ] **JS interop string parameters** → Use enum.ToString() for type safety on C# side

---

## File Organization

### Enums Location
```
src/GuideFlow/Enums/
├── AnimationType.cs
├── ButtonType.cs        ← NEW
├── HighlightShape.cs
├── OverlayClickBehavior.cs
├── OverlayMode.cs
├── Placement.cs
├── PopoverAlign.cs
├── ScrollBehavior.cs
├── ScrollBlock.cs       ← NEW
├── StepMode.cs
├── StepStatus.cs
└── TourStatus.cs
```

### Constants Location
```
src/GuideFlow/Constants.cs
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Using string for enum-like properties
```csharp
// WRONG
public string Mode { get; set; } = "bubble";

// RIGHT
public StepMode Mode { get; set; } = StepMode.Bubble;
```

### ❌ Mistake 2: Inline default text
```csharp
// WRONG
private string ResolvedText => value ?? "Next";

// RIGHT
private string ResolvedText => value ?? Constants.DefaultNextText;
```

### ❌ Mistake 3: Inline CSS classes
```csharp
// WRONG
await JS.InvokeVoidAsync("addBodyClass", "gf-active");

// RIGHT
await JS.InvokeVoidAsync("addBodyClass", Constants.BodyClassActive);
```

### ❌ Mistake 4: String status values
```csharp
// WRONG
Status = _isActive ? "Active" : "Inactive";

// RIGHT
Status = _isActive ? TourStatus.Active.ToString() : TourStatus.NotStarted.ToString();
```

### ❌ Mistake 5: String parameter types for known placements
```csharp
// WRONG
[Parameter] public string Placement { get; set; } = "bottom";

// RIGHT
[Parameter] public Placement Placement { get; set; } = Placement.Bottom;
```

---

## Migration Guide for Existing Code

When finding magic strings in existing code:

1. **Identify the domain** — What does this string represent?
2. **Check for existing enum** — Is there already an enum for this?
3. **Create enum if needed** — Add to `Enums/` folder
4. **Update Constants.cs** — Add shared string constants
5. **Update all usages** — Replace string with enum/constant
6. **Update JS interop** — Add `.ToString().ToLower()` where needed
7. **Build and test** — Verify no compilation errors

---

## Real Examples from This Codebase

### Example 1: ScrollBlock Migration
```csharp
// BEFORE
public string ScrollBlock { get; set; } = "center";

// AFTER
public enum ScrollBlock { Center, Start, End, Nearest }
public ScrollBlock ScrollBlock { get; set; } = ScrollBlock.Center;
```

### Example 2: ButtonType Migration
```csharp
// BEFORE
public string[]? ShowButtons { get; set; } = new[] { "next", "previous", "close" };

// AFTER
public enum ButtonType { Next, Previous, Close, Skip }
public ButtonType[]? ShowButtons { get; set; }
```

### Example 3: Placement Parameter Migration
```csharp
// BEFORE
[Parameter] public string Placement { get; set; } = "bottom";
<GuideFlowArrow Placement="@Side.ToString().ToLower()" />

// AFTER
[Parameter] public Placement Placement { get; set; } = Placement.Bottom;
<GuideFlowArrow Placement="@Side" />
```

### Example 4: CSS Class Constants Migration
```csharp
// BEFORE
await SafeInvokeVoidAsync("addBodyClass", "gf-active");
await SafeInvokeVoidAsync("addBodyClass", "gf-animate");

// AFTER
await SafeInvokeVoidAsync("addBodyClass", Constants.BodyClassActive);
await SafeInvokeVoidAsync("addBodyClass", Constants.BodyClassAnimate);
```

---

## Summary

| Pattern | Use When | Example |
|---------|----------|---------|
| **Enum** | Property has fixed set of values | `ScrollBlock`, `Placement`, `StepMode` |
| **Enum Array** | Property accepts multiple values from fixed set | `ButtonType[]`, `OverlayClickBehavior[]` |
| **Constant** | String shared across files or is a default | CSS classes, default text, labels |
| **Enum.ToString()** | Passing to JS interop | `placement.ToString().ToLower()` |

**Rule of thumb:** If you're writing a string literal that represents a *type* or *mode*, it should be an enum. If it's a *label* or *class name* used in multiple places, it should be a constant.
