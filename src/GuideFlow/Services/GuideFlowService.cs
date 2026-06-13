using System.Text.Json;
using GuideFlow.Enums;
using GuideFlow.Models;
using Microsoft.JSInterop;

namespace GuideFlow.Services;

/// <summary>
/// Default implementation of IGuideFlowService.
/// Manages tour state, navigation, events, and persistence.
/// </summary>
public class GuideFlowService : IGuideFlowService
{
    private readonly IJSRuntime _jsRuntime;
    private readonly Dictionary<int, StepOptions> _steps = new();
    private TourOptions? _tourOptions;
    private string? _tourName;

    public GuideFlowService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    // --- State ---
    public TourStatus Status { get; private set; } = TourStatus.NotStarted;
    public int ActiveIndex { get; private set; }
    public int TotalSteps => _steps.Count;
    public bool IsActive => Status == TourStatus.Active;
    public TourState? CurrentState => BuildState();

    // --- Events ---
    public event EventHandler<TourEventArgs>? OnTourStarted;
    public event EventHandler<TourEventArgs>? OnTourCompleted;
    public event EventHandler<TourEventArgs>? OnTourCancelled;
    public event EventHandler<StepChangeEventArgs>? OnStepChanged;
    public event Func<BeforeStepChangeEventArgs, Task>? OnBeforeStepChange;

    // === Navigation (Driver.js API) ===

    /// <summary>Driver.js: drive(). Starts the tour.</summary>
    public async Task DriveAsync(string? tourName = null)
    {
        _tourName = tourName ?? _tourName ?? Constants.DefaultTourName;
        Status = TourStatus.Active;
        ActiveIndex = 0;

        // Skip disabled steps
        while (ActiveIndex < TotalSteps && GetCurrentStep()?.Disabled == true)
            ActiveIndex++;

        if (ActiveIndex >= TotalSteps)
        {
            await CompleteAsync();
            return;
        }

        OnTourStarted?.Invoke(this, new TourEventArgs
        {
            TourName = _tourName,
            ActiveIndex = ActiveIndex,
            TotalSteps = TotalSteps
        });

        await NotifyStepChanged(-1, ActiveIndex);

        if (_tourOptions?.PersistState == true)
            await SaveStateAsync();
    }

    /// <summary>Driver.js: moveNext(). Moves to the next step.</summary>
    public async Task MoveNextAsync()
    {
        if (Status != TourStatus.Active) return;

        var nextIndex = ActiveIndex + 1;

        // Skip disabled steps
        while (nextIndex < TotalSteps && GetStepAtIndex(nextIndex)?.Disabled == true)
            nextIndex++;

        if (nextIndex >= TotalSteps)
        {
            await CompleteAsync();
            return;
        }

        var canChange = await CanChangeStep(ActiveIndex, nextIndex);
        if (!canChange) return;

        var previousIndex = ActiveIndex;
        ActiveIndex = nextIndex;
        await NotifyStepChanged(previousIndex, ActiveIndex);

        if (_tourOptions?.PersistState == true)
            await SaveStateAsync();
    }

    /// <summary>Driver.js: movePrevious(). Moves to the previous step.</summary>
    public async Task MovePreviousAsync()
    {
        if (Status != TourStatus.Active) return;
        if (ActiveIndex <= 0) return;

        var prevIndex = ActiveIndex - 1;

        // Skip disabled steps going backward
        while (prevIndex >= 0 && GetStepAtIndex(prevIndex)?.Disabled == true)
            prevIndex--;

        if (prevIndex < 0) return;

        var canChange = await CanChangeStep(ActiveIndex, prevIndex);
        if (!canChange) return;

        var previousIndex = ActiveIndex;
        ActiveIndex = prevIndex;
        await NotifyStepChanged(previousIndex, ActiveIndex);

        if (_tourOptions?.PersistState == true)
            await SaveStateAsync();
    }

    /// <summary>Driver.js: moveTo(index). Moves to a specific step.</summary>
    public async Task MoveToAsync(int stepIndex)
    {
        if (Status != TourStatus.Active) return;
        if (stepIndex < 0 || stepIndex >= TotalSteps) return;
        if (stepIndex == ActiveIndex) return;

        var step = GetStepAtIndex(stepIndex);
        if (step?.Disabled == true) return;

        var canChange = await CanChangeStep(ActiveIndex, stepIndex);
        if (!canChange) return;

        var previousIndex = ActiveIndex;
        ActiveIndex = stepIndex;
        await NotifyStepChanged(previousIndex, ActiveIndex);

        if (_tourOptions?.PersistState == true)
            await SaveStateAsync();
    }

    /// <summary>Driver.js: destroy(). Destroys the tour.</summary>
    public async Task DestroyAsync()
    {
        if (Status != TourStatus.Active) return;

        Status = TourStatus.Cancelled;
        OnTourCancelled?.Invoke(this, new TourEventArgs
        {
            TourName = _tourName,
            ActiveIndex = ActiveIndex,
            TotalSteps = TotalSteps
        });

        if (_tourOptions?.PersistState == true)
            await ClearStateAsync();
    }

    public async Task CompleteAsync()
    {
        if (Status != TourStatus.Active) return;

        Status = TourStatus.Completed;
        OnTourCompleted?.Invoke(this, new TourEventArgs
        {
            TourName = _tourName,
            ActiveIndex = ActiveIndex,
            TotalSteps = TotalSteps
        });

        if (_tourOptions?.PersistState == true)
            await SaveStateAsync();
    }

    // === Driver.js: hasNextStep, hasPreviousStep, isFirstStep, isLastStep ===

    public bool HasNextStep() => ActiveIndex < TotalSteps - 1;
    public bool HasPreviousStep() => ActiveIndex > 0;
    public bool IsFirstStep() => ActiveIndex == 0;
    public bool IsLastStep() => ActiveIndex >= TotalSteps - 1;

    // === Driver.js: getActiveIndex, getActiveStep, getPreviousStep ===

    public int GetActiveIndex() => ActiveIndex;

    public StepOptions? GetActiveStep() => GetCurrentStep();

    public StepOptions? GetPreviousStep() =>
        ActiveIndex > 0 ? GetStepAtIndex(ActiveIndex - 1) : null;

    // === Driver.js: getState, getConfig, setConfig ===

    public TourState? GetState() => BuildState();

    public TourOptions? GetConfig() => _tourOptions;

    public void SetConfig(TourOptions options)
    {
        _tourOptions = options;
    }

    // --- State Persistence ---
    public async Task SaveStateAsync()
    {
        var state = BuildState();
        if (state == null) return;

        var key = _tourOptions?.StorageKey ?? $"{Constants.StorageKeyPrefix}{_tourName}";
        var json = JsonSerializer.Serialize(state, GuideFlowJsonContext.Default.TourState);
        try
        {
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", key, json);
        }
        catch (JSDisconnectedException) { /* Server-side Blazor disconnection */ }
    }

    public async Task<TourState?> LoadStateAsync(string? tourName = null)
    {
        var key = _tourOptions?.StorageKey ?? $"{Constants.StorageKeyPrefix}{tourName ?? _tourName ?? Constants.DefaultTourName}";
        try
        {
            var json = await _jsRuntime.InvokeAsync<string?>("localStorage.getItem", key);
            if (string.IsNullOrEmpty(json)) return null;
            return JsonSerializer.Deserialize(json, GuideFlowJsonContext.Default.TourState);
        }
        catch (JSDisconnectedException) { return null; }
    }

    public async Task ClearStateAsync(string? tourName = null)
    {
        var key = _tourOptions?.StorageKey ?? $"{Constants.StorageKeyPrefix}{tourName ?? _tourName ?? Constants.DefaultTourName}";
        try
        {
            await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", key);
        }
        catch (JSDisconnectedException) { /* Server-side Blazor disconnection */ }
    }

    // --- Internal Registration ---
    void IGuideFlowService.RegisterTour(string tourName, TourOptions options)
    {
        _tourName = tourName;
        _tourOptions = options;
    }

    void IGuideFlowService.RegisterStep(int index, StepOptions step)
    {
        _steps[index] = step;
    }

    void IGuideFlowService.UnregisterStep(int index)
    {
        _steps.Remove(index);
    }

    TourOptions? IGuideFlowService.GetTourOptions() => _tourOptions;

    StepOptions? IGuideFlowService.GetStep(int index) =>
        _steps.TryGetValue(index, out var step) ? step : null;

    IReadOnlyList<StepOptions> IGuideFlowService.GetAllSteps() =>
        _steps.OrderBy(kv => kv.Key).Select(kv => kv.Value).ToList().AsReadOnly();

    // --- Private Helpers ---
    private StepOptions? GetCurrentStep() =>
        _steps.TryGetValue(ActiveIndex, out var step) ? step : null;

    private StepOptions? GetStepAtIndex(int index) =>
        _steps.TryGetValue(index, out var step) ? step : null;

    private async Task<bool> CanChangeStep(int from, int to)
    {
        if (OnBeforeStepChange == null) return true;

        var args = new BeforeStepChangeEventArgs
        {
            ActiveIndex = from,
            TargetStepIndex = to
        };

        await OnBeforeStepChange.Invoke(args);
        return !args.Cancel;
    }

    private async Task NotifyStepChanged(int previousIndex, int currentIndex)
    {
        var step = GetCurrentStep();
        OnStepChanged?.Invoke(this, new StepChangeEventArgs
        {
            PreviousStepIndex = previousIndex,
            ActiveIndex = currentIndex,
            TotalSteps = TotalSteps,
            StepId = step?.StepId,
            Selector = step?.Element
        });
    }

    private TourState? BuildState()
    {
        if (_tourName == null) return null;

        return new TourState
        {
            TourName = _tourName,
            ActiveIndex = ActiveIndex,
            TotalSteps = TotalSteps,
            Status = Status,
            CompletedStepIds = _steps
                .Where(kv => kv.Key < ActiveIndex)
                .Select(kv => kv.Value.StepId ?? kv.Key.ToString())
                .ToList(),
            LastUpdated = DateTime.UtcNow
        };
    }
}
