# AptosOne Discord Bot

![AptosOne Discord Bot](https://pbs.twimg.com/profile_banners/1901169280504524801/1742496467/1500x500)

A powerful Discord bot that enables users to interact with the Aptos blockchain directly through Discord DMs using the Move Agent Kit. This bot allows users to connect their Aptos wallets, check balances, send transactions, and interact with smart contracts—all without leaving Discord.

## Features

- 🏦 **Wallet Creation & Funding**:  
  Create a new wallet and fund it with any amount to activate your fully autonomous agent wallet.

- 🔑 **Seamless Protocol Access**:  
  Easily interact with protocols supported by the Move Agent Kit for secure and efficient blockchain operations.

- 🔄 **Stake/Unstake Operations**:  
  Stake or unstake your assets directly from the bot, streamlining your asset management on the fly.

- 💹 **DeFi Lending & Borrowing**:  
  Access top lending and borrowing pools from Joule Finance, enabling smarter yield strategies and liquidity management.

- 🤖 **AI-Strategy Builder**:  
  Receive AI-suggested strategies based on your risk profile—covering lending, swapping, borrowing, and even multi-lending/borrowing—to optimize your financial decisions.

## Supported Operations

The AptosOne bot supports a wide range of blockchain operations on the Aptos network:

### Wallet Management
- Link your existing Aptos wallet to your Discord account
- View wallet balances and transaction history
- Get notified about incoming transactions

### Token Operations
- Check APT and token balances
- Send APT to other addresses
- Transfer tokens to other users
- View transaction history

### Smart Contract Interactions
- Interact with DeFi protocols
- Stake and unstake APT
- Add and remove Liquidity
- Swap any token

### Exclusive Tools
- Get any Aptos token price, volume and market data
- Get top lending and Borrowing pools on Joule Finance
- Ai-Strategy Builder: 

## Getting Started

1. **For Users:**
   - Invite the AptosOne bot to your Discord server.
   - Send a DM to the bot to initiate a conversation.
   - Follow the prompts to link your existing Aptos wallet or create a new one.
   - Start interacting with the Aptos blockchain through simple commands.

2. **For Developers:**

   ### Installation

   1. **Clone the Repository:**
      ```bash
      git clone https://github.com/your-org/aptosone-discord-bot.git
      cd aptosone-discord-bot
      ```

   2. **Install Dependencies:**
      ```bash
      npm install
      ```

   3. **Configure Environment Variables:**
      Create a `.env` file in the root directory and add:
      ```
      DISCORD_BOT_TOKEN=your_discord_bot_token
      GOOGLE_API_KEY=your_google_api_key
      ENCRYPTION_PASSWORD=your_encryption_password
      DATABASE_URL=your_database_url
      ```

   4. **Set Up the Database with Prisma:**
      Run the migration command to set up your database:
      ```bash
      npx prisma migrate dev --name init
      ```

   5. **Start the Bot:**
      ```bash
      npm start
      ```

## Usage Examples

- **Check balance:**  
  "What's my APT balance?"

- **Send tokens:**  
  "Send 0.1 APT to 0x123..."

- **View transactions:**  
  "Show my recent transactions"

- **Contract interaction:**  
  "Stake 10 APT"

- **Get help:**  
  "How do I send tokens?"

## Security

The AptosOne Discord bot prioritizes security:

- Private keys are encrypted before storage.
- All blockchain interactions happen through secure channels.
- No sensitive data is ever logged or stored in plaintext.
- Wallet linking requires verification.
- Rate limiting is implemented to prevent abuse.

## Technical Architecture

The bot is built using:

- **Discord.js:** For Discord API interactions.
- **LangChain:** For building the AI agent.
- **Move Agent Kit:** For Aptos blockchain interactions.
- **Prisma:** For database operations.
- **Google Generative AI:** For natural language processing.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request:

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
