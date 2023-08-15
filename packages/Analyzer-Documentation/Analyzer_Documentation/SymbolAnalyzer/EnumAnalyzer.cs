using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;

namespace Analyzer_Documentation.SymbolAnalyzer
{
    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class EnumAnalyzer : BaseSymbolAnalyzer
    {
        public override string DiagnosticId { get; }  = "DS1001";

        // You can change these strings in the Resources.resx file. If you do not want your analyzer to be localize-able, you can use regular strings for Title and MessageFormat.
        // See https://github.com/dotnet/roslyn/blob/main/docs/analyzers/Localizing%20Analyzers.md for more on localization
        protected override string Title { get; } = "Enum lacks documentation";
        protected override string MessageFormat { get; } = "Enum '{0}' lacks documentation";
        protected override string Description { get; } = "Enums should have documentation";

        protected override TypeKind TargetTypeKind => TypeKind.Enum;
    }
}
