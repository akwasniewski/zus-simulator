import TelemetryManager from '../components/TelemetryManager';

export default function TelemetryPage() {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#00416E] mb-4">
              Raport zaintetresowania
            </h1>
            <p className="text-[#000000] text-lg">
              Analiza danych użytkowników kalkulatora emerytalnego
            </p>
          </div>
          
          <TelemetryManager />
        </div>
      </div>
    </div>
  );
}