import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CobbDouglasVisualizer = () => {
  // Default parameter values
  const [A, setA] = useState(10); // Total factor productivity
  const [N, setN] = useState(10); // Labor
  const [alpha, setAlpha] = useState(0.3); // Output elasticity of capital
  const [K, setK] = useState(10); // Current capital level
  const [data, setData] = useState([]);
  const [baselineData, setBaselineData] = useState([]); // Add baseline for comparison
  
  // Generate more granular data points for the production function
  useEffect(() => {
    const newData = [];
    const baseline = [];
    
    // Generate 100 points for a smooth curve from 1 to 20
    for (let k = 1; k <= 20; k += 0.2) {
      const roundedK = parseFloat(k.toFixed(1));
      // Production function with current parameters
      const output = A * Math.pow(roundedK, alpha) * Math.pow(N, (1 - alpha));
      
      // Baseline production function (with A=10, alpha=0.25, N=10)
      const baselineOutput = 10 * Math.pow(roundedK, 0.25) * Math.pow(10, 0.75);
      
      newData.push({
        k: roundedK,
        output: parseFloat(output.toFixed(2))
      });
      
      baseline.push({
        k: roundedK,
        output: parseFloat(baselineOutput.toFixed(2))
      });
    }
    
    setData(newData);
    setBaselineData(baseline);
  }, [A, N, alpha]);

  // Calculate output at current K
  const currentOutput = A * Math.pow(K, alpha) * Math.pow(N, (1 - alpha));
  const baselineOutput = 10 * Math.pow(K, 0.25) * Math.pow(10, 0.75);
  
  // Data for comparison bar chart
  const barData = [
    { name: 'Current', output: parseFloat(currentOutput.toFixed(2)) },
    { name: 'Baseline', output: parseFloat(baselineOutput.toFixed(2)) }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Cobb-Douglas Production Function</h1>
      <h2 className="text-xl mb-6 text-center">Y = A × K<sup>α</sup> × N<sup>(1-α)</sup></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold mb-4">Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Factor Productivity (A): {A.toFixed(2)}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={A}
                onChange={(e) => setA(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Labor (N): {N.toFixed(2)}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={N}
                onChange={(e) => setN(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Output Elasticity of Capital (α): {alpha.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.99"
                step="0.01"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level of Capital (K): {K.toFixed(2)}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={K}
                onChange={(e) => setK(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-800">Output Comparison:</h4>
            <p className="font-bold">Current: Y = {currentOutput.toFixed(2)}</p>
            <p className="text-gray-600">Baseline: Y = {baselineOutput.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-2">
              Current: A={A.toFixed(2)}, K={K.toFixed(2)}, N={N.toFixed(2)}, α={alpha.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              Baseline: A=10, K={K.toFixed(2)}, N=10, α=0.25
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Output Comparison at K = {K.toFixed(1)}</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 'auto']} />
                  <Tooltip />
                  <Bar dataKey="output" name="Output" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Production Functions</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number"
                    dataKey="k" 
                    allowDataOverflow={true}
                    domain={[1, 20]}
                    label={{ value: 'Level of capital (K)', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    label={{ value: 'Level of output (Y)', angle: -90, position: 'insideLeft', offset: -5 }}
                    domain={[0, 'auto']}
                  />
                  <Tooltip />
                  <Legend />
                  
                  {/* Current Production Function */}
                  <Line 
                    data={data}
                    type="monotone" 
                    dataKey="output" 
                    stroke="#4ade80" 
                    strokeWidth={2}
                    dot={false}
                    name="New production function"
                    activeDot={{ r: 8 }}
                  />
                  
                  {/* Baseline Production Function */}
                  <Line 
                    data={baselineData}
                    type="monotone" 
                    dataKey="output" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={false}
                    name="Baseline"
                  />
                  
                  {/* Vertical line at current K */}
                  <Line 
                    data={[
                      { k: K, output: 0 },
                      { k: K, output: Math.max(currentOutput, baselineOutput) * 1.1 }
                    ]} 
                    type="monotone" 
                    stroke="#475569" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Current K"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-md">
        <h3 className="font-semibold text-yellow-800">Economics Insight</h3>
        <p className="mt-2 text-sm">
          The curvature of the Cobb-Douglas production function demonstrates diminishing marginal returns to capital:
          as more capital is added, the additional output gained from each unit decreases.
        </p>
        <p className="mt-2 text-sm">
          Parameter α directly controls this curvature:
        </p>
        <ul className="mt-1 text-sm list-disc pl-5">
          <li>When α is close to 0: The curve flattens quickly, showing rapid diminishing returns to capital</li>
          <li>When α is close to 1: The curve remains steeper, indicating slower diminishing returns</li>
          <li>Changes in A (productivity) shift the entire curve up or down</li>
          <li>Changes in N (labor) also shift the curve's position while maintaining its shape</li>
        </ul>
      </div>
    </div>
  );
};

export default CobbDouglasVisualizer;