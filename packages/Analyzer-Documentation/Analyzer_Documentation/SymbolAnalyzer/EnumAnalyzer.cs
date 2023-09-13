using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;

namespace Analyzer_Documentation.SymbolAnalyzer
{
    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class EnumAnalyzer : BaseSymbolAnalyzer
    {
        public override string DiagnosticId { get; }  = "DS1001";

        protected override string Title { get; } = "Enum lacks documentation";
        protected override string MessageFormat { get; } = "Enum '{0}' lacks documentation";
        protected override string Description { get; } = "Enums should have documentation";

        protected override TypeKind TargetTypeKind => TypeKind.Enum;
    }
}
