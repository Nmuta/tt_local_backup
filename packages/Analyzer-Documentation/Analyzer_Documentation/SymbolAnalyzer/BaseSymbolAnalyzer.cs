using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis;
using System;
using System.Collections.Immutable;

namespace Analyzer_Documentation.SymbolAnalyzer
{
    public abstract class BaseSymbolAnalyzer : DiagnosticAnalyzer
    {
        public abstract string DiagnosticId { get; }

        // You can change these strings in the Resources.resx file. If you do not want your analyzer to be localize-able, you can use regular strings for Title and MessageFormat.
        // See https://github.com/dotnet/roslyn/blob/main/docs/analyzers/Localizing%20Analyzers.md for more on localization
        protected abstract string Title { get; }
        protected abstract string MessageFormat { get; }
        protected abstract string Description { get; }

        protected abstract TypeKind TargetTypeKind { get; }

        protected const string Category = "Documentation";

        protected Lazy<DiagnosticDescriptor> Rule { get; }

        public BaseSymbolAnalyzer()
        {
            this.Rule = new Lazy<DiagnosticDescriptor>(
                () => new DiagnosticDescriptor(
                DiagnosticId,
                Title,
                MessageFormat,
                Category,
                DiagnosticSeverity.Warning,
                isEnabledByDefault: true,
                description: this.Description)
            );
        }

        public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics { get { return ImmutableArray.Create(this.Rule.Value); } }

        public override void Initialize(AnalysisContext context)
        {
            context.ConfigureGeneratedCodeAnalysis(GeneratedCodeAnalysisFlags.None);
            context.EnableConcurrentExecution();

            // TODO: Consider registering other actions that act on syntax instead of or in addition to symbols
            // See https://github.com/dotnet/roslyn/blob/main/docs/analyzers/Analyzer%20Actions%20Semantics.md for more information
            context.RegisterSymbolAction(AnalyzeSymbol, SymbolKind.NamedType);
        }

        private void AnalyzeSymbol(SymbolAnalysisContext context)
        {
            // TODO: Replace the following code with your own analysis, generating Diagnostic objects for any issues you find
            var namedTypeSymbol = (INamedTypeSymbol)context.Symbol;
            var isTarget = namedTypeSymbol.TypeKind == this.TargetTypeKind;

            var isPublic = namedTypeSymbol.DeclaredAccessibility == Accessibility.Public;
            var documentation = namedTypeSymbol.GetDocumentationCommentXml();
            var lacksDocumentation = string.IsNullOrEmpty(documentation);

            if (isTarget && isPublic && lacksDocumentation)
            {
                var diagnostic = Diagnostic.Create(this.Rule.Value, namedTypeSymbol.Locations[0], namedTypeSymbol.Name);
                context.ReportDiagnostic(diagnostic);
            }
        }
    }
}
