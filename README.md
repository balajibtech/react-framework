# Support Playbook

## Real-time Data Dashboard

This project is a real-time data dashboard built using React, designed to provide users with an interactive and informative overview of key metrics. It leverages a modular architecture, dynamic chart rendering, and integration with a data backend (implementation details may vary depending on the specific setup).

## Features

- **Dynamic Chart Rendering:** The dashboard dynamically renders various chart types (e.g., area, line, bar, pie, progress) based on a configuration. This allows for flexible visualization of different data points.
- **Modular Component Structure:** The application is built with reusable React components, promoting maintainability and scalability.
- **Real-time Updates:** (If applicable) The dashboard is designed to receive and display real-time data updates, providing users with up-to-the-second insights. (Describe how updates are handled, e.g., WebSockets, polling).
- **Interactive Charts:** Users can interact with the charts (e.g., tooltips, zooming, filtering) to explore the data in more detail.
- **Customizable:** The dashboard can be customized through configuration, allowing users to define which charts are displayed and how they are configured.
- **Ant Design Integration:** The user interface utilizes the Ant Design library for a clean and consistent look and feel.
- **Redux Toolkit:** State management is handled using Redux Toolkit, ensuring predictable and manageable application state.
- **Recharts Library:** Powerful and flexible charting is provided by the Recharts library.

## Technologies Used

- React Typescript
- Ant Design
- Redux Toolkit
- Recharts
- Webpack

## Getting Started
**Clone the repository:**

```bash
git clone http://192.168.1.140:3000/INFINITI/support-playbook.git
```

**Install dependencies:**

```bash
cd repository-name
yarn install  
```

**Run the development server:**

```bash
yarn dev  
```
**Open the application in your browser:**
```
http://localhost:3000
```

## Configuration

The dashboard can be configured using a configuration file (e.g., config.json or environment variables). The configuration defines which charts are displayed, their data sources, and their visual appearance. For example:

```json
{
  "charts": {
    "menu_name": [
      {
        "type": "area",
        "title": "Overall Growth",
        "col": 8,
        "chartData": [
          { "dataKey": "overall", "stroke": "var(--t-common-secondary)", "fill": "var(--t-common-secondary)" },
          { "dataKey": "monthly", "stroke": "var(--t-common-primary)", "fill": "var(--t-common-primary)" },
          { "dataKey": "daily", "stroke": "var(--t-common-primary-lt)", "fill": "var(--t-common-primary-lt)" }
        ],
        "statistics": [
          { "dataKey": "Overall Growth", "dataValueKey": "overAllGrowth" },
          { "dataKey": "Monthly", "dataValueKey": "monthly" },
          { "dataKey": "Day", "dataValueKey": "day" }
        ]
      }
      // ... more chart configurations
    ]
  }
}
```
## Tools and Libraries

This project leverages the following technologies:

- **React**: A frontend library for building dynamic and responsive user interfaces.
- **TypeScript**: Enhances JavaScript with static typing for better code quality and maintainability.
- **Ant Design (AntD)**: A comprehensive UI components library for building professional-grade interfaces.
- **Redux Toolkit**: Simplified state management with best practices included out of the box.
- **JSON Server**: A lightweight mock backend for testing and development.
- **SASS/Styled-Components**: Modern styling solutions for consistent and maintainable design.
- **i18next**: Facilitates localization and internationalization for multilingual support.
- **react-router-dom**: A library for managing routing and navigation in React applications.
- **generate-react-cli**: A CLI tool to quickly generate React components, pages, and other files with predefined templates.
- **env-cmd**: A tool for managing environment variables using .env files for different environments.