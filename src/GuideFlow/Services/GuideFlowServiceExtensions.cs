using Microsoft.Extensions.DependencyInjection;

namespace GuideFlow.Services;

/// <summary>
/// Extension methods for registering GuideFlow services.
/// </summary>
public static class GuideFlowServiceExtensions
{
    /// <summary>
    /// Adds GuideFlow guided tour services to the DI container.
    /// </summary>
    public static IServiceCollection AddGuideFlow(this IServiceCollection services)
    {
        services.AddScoped<IGuideFlowService, GuideFlowService>();
        return services;
    }
}
