/**
 * High-tech holographic rotating Earth globe using raw Three.js.
 * Features custom interactive weather particle simulations (Rain, Snow, Sunny Gold Dust).
 * Responsive container sizing using ResizeObserver.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { WeatherCondition } from '../types';

interface WeatherGlobeProps {
  condition: WeatherCondition;
  lat: number;
  lon: number;
}

export default function WeatherGlobe({ condition, lat, lon }: WeatherGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep references to update coordinates/colors on state changes
  const conditionRef = useRef<WeatherCondition>(condition);
  const coordsRef = useRef<{ lat: number; lon: number }>({ lat, lon });

  useEffect(() => {
    conditionRef.current = condition;
    coordsRef.current = { lat, lon };
  }, [condition, lat, lon]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x081120, 0.005);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // 2. Base Holographic Earth Group
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // 2a. Elegant Wireframe Sphere representing Earth
    const sphereGeo = new THREE.SphereGeometry(4, 24, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(condition.themeColor),
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const wireframeGlobe = new THREE.Mesh(sphereGeo, sphereMat);
    earthGroup.add(wireframeGlobe);

    // 2b. Outer Atmospheric Glow ring
    const glowGeo = new THREE.RingGeometry(4.3, 4.35, 64);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(condition.themeColor),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const atmosphereRing = new THREE.Mesh(glowGeo, glowMat);
    scene.add(atmosphereRing);

    // 2c. Futuristic Geo-Location Pointer/Pin
    const markerGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0xffd700, // Gold location pin
      transparent: true,
      opacity: 0.9,
    });
    const locationPin = new THREE.Mesh(markerGeo, markerMat);
    earthGroup.add(locationPin);

    // 2d. Point Earth (Dotted holographic continents representation)
    const pointsCount = 450;
    const dotGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    const r = 4.02; // Close to earth boundary

    for (let i = 0; i < pointsCount; i++) {
      // Golden Spiral distribution
      const theta = Math.acos(-1 + (2 * i) / pointsCount);
      const phi = Math.sqrt(pointsCount * Math.PI) * theta;

      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
    }
    dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dotMat = new THREE.PointsMaterial({
      color: new THREE.Color(condition.accentColor),
      size: 0.08,
      transparent: true,
      opacity: 0.7,
    });
    const dotEarth = new THREE.Points(dotGeo, dotMat);
    earthGroup.add(dotEarth);

    // 3. Dynamic Weather Particle Systems (Full Overlay)
    const particlesCount = 350;
    const weatherGeo = new THREE.BufferGeometry();
    const weatherPositions = new Float32Array(particlesCount * 3);
    const weatherVelocities: number[] = [];

    // Populate random coordinates inside a space bounds
    for (let i = 0; i < particlesCount; i++) {
      weatherPositions[i * 3] = (Math.random() - 0.5) * 30; // X
      weatherPositions[i * 3 + 1] = (Math.random() - 0.5) * 30; // Y
      weatherPositions[i * 3 + 2] = (Math.random() - 0.5) * 30; // Z
      weatherVelocities.push(0.05 + Math.random() * 0.1); // Speed index
    }

    weatherGeo.setAttribute('position', new THREE.BufferAttribute(weatherPositions, 3));

    // Material changes based on active weather type
    const weatherMat = new THREE.PointsMaterial({
      color: new THREE.Color(condition.themeColor),
      size: 0.12,
      transparent: true,
      opacity: 0.8,
    });
    const weatherParticles = new THREE.Points(weatherGeo, weatherMat);
    scene.add(weatherParticles);

    // 4. Position Pin based on Latitude / Longitude
    const updatePinPosition = (latVal: number, lonVal: number) => {
      // Map lat/lon to spherical coordinate matching Three.js spherical axis
      const phi = (90 - latVal) * (Math.PI / 180);
      const theta = (lonVal + 180) * (Math.PI / 180);

      const targetX = r * Math.sin(phi) * Math.sin(theta);
      const targetY = r * Math.cos(phi);
      const targetZ = r * Math.sin(phi) * Math.cos(theta);

      locationPin.position.set(targetX, targetY, targetZ);
    };

    // Calculate initial position
    updatePinPosition(lat, lon);

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Mouse-follow lighting vector
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointLight.position.x = x * 15;
      pointLight.position.y = y * 15;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const activeCond = conditionRef.current;
      const curCoords = coordsRef.current;

      // Update Pin dynamically
      updatePinPosition(curCoords.lat, curCoords.lon);

      // Rotate Earth smoothly with cinematic floating
      earthGroup.rotation.y += 0.003;
      earthGroup.rotation.x = Math.sin(time * 0.15) * 0.12;

      // Pulse Outer atmospheric glow ring
      const scaleVal = 1.0 + Math.sin(time * 2.0) * 0.015;
      atmosphereRing.scale.set(scaleVal, scaleVal, 1);
      atmosphereRing.rotation.z -= 0.001;

      // Update material color in sync with general weather condition
      sphereMat.color.set(activeCond.themeColor);
      dotMat.color.set(activeCond.accentColor);
      glowMat.color.set(activeCond.themeColor);
      weatherMat.color.set(activeCond.themeColor);

      // Physics based weather particles behavior inside animation loop
      const positionsArr = weatherParticles.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particlesCount; i++) {
        const idx = i * 3;
        const vel = weatherVelocities[i];

        if (activeCond.type === 'rainy') {
          // Rain falls vertically swiftly
          positionsArr[idx + 1] -= vel * 1.5; // Y
          positionsArr[idx] += 0.01; // subtle wind drift X
          weatherMat.size = 0.07;
          if (positionsArr[idx + 1] < -15) {
            positionsArr[idx + 1] = 15;
            positionsArr[idx] = (Math.random() - 0.5) * 30;
          }
        } else if (activeCond.type === 'snowy') {
          // Snow swirls and falls gently
          positionsArr[idx + 1] -= vel * 0.3; // Y
          positionsArr[idx] += Math.sin(time + i) * 0.012; // X swirl
          weatherMat.size = 0.15;
          if (positionsArr[idx + 1] < -15) {
            positionsArr[idx + 1] = 15;
            positionsArr[idx] = (Math.random() - 0.5) * 30;
          }
        } else if (activeCond.type === 'thunderstorm') {
          // Rapid rain + chaotic lightning strobe lighting
          positionsArr[idx + 1] -= vel * 2.2;
          positionsArr[idx] += 0.04; // harsh wind drift
          weatherMat.size = 0.09;
          
          if (positionsArr[idx + 1] < -15) {
            positionsArr[idx + 1] = 15;
          }
          
          // Blitz electromagnetic stroboscope strobe (Brief ambient intensifications)
          if (Math.random() > 0.985) {
            pointLight.intensity = 3.5;
          } else {
            pointLight.intensity = THREE.MathUtils.lerp(pointLight.intensity, 1.2, 0.1);
          }
        } else {
          // Sunny / default floating gold cosmic dust drifting upwards
          positionsArr[idx + 1] += vel * 0.15; // float upwards Y
          positionsArr[idx] += Math.cos(time * 0.5 + i) * 0.005; // X drift
          weatherMat.size = 0.09;
          if (positionsArr[idx + 1] > 15) {
            positionsArr[idx + 1] = -15;
            positionsArr[idx] = (Math.random() - 0.5) * 30;
          }
        }
      }
      weatherParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Dynamic Resize Handling via ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      width = entry.contentRect.width || container.clientWidth;
      height = entry.contentRect.height || container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    // Cleanups on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);

      // Dispose Three.js objects
      sphereGeo.dispose();
      sphereMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      markerGeo.dispose();
      markerMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      weatherGeo.dispose();
      weatherMat.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div id="globe_container" ref={containerRef} className="w-full h-full relative cursor-crosshair">
      <canvas id="globe_canvas" ref={canvasRef} className="w-full h-full block" />
      
      {/* Decorative Cyber Grid Coordinates & Scale indicator */}
      <div className="absolute bottom-5 left-5 pointer-events-none font-mono text-[10px] tracking-widest text-cyan-400/70 bg-[#081120]/75 rounded px-2.5 py-1.5 border border-cyan-500/20 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-1.5 mb-1 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>SATELLITE DOWNLINKED</span>
        </div>
        <div>LAT: {lat.toFixed(4)}° / LON: {lon.toFixed(4)}°</div>
        <div>TARGET: {condition.label.toUpperCase()}</div>
      </div>

      {/* Futuristic aesthetic compass corners */}
      <span className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/30 pointer-events-none" />
      <span className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/30 pointer-events-none" />
      <span className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/30 pointer-events-none" />
      <span className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/30 pointer-events-none" />
    </div>
  );
}
