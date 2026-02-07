# vladtamas.com

Personal website with payment information page.

## Project Structure

```
vladtamas-website/
├── app/
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Homepage with link to /payme
│   ├── globals.css       # Global styles with Tailwind
│   └── payme/
│       └── page.tsx      # Payment options page
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

5. Configure your custom domain `vladtamas.com` in the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Domains"
   - Add `vladtamas.com`
   - Update your DNS records as instructed by Vercel

### Alternative: Deploy to other platforms

This Next.js app can also be deployed to:
- Netlify
- AWS Amplify
- Google Cloud Run
- Your own server with Node.js

## Next Steps

To complete the payment page, you'll need to:

1. Add your PayPal link
2. Add your Revolut tag
3. Add your Wise QR code image
4. Add your IBAN details

These can be easily added to `/app/payme/page.tsx`.

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)
