# GuideFlow — Missing Features Roadmap

So sánh với Shepherd.js, Intro.js. Trạng thái: ❌ Chưa có | ⚠️ Có nhưng thiếu | ✅ Đã có

---

## Phase 1: Critical (Trước release 1.0) ✅ COMPLETED

### 1. Responsive Reposition ✅
- **Mô tả:** Tự reposition popover khi user resize window hoặc scroll
- **JS tham khảo:** Shepherd.js `autoUpdate`
- **Cách implement:** Lắng nghe `window.resize` + `scroll` events trong JS module, gọi lại `computePosition` và cập nhật `stepElement.style.left/top`
- **Files cần sửa:** `guideflow.module.js`, `GuideFlowTour.razor`

### 2. Overlay Click-Through (Element Passthrough) ✅
- **Mô tả:** Cho phép user click vào element được highlight xuyên qua overlay, thay vì bị overlay chặn
- **JS tham khảo:** Shepherd.js, Intro.js đều có
- **Cách implement:** Dùng `pointer-events: none` trên overlay, tạo vùng click-through bằng cách đặt một `div` trong suốt đúng vị trí highlight với `pointer-events: auto`, hoặc dùng `elementFromPoint` trick
- **Files cần sửa:** `GuideFlowOverlay.razor`, `GuideFlowOverlay.razor.css`

### 3. Destroy on Complete / Cleanup ✅
- **Mô tả:** Khi tour kết thúc (complete/cancel), remove overlay và step elements khỏi DOM hoàn toàn, cleanup event listeners
- **JS tham khảo:** Shepherd.js `tour.complete()`
- **Cách implement:** Thêm `destroy()` method vào `GuideFlowTour`, gọi `DisposeAsync` đúng cách, cleanup JS event listeners
- **Files cần sửa:** `GuideFlowTour.razor`, `guideflow.module.js`

### 4. Programmatic Tour API ✅
- **Mô tả:** Tạo tour từ C# code mà không cần markup Razor, ví dụ:
  ```csharp
  var tour = new GuideFlowBuilder()
      .AddStep("#header", "Welcome", "This is the header")
      .AddStep("#sidebar", "Menu", "Navigation here")
      .Build();
  await tour.StartAsync();
  ```
- **JS tham khảo:** Shepherd.js `tour.addStep()`, Intro.js `steps[]`
- **Cách implement:** Tạo `GuideFlowBuilder` class + `ProgrammaticTour` component tự render steps từ code
- **Files cần tạo:** `Services/GuideFlowBuilder.cs`, `Components/ProgrammaticTour.razor`

### 5. Per-Step Lifecycle Hooks (Hoạt động đúng) ✅
- **Mô tả:** `OnBeforeShow`, `OnAfterShow`, `OnBeforeHide`, `OnAfterHide` cho từng step, có thể cancel
- **JS tham khảo:** Shepherd.js `when.show()`
- **Cách implement:** Wire up EventCallback trong `GuideFlowStep`, gọi từ `GuideFlowTour` khi chuyển step
- **Files cần sửa:** `GuideFlowStep.razor`, `GuideFlowTour.razor`

### 6. No-Overlay Mode ✅
- **Mô tả:** Highlight element mà không có overlay mờ phía sau
- **JS tham khảo:** Cả 3 thư viện đều hỗ trợ
- **Cách implement:** `TourOptions.Overlay = false` → chỉ render step popover, không render overlay
- **Files cần sửa:** `GuideFlowTour.razor`

### 7. Multiple Tours Support ✅
- **Mô tả:** Nhiều tour trên cùng 1 page, tour queue (tour B đợi tour A xong mới bắt đầu)
- **JS tham khảo:** Shepherd.js nhiều instances
- **Cách implement:** Mỗi `<GuideFlowTour>` có `TourName` riêng, service quản lý active tour, queue mechanism
- **Files cần sửa:** `GuideFlowService.cs`, `GuideFlowTour.razor`

### 8. Custom Buttons Per Step ✅
- **Mô tả:** Mỗi step có thể define button riêng với action tùy chỉnh, không chỉ Next/Back/Skip
  ```razor
  <GuideFlowStep ...>
      <Buttons>
          <GuideFlowButton Text="Try it" Action="OpenModal" />
          <GuideFlowButton Text="Skip" Action="Next" />
      </Buttons>
  </GuideFlowStep>
  ```
- **JS tham khảo:** Shepherd.js `buttons[]` với custom `action` function
- **Cách implement:** Thêm `ButtonsContent` RenderFragment parameter, nếu có thì override default buttons
- **Files cần sửa:** `GuideFlowStep.razor`

---

## Phase 2: Important (Cạnh tranh với JS libraries) ✅ COMPLETED

### 9. Auto-Placement (Viewport Collision Detection) ✅
- **Mô tả:** Tự chọn placement tốt nhất khi placement hiện tại bị tràn viewport
- **JS tham khảo:** Shepherd.js `autoPlacement` middleware
- **Cách implement:** Trong `computePosition`, kiểm tra nếu popover tràn viewport → thử placement khác (bottom → top → right → left)
- **Files cần sửa:** `guideflow.module.js`

### 10. Arrow Auto-Flip ✅
- **Mô tả:** Khi popover bị flip (từ bottom sang top), mũi tên cũng tự đảo vị trí
- **JS tham khảo:** Shepherd.js arrow middleware
- **Cách implement:** Trả về `actualPlacement` từ `computePosition`, dùng nó để set arrow CSS class
- **Files cần sửa:** `guideflow.module.js`, `GuideFlowArrow.razor`

### 11. Step Highlight Styles ✅
- **Mô tả:** Thêm border, pulse, glow effect cho target element đang được highlight
- **JS tham khảo:** Intro.js `highlightClass`
- **Cách implement:** Thêm CSS class vào target element qua JS interop khi step active, remove khi step deactivate
- **Files cần sửa:** `guideflow.module.js`, thêm CSS class `gf-highlight-active`

### 12. Floating Overlay (Stage Mode) ✅
- **Mô tả:** Overlay chỉ bao quanh target element thay vì full-screen, tạo hiệu ứng spotlight
- **JS tham khảo:** Stage mode overlay
- **Cách implement:** Thay vì 1 overlay full-screen, render 4 overlay panels xung quanh target (top, bottom, left, right)
- **Files cần sửa:** `GuideFlowOverlay.razor`

### 13. Progress Bar Visual ✅
- **Mô tả:** Thanh progress bar ngang, không chỉ text "2 of 5"
- **JS tham khảo:** Intro.js `showProgress`
- **Cách implement:** Thêm `<div class="gf-progress-bar">` với width tính theo `currentStep/totalSteps * 100%`
- **Files cần sửa:** `GuideFlowStep.razor`, `GuideFlowStep.razor.css`

### 14. Scroll Behavior Config ✅
- **Mô tả:** Cấu hình chi tiết scroll: `off`, `element`, `window`, custom `scrollIntoViewOptions`
- **JS tham khảo:** Shepherd.js `scrollTo: { behavior, block }`
- **Cách implement:** Đổi `SmoothScroll` từ `bool` thành `ScrollBehavior` enum/object
- **Files cần sửa:** `TourOptions.cs`, `guideflow.module.js`

### 15. Backdrop Padding/Shape Config ✅
- **Mô tả:** Cấu hình padding bo tròn, hình dạng cutout (chữ nhật, ellipse, custom)
- **JS tham khảo:** Intro.js `hintBorderRadius`
- **Cách implement:** Thêm `HighlightShape` enum (Rectangle, RoundedRect, Circle, Ellipse), tính toán SVG path tương ứng
- **Files cần sửa:** `TourOptions.cs`, `GuideFlowOverlay.razor`

### 16. z-Index Management ✅
- **Mô tả:** Tự quản lý z-index khi có nhiều overlay/tour trên cùng page
- **JS tham khảo:** z-index management patterns
- **Cách implement:** Service track active z-index counter, mỗi overlay/tour tăng z-index
- **Files cần sửa:** `GuideFlowService.cs`

### 17. Async Step Content Loading ✅
- **Mô tả:** Load step content từ API/async source trước khi show step
- **JS tham khảo:** Không thư viện nào có sẵn (custom extension)
- **Cách implement:** Thêm `Func<Task<RenderFragment>>` parameter hoặc `OnLoad` callback
- **Files cần sửa:** `GuideFlowStep.razor`

### 18. Step Visited Indicator ✅
- **Mô tả:** Đánh dấu step đã xem (visited), cho phép user thấy progress cá nhân
- **JS tham khảo:** Không thư viện nào có sẵn
- **Cách implement:** Track visited steps trong `TourState`, thêm CSS class `gf-step--visited`
- **Files cần sửa:** `GuideFlowTour.razor`, `TourState.cs`

---

## Phase 3: Nice-to-have (Enhancement) ✅ COMPLETED

### 19. Bubble vs Modal Mode ✅
- **Mô tả:** Popover nổi cạnh target (bubble) vs centered trên màn hình (modal)
- **JS tham khảo:** Popover display modes
- **Cách implement:** Thêm `StepMode` enum (Bubble, Modal), khi Modal thì center popover
- **Files cần sửa:** `GuideFlowStep.razor`, `guideflow.module.js`

### 20. Step Animation Types ✅
- **Mô tả:** Nhiều loại animation: fade, slide, bounce, none
- **JS tham khảo:** Animation options
- **Cách implement:** Thêm `AnimationType` enum, CSS animation classes tương ứng
- **Files cần sửa:** `TourOptions.cs`, `GuideFlowStep.razor.css`

### 21. Dark Mode / Theme Presets ✅
- **Mô tả:** Built-in light/dark/high-contrast themes
- **JS tham khảo:** Không thư viện nào có sẵn
- **Cách implement:** Pre-built CSS class sets: `gf-theme-light`, `gf-theme-dark`, `gf-theme-high-contrast`
- **Files cần tạo:** `wwwroot/themes/light.css`, `wwwroot/themes/dark.css`

### 22. Tour Replay ✅
- **Mô tả:** Restart tour từ đầu sau khi complete, hoặc replay từ step cụ thể
- **JS tham khảo:** Intro.js `introJs().start()`
- **Cách implement:** `tour.ResetAsync()` → reset state, gọi `StartAsync()` lại
- **Files cần sửa:** `GuideFlowTour.razor`

### 24. Tooltip Mode (Standalone Highlight) ✅
- **Mô tả:** Dùng như tooltip library, highlight 1 element mà không cần tour
- **JS tham khảo:** Standalone highlight
- **Cách implement:** `<GuideFlowTooltip>` component standalone, không cần `<GuideFlowTour>`
- **Files cần tạo:** `Components/GuideFlowTooltip.razor`

### 25. Step Data Attributes ✅
- **Mô tả:** Define steps bằng HTML data attributes thay vì Razor markup
  ```html
  <div data-gf-step="1" data-gf-title="Welcome" data-gf-placement="bottom">...</div>
  ```
- **JS tham khảo:** Intro.js `data-intro`, `data-step`
- **Cách implement:** Scan DOM cho `[data-gf-step]` elements, auto-generate steps
- **Files cần sửa:** `guideflow.module.js`

### 26. Floating UI Full Middleware Chain
- **Mô tả:** Offset, shift, flip, arrow, size, hide middleware đầy đủ
- **JS tham khảo:** Shepherd.js dùng @floating-ui/dom đầy đủ
- **Cách implement:** Inline thêm middleware logic vào `computePosition` hoặc bundle @floating-ui/dom
- **Files cần sửa:** `guideflow.module.js`

### 27. Lazy Step Rendering ✅
- **Mô tả:** Chỉ render step content khi step đó active, tiết kiệm DOM
- **JS tham khảo:** Shepherd.js lazy rendering
- **Cách implement:** Dùng `@if (IsActive)` hoặc `DynamicComponent` lazy load
- **Files cần sửa:** `GuideFlowStep.razor`

### 28. Export Tour State as JSON ✅
- **Mô tả:** Serialize toàn bộ tour state ra JSON để debug, test, analytics
- **JS tham khảo:** Không thư viện nào có sẵn
- **Cách implement:** `tour.ExportState()` → JSON string
- **Files cần sửa:** `GuideFlowTour.razor`

### 29. Server-Side Blazor Support ✅
- **Mô tả:** Test và đảm bảo hoạt động với Blazor Server, SignalR reconnection
- **JS tham khảo:** N/A
- **Cách implement:** Handle `JSDisconnectedException` đúng cách, test với Blazor Server template
- **Files cần sửa:** Toàn bộ JS interop calls

### 30. Step Content from URL ✅
- **Mô tả:** Load step content từ URL (partial view, markdown file)
- **JS tham khảo:** Không thư viện nào có sẵn
- **Cách implement:** Thêm `ContentUrl` parameter, fetch content trước khi render
- **Files cần sửa:** `GuideFlowStep.razor`

---

## Priority Matrix

| Phase | Số tính năng | Effort | Impact |
|---|---|---|---|
| Phase 1: Critical | 8 | ~3-5 ngày | Cốt lõi, phải có trước release |
| Phase 2: Important | 10 | ~5-7 ngày | Cạnh tranh với JS libraries |
| Phase 3: Nice-to-have | 12 | ~5-8 ngày | Differentiation, UX polish |
| **Tổng** | **30** | **~13-20 ngày** | |

---

## Implementation Order (Gợi ý)

### Week 1: Foundation fixes
1. ✅ Overlay click-through (#2)
2. ✅ Destroy on complete (#3)
3. ✅ No-overlay mode (#6)
4. ✅ Responsive reposition (#1)

### Week 2: Core features
5. ✅ Programmatic API (#4)
6. ✅ Per-step lifecycle hooks (#5)
7. ✅ Custom buttons per step (#8)
8. ✅ Auto-placement (#9)

### Week 3: Polish
9. ✅ Arrow auto-flip (#10)
10. ✅ Progress bar visual (#13)
11. ✅ Step highlight styles (#11)
12. ✅ Floating overlay / stage mode (#12)

### Week 4+: Enhancement
13. Các tính năng Phase 3 theo nhu cầu
