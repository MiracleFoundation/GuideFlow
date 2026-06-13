namespace GuideFlow.Services;

/// <summary>
/// Localization strings for GuideFlow tour UI.
/// Create an instance and pass to TourOptions.Localization.
/// </summary>
public class GuideFlowLocalization
{
    /// <summary>"Next" button text. Default: "Next"</summary>
    public string NextButton { get; set; } = Constants.DefaultNextText;

    /// <summary>"Back" button text. Default: "Back"</summary>
    public string BackButton { get; set; } = Constants.DefaultBackText;

    /// <summary>"Skip" button text. Default: "Skip"</summary>
    public string SkipButton { get; set; } = Constants.DefaultSkipText;

    /// <summary>"Finish/Done" button text. Default: "Done"</summary>
    public string FinishButton { get; set; } = Constants.DefaultDoneText;

    /// <summary>"Close" button aria-label. Default: "Close tour"</summary>
    public string CloseLabel { get; set; } = Constants.DefaultCloseLabel;

    /// <summary>Progress text template. {0}=current, {1}=total. Default: "{0} of {1}"</summary>
    public string ProgressTemplate { get; set; } = Constants.DefaultProgressTemplate;

    /// <summary>Step dialog aria-label prefix. Default: "Tour step"</summary>
    public string StepAriaLabel { get; set; } = Constants.DefaultStepAriaLabel;

    // --- Factory methods for common locales ---

    /// <summary>English (default).</summary>
    public static GuideFlowLocalization English => new();

    /// <summary>Vietnamese.</summary>
    public static GuideFlowLocalization Vietnamese => new()
    {
        NextButton = "Tiếp",
        BackButton = "Quay lại",
        SkipButton = "Bỏ qua",
        FinishButton = "Hoàn thành",
        CloseLabel = "Đóng hướng dẫn",
        ProgressTemplate = "{0} / {1}",
        StepAriaLabel = "Bước hướng dẫn",
    };

    /// <summary>Japanese.</summary>
    public static GuideFlowLocalization Japanese => new()
    {
        NextButton = "次へ",
        BackButton = "戻る",
        SkipButton = "スキップ",
        FinishButton = "完了",
        CloseLabel = "ツアーを閉じる",
        ProgressTemplate = "{0} / {1}",
        StepAriaLabel = "ツアーステップ",
    };

    /// <summary>Korean.</summary>
    public static GuideFlowLocalization Korean => new()
    {
        NextButton = "다음",
        BackButton = "이전",
        SkipButton = "건너뛰기",
        FinishButton = "완료",
        CloseLabel = "투어 닫기",
        ProgressTemplate = "{0} / {1}",
        StepAriaLabel = "투어 단계",
    };

    /// <summary>Chinese (Simplified).</summary>
    public static GuideFlowLocalization ChineseSimplified => new()
    {
        NextButton = "下一步",
        BackButton = "返回",
        SkipButton = "跳过",
        FinishButton = "完成",
        CloseLabel = "关闭导览",
        ProgressTemplate = "第 {0} 步，共 {1} 步",
        StepAriaLabel = "导览步骤",
    };

    /// <summary>French.</summary>
    public static GuideFlowLocalization French => new()
    {
        NextButton = "Suivant",
        BackButton = "Retour",
        SkipButton = "Passer",
        FinishButton = "Terminer",
        CloseLabel = "Fermer la visite",
        ProgressTemplate = "{0} sur {1}",
        StepAriaLabel = "Étape de visite",
    };

    /// <summary>German.</summary>
    public static GuideFlowLocalization German => new()
    {
        NextButton = "Weiter",
        BackButton = "Zurück",
        SkipButton = "Überspringen",
        FinishButton = "Fertig",
        CloseLabel = "Tour schließen",
        ProgressTemplate = "{0} von {1}",
        StepAriaLabel = "Tour-Schritt",
    };

    /// <summary>Spanish.</summary>
    public static GuideFlowLocalization Spanish => new()
    {
        NextButton = "Siguiente",
        BackButton = "Atrás",
        SkipButton = "Omitir",
        FinishButton = "Finalizar",
        CloseLabel = "Cerrar recorrido",
        ProgressTemplate = "{0} de {1}",
        StepAriaLabel = "Paso del recorrido",
    };
}
