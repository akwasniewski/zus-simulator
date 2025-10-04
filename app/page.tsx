import PensionCalculatorForm from './components/PensionCalculatorForm';
import Footer from './components/footer/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-[#BEC3CE] to-[#3F84D2]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#00416E] mb-6">
            Plan Your Perfect
            <span className="text-[#FFB34F] block">Retirement</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#000000] max-w-3xl mx-auto mb-8">
            Take control of your financial future with our easy-to-use pension calculator. 
            Get personalized projections based on your current situation and retirement goals.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#00416E]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00993F]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free to use
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00993F]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Instant results
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00993F]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No registration required
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <PensionCalculatorForm />

  {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-[#00416E] mb-12">
            Why Plan Your Retirement?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#BEC3CE] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#3F84D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#00416E] mb-2">Financial Security</h3>
              <p className="text-[#000000]">
                Ensure you have enough money to maintain your lifestyle in retirement and cover unexpected expenses.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#BEC3CE] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#00993F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#00416E] mb-2">Early Planning</h3>
              <p className="text-[#000000]">
                The earlier you start, the more time your money has to grow through compound interest.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#BEC3CE] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#FFB34F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#00416E] mb-2">Peace of Mind</h3>
              <p className="text-[#000000]">
                Know exactly where you stand and what adjustments you might need to make to reach your goals.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer (full width, flush to bottom) */}
      <Footer />

    </div>
  );
}
