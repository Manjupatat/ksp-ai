import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Settings, 
  Activity, 
  Zap, 
  Unlock, 
  Fingerprint, 
  RefreshCw,
  Info
} from 'lucide-react';
import { NetworkNode, NetworkLink } from '../types';
import { playTerminalBeep } from './AudioSynthesizer';

interface ForceNode extends NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
}

interface ForceDirectedNetworkProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  onSelectNode: (nodeId: string | null) => void;
  selectedNodeId: string | null;
}

export default function ForceDirectedNetwork({ 
  nodes, 
  links, 
  onSelectNode, 
  selectedNodeId 
}: ForceDirectedNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Dimensions state tracked via ResizeObserver
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  
  // Physics parameters state
  const [repulsion, setRepulsion] = useState<number>(300);
  const [springStrength, setSpringStrength] = useState<number>(0.04);
  const [gravity, setGravity] = useState<number>(0.03);
  const [friction, setFriction] = useState<number>(0.85);
  const [magneticPulse, setMagneticPulse] = useState<boolean>(false);
  const [showParameters, setShowParameters] = useState<boolean>(false);
  
  // Local state for interactive nodes in physics loop
  const [forceNodes, setForceNodes] = useState<ForceNode[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  
  // Keep tracking nodes and variables in refs for the real-time simulation loop
  const forceNodesRef = useRef<ForceNode[]>([]);
  const physicsParamsRef = useRef({ repulsion, springStrength, gravity, friction });

  // Update physics refs instantly
  useEffect(() => {
    physicsParamsRef.current = { repulsion, springStrength, gravity, friction };
  }, [repulsion, springStrength, gravity, friction]);

  // Handle container resizing using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      // Safeguard smaller or zero client rect boundaries
      const boundedWidth = Math.max(width, 300);
      const boundedHeight = Math.max(height, 280);
      setDimensions({ width: boundedWidth, height: boundedHeight });
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize nodes with positions near the center
  useEffect(() => {
    const initialized: ForceNode[] = nodes.map((node, i) => {
      // Check if there is already a node with similar ID to preserve positions if nodes change
      const existing = forceNodesRef.current.find(n => n.id === node.id);
      if (existing) {
        return { ...node, ...existing };
      }
      
      // Hexagonal or spiral layout initialization to prevent direct overlapping centers
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = 60 + Math.random() * 40;
      return {
        ...node,
        x: dimensions.width / 2 + Math.cos(angle) * radius,
        y: dimensions.height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        fx: null,
        fy: null
      };
    });
    
    forceNodesRef.current = initialized;
    setForceNodes(initialized);
  }, [nodes, dimensions.width, dimensions.height]);

  // Physics animation loop
  useEffect(() => {
    let animationId: number;
    
    const tick = () => {
      const currentNodes = [...forceNodesRef.current];
      if (currentNodes.length === 0) {
        animationId = requestAnimationFrame(tick);
        return;
      }

      const { repulsion: rep, springStrength: spr, gravity: grav, friction: fric } = physicsParamsRef.current;
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      // 1. Repulsion force between all nodes (charge repulsion)
      for (let i = 0; i < currentNodes.length; i++) {
        const nodeA = currentNodes[i];
        for (let j = i + 1; j < currentNodes.length; j++) {
          const nodeB = currentNodes[j];
          
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          // Avoid division by zero
          const distSq = dx * dx + dy * dy + 0.1;
          const dist = Math.sqrt(distSq);
          
          if (dist < 280) {
            // Force strength is inversely proportional to squared distance
            const force = rep / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            // Push apart
            nodeA.vx -= fx;
            nodeA.vy -= fy;
            nodeB.vx += fx;
            nodeB.vy += fy;
          }
        }
      }

      // 2. Attraction force between connected link endpoints (Spring forces)
      links.forEach(({ source, target }) => {
        const nodeA = currentNodes.find(n => n.id === source);
        const nodeB = currentNodes.find(n => n.id === target);
        
        if (nodeA && nodeB) {
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
          
          // Target rest length for spring connections
          const restLength = 110;
          const force = (dist - restLength) * spr;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          nodeA.vx += fx;
          nodeA.vy += fy;
          nodeB.vx -= fx;
          nodeB.vy -= fy;
        }
      });

      // 3. Central Gravity (Pull towards center of stage)
      currentNodes.forEach(node => {
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        
        node.vx += dx * grav;
        node.vy += dy * grav;
      });

      // 4. Update velocities, friction damping and apply final coordinates
      const scaleBoundsPadding = 24;
      currentNodes.forEach(node => {
        if (node.fx !== null && node.fx !== undefined && node.fy !== null && node.fy !== undefined) {
          // If node is currently dragged, lock to drag target position
          node.x = node.fx;
          node.y = node.fy;
          node.vx = 0;
          node.vy = 0;
        } else {
          // Apply velocity and dampen using friction
          node.vx *= fric;
          node.vy *= fric;
          node.x += node.vx;
          node.y += node.vy;
          
          // Keep nodes inside viewport bounds
          if (node.x < scaleBoundsPadding) {
            node.x = scaleBoundsPadding;
            node.vx *= -0.5;
          }
          if (node.x > dimensions.width - scaleBoundsPadding) {
            node.x = dimensions.width - scaleBoundsPadding;
            node.vx *= -0.5;
          }
          if (node.y < scaleBoundsPadding) {
            node.y = scaleBoundsPadding;
            node.vy *= -0.5;
          }
          if (node.y > dimensions.height - scaleBoundsPadding) {
            node.y = dimensions.height - scaleBoundsPadding;
            node.vy *= -0.5;
          }
        }
      });

      forceNodesRef.current = currentNodes;
      setForceNodes([...currentNodes]);
      
      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [links, dimensions.width, dimensions.height]);

  // Handle Drag Interactions inside SVG Space
  const handleSVGMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!activeDragId || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    forceNodesRef.current = forceNodesRef.current.map(n => {
      if (n.id === activeDragId) {
        return {
          ...n,
          fx: mouseX,
          fy: mouseY,
          x: mouseX,
          y: mouseY
        };
      }
      return n;
    });
  };

  const handleSVGMouseUp = () => {
    if (activeDragId) {
      forceNodesRef.current = forceNodesRef.current.map(n => {
        if (n.id === activeDragId) {
          return { ...n, fx: null, fy: null };
        }
        return n;
      });
      setActiveDragId(null);
    }
  };

  const startDragging = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDragId(nodeId);
    onSelectNode(nodeId);
    playTerminalBeep('click');
  };

  // Magnetic Shock pulse to dynamic forces (shakes the layout)
  const triggerGlitchedPulse = () => {
    playTerminalBeep('glitch');
    setMagneticPulse(true);
    setTimeout(() => setMagneticPulse(false), 240);
    
    forceNodesRef.current = forceNodesRef.current.map(n => ({
      ...n,
      vx: (Math.random() - 0.5) * 45,
      vy: (Math.random() - 0.5) * 45
    }));
  };

  const selectedNodeObject = forceNodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col gap-4 w-full" ref={containerRef} id="force-network-container">
      
      {/* HUD Controller */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-[#ff007f]/5 border border-[#ff007f]/30 p-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold uppercase text-[#ff007f]">
          <Activity className="w-4 h-4 animate-pulse text-[#ff007f]" />
          <span>CYBER FORCE_DYNAMIC TRACER UNIT</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowParameters(!showParameters)}
            className={`px-2.5 py-1 border border-[#00f0ff]/50 text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-all ${
              showParameters ? 'bg-[#00f0ff] text-black' : 'text-[#00f0ff] hover:bg-[#00f0ff]/10'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>CONFIG</span>
          </button>
          
          <button 
            onClick={triggerGlitchedPulse}
            className="px-2.5 py-1 border border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_8px_rgba(239,68,68,0.2)]"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>PULSE_SHOCK</span>
          </button>
        </div>
      </div>

      {/* Embedded Settings panel */}
      {showParameters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 border border-[#00f0ff]/30 bg-black/90 text-[10px] text-[#00f0ff] uppercase font-semibold">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-stone-500">Repulsion charge ({repulsion})</span>
            <input 
              type="range" 
              min="50" 
              max="900" 
              step="20"
              value={repulsion} 
              onChange={(e) => setRepulsion(parseInt(e.target.value))}
              className="accent-[#00f0ff]" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-stone-500">Spring tension ({springStrength.toFixed(3)})</span>
            <input 
              type="range" 
              min="0.005" 
              max="0.15" 
              step="0.005"
              value={springStrength} 
              onChange={(e) => setSpringStrength(parseFloat(e.target.value))}
              className="accent-[#ff007f]" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-stone-500">Gravitational pull ({gravity.toFixed(3)})</span>
            <input 
              type="range" 
              min="0.005" 
              max="0.1" 
              step="0.005"
              value={gravity} 
              onChange={(e) => setGravity(parseFloat(e.target.value))}
              className="accent-[#00f0ff]" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-stone-500">Node friction ({friction.toFixed(2)})</span>
            <input 
              type="range" 
              min="0.70" 
              max="0.98" 
              step="0.01"
              value={friction} 
              onChange={(e) => setFriction(parseFloat(e.target.value))}
              className="accent-[#ff007f]" 
            />
          </div>
        </div>
      )}

      {/* Main Force Directed Sandbox Stage */}
      <div 
        className={`border-2 border-[#00f0ff]/40 bg-black/95 relative h-[420px] overflow-hidden select-none transition-all duration-150 ${
          magneticPulse ? 'border-red-500 scale-[0.99] shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''
        }`}
        style={{ cursor: activeDragId ? 'grabbing' : 'default' }}
      >
        {/* Dynamic Matrix digital background lines */}
        <div className="absolute inset-0 bg-[#09090e] bg-[radial-gradient(#00f0ff09_1.2px,transparent_1.2px)] [background-size:20px_20px] pointer-events-none" />
        
        {/* CRT Scanline Glitch Filter Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/5 via-transparent to-[#ff007f]/5 opacity-10 pointer-events-none" />

        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          onMouseMove={handleSVGMouseMove}
          onMouseUp={handleSVGMouseUp}
          onMouseLeave={handleSVGMouseUp}
          className="absolute inset-0 select-none z-10"
        >
          {/* SVG Glow Filter definitions for the aesthetic neon look */}
          <defs>
            <filter id="neon-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="neon-magenta" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="neon-yellow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Links Render */}
          {links.map((link, idx) => {
            const nodeA = forceNodes.find(n => n.id === link.source);
            const nodeB = forceNodes.find(n => n.id === link.target);
            
            if (!nodeA || !nodeB) return null;

            const isRelatedToSelected = selectedNodeId === link.source || selectedNodeId === link.target;
            const strokeColor = isRelatedToSelected ? '#ff007f' : '#00f0ff';
            const strokeWidth = isRelatedToSelected ? 2.5 : 0.8;
            const strokeOpacity = selectedNodeId ? (isRelatedToSelected ? 0.95 : 0.1) : 0.45;

            return (
              <g key={`link-${idx}`}>
                {/* SVG connection lines */}
                <line 
                  x1={nodeA.x} 
                  y1={nodeA.y} 
                  x2={nodeB.x} 
                  y2={nodeB.y} 
                  stroke={strokeColor} 
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                  strokeDasharray={link.type.toLowerCase().includes('wash') || link.type.toLowerCase().includes('stolen') ? '4 2' : undefined}
                  className="transition-all duration-150"
                />
                
                {/* Connection textual annotations (Rendered only on dynamic hover relationship) */}
                {isRelatedToSelected && (
                  <g className="select-none pointer-events-none">
                    <rect 
                      x={(nodeA.x + nodeB.x) / 2 - 45}
                      y={(nodeA.y + nodeB.y) / 2 - 8}
                      width="90"
                      height="14"
                      fill="#000000"
                      stroke="#ff007f"
                      strokeWidth="0.5"
                      opacity="0.8"
                    />
                    <text 
                      x={(nodeA.x + nodeB.x) / 2} 
                      y={(nodeA.y + nodeB.y) / 2 + 2}
                      fill="#ff007f" 
                      fontSize="7" 
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {link.type.toUpperCase()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes Render */}
          {forceNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isFaded = selectedNodeId ? !isSelected && !links.some(l => 
              (l.source === node.id && l.target === selectedNodeId) || 
              (l.target === node.id && l.source === selectedNodeId)
            ) : false;

            // Determine specific color matrix for crime nodes
            let nodeColor = '#00f0ff'; // Default Cyan
            let filterId = 'neon-cyan';
            
            if (node.type === 'suspect') {
              nodeColor = '#ff007f'; // Hot Magenta
              filterId = 'neon-magenta';
            } else if (node.type === 'bank_account') {
              nodeColor = '#eab308'; // Glowing Yellow
              filterId = 'neon-yellow';
            } else if (node.type === 'location') {
              nodeColor = '#a855f7'; // Cyber Purple
              filterId = 'neon-cyan';
            }

            const radius = isSelected ? 12 : (node.type === 'suspect' ? 9 : 7);

            return (
              <g 
                key={`node-${node.id}`}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => startDragging(node.id, e)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node.id === selectedNodeId ? null : node.id);
                  playTerminalBeep('click');
                }}
                className="cursor-pointer group"
                opacity={isFaded ? 0.15 : 1}
              >
                {/* Glowing aura */}
                <circle 
                  r={radius + 4} 
                  fill={nodeColor} 
                  opacity={isSelected ? 0.3 : 0.08}
                  filter={`url(#${filterId})`}
                  className="transition-all duration-300 group-hover:scale-135"
                />

                {/* Primary vector center */}
                <circle 
                  r={radius} 
                  fill={isSelected ? '#ffffff' : '#09090e'} 
                  stroke={nodeColor} 
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* Cyber decorative inner crosshair marker inside selected nodes */}
                {isSelected && (
                  <circle 
                    r="3.5" 
                    fill="#ff007f" 
                    className="animate-ping"
                  />
                )}

                {/* Interactive labels */}
                <g transform="translate(0, -15)">
                  {/* Backdrop path for readability */}
                  <text
                    textAnchor="middle"
                    fill="#000000"
                    stroke="#000000"
                    strokeWidth="3.5"
                    fontSize={isSelected ? '10' : '8'}
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="select-none pointer-events-none"
                  >
                    {node.label.split(' (')[0]}
                  </text>
                  
                  {/* Solid colored text */}
                  <text
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : nodeColor}
                    fontSize={isSelected ? '10' : '8'}
                    fontWeight={isSelected ? 'extrabold' : 'normal'}
                    fontFamily="monospace"
                    className="select-none pointer-events-none tracking-wide"
                  >
                    {node.label.split(' (')[0]}
                  </text>
                </g>

                {/* Small indicator ticks on high risk items */}
                {node.riskLevel === 'high' && !isSelected && (
                  <polygon 
                    points="0,-4 3,2 -3,2" 
                    fill="#ff007f" 
                    className="animate-pulse"
                    transform="translate(0, 1)"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic status line overlay */}
        <div className="absolute bottom-2 right-3 text-[8.5px] text-[#00f0ff]/50 font-mono tracking-widest uppercase flex items-center gap-1.5 select-none pointer-events-none">
          <Fingerprint className="w-3.5 h-3.5" />
          <span>GRID_GRAVITY: {(gravity * 100).toFixed(0)}N // PARTICLES: {forceNodes.length}</span>
        </div>

        {/* Drag tutorial label */}
        <div className="absolute top-2 left-3 bg-black/80 px-2 py-1 border border-[#00f0ff]/20 text-[8.5px] text-[#00f0ff]/70 font-mono select-none pointer-events-none flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>DRAG NODES TO REORGANIZE // CLICK TO ACCESS EVIDENCE</span>
        </div>
      </div>

      {/* Expanded metadata card for selected entities */}
      {selectedNodeId ? (
        <div className="p-3 bg-[#ff007f]/5 border border-[#ff007f]/40 relative mt-1 transition-all duration-300">
          <div className="absolute -top-[1.5px] -left-[1.5px] w-2 h-2 border-t-2 border-l-2 border-[#ff007f]" />
          <div className="absolute -top-[1.5px] -right-[1.5px] w-2 h-2 border-t-2 border-r-2 border-[#ff007f]" />
          
          <div className="flex justify-between items-start mb-2 border-b border-white/10 pb-1.5 text-xs font-bold uppercase">
            <span className="text-[#ff007f] flex items-center gap-1">
              <Fingerprint className="w-4 h-4 text-[#ff007f]" />
              ENTITY PROFILE SECURE DECRYPTED
            </span>
            <button 
              onClick={() => onSelectNode(null)}
              className="text-stone-500 hover:text-white cursor-pointer px-1 text-[10px]"
            >
              [X] CLOSE
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-[9px] text-stone-500 uppercase block">NODE IDENTITY</span>
              <span className="text-white font-bold">{selectedNodeObject?.id}</span>
            </div>
            <div>
              <span className="text-[9px] text-stone-500 uppercase block">CLASSIFIED TYPE</span>
              <span className="text-[#00f0ff] font-bold uppercase">{selectedNodeObject?.type}</span>
            </div>
            <div>
              <span className="text-[9px] text-stone-500 uppercase block">INTELLIGENCE LABEL</span>
              <span className="text-stone-200 block truncate">{selectedNodeObject?.label}</span>
            </div>
            <div>
              <span className="text-[9px] text-stone-500 uppercase block">RECIDIVISM THREAT RISK</span>
              {selectedNodeObject?.riskLevel ? (
                <span className={`font-black uppercase tracking-wider text-[11px] ${
                  selectedNodeObject.riskLevel === 'high' ? 'text-red-500 animate-pulse' : 'text-yellow-400'
                }`}>
                  💀 {selectedNodeObject.riskLevel}
                </span>
              ) : (
                <span className="text-stone-500 text-[10px]">UNCLASSIFIED</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-black/40 border border-stone-800 text-center text-xs text-stone-500 italic">
          HOVER OR CLICK ON NETWORK VECTOR TO DECRYPT MULTI-ROLE RELATIONSHIP MATRIX DATA.
        </div>
      )}
    </div>
  );
}
