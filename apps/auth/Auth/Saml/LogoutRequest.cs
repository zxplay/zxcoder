/*
using System.IO.Compression;
using System.Text;
using System.Web;
using System.Xml;

namespace SteveR.Auth.Saml;

/// <summary>
/// This class is used to build a SAML logoout request as a simple HTTP redirect URL.
/// </summary>
public class LogoutRequest
{
    private readonly Guid _id = Guid.NewGuid();
    private readonly string _issuer;
    private readonly string? _destination;

    public LogoutRequest(string issuer)
    {
        _issuer = issuer;
    }

    public LogoutRequest(string issuer, string destination) : this(issuer)
    {
        _destination = destination;
    }

    /// <param name="samlEndpoint">HTTP endpoint for making the SSO logout request.</param>
    /// <returns>Returns the HTTP redirect URL with the encoded SAML request on the query string.</returns>
    public string GetRedirectUrl(string samlEndpoint)
    {
        var queryStringSeparator = samlEndpoint.Contains("?") ? "&" : "?";
        return $"{samlEndpoint}{queryStringSeparator}SAMLRequest={HttpUtility.UrlEncode(GetRequest())}";
    }

    /// <returns>Base64 encoded string with the SAML logout request XML.</returns>
    private string GetRequest()
    {
        using var stringWriter = new StringWriter();
            
        var settings = new XmlWriterSettings
        {
            OmitXmlDeclaration = true
        };

        using var writer = XmlWriter.Create(stringWriter, settings);
            
        // Example from https://www.samltool.com/generic_slo_req.php

        // <samlp:LogoutRequest
        //       xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
        //       xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
        // 
        //       ID="ONELOGIN_21df91a89767879fc0f7df6a1490c6000c81644d"
        //       Version="2.0"
        //       IssueInstant="2014-07-18T01:13:06Z"
        //       Destination="http://idp.example.com/SingleLogoutService.php">
        // 
        //    <saml:Issuer>http://sp.example.com/demo1/metadata.php</saml:Issuer>
        // 
        //    <saml:NameID
        //       SPNameQualifier="http://sp.example.com/demo1/metadata.php"
        //       Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">
        // 
        //       ONELOGIN_f92cc1834efc0f73e9c09f482fce80037a6251e7
        //    </saml:NameID>
        // 
        // </samlp:LogoutRequest>

        writer.WriteStartElement("samlp", "LogoutRequest", "urn:oasis:names:tc:SAML:2.0:protocol");
        writer.WriteAttributeString("ID", $"_{_id}"); // This unique request ID.
        writer.WriteAttributeString("Version", "2.0");

        // Timestamp the request.
        writer.WriteAttributeString("IssueInstant", 
            DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssZ", 
                System.Globalization.CultureInfo.InvariantCulture));

        if (_destination != null)
        {
            // NOTE: Destination seems to be ignored.
            //       Is destination ignored because the request is not signed?
            writer.WriteAttributeString("Destination", _destination);
        }

        // Issuer is our application ID. NOTE: This is pre-registered with the IdP.
        writer.WriteStartElement("saml", "Issuer");
        writer.WriteString(_issuer);
        writer.WriteEndElement();

        writer.WriteStartElement("saml", "NameID");
        writer.WriteAttributeString("SPNameQualifier", _issuer);
        writer.WriteAttributeString("Format", "urn:oasis:names:tc:SAML:2.0:nameid-format:transient");
        writer.WriteString(string.Empty); // Should there be another ID here?
        writer.WriteEndElement();

        writer.WriteEndElement();

        using (var memoryStream = new MemoryStream())
        {
            using (var streamWriter = new StreamWriter(new DeflateStream(memoryStream, CompressionMode.Compress, true), new UTF8Encoding(false)))
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
*/
