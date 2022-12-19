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
        ///     Recursively builds a tree of metadata from deserilized xml object.
        /// </summary>
        public static Node BuildMetaData(object target, Node root, Dictionary<Guid, List<LiveOpsContracts.LocalizedString>> locstrings)
        {
            Node tree = BuildMetaDataCore(target, root);

            ApplyLocTextComments(tree, locstrings);

            return tree;
        }

        /// <summary>
        /// Applies localization comments for formatter.
        /// </summary>
        public static void ApplyLocTextComments(Node tree, Dictionary<Guid, List<LiveOpsContracts.LocalizedString>> locstrings)
        {
            var children = tree.Children;
            foreach (var child in children)
            {
                if (child.Path.LocalName == "loc-ref" && child.IsAttributeField && child.Value != null)
                {
                    Guid guid = Guid.Parse((string)child.Value);
                    if (locstrings.TryGetValue(guid, out var localizedStrings))
                    {
                        var loc = localizedStrings.Where(param => param.LanguageCode == "en-US").FirstOrDefault();
                        if (loc != null)
                        {
                            // example: <!-- loc: Here be dragons (base) -->
                            child.Comment = $" loc: {loc.Message} (base) ";
                        }
                    }
                }

                ApplyLocTextComments(child, locstrings);
            }
        }

        /// <summary>
        ///     Recursively builds a tree of metadata from
        ///     deserialized xml object.
        /// </summary>
        /// <typeparam name="T">The type of target.</typeparam>
        private static Node BuildMetaDataCore<T>(T target, Node root)
        {
            foreach (PropertyInfo property in target.GetType().GetProperties())
            {
                if (property.GetCustomAttribute<PegEditAttribute>() != null && property.PropertyType.IsClass && property.PropertyType != typeof(string))
                {
                    object value = property.GetValue(target);
                    if (value == null)
                    {
                        // Safety measure in case someone marks a class-type propeprty in the deserialized model with [PegEdit],
                        // but that property doesn't have a value because the bridge did not have a value
                        // for it when the bridge was mapped to the xml object. So skip the current property
                        // and go to the next one. This avoids a null reference on `target` on the next recursive call.
                        continue;
                    }

                    XNamespace xnamespace = property.DeclaringType.GetCustomAttribute<XmlTypeAttribute>().Namespace;
                    XName path = xnamespace + property.Name;

                    if (value.GetType().IsArray)
                    {
                        int k = 0;
                        root.IsArray = true;
                        foreach (var innervalue in (object[])value)
                        {
                            Node ret = BuildMetaDataCore(innervalue, new Node()
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
                        Node child = BuildMetaDataCore(value, new Node()
                        {
                            Value = null,
                            Path = path,
                            Parent = root
                        });

                        root.Children.Add(child);
                    }
                }
                else if (property.GetCustomAttribute<PegEditAttribute>() != null)
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

                    bool isCdata = property.GetCustomAttribute<PegEditAttribute>()?.AddCdataMarkupToEntry ?? false;
                    bool isAnony = property.GetCustomAttribute<PegEditAttribute>()?.AnonymousField ?? false;
                    bool isAttri = property.GetCustomAttribute<XmlAttributeAttribute>() != null;

                    object value = property.GetValue(target);

                    root.Children.Add(new Node()
                    {
                        Value = value,
                        Path = path,
                        Parent = root,
                        IsCdata = isCdata,
                        IsAnonymousField = isAnony,
                        IsAttributeField = isAttri,
                    });
                }
            }

            return root;
        }

        /// <summary>
        ///     Recursively fills xml elements with values from the node tree.
        /// </summary>
        public static void FillXml(XElement el, Node root)
        {
            var children = root.Children;

            if (children.Count > 0)
            {
                foreach (var child in children)
                {
                    if (IsNullElement(el))
                    {
                        el.FirstNode.ReplaceWith(HandleNullElement(root, child));
                    }
                    else if (child.IsArray)
                    {
                        var descend = el.Descendants(child.Path).First();
                        foreach (var c in child.Children)
                        {
                            FillXml(descend.Descendants(c.Path).ElementAt(c.Index), c);
                        }
                    }
                    else if (child.IsAnonymousField && child.Children.Count == 0)
                    {
                        SetElementValue(el, child);
                    }
                    else if (child.IsAttributeField)
                    {
                        HandleAttribute(el, child);
                    }
                    else
                    {
                        FillXml(el.Descendants(child.Path).First(), child);
                    }
                }
            }
            else
            {
                SetElementValue(el, root);
            }
        }

        private static void HandleAttribute(XElement el, Node child)
        {
            if (child.Path.LocalName == "loc-ref" || child.Path.LocalName == "loc-def")
            {
                if (child.Value != null)
                {
                    // Null check ignores the non-existant loc-ref or loc-def.
                    // Always remove loc-def, replace with loc-ref. If loc-ref, replace.
                    el.SetAttributeValue(child.Path, null);
                    el.SetAttributeValue(child.Path.Namespace + "loc-ref", child.Value);

                    // remove nodes from loc-refs: (description, base, skiploc)
                    el.RemoveNodes();

                    if (child.Comment != null)
                    {
                        el.AddBeforeSelf(new XComment(child.Comment));
                    }
                }
            }
            else
            {
                el.SetAttributeValue(child.Path, child.Value);
            }
        }

        private static void SetElementValue(XElement el, Node node)
        {
            if (node.Value == null)
            {
                el.Value = string.Empty;
                el.Add(new XElement(NullElementXname));
            }
            else if (node.IsCdata)
            {
                var newElement = XElement.Parse($"<{el.Name.LocalName}><![CDATA[{node.Value}]]></{el.Name.LocalName}>");
                newElement.Name = node.Path;
                el.ReplaceWith(newElement);
            }
            else
            {
                el.Value = node.Value.ToString();
            }
        }

        private static bool IsNullElement(XElement el)
        {
            XName xname;

            if (el.FirstNode == null)
            {
                // example: <From x:when="#bcfeaturedrace" />
                xname = XElement.Parse(el.ToString()).Name;
            }
            else
            {
                try
                {
                    xname = XElement.Parse(el.FirstNode.ToString()).Name;
                }
                catch (XmlException)
                {
                    // got anonymous property's value
                    // instead of outerxml.
                    return false;
                }
            }

            return xname == NullElementXname;
        }

        private static XElement HandleNullElement(Node root, Node child)
        {
            if (child.Value == null)
            {
                return new XElement(NullElementXname);
            }
            else if (child.Children.Count > 0)
            {
                throw new WelcomeCenterXmlException(
                    $"Generating nested elements from a null element is not supported: root: {root.Path}, child: {child.Path}");
            }
            else
            {
                return new XElement(child.Path, child.Value);
            }
        }
    }
}
