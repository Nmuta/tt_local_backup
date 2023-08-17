using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;

namespace Analyzer_Documentation.SymbolAnalyzer
{
    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class StructAnalyzer : BaseSymbolAnalyzer
    {
        public override string DiagnosticId { get; }  = "DS1003";

        protected override string Title { get; } = "Struct lacks documentation";
        protected override string MessageFormat { get; } = "Struct '{0}' lacks documentation";
        protected override string Description { get; } = "Structs should have documentation";

        protected override TypeKind TargetTypeKind => TypeKind.Struct;
    }
}
