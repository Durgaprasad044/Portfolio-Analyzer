# SolTracker - Solana DeFi Portfolio Tracker

A comprehensive DeFi tracking platform for Solana, inspired by de.fi/track/solana, featuring real-time portfolio monitoring, token analytics, swapping capabilities, and yield farming opportunities.

## 🚀 Features

### Core Functionality
- **Real-time Portfolio Tracking** - Monitor your Solana assets with Jupiter API integration
- **Multi-wallet Support** - Connect Phantom, Solflare, and other Solana wallets
- **Token Analytics** - Advanced price charts and market data visualization
- **Token Swapping** - Seamless asset exchanges with best price execution
- **Yield Farming Dashboard** - Discover and manage liquidity pool opportunities
- **Transaction History** - Complete DeFi activity tracking

### Authentication & Security
- **Firebase Authentication** - Secure user management
- **OAuth Integration** - Google, Twitter, and Discord sign-in
- **reCAPTCHA Protection** - Bot prevention and security
- **Encrypted Data Storage** - Secure user portfolio data

### Design & UX
- **Dark Theme** - Sleek, modern interface with neon accents
- **Glassmorphism Effects** - Beautiful backdrop blur and gradients
- **Responsive Design** - Optimized for desktop and mobile
- **Smooth Animations** - Framer Motion powered interactions
- **Real-time Updates** - Live data refresh every 30 seconds

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **APIs**: Jupiter Aggregator, Solana RPC
- **Security**: Google reCAPTCHA
- **Deployment**: Vite build system

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd solana-defi-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

4. Start the development server:
```bash
npm run dev
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with Google and Twitter providers
3. Create a Firestore database
4. Add your Firebase config to the environment variables

### reCAPTCHA Setup
1. Register your domain at https://www.google.com/recaptcha
2. Add your site key to the environment variables
3. Configure the secret key in your backend (if applicable)

### Jupiter API
The app uses Jupiter Aggregator's public APIs:
- Price API: `https://price.jup.ag/v4`
- Quote API: `https://quote-api.jup.ag/v6`

No API key required for basic usage.

## 🎨 Design System

### Colors
- **Primary**: Cyan (#00D4FF)
- **Secondary**: Purple (#9945FF)
- **Success**: Green (#14F195)
- **Warning**: Orange (#FF6B35)
- **Error**: Red (#FF4757)

### Typography
- **Font**: Inter (300, 400, 500, 600, 700, 800)
- **Headings**: 120% line height
- **Body**: 150% line height

### Components
- **Cards**: Glassmorphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Charts**: Dark theme with neon accent colors
- **Modals**: Centered with backdrop blur overlay

## 🔮 Future Enhancements

### Phase 1 - Enhanced Analytics
- [ ] Advanced charting with TradingView integration
- [ ] Portfolio performance analytics
- [ ] P&L tracking and tax reporting
- [ ] Custom watchlists and alerts

### Phase 2 - Advanced DeFi Features
- [ ] Automated portfolio rebalancing
- [ ] DeFi protocol integrations (Serum, Mango)
- [ ] Cross-chain bridge integration
- [ ] NFT portfolio tracking

### Phase 3 - Social & Community
- [ ] Social trading features
- [ ] Portfolio sharing and leaderboards
- [ ] DeFi education resources
- [ ] Community governance token

### Phase 4 - Professional Tools
- [ ] API for developers
- [ ] White-label solutions
- [ ] Institutional dashboard
- [ ] Advanced risk management tools

## 📱 Mobile Features
- Responsive design for all screen sizes
- Touch-optimized interactions
- Progressive Web App (PWA) capabilities
- Push notifications for price alerts

## 🔒 Security Features
- Client-side encryption for sensitive data
- Secure wallet connection protocols
- Regular security audits
- HTTPS-only communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Jupiter Aggregator for DEX APIs
- Solana Labs for blockchain infrastructure
- Firebase for authentication and database
- The amazing Solana DeFi community

---

Built with ❤️ for the Solana ecosystem