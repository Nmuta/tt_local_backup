using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Turn10.LiveOps.StewardTest.Categories
{
    /// <summary>
    ///     Marks this class/method as a Unit Test.
    /// </summary>
    [AttributeUsage(AttributeTargets.Assembly | AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public abstract class TestAttributeBase : TestCategoryBaseAttribute
    {
        private IList<string> categories;

        /// <inheritdoc />
        public override IList<string> TestCategories => this.categories;

        protected TestAttributeBase(params string[] testCategories)
        {
            this.categories = testCategories.ToList();
        }
    }
}
