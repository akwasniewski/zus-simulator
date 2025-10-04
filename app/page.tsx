import ExpectationsForm from './components/ExpectationsForm';
// import StatisticsComparison from './components/StatisticsComparison';

export default function SymulatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-grey to-blue">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kalkulator Emerytalny
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Sprawdź, jak Twoje oczekiwania emerytalne mają się do rzeczywistości
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <ExpectationsForm />
        </div>

        {/* Stats comprasion
        <div className="max-w-4xl mx-auto">
          <StatisticsComparison />
        </div> */}
      </div>
    </div>
  );
}