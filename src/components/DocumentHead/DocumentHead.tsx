/**
 * Title       : DocumentHead Component
 * Description : This component manages the document head for a web application, including setting the page title,
 *               description, and managing the Progressive Web App (PWA) manifest. It uses `react-helmet-async` for 
 *               dynamically manipulating the head tags of the document based on the current path and system settings.
 */
import "./DocumentHead.scss";
import { useAppSelector } from "@/hooks/App.hook";
import { useEffect, useState } from "react";
import { useRedirect } from "@/hooks/Redirect.hook";
import { useTranslation } from "react-i18next";
import CFG from "@/config/config.json";

const DocumentHead = () => {
  /* --- Hook variables --- */
  const { t } = useTranslation();
  const { currentPath } = useRedirect(); // Get the current path from `useRedirect` hook to update the title based on the path.

  /* --- State variables --- */
  const [title, setTitle] = useState<string>("Support playbook"); //Initialize the state for title with the default value "GroupRM"
  const [description] = useState<string>(""); // Initialize the state for `description` with an empty string.

  /* --- Store variables --- */
  const menuList = useAppSelector((store) => store.MenuReducer.menuServiceData);  // Access the `menuServiceData` from Redux store's MenuReducer.

  // Defining the manifest object for the Progressive Web App (PWA)
  const manifest = {
    short_name: "Support playbook",  // Short name used for the app's home screen or launcher icon.
    name: "Support playbook - GroupRM",  // Full name of the app displayed in the app launcher and install prompt.
    // Icons used for various purposes in the PWA.
    icons: [
      {
        src: new URL(
          `/src/plugins/${CFG?.default?.airline_code || "RM"}/assets/images/pwa/logo192.webp`,
          import.meta.url
        ).href,
        sizes: "192x192",  // Icon size (192x192 pixels).
        type: "image/webp",  // Icon type (WebP format).
      },
      {
        src: new URL(
          `/src/plugins/${CFG?.default?.airline_code || "RM"}/assets/images/pwa/logo512.webp`,
          import.meta.url
        ).href,
        sizes: "512x512",  // Icon size (512x512 pixels).
        type: "image/webp",  // Icon type (WebP format).
      }
    ],
    start_url: window.location.origin,  // Start URL for the PWA (the entry point when the app is launched).
    display: "standalone",  // Display mode for the PWA (standalone means it behaves like a native app).
    theme_color: "#000000",  // Theme color of the PWA (used in the browser toolbar).
    background_color: "#ffffff",  // Background color for the splash screen and loading UI.
    description: "Save when flying with large groups on Airlines. We will assure your group arrives comfortably & on a budget. Contact us today."  // Description of the app, shown to users when they consider installing the PWA.
  };

  // Convert the manifest object to a JSON string, then encode it as a data URI.
  let manifestJSON = JSON.stringify(manifest);
  manifestJSON = "data:application/json;charset=utf-8," + encodeURIComponent(manifestJSON);  // Safe encoding for data URI.

  // Find the menu item that matches the current path set its `menu_code` as the title when `currentPath` changes.
  useEffect(() => {
    const menu: any = menuList?.find((menu: any) => menu.path == currentPath);  // Find the menu item that matches the current path.
    if (menu) setTitle(t(menu?.menu_code));  // Set the title based on the `menu_code` of the matching menu item.
  }, [currentPath]);

  return (
    <>
      {/* Title tag dynamically set based on state */}
      <title>{title}</title>
      {/* Description meta tag */}
      <meta name="description" content={description} />
      {/* Manifest link to include the PWA manifest */}
      <link rel="manifest" href={manifestJSON} />
       {/* Favicon */}
       <link 
        rel="icon" 
        type="image/x-icon"
        href={
          new URL(
            `/src/plugins/${CFG?.default?.airline_code || "RM"}/assets/images/favicon.ico`,
            import.meta.url
          ).href
        } 
      />
    </>
  );
};

export { DocumentHead };