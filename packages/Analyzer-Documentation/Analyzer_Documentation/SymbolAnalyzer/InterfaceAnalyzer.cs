using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;

namespace Analyzer_Documentation.SymbolAnalyzer
{
    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class InterfaceAnalyzer : BaseSymbolAnalyzer
    {
        public override string DiagnosticId { get; }  = "DS1002";

        protected override string Title { get; } = "Interface lacks documentation";
        protected override string MessageFormat { get; } = "Interface '{0}' lacks documentation";
        protected override string Description { get; } = "Interfaces should have documentation";

        protected override TypeKind TargetTypeKind => TypeKind.Interface;
    }
}
