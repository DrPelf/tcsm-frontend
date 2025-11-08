# Turtle Conservation and Sanctuary Management (TCSM) Frontend

A web application for managing turtle conservation data and sanctuary operations. Built with Next.js, Tailwind CSS, and modern web technologies.

## Features

- **Turtle Management**
  - Record and track captured turtles
  - Monitor species distribution
  - View turtle locations on an interactive map
  - Manage turtle health records and status

- **Data Visualization**
  - Species distribution charts
  - Population trends
  - Interactive maps with clustering
  - Summary statistics

- **User Interface**
  - Modern, responsive design
  - Intuitive navigation
  - Table and map views
  - Form-based data entry

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Charts**: Nivo
- **Maps**: Leaflet.js with marker clustering
- **State Management**: React Hooks
- **Data Fetching**: Next.js API Routes (planned)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/TCSM-frontend.git
   cd TCSM-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
```

## Project Structure

```
TCSM-frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Next.js pages and API routes
│   ├── styles/           # Global styles and Tailwind config
│   └── utils/            # Helper functions and utilities
├── public/              # Static assets
└── package.json         # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors and maintainers
- Special thanks to the conservation team for their input and requirements
