using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Generic xml operations.
    /// </summary>
    public static class WelcomeCenterHelpers
    {
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
        ///     Recursively builds a tree of metadata from
        ///     deserialized xml object.
        /// </summary>
        /// <typeparam name="T">The type of target.</typeparam>
        public static Node BuildMetaData<T>(T target, Node root)
        {
            foreach (PropertyInfo property in target.GetType().GetProperties())
            {
                if (property.GetCustomAttribute<PegEditAttribute>() != null && property.PropertyType.IsClass && property.PropertyType != typeof(string))
                {
                    object value = property.GetValue(target);
                    if (value == null)
                    {
                        // safety measure in case someone marks a deserialized model property with [PegEdit],
                        // but that property doesn't have a value because the bridge did not have a value
                        // for it when the bridge was mapped to the xml object. So skip the current property
                        // and go to the next one. This avoids a null reference on `target` on the next recursive call.
                        // NO nulls allowed as a bridge value (make empty str instead)
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
                            Node ret = BuildMetaData(innervalue, new Node()
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
                        Node child = BuildMetaData(value, new Node()
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
                    XNamespace xnamespace = property.GetCustomAttribute<XmlElementAttribute>()?.Namespace ?? property.DeclaringType.GetCustomAttribute<XmlTypeAttribute>().Namespace;
                    string name = property.GetCustomAttribute<XmlElementAttribute>()?.ElementName;
                    XName path = string.IsNullOrEmpty(name) ? xnamespace + property.Name : xnamespace + name;

                    bool isCdata = property.GetCustomAttribute<PegEditAttribute>()?.AddCdataMarkupToEntry ?? false;
                    bool isAnony = property.GetCustomAttribute<PegEditAttribute>()?.AnonymousField ?? false;
                    object value = property.GetValue(target);

                    root.Children.Add(new Node()
                    {
                        Value = value,
                        Path = path,
                        Parent = root,
                        IsCdata = isCdata,
                        IsAnonymousField = isAnony
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
            var name = root.Path;
            var value = root.Value;
            var children = root.Children;

            if (children.Count > 0)
            {
                foreach (var child in children)
                {
                    if (child.IsArray)
                    {
                        var descend = el.Descendants(child.Path).First();
                        foreach (var c in child.Children)
                        {
                            var d2 = descend.Descendants(c.Path).ElementAt(c.Index);
                            FillXml(d2, c);
                        }

                        continue;
                    }

                    if (IsNullElement(el))
                    {
                        var ret = HandleNullElement(root, child);
                        el.FirstNode.ReplaceWith(ret);
                    }
                    else if (child.Children.Count == 0 && child.IsAnonymousField)
                    {
                        el.Value = "ZZZZZZZZZZZZZZZZZZ";// SetElementValue(el, child);
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

        private static void SetElementValue(XElement el, Node node)
        {
            if (node.Value == null)
            {
                el.Value = string.Empty;
            }
            else if (node.IsCdata)
            {
                // TODO support cdata wrap value in cdata
                el.Value = new XCData(node.Value.ToString()).Value;
                XmlCDataSection cdata = new XmlDocument().CreateCDataSection(node.Value.ToString());
                el.Value = "BBBBBBB";// cdata.Value;
            }
            else
            {
                el.Value = "AAAAAAAAAA";// node.value.ToString();
            }
        }

        private static bool IsNullElement(XElement el)
        {
            XName dCereal;

            if (el.FirstNode == null)
            {
                dCereal = XElement.Parse(el.ToString()).Name;
            }
            else
            {
                // TODO: handle better
                try
                {
                    dCereal = XElement.Parse(el.FirstNode.ToString()).Name;
                }
                catch (XmlException)
                {
                    return false;
                }
            }

            if (dCereal == NullElementXname)
            {
                return true;
            }

            return false;
        }

        private static XElement HandleNullElement(Node root, Node node)
        {
            if (node.Value == null)
            {
                return new XElement(NullElementXname);
            }
            else
            {
                return new XElement(root.Path, node.Value);
            }
        }
    }
}
