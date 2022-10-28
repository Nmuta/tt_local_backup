using System.Collections.Generic;
using System.Xml.Linq;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Node for Welcome Center's xml trees.
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
        /// Gets or sets the node's index in
        /// its descendant list e.g. <code>XElement.Descendants(path)[index]</code>
        /// </summary>
        public int Index { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether
        ///     the node is an array.
        /// </summary>
        public bool IsArray { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether
        ///     the node's <see cref="Value"/> should be
        ///     wrapped in a CDATA tag to ignore XML markup.
        ///     e.g. treat the value as a verbatim string.
        /// </summary>
        public bool IsCdata { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether
        ///     this node's <see cref="Value"/> does not
        ///     have a corresponding path.
        ///     Example <![CDATA[<color>green<color/>]]>,
        ///     green's path is {{examplenamespace}Text}, with Text
        ///     being the property containing green. The property Text
        ///     comes from the deserialized model.
        /// </summary>
        public bool IsAnonymousField { get; set; }

        /// <summary>
        ///     The <see cref="Path"/> or "head".
        /// </summary>
        public override string ToString()
        {
            return this.Parent == null ? "Head" : this.Path.ToString();
        }
    }
}
