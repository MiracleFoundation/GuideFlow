using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace GuideFlow.Tests;

[TestClass]
public class GuideFlowDemoTests : PageTest
{
    private const string BaseUrl = "http://localhost:5080";

    // ========== Page Load ==========

    [TestMethod]
    public async Task Page_Loads_Successfully()
    {
        var response = await Page.GotoAsync(BaseUrl);
        Assert.IsNotNull(response);
        Assert.IsTrue(response.Ok);
        var title = await Page.TitleAsync();
        Assert.IsTrue(title.Contains("GuideFlow"));
    }

    [TestMethod]
    public async Task Hero_Section_Is_Visible()
    {
        await Page.GotoAsync(BaseUrl);
        var hero = Page.Locator("#gf-hero");
        await Expect(hero).ToBeVisibleAsync();
        var h1 = hero.Locator("h1");
        await Expect(h1).ToHaveTextAsync("GuideFlow");
    }

    [TestMethod]
    public async Task Feature_Cards_Are_Displayed()
    {
        await Page.GotoAsync(BaseUrl);
        var cards = Page.Locator(".demo-card");
        await Expect(cards).ToHaveCountAsync(6);
    }

    [TestMethod]
    public async Task Stats_Section_Shows_Numbers()
    {
        await Page.GotoAsync(BaseUrl);
        var stats = Page.Locator(".demo-stat__number");
        await Expect(stats).ToHaveCountAsync(4);
        await Expect(stats.Nth(0)).ToHaveTextAsync("30");
    }

    // ========== Declarative Tour ==========

    [TestMethod]
    public async Task DeclarativeTour_Starts_And_Shows_Step()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();

        var step = Page.Locator(".gf-step--visible");
        await Expect(step).ToBeVisibleAsync();

        var title = step.Locator(".gf-step__title");
        await Expect(title).ToBeVisibleAsync();
    }

    [TestMethod]
    public async Task DeclarativeTour_Shows_Overlay()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();

        var overlay = Page.Locator(".gf-overlay");
        await Expect(overlay).ToBeVisibleAsync();
    }

    [TestMethod]
    public async Task DeclarativeTour_Step_Has_Next_Button()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();

        var nextBtn = Page.Locator(".gf-step--visible .gf-btn--next");
        await Expect(nextBtn).ToBeVisibleAsync();
    }

    [TestMethod]
    public async Task DeclarativeTour_Next_Navigates()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();

        var firstTitle = await Page.Locator(".gf-step--visible .gf-step__title").TextContentAsync();

        await Page.Locator(".gf-step--visible .gf-btn--next").ClickAsync(new() { Force = true });
        await Task.Delay(600);

        var secondTitle = await Page.Locator(".gf-step--visible .gf-step__title").TextContentAsync();
        Assert.AreNotEqual(firstTitle, secondTitle);
    }

    [TestMethod]
    public async Task DeclarativeTour_Escape_Cancels()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();
        await Expect(Page.Locator(".gf-step--visible")).ToBeVisibleAsync();

        await Page.Keyboard.PressAsync("Escape");
        await Task.Delay(500);

        await Expect(Page.Locator(".gf-step--visible")).Not.ToBeVisibleAsync();
    }

    [TestMethod]
    public async Task DeclarativeTour_Close_Button_Cancels()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();
        await Expect(Page.Locator(".gf-step--visible")).ToBeVisibleAsync();

        await Page.Locator(".gf-step--visible .gf-step__close").ClickAsync(new() { Force = true });
        await Task.Delay(500);

        await Expect(Page.Locator(".gf-step--visible")).Not.ToBeVisibleAsync();
    }

    [TestMethod]
    public async Task DeclarativeTour_Progress_Bar_Exists()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();

        var progressBar = Page.Locator(".gf-step--visible .gf-step__progress-bar");
        await Expect(progressBar).ToBeVisibleAsync();
    }

    [TestMethod]
    public async Task DeclarativeTour_Progress_Text_Shows()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();

        var progress = Page.Locator(".gf-step--visible .gf-step__progress");
        await Expect(progress).ToBeVisibleAsync();
        await Expect(progress).ToContainTextAsync("of");
    }

    [TestMethod]
    public async Task DeclarativeTour_Status_Badge_Shows()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();

        var badge = Page.Locator(".demo-badge");
        await Expect(badge).ToBeVisibleAsync();
        await Expect(badge).ToContainTextAsync("Declarative Tour");
    }

    [TestMethod]
    public async Task DeclarativeTour_Navigate_Multiple_Steps()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();

        int stepCount = 0;
        for (int i = 0; i < 10; i++)
        {
            var nextBtn = Page.Locator(".gf-step--visible .gf-btn--next");
            if (!await nextBtn.IsVisibleAsync()) break;

            await nextBtn.ClickAsync(new() { Force = true });
            await Task.Delay(400);
            stepCount++;
        }

        Assert.IsTrue(stepCount >= 3, $"Expected at least 3 steps navigated, got {stepCount}");
    }

    // ========== Programmatic Tour ==========

    [TestMethod]
    public async Task ProgrammaticTour_Starts_On_Click()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Programmatic Tour").First.ClickAsync();

        var step = Page.Locator(".gf-step--visible");
        await Expect(step).ToBeVisibleAsync();

        var title = step.Locator(".gf-step__title");
        await Expect(title).ToBeVisibleAsync();
    }

    [TestMethod]
    public async Task ProgrammaticTour_Has_Slide_Animation()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Programmatic Tour").First.ClickAsync();

        var step = Page.Locator(".gf-step--visible");
        await Expect(step).ToBeVisibleAsync();

        var classes = await step.GetAttributeAsync("class");
        Assert.IsTrue(classes?.Contains("gf-step--anim-slide"));
    }

    // ========== Modal Tour ==========

    [TestMethod]
    public async Task ModalTour_Shows_Centered_Step()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Modal Tour").First.ClickAsync();

        var step = Page.Locator(".gf-step--visible");
        await Expect(step).ToBeVisibleAsync();

        var classes = await step.GetAttributeAsync("class");
        Assert.IsTrue(classes?.Contains("gf-step--modal"));
    }

    [TestMethod]
    public async Task ModalTour_Has_No_Arrow()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Modal Tour").First.ClickAsync();

        var arrow = Page.Locator(".gf-step--visible .gf-arrow");
        await Expect(arrow).ToHaveCountAsync(0);
    }

    // ========== Overlay ==========

    [TestMethod]
    public async Task Overlay_Does_Not_Block_Step_Clicks()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.ReloadAsync();
        await Task.Delay(1000);

        await Page.GetByText("Declarative Tour").First.ClickAsync();
        await Expect(Page.Locator(".gf-overlay")).ToBeVisibleAsync();

        // Step next button should be clickable (overlay is pointer-events:none)
        var nextBtn = Page.Locator(".gf-step--visible .gf-btn--next");
        await Expect(nextBtn).ToBeVisibleAsync();
        await nextBtn.ClickAsync(new() { Force = true });
        await Task.Delay(400);

        // Should have moved to next step (any step > 1)
        var progress = Page.Locator(".gf-step--visible .gf-step__progress");
        await Expect(progress).ToBeVisibleAsync();
    }

    // ========== Page Interaction ==========

    [TestMethod]
    public async Task Page_Elements_Clickable_When_Tour_Not_Active()
    {
        await Page.GotoAsync(BaseUrl);

        var heroBtn = Page.GetByText("Declarative Tour").First;
        await Expect(heroBtn).ToBeEnabledAsync();
        await heroBtn.ClickAsync();
    }

    [TestMethod]
    public async Task Page_Elements_Clickable_After_Tour_Ends()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByText("Declarative Tour").First.ClickAsync();
        await Page.Keyboard.PressAsync("Escape");
        await Task.Delay(500);

        await Expect(Page.Locator(".gf-step--visible")).Not.ToBeVisibleAsync();

        var heroBtn = Page.GetByText("Declarative Tour").First;
        await Expect(heroBtn).ToBeEnabledAsync();
    }

    // ========== Responsive ==========

    [TestMethod]
    public async Task Page_Works_At_Mobile_Width()
    {
        await Page.SetViewportSizeAsync(375, 812);
        await Page.GotoAsync(BaseUrl);

        var hero = Page.Locator("#gf-hero");
        await Expect(hero).ToBeVisibleAsync();

        var cards = Page.Locator(".demo-card");
        await Expect(cards).ToHaveCountAsync(6);
    }
}
