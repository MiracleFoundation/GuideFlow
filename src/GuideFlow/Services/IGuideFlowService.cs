using GuideFlow.Enums;
using GuideFlow.Models;

namespace GuideFlow.Services;

/// <summary>
/// Service for controlling guided tours programmatically.
/// </summary>
public interface IGuideFlowService
{
    // --- State ---
    TourStatus Status { get; }
    int ActiveIndex { get; }
    int TotalSteps { get; }
    bool IsActive { get; }
    TourState? CurrentState { get; }

    // === Navigation ===

    /// <summary>Starts the tour.</summary>
    Task DriveAsync(string? tourName = null);

    /// <summary>Moves to the next step.</summary>
    Task MoveNextAsync();

    /// <summary>Moves to the previous step.</summary>
    Task MovePreviousAsync();

    /// <summary>Moves to a specific step.</summary>
    Task MoveToAsync(int stepIndex);

    /// <summary>Destroys the tour.</summary>
    Task DestroyAsync();

    /// <summary>Complete the tour.</summary>
    Task CompleteAsync();

    // === Step Queries ===
    bool HasNextStep();
    bool HasPreviousStep();
    bool IsFirstStep();
    bool IsLastStep();

    // === State Access ===
    int GetActiveIndex();
    StepOptions? GetActiveStep();
    StepOptions? GetPreviousStep();

    // === Config ===
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
