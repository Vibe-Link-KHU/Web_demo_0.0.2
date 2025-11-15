import React, { useEffect, useRef, useState } from 'react';
import { Artist } from '../App';

interface MusicGraphProps {
  artists: Artist[];
}

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  imageUrl: string;
  genre: string;
}

interface Link {
  source: string;
  target: string;
}

export function MusicGraph({ artists }: MusicGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const linksRef = useRef<Link[]>([]);

  const genreColors: { [key: string]: string } = {
    'J-Pop': '#1DB954',
    'K-Pop': '#1ed760',
    'K-Hip Hop': '#ff6b35',
    'K-R&B': '#ffbe0b',
    'Rock': '#8338ec',
    'Electronic': '#3a86ff',
    'Pop': '#ff006e',
    'Hip Hop': '#fb8500'
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Create nodes
    const maxPlayCount = Math.max(...artists.map(a => a.playCount));
    nodesRef.current = artists.map((artist, index) => {
      const angle = (index / artists.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.3;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      return {
        id: artist.id,
        name: artist.name,
        x,
        y,
        vx: 0,
        vy: 0,
        size: (artist.playCount / maxPlayCount) * 40 + 20,
        color: genreColors[artist.genre] || '#6c5ce7',
        imageUrl: artist.imageUrl,
        genre: artist.genre
      };
    });

    // Create links
    linksRef.current = [];
    artists.forEach(artist => {
      artist.connections.forEach(connectionId => {
        if (artists.find(a => a.id === connectionId)) {
          linksRef.current.push({
            source: artist.id,
            target: connectionId
          });
        }
      });
    });

    const simulate = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;

      // Apply forces
      nodes.forEach(node => {
        // Center force
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.vx += dx * 0.001;
        node.vy += dy * 0.001;

        // Repulsion between nodes
        nodes.forEach(other => {
          if (node.id !== other.id) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
              const force = (100 - distance) * 0.01;
              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          }
        });

        // Apply velocity
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.9;
        node.vy *= 0.9;

        // Keep nodes in bounds
        node.x = Math.max(node.size, Math.min(width - node.size, node.x));
        node.y = Math.max(node.size, Math.min(height - node.size, node.y));
      });

      // Draw
      ctx.clearRect(0, 0, width, height);

      // Draw links
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 1.5;
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = '#121212';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Truncate long names
        let displayName = node.name;
        if (displayName.length > 10) {
          displayName = displayName.substring(0, 10) + '...';
        }
        
        ctx.fillText(displayName, node.x, node.y);
      });

      animationRef.current = requestAnimationFrame(simulate);
    };

    simulate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePos({ x: e.clientX, y: e.clientY });

      const hoveredNode = nodesRef.current.find(node => {
        const dx = x - node.x;
        const dy = y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= node.size;
      });

      setHoveredNode(hoveredNode || null);
      canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [artists]);

  return (
    <div className="relative w-full h-96">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        style={{ background: 'linear-gradient(135deg, #121212 0%, #181818 100%)' }}
      />
      
      {hoveredNode && (
        <div 
          className="absolute bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl z-10 pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 10,
            transform: 'translate(0, -100%)'
          }}
        >
          <div className="flex items-center gap-3">
            <img 
              src={hoveredNode.imageUrl} 
              alt={hoveredNode.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-semibold">{hoveredNode.name}</p>
              <p className="text-gray-300">{hoveredNode.genre}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 text-sm text-gray-400">
        Node size represents play count • Lines show genre connections
      </div>
    </div>
  );
}