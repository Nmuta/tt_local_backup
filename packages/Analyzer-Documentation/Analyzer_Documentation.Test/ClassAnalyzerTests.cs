using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;
using VerifyCS = Analyzer_Documentation.Test.CSharpAnalyzerVerifier<
    Analyzer_Documentation.SymbolAnalyzer.ClassAnalyzer>;

namespace Analyzer_Documentation.Test
{
    [TestClass]
    public class Analyzer_DocumentationUnitTest
    {
        //No diagnostics expected to show up
        [TestMethod]
        public async Task WhenNoClass_NoErrors()
        {
            var test = @"";

            await VerifyCS.VerifyAnalyzerAsync(test);
        }

        //Diagnostic and CodeFix both triggered and checked for
        [TestMethod]
        public async Task WhenUndocumentedClass_Errors()
        {
            var test = @"
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Diagnostics;

    namespace ConsoleApplication1
    {
        class {|#0:TypeName|}
        {   
        }
    }";

            var expected = VerifyCS.Diagnostic("Analyzer_Documentation").WithLocation(0).WithArguments("TypeName");
            await VerifyCS.VerifyAnalyzerAsync(test, expected);
        }
    }
}
