import { useEffect, useRef } from 'preact/hooks';

export default function SalesChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const data = [4500, 5200, 4800, 6300, 7100, 6800, 8200];
    const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Encontrar valores máximos y mínimos
    const maxValue = Math.max(...data);
    const minValue = 0;
    const valueRange = maxValue - minValue;

    // Dibujar grid
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Dibujar área bajo la línea
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();

    // Dibujar línea
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Dibujar puntos
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
      
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Dibujar etiquetas del eje X
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    labels.forEach((label, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      ctx.fillText(label, x, height - 15);
    });

    // Dibujar valores del eje Y
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = maxValue - (valueRange / 5) * i;
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(`€${Math.round(value)}`, padding - 10, y + 5);
    }

  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={300}
      class="w-full h-auto"
    />
  );
}
