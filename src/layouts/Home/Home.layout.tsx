import React  from 'react';
import "./Home.layout.scss";
import { Layout, theme } from 'antd';
import { HeaderItems } from '@/components/Header/Header';
import MenuBar from '@/components/Menu/Menu';
import { useResize } from '@/utils/resize';
import CFG from "@/config/config.json";

// Destructure Layout components from Ant Design
const { Sider } = Layout;

// Interface defining the props for HomeLayout component
interface HomeLayout {
  children: React.ReactNode;
}

/**
 * Main layout component for the application
 * Handles responsive layout with header, sidebar menu, and content area
 */
const HomeLayout: React.FC<HomeLayout> = ({ children }) => {
  // Access theme tokens for consistent styling
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  // Custom hook to detect screen size changes
  const isSmallScreen = useResize(762);

  // CSS styles for the sidebar
  const siderStyle: React.CSSProperties = {
    overflow: 'auto', // Enable scrolling if content overflows
    height: 'calc(100vh - 72px)', // Full height minus header
    position: 'fixed', // Sticky positioning
    insetInlineStart: 0, // Left position (RTL-aware)
    insetBlockStart: 72, // Top position below header
    insetBlockEnd: 0, // Bottom position
    boxShadow: '0px 3px 6px 0px #00000029', // Shadow effect
    scrollbarWidth: 'none', // Hide scrollbar (for Firefox)
    background: colorBgContainer // Use theme background color
  };

  return (
    <Layout className='cls-homeLayout'>
      {/* Fixed header component */}
      <HeaderItems />
      
      {/* Main content layout */}
      <Layout>
        {/* Conditionally render sidebar menu based on config and screen size */}
        { 
          CFG.menu_position === "vertical" && !isSmallScreen.isSmallScreen ? (
            <Sider 
              width={92} // Fixed sidebar width
              style={siderStyle} // Apply the style object
            >
              {/* Menu component with position from config */}
              <MenuBar position={CFG.menu_position} />
            </Sider>
          ) : <></> // Empty fragment if conditions aren't met
        }
        
        {/* Main content area with responsive padding */}
        <Layout style={{ 
          padding: isSmallScreen.isSmallScreen 
            ? "100px 20px 20px 20px" // No padding on small screens
            : '95px 25px 25px 115px' // Standard padding on larger screens
        }}>
          {/* Render child components */}
          {children}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HomeLayout;