import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product";
}

const SEO = ({ title, description, image, url, type = "website" }: SEOProps) => {
  const siteName = "LuFi Shop";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = "Your premium online store for quality products at great prices.";
  const actualDescription = description || defaultDescription;
  const siteUrl = "https://lufishop.com"; // Replace with your actual domain
  const actualUrl = url ? `${siteUrl}${url}` : siteUrl;
  const actualImage = image || "/og-image.jpg"; // Default social image

  useEffect(() => {
    // Update Document Title
    document.title = fullTitle;

    // Helper to update meta tags
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute("content", content);
      } else {
        // If it doesn't exist, create it (simplified)
        const newMeta = document.createElement("meta");
        if (selector.startsWith('meta[name')) {
            newMeta.setAttribute("name", selector.match(/"([^"]+)"/)?.[1] || "");
        } else {
            newMeta.setAttribute("property", selector.match(/"([^"]+)"/)?.[1] || "");
        }
        newMeta.setAttribute("content", content);
        document.head.appendChild(newMeta);
      }
    };

    // Standard Meta Tags
    updateMetaTag('meta[name="description"]', actualDescription);

    // Open Graph / Facebook
    updateMetaTag('meta[property="og:type"]', type);
    updateMetaTag('meta[property="og:title"]', fullTitle);
    updateMetaTag('meta[property="og:description"]', actualDescription);
    updateMetaTag('meta[property="og:image"]', actualImage);
    updateMetaTag('meta[property="og:url"]', actualUrl);
    updateMetaTag('meta[property="og:site_name"]', siteName);

    // Twitter
    updateMetaTag('meta[name="twitter:card"]', "summary_large_image");
    updateMetaTag('meta[name="twitter:title"]', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', actualDescription);
    updateMetaTag('meta[name="twitter:image"]', actualImage);

  }, [fullTitle, actualDescription, actualImage, actualUrl, type]);

  return null; // This component doesn't render anything to the UI
};

export default SEO;
