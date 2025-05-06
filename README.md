# Air Canada GSE Admin App

This is the administration application for Air Canada's Ground Service Equipment (GSE) management system.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` file based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

4. Update the environment variables in `.env.local` with your actual values.

### Development

Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Configuration

This application uses a centralized API configuration system to manage API endpoints. The base URL for the API is configured through environment variables, making it easy to switch between different environments.

### API Configuration Files

- `lib/api-config.ts`: Contains the API base URL and endpoint definitions
- `lib/api-client.ts`: Provides a client for making API requests
- `lib/services/*.ts`: Service modules for different resources

### Setting the API Base URL

The API base URL is set using the `NEXT_PUBLIC_API_BASE_URL` environment variable in your `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

For production, set this environment variable in your deployment environment.

### Using the API Services

Import and use the service modules to interact with the API:

```typescript
import { EquipmentService } from '@/lib/services/equipment-service';

// Example: Get all equipment
const equipment = await EquipmentService.getAllEquipment();
```

See the [API Services README](lib/services/README.md) for more details.

## Project Structure

- `app/`: Next.js app router pages and layouts
- `components/`: React components
- `context/`: React context providers
- `data/`: Mock data files
- `hooks/`: Custom React hooks
- `lib/`: Utility functions and services
- `public/`: Static assets
- `styles/`: Global CSS styles
- `utils/`: Utility functions

## Technologies

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/api/) - Maps

## License

Proprietary - All rights reserved
