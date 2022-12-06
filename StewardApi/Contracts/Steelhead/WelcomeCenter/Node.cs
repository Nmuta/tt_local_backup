using System.Collections.Generic;
using System.Xml.Linq;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Node to facilitate processing Welcome Center's xml trees.
    /// </summary>
    public class Node
    {
        /// <summary>
        ///     Gets or sets the parent node.
        /// </summary>
        public Node Parent { get; set; }

        /// <summary>
        ///     Gets or sets a list of child nodes.
        /// </summary>
        public List<Node> Children { get; set; } = new ();

        /// <summary>
        ///     Gets or sets the relative path to this node.
        /// </summary>
        public XName Path { get; set; }

        /// <summary>
        ///     Gets or sets the node's value.
        /// </summary>
        public object Value { get; set; }

        /// <summary>
        /// Gets or sets the node's index in its descendant list
        /// (e.g., <c>XElement.Descendants(path)[index]</c>).
        /// </summary>
        public int Index { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the node is an array.
        /// </summary>
        public bool IsArray { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the node's
        ///     <see cref="Value"/> should be wrapped in a CDATA tag
        ///     to ignore XML markup (i.e., treat the value as a verbatim string).
        ///     See <see cref="PegEditAttribute.AddCdataMarkupToEntry"/>.
        /// </summary>
        public bool IsCdata { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the node's value is
        ///     backed by an anonymous property in the deserialized model.
        ///     See <see cref="PegEditAttribute.AnonymousField"/>.
        /// </summary>
        public bool IsAnonymousField { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether this node is an attribute.
        /// </summary>
        public bool IsAttributeField { get; set; }

        /// <summary>
        ///     Gets or sets the node's comment text.
        /// </summary>
        public string Comment { get; set; }

        /// <summary>
        ///     The name of othe node.
        /// </summary>
        public override string ToString()
        {
            return this.Parent == null ? "Head" : this.Path.ToString();
        }
    }
}
