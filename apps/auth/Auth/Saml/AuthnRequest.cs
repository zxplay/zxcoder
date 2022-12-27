using System.IO.Compression;
using System.Text;
using System.Web;
using System.Xml;

namespace SteveR.Auth.Saml;

/// <summary>
/// This class is used to build a SAML authentication request as a simple HTTP redirect URL.
/// </summary>
public class AuthnRequest
{
    private readonly Guid _id = Guid.NewGuid();
    private readonly string _issuer;
    private readonly string _assertionConsumerServiceUrl;

    /// <param name="issuer">Identifies the SAML service provider making the request.</param>
    /// <param name="assertionConsumerServiceUrl">URL for the handler of the response from the SAML IdP.</param>
    public AuthnRequest(string issuer, string assertionConsumerServiceUrl)
    {
        _issuer = issuer;
        _assertionConsumerServiceUrl = assertionConsumerServiceUrl;
    }

    /// <param name="samlEndpoint">HTTP endpoint for making the SSO authentication request.</param>
    /// <returns>Returns the HTTP redirect URL with the encoded SAML request on the query string.</returns>
    public string GetRedirectUrl(string samlEndpoint)
    {
        var queryStringSeparator = samlEndpoint.Contains("?") ? "&" : "?";
        return $"{samlEndpoint}{queryStringSeparator}SAMLRequest={HttpUtility.UrlEncode(GetRequest())}";
    }

    /// <returns>Base64 encoded string with the SAML authentication request XML.</returns>
    private string GetRequest()
    {
        using var stringWriter = new StringWriter();
            
        var settings = new XmlWriterSettings
        {
            OmitXmlDeclaration = true
        };

        using (var writer = XmlWriter.Create(stringWriter, settings))
        {
            writer.WriteStartElement("samlp", "AuthnRequest", "urn:oasis:names:tc:SAML:2.0:protocol");
            writer.WriteAttributeString("ID", $"_{_id}"); // This unique request ID.
            writer.WriteAttributeString("Version", "2.0");
                    
            // Timestamp the request.
            writer.WriteAttributeString("IssueInstant", 
                DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssZ", 
                    System.Globalization.CultureInfo.InvariantCulture));
                    
            writer.WriteAttributeString("ProtocolBinding", "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST");

            // URL for the assertion consumer for response. NOTE: This is pre-registered with the IdP.
            writer.WriteAttributeString("AssertionConsumerServiceURL", _assertionConsumerServiceUrl);

            // Issuer is our application ID. NOTE: This is pre-registered with the IdP.
            writer.WriteStartElement("saml", "Issuer", "urn:oasis:names:tc:SAML:2.0:assertion");
            writer.WriteString(_issuer);
            writer.WriteEndElement();

            writer.WriteStartElement("samlp", "NameIDPolicy", "urn:oasis:names:tc:SAML:2.0:protocol");
            writer.WriteAttributeString("Format", "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified");
            writer.WriteAttributeString("AllowCreate", "true");
            writer.WriteEndElement();

            writer.WriteEndElement();
        }

        // Base64 encode and return the XML string.
        using (var memoryStream = new MemoryStream())
        {
            using (var streamWriter = new StreamWriter(
                       new DeflateStream(memoryStream, CompressionMode.Compress, true), 
                       new UTF8Encoding(false)))
            {
                streamWriter.Write(stringWriter.ToString());
                streamWriter.Close();
                return Convert.ToBase64String(
                    memoryStream.GetBuffer(), 
                    0, 
                    (int)memoryStream.Length, 
                    Base64FormattingOptions.None);
            }
        }
    }
}