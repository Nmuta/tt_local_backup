using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;
using System.Collections.Immutable;

namespace Analyzer_Documentation
{
    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class MethodAnalyzer : DiagnosticAnalyzer
    {
        public const string DiagnosticId = "DS2000";

        // You can change these strings in the Resources.resx file. If you do not want your analyzer to be localize-able, you can use regular strings for Title and MessageFormat.
        // See https://github.com/dotnet/roslyn/blob/main/docs/analyzers/Localizing%20Analyzers.md for more on localization
        private const string Title = "Visible method lacks documentation";
        private const string MessageFormat = "Method '{0}' in '{1}' lacks documentation ({2})";
        private const string Description = "Visible methods should have documentation";

        private const string Category = "Documentation";

        private static readonly DiagnosticDescriptor Rule = new DiagnosticDescriptor(
            DiagnosticId,
            Title,
            MessageFormat,
            Category,
            DiagnosticSeverity.Warning,
            isEnabledByDefault: true,
            description: Description);

        public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics { get { return ImmutableArray.Create(Rule); } }

        public override void Initialize(AnalysisContext context)
        {
            context.ConfigureGeneratedCodeAnalysis(GeneratedCodeAnalysisFlags.None);
            context.EnableConcurrentExecution();

            // TODO: Consider registering other actions that act on syntax instead of or in addition to symbols
            // See https://github.com/dotnet/roslyn/blob/main/docs/analyzers/Analyzer%20Actions%20Semantics.md for more information
            context.RegisterSymbolAction(AnalyzeSymbol, SymbolKind.Method);
        }

        private static void AnalyzeSymbol(SymbolAnalysisContext context)
        {
            // TODO: Replace the following code with your own analysis, generating Diagnostic objects for any issues you find
            var methodSymbol = (IMethodSymbol)context.Symbol;
            var methodClass = methodSymbol.ContainingType;
            var methodClassName = methodClass?.Name;

            var isPublic = methodSymbol.DeclaredAccessibility == Accessibility.Public;
            var isProtected = methodSymbol.DeclaredAccessibility == Accessibility.Protected;
            var isVisible = isPublic || isProtected;

            var isPropertyMethod = methodSymbol.MethodKind is MethodKind.PropertyGet or MethodKind.PropertySet;
            var isConstructorMethod = methodSymbol.MethodKind == MethodKind.Constructor;
            //var isOrdinaryMethod = methodSymbol.MethodKind == MethodKind.Ordinary;
            var isRelevantMethod = !(isPropertyMethod || isConstructorMethod);

            var documentation = methodSymbol.GetDocumentationCommentXml();
            var lacksDocumentation = string.IsNullOrEmpty(documentation);

            if (isRelevantMethod && isVisible && lacksDocumentation)
            {
                var diagnostic = Diagnostic.Create(Rule, methodSymbol.Locations[0], methodSymbol.Name, methodClassName, methodSymbol.MethodKind.ToString());
                context.ReportDiagnostic(diagnostic);
            }
        }
    }
}
