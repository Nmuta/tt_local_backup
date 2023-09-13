using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis;
using System;
using System.Collections.Immutable;

namespace Analyzer_Documentation.SymbolAnalyzer
{
    public abstract class BaseSymbolAnalyzer : DiagnosticAnalyzer
    {
        public abstract string DiagnosticId { get; }

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

            context.RegisterSymbolAction(AnalyzeSymbol, SymbolKind.NamedType);
        }

        private void AnalyzeSymbol(SymbolAnalysisContext context)
        {
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
