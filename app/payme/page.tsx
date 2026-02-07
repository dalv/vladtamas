import Link from 'next/link'

export default function PayMePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/"
          className="inline-block mb-8 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          Send Me a Payment
        </h1>
        <p className="text-slate-600 mb-8">
          Choose your preferred payment method below
        </p>

        <div className="space-y-4">
          {/* Wise */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#9fe870] rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#163300]" fill="currentColor">
                  <path d="M12.5 2L8 11h4l-1 11 8.5-13H15l2-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Wise</h2>
            </div>
            <p className="text-slate-600 mb-1">
              Tag: <span className="font-mono font-semibold text-slate-800">@vladt35</span>
            </p>
            <a
              href="https://wise.com/pay/me/vladt35"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-600 hover:text-blue-700 underline font-medium"
            >
              wise.com/pay/me/vladt35
            </a>
          </div>

          {/* Revolut */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Revolut</h2>
            </div>
            <p className="text-slate-600 mb-1">
              Tag: <span className="font-mono font-semibold text-slate-800">@vladyv4a</span>
            </p>
            <a
              href="https://revolut.me/vladyv4a"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-600 hover:text-blue-700 underline font-medium"
            >
              revolut.me/vladyv4a
            </a>
          </div>

          {/* USD Bank Transfer */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-bold text-sm">$</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Bank Transfer (USD)</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-800">Vlad Tamas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account number</span>
                <span className="font-mono font-medium text-slate-800">8310103041</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account type</span>
                <span className="font-medium text-slate-800">Checking</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Routing number</span>
                <span className="font-mono font-medium text-slate-800">026073150</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SWIFT/BIC</span>
                <span className="font-mono font-medium text-slate-800">CMFGUS33</span>
              </div>
              <div className="border-t border-slate-100 pt-2 mt-2">
                <span className="text-slate-500 text-xs">Bank: Community Federal Savings Bank, 89-16 Jamaica Ave, Woodhaven, NY, 11421, United States</span>
              </div>
            </div>
          </div>

          {/* EUR Bank Transfer */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-700 font-bold text-sm">€</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Bank Transfer (EUR)</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-800">Vlad Tamas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IBAN</span>
                <span className="font-mono font-medium text-slate-800">BE08 9671 1047 8013</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SWIFT/BIC</span>
                <span className="font-mono font-medium text-slate-800">TRWIBEB1XXX</span>
              </div>
              <div className="border-t border-slate-100 pt-2 mt-2">
                <span className="text-slate-500 text-xs">Bank: Wise, Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}