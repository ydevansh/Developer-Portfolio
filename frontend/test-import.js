import fs from 'fs';
import path from 'path';

console.log('Testing frontend files...');
try {
  const loadingScreen = fs.readFileSync('./src/components/LoadingScreen.jsx', 'utf-8');
  console.log('LoadingScreen.jsx size:', loadingScreen.length);
  const app = fs.readFileSync('./src/App.jsx', 'utf-8');
  console.log('App.jsx size:', app.length);
  const volumetricNebula = fs.readFileSync('./src/components/3d/VolumetricNebula.jsx', 'utf-8');
  console.log('VolumetricNebula.jsx size:', volumetricNebula.length);
  const gpuStarfield = fs.readFileSync('./src/components/3d/GPUStarfield.jsx', 'utf-8');
  console.log('GPUStarfield.jsx size:', gpuStarfield.length);
  const galaxyCanvas = fs.readFileSync('./src/components/3d/GalaxyCanvas.jsx', 'utf-8');
  console.log('GalaxyCanvas.jsx size:', galaxyCanvas.length);
  console.log('All files present and readable.');
} catch (e) {
  console.error('Error reading files:', e);
}
