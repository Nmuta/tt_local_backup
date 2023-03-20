﻿#pragma warning disable SA1512 // Single-line comments should not be followed by blank line

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using LiveOpsContracts = Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Generic xml operations.
    /// </summary>
    public static class WelcomeCenterHelpers
    {
        /// <summary>
        ///     A standard commit message.
        /// </summary>
        public const string StandardCommitMessage = "StewardApi: Edits {0}";

        /// <summary>
        ///     A standard pull request title.
        /// </summary>
        public const string StandardPullRequestTitle = "Edits {0} from Steward. Author: {1}";

        /// <summary>
        ///     A standard pull request description.
        /// </summary>
        public const string StandardPullRequestDescription = "- Autogenerated pull request\n\t- Edited on {0:u} (UTC)";

        /// <summary>
        ///     The element namespace prefix.
        /// </summary>
        public const string NamespaceElementPrefix = "x";

        /// <summary>
        ///     The root namespace.
        /// </summary>
        public static readonly XNamespace NamespaceRoot = "scribble:title-content";

        /// <summary>
        ///     The element namespace.
        /// </summary>
        public static readonly XNamespace NamespaceElement = "scribble:x";

        /// <summary>
        ///     The null element name.
        /// </summary>
        public static readonly XName NullElementXname = NamespaceElement + "null";

        /// <summary>
        ///     Steelhead xml namespaces.
        /// </summary>
        public static readonly XmlSerializerNamespaces SteelheadXmlNamespaces
            = new XmlSerializerNamespaces(
                new XmlQualifiedName[]
                {
                    new XmlQualifiedName(string.Empty, "scribble:title-content"),
                    new XmlQualifiedName("x", "scribble:x"),
                });

        /// <summary>
        ///     Recursively builds a tree of metadata from deserilized xml object.
        /// </summary>
        public static Node BuildMetaData(
            object target,
            Node root,
            Dictionary<Guid, List<LiveOpsContracts.LocalizedString>> locstrings,
            Dictionary<Guid, SteelheadLiveOpsContent.DisplayCondition> displayConditions)
        {
            Node tree = BuildTree(target, root);

            if (locstrings != null)
            {
                BakeLocTextComments(tree, locstrings);
            }

            if (displayConditions != null)
            {
                BakeDisplayConditions(tree, displayConditions);
            }

            return tree;
        }

        private static void BakeDisplayConditions(Node tree, Dictionary<Guid, SteelheadLiveOpsContent.DisplayCondition> displayConditions)
        {
            // DisplayConditions are top level. No need to recurse.
            var child = tree.Children.Where(node => node.Path.LocalName == "DisplayConditions").FirstOrDefault();
            if (child == null)
            {
                return;
            }

            foreach (var item in child.Children)
            {
                Node refNode = item.Children.Where(node => node.Path.LocalName == "ref").First();
                if (displayConditions.TryGetValue((Guid)refNode.Value, out var condition))
                {
                    // comments must be placed on nodes with values.
                    refNode.Comment = $" ref: {condition.FriendlyName} (LiveConditions.{condition.ToString()["SteelheadLiveOpsContent.".Length..]}) ";
                }
            }
        }

        private static void BakeLocTextComments(Node tree, Dictionary<Guid, List<LiveOpsContracts.LocalizedString>> locstrings)
        {
            var children = tree.Children;
            foreach (var child in children)
            {
                if (child.Path.LocalName == "loc-ref" && child.IsAttributeField && child.Value != null)
                {
                    var guid = new Guid(child.Value.ToString());
                    if (locstrings.TryGetValue(guid, out var localizedStrings))
                    {
                        var loc = localizedStrings.Where(param => param.LanguageCode == "en-US").FirstOrDefault();
                        if (loc != null)
                        {
                            child.Comment = $" loc: {loc.Message} (base) ";
                        }
                    }
                }

                BakeLocTextComments(child, locstrings);
            }
        }

        /// <summary>
        ///     Recursively fills xml elements with values from the node tree.
        /// </summary>
        public static void FillXml(XElement el, Node root)
        {
            if (root.Children.Count == 0)
            {
                SetNodeValue(root, el, root.Path, root.Value);
                return;
            }

            foreach (var child in root.Children)
            {
                if (ElementDoesNotExist(el, child) && !child.IsAttributeField && !child.IsXmlText)
                {
                    el.Add(new XElement(child.Path, child.Value));
                }

                if (child.IsArray)
                {
                    var descend = el.Descendants(child.Path).First();
                    foreach (var c in child.Children)
                    {
                        CheckForMissingElementAtCurrentIndex(descend, c);

                        FillXml(descend.Descendants(c.Path).ElementAt(c.Index), c);
                    }
                }
                else if (child.IsAttributeField)
                {
                    HandleAttribute(el, child);
                }
                else if (child.IsXmlText)
                {
                    SetNodeValue(child, el, child.Path, child.Value);
                }
                else
                {
                    FillXml(el.Descendants(child.Path).First(), child);
                }
            }
        }

        private static void CheckForMissingElementAtCurrentIndex(XElement descend, Node c)
        {
            // A node's index is relative to its path.
            // Note: pathAtValidIndex may not be necessary because
            // all the elements along a path share the same name.
            bool validIndex = descend.Elements(c.Path).Count() > c.Index;
            bool pathAtValidIndex = validIndex && descend.Elements(c.Path).ElementAt(c.Index).Name == c.Path;

            if (!pathAtValidIndex)
            {
                descend.Add(new XElement(c.Path));
            }
        }

        private static bool ElementDoesNotExist(XElement el, Node child)
        {
            return !el.Descendants(child.Path).Any();
        }

        private static void HandleAttribute(XElement el, Node child)
        {
            if (child.Value == null || (child.Value is Guid guid && guid == Guid.Empty))
            {
                SetNodeValue(child, el, child.Path, null);
                return;
            }

            if (child.Path.LocalName != "loc-ref" && child.Path.LocalName != "loc-def")
            {
                SetNodeValue(child, el, child.Path, child.Value);
                return;
            }

            // Always remove loc-def, replace with loc-ref.
            SetNodeValue(child, el, child.Path.Namespace + "loc-def", null);
            SetNodeValue(child, el, child.Path.Namespace + "loc-ref", child.Value);

            // remove nodes from loc-refs: (description, base, skiploc)
            el.RemoveNodes();
        }

        private static void SetNodeValue(Node node, XElement el, XName path, object value)
        {
            if (node.IsAttributeField)
            {
                el.SetAttributeValue(path, value);
                HandleComment(node, el);
                return;
            }

            if (node.Value == null)
            {
                // create <x:null /> or <!-- empty array -->
                el.Value = string.Empty;
                XNode xnode = node.IsArray
                    ? new XComment(" empty array ")
                    : new XElement(NullElementXname);

                if (IsNullElement(el))
                {
                    el.FirstNode.ReplaceWith(xnode);
                }
                else
                {
                    el.RemoveNodes();
                    el.Add(xnode);
                }
            }
            else
            {
                if (node.IsXmlText)
                {
                    el.Value = node.Value.ToString();
                }
                else
                {
                    el.FirstNode?.ReplaceWith(node.Value.ToString());
                }
            }

            if (node.IsCdata)
            {
                el.FirstNode?.ReplaceWith(path, new XCData(value.ToString()));
            }

            HandleComment(node, el);

            static void HandleComment(Node node, XElement el)
            {
                if (node.Comment != null)
                {
                    if (el.PreviousNode is XComment cNode)
                    {
                        cNode.Value = node.Comment;
                    }
                    else
                    {
                        el.AddBeforeSelf(new XComment(node.Comment));
                    }
                }
            }
        }

        private static bool IsNullElement(XElement el)
        {
            // FirstNode == null example: <From x:when="#bcfeaturedrace"/> (self closing)
            // FirstNode != null example: <Day>7</Day> or <Day><x:null/></Day>

            XName xname = el.FirstNode == null
                ? XElement.Parse(el.ToString()).Name
                : XElement.Parse(el.FirstNode.ToString()).Name;

            return xname == NullElementXname;
        }

        /// <summary>
        ///     Recursively builds a tree of metadata from
        ///     deserialized xml object.
        /// </summary>
        private static Node BuildTree(object target, Node root)
        {
            foreach (PropertyInfo property in target.GetType().GetProperties())
            {
                if (property.GetCustomAttribute<WriteToPegasusAttribute>() != null && property.PropertyType.IsClass && property.PropertyType != typeof(string))
                {
                    object value = property.GetValue(target);

                    XNamespace xnamespace = property.DeclaringType.GetCustomAttribute<XmlTypeAttribute>().Namespace;

                    // If value is null take the base name.
                    // If the property is a non-null multi-element base type, use the derived name.
                    XName path = value == null
                        ? xnamespace + property.Name
                        : property.GetCustomAttribute<WriteToPegasusAttribute>()?.IsMultiElement ?? false
                            ? xnamespace + value.GetType().Name
                            : xnamespace + property.Name;

                    if (value == null)
                    {
                        // This block is a safety measure in case a class-type propeprty
                        // in the deserialized model is annotated with [WriteToPegasus],
                        // but that property is null because its bridge equivalent was null
                        // when mapped to the xml object. So skip the current property,
                        // avoiding a null reference on `target` on the next recursive call.

                        if (root.Parent == null || root.Parent.Value != null)
                        {
                            // Create the node if the parent is valid. But do not create its children.
                            // Allows for easier creation of elements with <x:null/> inside.
                            root.Children.Add(new Node()
                            {
                                Value = null,
                                Path = path,
                                Parent = root
                            });
                        }

                        continue;
                    }

                    if (value.GetType().IsArray)
                    {
                        int k = 0;
                        root.IsArray = true;
                        foreach (var innervalue in (object[])value)
                        {
                            Node ret = BuildTree(innervalue, new Node()
                            {
                                Value = null,
                                Path = path,
                                Parent = root
                            });

                            ret.Index = k;
                            root.Children.Add(ret);
                            k++;
                        }
                    }
                    else
                    {
                        // Recurse, then add created node to root.
                        Node child = BuildTree(value, new Node()
                        {
                            Value = null,
                            Path = path,
                            Parent = root
                        });

                        root.Children.Add(child);
                    }
                }
                else if (property.GetCustomAttribute<WriteToPegasusAttribute>() != null)
                {
                    // Create the node with metadata.
                    XNamespace xnamespace = property.GetCustomAttribute<XmlElementAttribute>()?.Namespace
                        ?? property.GetCustomAttribute<XmlAttributeAttribute>()?.Namespace
                        ?? property.DeclaringType.GetCustomAttribute<XmlTypeAttribute>().Namespace;

                    string name = property.GetCustomAttribute<XmlElementAttribute>()?.ElementName
                        ?? property.GetCustomAttribute<XmlAttributeAttribute>()?.AttributeName;

                    XName path = string.IsNullOrEmpty(name)
                        ? xnamespace + property.Name
                        : xnamespace + name;

                    bool isCdata = property.GetCustomAttribute<WriteToPegasusAttribute>()?.AddCdataMarkupToEntry ?? false;
                    bool isAttri = property.GetCustomAttribute<XmlAttributeAttribute>() != null;
                    bool isXmlTx = property.GetCustomAttribute<XmlTextAttribute>() != null;

                    object value = property.GetValue(target);

                    root.Children.Add(new Node()
                    {
                        Value = value,
                        Path = path,
                        Parent = root,
                        IsCdata = isCdata,
                        IsXmlText = isXmlTx,
                        IsAttributeField = isAttri,
                    });
                }
            }

            return root;
        }
    }
}
