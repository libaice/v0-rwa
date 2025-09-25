# RWA Oracle System

A decentralized Real World Assets (RWA) Oracle system that provides reliable price data for on-chain applications.

## Features

- **Multi-Source Data Aggregation**: Aggregate prices from multiple trusted data sources
- **Byzantine Fault Tolerance**: Reputation-based consensus mechanism for data validation
- **Real-Time Updates**: Sub-second latency price feeds with WebSocket support
- **Cross-Chain Support**: Deploy on Ethereum, Polygon, BSC, and other EVM chains
- **Asset Management**: Support for real estate, commodities, stocks, and bonds
- **Node Management**: Decentralized network of oracle validators

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Blockchain**: ethers.js v6, Web3 integration
- **Database**: Supabase (PostgreSQL)
- **Real-time**: WebSocket for live price updates

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` with your configuration:
   - Supabase credentials
   - Oracle contract address
   - API keys for data sources

5. Run the development server:
   ```bash
   bun run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

1. Create a new Supabase project
2. Run the migration script in `supabase/migrations/001_initial_schema.sql`
3. Update `.env.local` with your Supabase URL and anon key

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Layout components
│   └── web3/        # Web3-related components
├── lib/             # Utility functions and services
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
└── utils/           # Helper functions
```

## API Routes

- `GET /api/assets` - List all assets
- `POST /api/assets` - Create new asset
- `GET /api/assets/[id]` - Get asset details
- `PUT /api/assets/[id]` - Update asset
- `DELETE /api/assets/[id]` - Delete asset
- `GET /api/prices/[symbol]` - Get current price
- `GET /api/prices/[symbol]/history` - Get price history
- `POST /api/prices/aggregate` - Aggregate prices from sources
- `GET /api/nodes` - List oracle nodes
- `POST /api/nodes` - Register new node
- `PUT /api/nodes/[id]/status` - Update node status
- `GET /api/sources` - List data sources
- `POST /api/sources` - Add data source
- `POST /api/sources/validate` - Validate data source

## Smart Contract Integration

The system integrates with an Oracle smart contract that implements:
- Price storage and retrieval
- Access control for price updates
- Event emission for price changes
- Data source management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License