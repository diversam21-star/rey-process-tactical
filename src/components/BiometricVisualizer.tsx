import React, { useEffect, useRef, useState } from 'react';

interface BiometricVisualizerProps {
  isAuthorized: boolean;
}

export const BiometricVisualizer: React.FC<BiometricVisualizerProps> = ({ isAuthorized }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pitch, setPitch] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAuthorized) return;

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        
        source.connect(analyser);
        analyser.fftSize = 256;
        
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawWaveform = () => {
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate pitch from frequency data
          let maxAmplitude = 0;
          let maxIndex = 0;
          for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > maxAmplitude) {
              maxAmplitude = dataArray[i];
              maxIndex = i;
            }
          }
          const frequency = (maxIndex * audioContext.sampleRate) / analyser.fftSize;
          setPitch(frequency);

          // Draw waveform on canvas
          ctx.fillStyle = '#f4f4f5';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.strokeStyle = '#ff4e00';
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          const barWidth = canvas.width / dataArray.length;
          let x = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 128) * (canvas.height / 2);
            if (i === 0) {
              ctx.moveTo(x, barHeight);
            } else {
              ctx.lineTo(x, barHeight);
            }
            x += barWidth;
          }
          ctx.stroke();
          
          animationRef.current = requestAnimationFrame(drawWaveform);
        };
        
        drawWaveform();
      } catch (error) {
        console.error('Biometric audio access denied:', error);
      }
    };

    initAudio();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [isAuthorized]);

  return (
    <div className="flex flex-col gap-2 p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_black]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] uppercase tracking-tighter font-black text-black">
          REY BIOMETRIC LOCK
        </span>
        <div className={`w-4 h-4 border-2 border-black ${isAuthorized ? 'bg-tactical-accent' : 'bg-white animate-pulse'}`} />
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={60}
        className="w-full h-16 bg-zinc-100 border border-black"
      />
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold text-zinc-500">PITCH</span>
          <span className="text-2xl font-black text-black tracking-tighter">
            {pitch.toFixed(0)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold text-zinc-500">TEMP</span>
          <span className="text-2xl font-black text-black tracking-tighter">
            {(pitch / 100).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
