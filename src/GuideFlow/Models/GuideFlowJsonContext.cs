using System.Text.Json.Serialization;

namespace GuideFlow.Models;

/// <summary>
/// JSON source generator context for trimming-compatible serialization.
/// The trimmer preserves types listed here; reflection-based serialization is avoided.
/// </summary>
[JsonSerializable(typeof(TourState))]
[JsonSerializable(typeof(TourSnapshot))]
[JsonSerializable(typeof(TourSnapshotStep))]
[JsonSourceGenerationOptions(WriteIndented = true)]
internal partial class GuideFlowJsonContext : JsonSerializerContext;
