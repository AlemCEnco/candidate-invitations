# Candidate Invitations

A web application for managing candidate communications through multiple channels, including email, SMS, and WhatsApp. This application allows you to select candidates, choose communication templates, and send personalized messages through various channels.

## Features

- Candidate management and selection
- Multiple communication channels (Email, SMS, WhatsApp)
- Customizable message templates
- Multi-step workflow for message creation and sending

## Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended) or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/candidate-invitations.git
   cd candidate-invitations
   ```

2. Install dependencies:
   ```bash
   npm install
   # or if you prefer yarn
   yarn
   ```

## Running the Application

### Development Mode

To start the development server with hot-reload:

```bash
npm run dev
# or
yarn dev
```

This will start the application on `http://localhost:5173` by default.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
candidate-invitations/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── stores/         # Valtio state management
│   └── ...
├── index.html          # HTML entry point
└── ...
```

## Technologies

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Material UI](https://mui.com/) - Component library
- [Valtio](https://valtio.pmnd.rs/) - State management
- [React Router](https://reactrouter.com/) - Navigation and routing

## License

MIT
