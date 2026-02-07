# Quick Start Guide - vladtamas.com

## What's Included

Your new Next.js website is ready! It includes:

✅ **Homepage** (`/`) - A simple landing page with your name and a button linking to the payment page
✅ **Payment Page** (`/payme`) - A dedicated page with placeholder sections for:
   - PayPal
   - Revolut
   - Wise (with QR code placeholder)
   - Bank Transfer (IBAN)

## How to Run Locally

1. **Extract the files** to your preferred location

2. **Install dependencies**:
   ```bash
   cd vladtamas-website
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:3000`

## Project Structure

```
vladtamas-website/
├── app/
│   ├── layout.tsx         # Main layout (wraps all pages)
│   ├── page.tsx           # Homepage (/)
│   ├── globals.css        # Global styles
│   └── payme/
│       └── page.tsx       # Payment page (/payme)
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
└── next.config.js         # Next.js config
```

## Adding Your Payment Information

Edit `/app/payme/page.tsx` to replace the placeholders with your actual payment details:

### Example for PayPal:
```tsx
<div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
  <h2 className="text-xl font-semibold text-slate-800 mb-2">
    PayPal
  </h2>
  <a 
    href="https://paypal.me/yourusername" 
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:text-blue-700 font-medium"
  >
    paypal.me/yourusername
  </a>
</div>
```

### Example for Revolut:
```tsx
<div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
  <h2 className="text-xl font-semibold text-slate-800 mb-2">
    Revolut
  </h2>
  <p className="text-slate-800 font-mono">@yourusername</p>
</div>
```

### Example for Wise QR Code:
```tsx
<div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
  <h2 className="text-xl font-semibold text-slate-800 mb-2">
    Wise
  </h2>
  <img 
    src="/wise-qr-code.png" 
    alt="Wise QR Code" 
    className="w-48 h-48"
  />
</div>
```
(Place your QR code image in the `public` folder)

### Example for IBAN:
```tsx
<div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
  <h2 className="text-xl font-semibold text-slate-800 mb-2">
    Bank Transfer (EUR)
  </h2>
  <div className="space-y-2">
    <p className="text-sm text-slate-600">IBAN:</p>
    <p className="font-mono text-slate-800">DE89 3704 0044 0532 0130 00</p>
    <p className="text-sm text-slate-600">BIC:</p>
    <p className="font-mono text-slate-800">COBADEFFXXX</p>
  </div>
</div>
```

## Deploying to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and deploy

3. **Add Custom Domain**:
   - In Vercel dashboard, go to your project settings
   - Navigate to "Domains"
   - Add `vladtamas.com` and `www.vladtamas.com`
   - Update your domain's DNS records as shown by Vercel

## Tech Stack

- **Framework**: Next.js 16 (latest)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Turbopack (Next.js built-in)

## Need Help?

The build was tested and works perfectly. If you encounter any issues:
1. Make sure you're using Node.js 18 or later
2. Delete `node_modules` and run `npm install` again
3. Clear the `.next` folder if you see caching issues

Enjoy your new website! 🚀
