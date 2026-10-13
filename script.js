// Base market database matrix (Baseline average price per quintal)
const cropBasePrices = {
    Wheat: 2200,
    Rice: 2500,
    Maize: 1900,
    Cotton: 6500,
    Potato: 1200
};

document.getElementById('predictionForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const crop = document.getElementById('cropSelect').value;
    const season = document.getElementById('seasonSelect').value;
    const region = document.getElementById('marketSelect').value;

    if (!crop || !season || !region) return;

    // Fetch baseline price
    let basePrice = cropBasePrices[crop];

    // Predictive Simulation Logic multipliers based on chosen inputs
    let seasonalMultiplier = 1.0;
    if (season === 'Kharif' && (crop === 'Rice' || crop === 'Cotton')) seasonalMultiplier = 1.12; 
    if (season === 'Rabi' && crop === 'Wheat') seasonalMultiplier = 1.08;
    if (season === 'Zaid') seasonalMultiplier = 0.92; // Supply surge generally drops values

    let regionalMultiplier = 1.0;
    if (region === 'North') regionalMultiplier = 1.05;
    if (region === 'East') regionalMultiplier = 0.97;
    if (region === 'West') regionalMultiplier = 1.03;

    // Calculate simulated baseline metrics
    let finalCurrentPrice = basePrice * regionalMultiplier;
    // Inject custom randomized market volatility factor (+/- 6%)
    let volatility = 0.94 + (Math.random() * 0.12); 
    let finalPredictedPrice = finalCurrentPrice * seasonalMultiplier * volatility;

    // Formatting outputs
    document.getElementById('currentPrice').innerText = `₹${finalCurrentPrice.toFixed(2)}`;
    document.getElementById('predictedPrice').innerText = `₹${finalPredictedPrice.toFixed(2)}`;

    // Process Trend Output and dynamic advice text strings
    const trendElement = document.getElementById('marketTrend');
    const adviceElement = document.getElementById('farmerAdvice');
    const percentageChange = ((finalPredictedPrice - finalCurrentPrice) / finalCurrentPrice) * 100;

    if (percentageChange > 3) {
        trendElement.innerText = `📈 Upward (+${percentageChange.toFixed(1)}%)`;
        adviceElement.innerText = `Market demand expected to scale up. Holding off your stock for a few weeks could fetch you premium profit windows.`;
    } else if (percentageChange < -3) {
        trendElement.innerText = `📉 Downward (${percentageChange.toFixed(1)}%)`;
        adviceElement.innerText = `High supply arrivals anticipated. Selling early or striking advance contract deals is advised to mitigate loss.`;
    } else {
        trendElement.innerText = `➡️ Stable (${percentageChange.toFixed(1)}%)`;
        adviceElement.innerText = `Market indices show safe stability profiles. Trade normally based on regular immediate liquidity workflows.`;
    }

    // Display the dashboard panel container smoothly
    document.getElementById('resultsSection').classList.remove('hidden');
});
