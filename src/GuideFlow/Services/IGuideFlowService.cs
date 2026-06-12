using GuideFlow.Enums;
using GuideFlow.Models;

namespace GuideFlow.Services;

/// <summary>
/// Service for controlling guided tours programmatically.
/// API aligned with Driver.js.
/// </summary>
public interface IGuideFlowService
{
    // --- State ---
    TourStatus Status { get; }
    int ActiveIndex { get; }
    int TotalSteps { get; }
    bool IsActive { get; }
    TourState? CurrentState { get; }

    // === Navigation (Driver.js: drive, moveNext, movePrevious, moveTo, destroy) ===

    /// <summary>Driver.js: drive(). Starts the tour.</summary>
    Task DriveAsync(string? tourName = null);

    /// <summary>Driver.js: moveNext(). Moves to the next step.</summary>
    Task MoveNextAsync();

    /// <summary>Driver.js: movePrevious(). Moves to the previous step.</summary>
    Task MovePreviousAsync();

    /// <summary>Driver.js: moveTo(index). Moves to a specific step.</summary>
    Task MoveToAsync(int stepIndex);

    /// <summary>Driver.js: destroy(). Destroys the tour.</summary>
    Task DestroyAsync();

    /// <summary>Complete the tour.</summary>
    Task CompleteAsync();

    // === Driver.js: hasNextStep, hasPreviousStep, isFirstStep, isLastStep ===
    bool HasNextStep();
    bool HasPreviousStep();
    bool IsFirstStep();
    bool IsLastStep();

    // === Driver.js: getActiveIndex, getActiveStep, getPreviousStep ===
    int GetActiveIndex();
    StepOptions? GetActiveStep();
    StepOptions? GetPreviousStep();

    // === Driver.js: getState, getConfig, setConfig ===
    TourState? GetState();
    TourOptions? GetConfig();
    void SetConfig(TourOptions options);

    // --- State Persistence ---
    Task SaveStateAsync();
    Task<TourState?> LoadStateAsync(string? tourName = null);
    Task ClearStateAsync(string? tourName = null);

    // --- Events ---
    event EventHandler<TourEventArgs>? OnTourStarted;
    event EventHandler<TourEventArgs>? OnTourCompleted;
    event EventHandler<TourEventArgs>? OnTourCancelled;
    event EventHandler<StepChangeEventArgs>? OnStepChanged;
    event Func<BeforeStepChangeEventArgs, Task>? OnBeforeStepChange;

    // --- Internal (used by components) ---
    internal void RegisterTour(string tourName, TourOptions options);
    internal void RegisterStep(int index, StepOptions step);
    internal void UnregisterStep(int index);
    internal TourOptions? GetTourOptions();
    internal StepOptions? GetStep(int index);
    internal IReadOnlyList<StepOptions> GetAllSteps();
}
