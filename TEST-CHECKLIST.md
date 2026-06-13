# GuideFlow - Manual Test Checklist

## 1. Tour Lifecycle

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 1.1 | Start tour | Click "Start Tour" button | Tour starts, first step popover appears | ✅ |
| 1.2 | Next step | Click Next button | Popover moves to next target element | ✅ |
| 1.3 | Previous step | Click Previous button | Popover moves back to previous target | ✅ |
| 1.4 | Complete tour | Navigate to last step, click Done/Finish | Tour ends, overlay removed | ✅ |
| 1.5 | Cancel/Close tour | Click X button or press Escape | Tour ends immediately | ✅ |
| 1.6 | Overlay click to close | Click on overlay area | Tour closes (when AllowClose=true) | ✅ |
| 1.7 | Start from specific step | Call `await tour.DriveAsync()` rồi `await tour.MoveToAsync(2)` | Tour bắt đầu rồi nhảy tới step index 2 | ✅ |

## 2. Overlay

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 2.1 | Cutout mode (default) | Click "Cutout Mode" | SVG cutout highlights target element | |
| 2.2 | Stage mode | Click "Stage Mode" | 4 panels surround target without overlapping | |
| 2.3 | Overlay opacity | Click Light/Medium/Dark buttons | Overlay opacity changes accordingly | ✅ |
| 2.4 | Custom overlay color | Click Red/Blue/Yellow buttons | Overlay tints with custom color | ✅ |
| 2.5 | Disable overlay | Click "No Overlay" | No overlay shown | ✅ |
| 2.6 | Overlay click = None | Click "None" rồi click overlay area | Overlay click không làm gì | ✅ |
| 2.7 | Overlay click = NextStep | Click "Next Step" rồi click overlay area | Chuyển sang step tiếp theo | ✅ |

## 3. Popover Positioning

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 3.1 | Placement Bottom | Set `Side = Bottom` | Popover appears below target | ✅ |
| 3.2 | Placement Top | Set `Side = Top` | Popover appears above target | ✅ |
| 3.3 | Placement Left | Set `Side = Left` | Popover appears left of target | ✅ |
| 3.4 | Placement Right | Set `Side = Right` | Popover appears right of target | ✅ |
| 3.5 | Placement TopStart/TopEnd | Test start/end variants | Popover aligned to start/end edge | ✅ |
| 3.6 | Placement BottomStart/BottomEnd | Test start/end variants | Popover aligned to start/end edge | ✅ |
| 3.7 | Placement LeftStart/LeftEnd | Test start/end variants | Popover aligned to start/end edge | ✅ |
| 3.8 | Placement RightStart/RightEnd | Test start/end variants | Popover aligned to start/end edge | ✅ |
| 3.9 | Placement Auto | Click "Auto Flip" button | Popover auto-flips to stay in viewport | ✅ |
| 3.10 | Align Start | Set `Align = Start` | Popover aligned to start edge of target | ✅ |
| 3.11 | Align Center | Set `Align = Center` | Popover centered on target | ✅ |
| 3.12 | Align End | Set `Align = End` | Popover aligned to end edge of target | ✅ |
| 3.13 | Popover offset | Click 5px/10px/30px buttons | Gap between popover and target changes | ✅ |

## 4. Arrow

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 4.1 | Arrow visible (default) | Start tour, `ShowArrow = true` | Arrow points from popover to target | ✅ |
| 4.2 | Arrow hidden | Set `ShowArrow = false` | No arrow shown | ✅ |
| 4.3 | Arrow direction follows placement | Change Side between Top/Bottom/Left/Right | Arrow rotates to point correctly | ✅ |

## 5. Highlight Shapes

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 5.1 | RoundedRect (default) | Default settings | Rounded rectangle cutout | ✅ |
| 5.2 | Rectangle | Set `HighlightShape = Rectangle` | Sharp-corner rectangle cutout | ✅ |
| 5.3 | Circle | Set `HighlightShape = Circle` | Circular cutout | ✅ |
| 5.4 | Ellipse | Set `HighlightShape = Ellipse` | Elliptical cutout | ✅ |
| 5.5 | Stage padding | Click 0px/10px/30px buttons on Stage Overlay page | Gap around target changes | ✅ |
| 5.6 | Stage radius | Click 0px/5px/20px buttons on Stage Overlay page | Border radius changes | ✅ |

## 6. Animation ✅

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 6.1 | Fade animation (default) | Default settings | Smooth fade between steps | ✅ |
| 6.2 | Slide animation | Set `AnimationType = Slide` | Slide transition between steps | ✅ |
| 6.3 | Bounce animation | Set `AnimationType = Bounce` | Bounce effect on popover | ✅ |
| 6.4 | No animation | Set `AnimationType = None` | Instant switch, no transition | ✅ |
| 6.5 | Disable animation | Set `Animate = false` | No animation | ✅ |
| 6.6 | Custom duration | Set `AnimationDuration = 600` | Slower 600ms transition | ✅ |
| 6.7 | Animate cutout | Set `AnimateCutout = true` | Cutout smoothly moves between elements | ✅ |
| 6.8 | Cutout no animation | Set `AnimateCutout = false` | Cutout jumps instantly | ✅ |

## 7. Step Content

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 7.1 | Title + Text | Set Title and Text | Popover shows title and description | ✅ |
| 7.2 | ChildContent (rich HTML) | Use `<ChildContent>` with HTML | HTML renders inside popover | ✅ |
| 7.3 | Description alias | Use `Description` instead of `Text` | Same result as Text | ✅ |
| 7.4 | AttachTo alias | Use `AttachTo` instead of `Element` | Same result as Element | ✅ |
| 7.5 | Async content (OnLoadContent) | Click "Load Content Async" on Async Tour page | Content loads with 1.5s delay | ✅ |
| 7.6 | Content from URL | Set `ContentUrl` (requires HttpClient) | Content fetched from URL | |

## 8. Buttons

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 8.1 | Next button visible | Default | Next button shown | ✅ |
| 8.2 | Previous button visible | Default | Previous button shown | ✅ |
| 8.3 | Close button visible | Default | Close (X) button shown | ✅ |
| 8.4 | Hide Next | Set `ShowNext = false` | Next button hidden | ✅ |
| 8.5 | Hide Previous | Set `ShowBack = false` | Previous button hidden | ✅ |
| 8.6 | Hide Close | Set `ShowClose = false` | Close button hidden | ✅ |
| 8.7 | Show Skip | Set `ShowSkip = true` | Skip button appears | ✅ |
| 8.8 | Custom button text | Set `NextBtnText = "Continue"`, etc. | Custom text on buttons | ✅ |
| 8.9 | Done button on last step | Navigate to last step | "Done" button replaces "Next" | ✅ |
| 8.10 | Custom Done text | Set `DoneBtnText = "Finish!"` | Custom Done text on last step | ✅ |
| 8.11 | Disable specific buttons | Set `DisableButtons = [Previous]` | Previous button grayed out | ❌ BUG |
| 8.12 | Show only specific buttons | Set `ShowButtons = [Next, Close]` | Only Next and Close visible | ✅ |
| 8.13 | Custom ButtonsContent | Use `ButtonsContent` render fragment | Custom buttons render | ✅ |

## 9. Progress

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 9.1 | Progress text | Set `ShowProgress = true` | Shows "1 of 3" style text | ✅ |
| 9.2 | Custom progress template | Set `ProgressText = "Step {{current}}/{{total}}"` | Shows "Step 1/3" | ✅ |
| 9.3 | Progress bar | Set `ShowProgressBar = true` | Visual progress bar shown | ✅ |
| 9.4 | Progress updates on navigate | Move between steps | Progress text/bar updates correctly | ✅ |

## 10. Keyboard Navigation

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 10.1 | Arrow Right / Down = Next | Click "Keyboard Enabled", press → or ↓ | Moves to next step | ✅ |
| 10.2 | Arrow Left / Up = Previous | Press ← or ↑ | Moves to previous step | ✅ |
| 10.3 | Enter = Next | Press Enter | Moves to next step | ✅ |
| 10.4 | Escape = Close | Press Escape | Tour closes | ✅ |
| 10.5 | Tab = Focus trap | Press Tab repeatedly | Focus stays within popover | ✅ |
| 10.6 | Disable keyboard | Click "Keyboard Disabled", try arrow keys | Keyboard does nothing | ✅ |

## 11. Scrolling

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 11.1 | Auto scroll to target | Click any button on Scrolling Demo | Page scrolls down to target | |
| 11.2 | Smooth scroll | Click "Smooth" | Animated smooth scroll | |
| 11.3 | Scroll behavior Smooth | Click "Smooth" | Smooth scrolling animation | |
| 11.4 | Scroll behavior Instant | Click "Instant" | Instant jump, no animation | |
| 11.5 | Scroll block Center | Click "Center" | Target centered in viewport | |
| 11.6 | Scroll block Start | Click "Start" | Target at top of viewport | |
| 11.7 | Scroll block End | Click "End" | Target at bottom of viewport | |
| 11.8 | Scroll block Nearest | Click "Nearest" | Minimal scroll needed | |

## 12. Themes

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 12.1 | Default theme | No PopoverClass set | Default light theme | ✅ |
| 12.2 | Light theme | Set `PopoverClass = "gf-theme-light"` | Light styled popover | ✅ |
| 12.3 | Dark theme | Set `PopoverClass = "gf-theme-dark"` | Dark styled popover | ✅ |
| 12.4 | High contrast theme | Set `PopoverClass = "gf-theme-high-contrast"` | High contrast colors | ✅ |
| 12.5 | Custom CSS variables | Override CSS custom properties | Custom styling applied | ✅ |

## 13. Step Mode

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 13.1 | Bubble mode (default) | Default settings | Popover near target element | ✅ |
| 13.2 | Modal mode | Set `Mode = StepMode.Modal` | Popover centered on screen | ✅ |
| 13.3 | Mix modes | Some steps Bubble, some Modal | Each step uses its own mode | ✅ |

## 14. Step Lifecycle Events

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 14.1 | OnBeforeShow | Set callback | Fires before step shows | |
| 14.2 | OnAfterShow | Set callback | Fires after step shown | |
| 14.3 | OnBeforeHide | Set callback | Fires before step hides | |
| 14.4 | OnAfterHide | Set callback | Fires after step hides | |
| 14.5 | OnPopoverRender | Set callback | Fires after popover rendered | |

## 15. Tour Events

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 15.1 | OnStart | Start tour | OnStart callback fires | |
| 15.2 | OnComplete | Complete tour | OnComplete callback fires | |
| 15.3 | OnCancel | Cancel tour | OnCancel callback fires | |
| 15.4 | OnStepChange | Move between steps | OnStepChange fires with step info | |
| 15.5 | OnBeforeStepChange (cancel) | Return false from callback | Step change blocked | |
| 15.6 | OnNextClick override | Set custom OnNextClick | Custom logic runs instead of default | |
| 15.7 | OnPrevClick override | Set custom OnPrevClick | Custom logic runs | |
| 15.8 | OnCloseClick override | Set custom OnCloseClick | Custom logic runs | |
| 15.9 | OnDestroyStarted (confirm exit) | Set callback returning Task<bool> | Prompt shown before exit | |

## 16. Accessibility

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 16.1 | ARIA role="dialog" | Inspect popover | Has role="dialog" | |
| 16.2 | aria-labelledby | Inspect popover | Points to title element | |
| 16.3 | aria-describedby | Inspect popover | Points to description element | |
| 16.4 | Focus trap | Tab through popover | Focus stays inside | |
| 16.5 | Escape closes | Press Escape | Tour closes | |
| 16.6 | Disable focus trap | Set `TrapFocus = false` | Tab can leave popover | |
| 16.7 | Screen reader | Navigate with screen reader | Step content announced | |

## 17. Programmatic API (GuideFlowBuilder)

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 17.1 | Build tour with fluent API | Use `GuideFlowBuilder` | Tour works same as declarative | |
| 17.2 | AddStep with options | Use `StepBuilder` | Step configured correctly | |
| 17.3 | SetSteps at runtime | Call `SetSteps()` | Tour updates with new steps | |
| 17.4 | MoveToAsync | Call `MoveToAsync(3)` | Jumps to step 3 | |
| 17.5 | ResetAsync | Call `ResetAsync()` | Tour resets to initial state | |
| 17.6 | HighlightAsync | Call `HighlightAsync("#el")` | Single element highlighted | |
| 17.7 | ShowPopoverAsync | Call `ShowPopoverAsync()` | Popover shown without target | |
| 17.8 | GetState | Call `GetState()` | Returns JSON with current state | |
| 17.9 | GetConfig/SetConfig | Get and modify config | Config updates applied | |

## 18. Async Tour

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 18.1 | Load steps async | Steps loaded from API | Tour starts after steps loaded | |
| 18.2 | OnLoadContent per step | Step has async content loader | Content loads before step shows | |
| 18.3 | ContentUrl per step | Step has URL set | Content fetched from URL | |

## 19. Edge Cases

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 19.1 | Target element not found | Use invalid CSS selector | Step skipped or graceful error | |
| 19.2 | Window resize | Resize browser during tour | Popover repositions (AutoReposition) | |
| 19.3 | Scroll during tour | Scroll page while tour active | Popover follows target | |
| 19.4 | Z-index conflicts | Page has high z-index elements | Tour stays on top (ZIndex=10000) | |
| 19.5 | Disabled step | Set `Disabled = true` on a step | Step skipped | |
| 19.6 | Single step tour | Tour with only 1 step | Works correctly, no Previous | |
| 19.7 | Many steps (10+) | Tour with many steps | Performance OK, progress correct | |
| 19.8 | DisableActiveInteraction | Set `DisableActiveInteraction = true` | Cannot click target element | |
| 19.9 | HighlightClass | Set custom `HighlightClass` | Class added to target element | |
| 19.10 | LazyRender | Set `LazyRender = true` | Content only renders when active | |

## 20. Persist State (localStorage)

| # | Test Case | Steps | Expected | OK? |
|---|-----------|-------|----------|-----|
| 20.1 | Enable persistence | Set `PersistState = true` | State saved to localStorage | |
| 20.2 | Resume on reload | Start tour, refresh page | Tour resumes from last step | |
| 20.3 | Custom storage key | Set `StorageKey = "my-tour"` | Uses custom key in localStorage | |
| 20.4 | TrackVisited | Set `TrackVisited = true` | Visited steps tracked | |

---

**Total: 100 test cases** across 20 categories.

## Summary

| Category | Total | Pass | Fail | Skip |
|----------|-------|------|------|------|
| 1. Tour Lifecycle | 7 | 7 | 0 | 0 |
| 2. Overlay | 7 | 5 | 0 | 0 |
| 3. Popover Positioning | 13 | 13 | 0 | 0 |
| 4. Arrow | 3 | 3 | 0 | 0 |
| 5. Highlight Shapes | 6 | 6 | 0 | 0 |
| 6. Animation | 8 | 8 | 0 | 0 |
| 7. Step Content | 6 | 5 | 0 | 0 |
| 8. Buttons | 13 | 12 | 1 | 0 |
| 9. Progress | 4 | 4 | 0 | 0 |
| 10. Keyboard Navigation | 6 | 6 | 0 | 0 |
| 11. Scrolling | 8 | | | |
| 12. Themes | 5 | 5 | 0 | 0 |
| 13. Step Mode | 3 | 3 | 0 | 0 |
| 14. Step Lifecycle Events | 5 | | | |
| 15. Tour Events | 9 | | | |
| 16. Accessibility | 7 | | | |
| 17. Programmatic API | 9 | | | |
| 18. Async Tour | 3 | | | |
| 19. Edge Cases | 10 | | | |
| 20. Persist State | 4 | | | |
| **Total** | **136** | **74** | **1** | **0** |

## Notes

- Chạy docs site: `dotnet run` trong `docs/GuideFlow.Docs`
- Test trên nhiều trình duyệt (Chrome, Firefox, Edge)
- Test responsive (resize cửa sổ)
- Đánh dấu OK / FAIL / SKIP cho mỗi mục
- Nếu FAIL thì ghi lại steps reproduce + screenshot
