import { Satellite, Calendar, Download } from 'lucide-react';

export default function NASADashboard() {
  const nasaImages = [
    { state: 'Alagoas', stateCode: 'AL', dates: [
        { date: '29/08/2025', image: '/mapa_ndvi_AL_2025-08-29.png' },
        { date: '14/09/2025', image: '/mapa_ndvi_AL_2025-09-14.png' }
    ]},
    { state: 'Bahia', stateCode: 'BA', dates: [
        { date: '29/08/2025', image: '/mapa_ndvi_BA_2025-08-29.png' },
        { date: '14/09/2025', image: '/mapa_ndvi_BA_2025-09-14.png' }
    ]},
    { state: 'Ceará', stateCode: 'CE', dates: [
        { date: '29/08/2025', image: '/mapa_ndvi_Ce_2025-08-29.png' },
        { date: '14/09/2025', image: '/mapa_ndvi_Ce_2025-09-14.png' }
    ]},
    { state: 'Maranhão', stateCode: 'MA', dates: [
        { date: '29/08/2025', image: '/mapa_ndvi_MA_2025-08-29.png' },
        { date: '14/09/2025', image: '/mapa_ndvi_MA_2025-09-14.png' }
    ]},
    { state: 'Pernambuco', stateCode: 'PE', dates: [
        { date: '29/08/2025', image: '/mapa_ndvi_PE_2025-08-29.png' }
    ]}
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-lg shadow-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Satellite className="w-12 h-12 animate-pulse" />
          <h1 className="text-4xl font-bold">NASA MODIS</h1>
        </div>
        <p className="text-xl">Monitoramento por Satélite</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Mapas NDVI</h2>
        <div className="space-y-8">
          {nasaImages.map((stateData) => (
            <div key={stateData.stateCode} className="border-2 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">{stateData.state} ({stateData.stateCode})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stateData.dates.map((dateData, idx) => (
                  <div key={idx} onClick={() => window.open(dateData.image, '_blank')}
                    className="border-2 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all">
                    <div className="bg-green-600 text-white p-3 flex items-center justify-between">
                      <span className="font-semibold">{dateData.date}</span>
                      <Satellite className="w-4 h-4" />
                    </div>
                    <img src={dateData.image} alt={stateData.state} className="w-full" />
                    <div className="p-3 flex items-center justify-between text-sm">
                      <span>250m</span>
                      <div className="flex items-center gap-1 text-blue-600">
                        <Download className="w-3 h-3" />
                        Abrir
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
