using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;

namespace Analyzer_Documentation.SymbolAnalyzer
{
    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class InterfaceAnalyzer : BaseSymbolAnalyzer
    {
        public override string DiagnosticId { get; }  = "DS1002";

        // You can change these strings in the Resources.resx file. If you do not want your analyzer to be localize-able, you can use regular strings for Title and MessageFormat.
        // See https://github.com/dotnet/roslyn/blob/main/docs/analyzers/Localizing%20Analyzers.md for more on localization
        protected override string Title { get; } = "Interface lacks documentation";
        protected override string MessageFormat { get; } = "Interface '{0}' lacks documentation";
        protected override string Description { get; } = "Interfaces should have documentation";

        protected override TypeKind TargetTypeKind => TypeKind.Interface;
    }
}
