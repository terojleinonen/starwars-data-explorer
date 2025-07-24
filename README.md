# Star Wars Data Explorer

Welcome to the Star Wars Data Explorer! This application allows you to explore various aspects of the Star Wars universe using live data from the SWAPI (Star Wars API).

## Features

- **Explore Categories**: Navigate through different categories such as Films, People, Planets, Species, Vehicles, and Starships.
- **Dynamic Routing**: Access detailed information about specific items within each category.
- **Theme Toggle**: Switch between light and dark themes for a personalized experience.

## Getting Started

To get started with the Star Wars Data Explorer, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/starwars-data-explorer.git
   cd starwars-data-explorer
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000` to view the application.

## Project Structure

- `src/pages`: Contains the pages of the application.
  - `_app.tsx`: Custom App component for global styles and layout.
  - `index.tsx`: Home page of the application.
  - `[category]/index.tsx`: Dynamic routing for category pages.
  - `[category]/[id].tsx`: Dynamic routing for detail pages.
  
- `src/components`: Contains reusable components.
  - `Navbar.tsx`: Navigation bar with category links and theme toggle.
  - `Footer.tsx`: Footer with credits and information.
  - `Home.tsx`: Main introduction and category links.
  - `CategoryPage.tsx`: Displays items for a specific category.
  - `DetailPage.tsx`: Displays detailed information about a specific item.

- `src/styles`: Contains global CSS styles.
  - `globals.css`: Global styles for the application.

- `public`: Contains static assets.
  - `favicon.ico`: Favicon for the application.

- `package.json`: Configuration file for npm dependencies and scripts.

- `tsconfig.json`: TypeScript configuration file.

## Acknowledgments

Data provided by [SWAPI](https://swapi.dev). Not affiliated with Lucasfilm or Disney.

## License

This project is licensed under the MIT License. See the LICENSE file for details.