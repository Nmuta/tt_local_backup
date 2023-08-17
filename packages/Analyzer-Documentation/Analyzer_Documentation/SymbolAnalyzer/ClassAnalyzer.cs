using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;

namespace Analyzer_Documentation.SymbolAnalyzer
{
    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class ClassAnalyzer : BaseSymbolAnalyzer
    {
        public override string DiagnosticId { get; }  = "DS1000";

        protected override string Title { get; } = "Class lacks documentation";
        protected override string MessageFormat { get; } = "Class '{0}' lacks documentation";
        protected override string Description { get; } = "Classes should have documentation";

        protected override TypeKind TargetTypeKind => TypeKind.Class;
    }
}
