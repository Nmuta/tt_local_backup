using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;

namespace Analyzer_Documentation.SymbolAnalyzer
{
    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class ClassAnalyzer : BaseSymbolAnalyzer
    {
        public override string DiagnosticId { get; }  = "DS1000";

        // You can change these strings in the Resources.resx file. If you do not want your analyzer to be localize-able, you can use regular strings for Title and MessageFormat.
        // See https://github.com/dotnet/roslyn/blob/main/docs/analyzers/Localizing%20Analyzers.md for more on localization
        protected override string Title { get; } = "Class lacks documentation";
        protected override string MessageFormat { get; } = "Class '{0}' lacks documentation";
        protected override string Description { get; } = "Classes should have documentation";

        protected override TypeKind TargetTypeKind => TypeKind.Class;
    }
}
