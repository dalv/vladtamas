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
          {/* PayPal */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              PayPal
            </h2>
            <p className="text-slate-600">
              PayPal link will be added here
            </p>
          </div>

          {/* Revolut */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Revolut
            </h2>
            <p className="text-slate-600">
              Revolut tag will be added here
            </p>
          </div>

          {/* Wise */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Wise
            </h2>
            <p className="text-slate-600">
              Wise QR code will be added here
            </p>
          </div>

          {/* Bank Transfer */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Bank Transfer (IBAN)
            </h2>
            <p className="text-slate-600">
              IBAN details will be added here
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
