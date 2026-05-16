import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import { Play, Square, FolderOpen, Maximize, Minimize, Settings, Code, Layers, Blocks, Users } from 'lucide-react';
import { toolboxXml, defaultWorkspaceXml } from './blocklySetup';
import { templates } from './templates';

export default function App() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const mousePosRef = useRef({ x: 0, y: 0, isDown: false });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [promptData, setPromptData] = useState<{message: string, defaultValue: string, callback: (v: string | null) => void} | null>(null);

  // حالة اللعبة
  const defaultGameState = { 
    x: 180, y: 130, color: '#3498db', rotation: 0, scale: 1, text: '', bg: '#1e293b', visible: true, shape: '😎',
    score: 0, round: 1, 
    bullets: [] as {x: number, y: number, dir: number, active: boolean}[], 
    enemies: [] as {x: number, y: number, speed: number, active: boolean}[],
    particles: [] as {x: number, y: number, vx: number, vy: number, life: number, color: string, size: number}[],
    overlayText: '', overlaySub: '', overlayActive: false, gameOver: false,
    roadOffset: 0, isCarGame: false, isUndertaleMode: false, enemyShape: '🧟', ticks: 0, hp: 100
  };
  const gameStateRef = useRef({ ...defaultGameState });

  useEffect(() => {
    // تجاوز النوافذ المنبثقة الافتراضية
    Blockly.dialog.setPrompt(function(message, defaultValue, callback) {
      setPromptData({ message, defaultValue, callback });
    });
    Blockly.dialog.setAlert(function(message, callback) {
      alert(message); // iframe might block this too, but we can make custom if needed
      callback();
    });

    // تهيئة Blockly مرة واحدة فقط
    if (!workspaceRef.current && blocklyDiv.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxXml,
        rtl: true, // دعم من اليمين لليسار
        scrollbars: true,
        trashcan: true
      });

      workspaceRef.current.registerToolboxCategoryCallback(
        'CUSTOM_VARIABLES',
        (workspace: Blockly.Workspace) => {
          // @ts-ignore
          let xmlList = Blockly.Variables.flyoutCategory(workspace);
          
          const blockDef = document.createElement('block');
          blockDef.setAttribute('type', 'define_custom_code_var');
          
          const blockGet = document.createElement('block');
          blockGet.setAttribute('type', 'get_custom_code_var');

          // إضافتها إلى أعلى القائمة (بعد زر إنشاء متغير)
          xmlList.splice(1, 0, blockDef, blockGet);
          
          return xmlList;
        }
      );

      // إدراج المثال الافتراضي
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(defaultWorkspaceXml),
        workspaceRef.current
      );
    }
    
    // رسم الكائن بالحالة الافتراضية عند البداية
    draw();
  }, []);

  useEffect(() => {
    if (!isFullscreen && workspaceRef.current) {
      setTimeout(() => {
        Blockly.svgResize(workspaceRef.current as Blockly.WorkspaceSvg);
      }, 50);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = true;
      keysPressedRef.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
      keysPressedRef.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // مسح الشاشة
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.scale(canvas.width / 400, canvas.height / 300);

    // رسم الخلفية الخاصة ببيئة اللعب
    const state = gameStateRef.current;
    ctx.fillStyle = state.bg; // لون داكن للشاشة أو متغير
    ctx.fillRect(0, 0, 400, 300);

    if (state.isCarGame) {
      // رسم الشارع
      ctx.fillStyle = "#374151";
      ctx.fillRect(80, 0, 240, 300);
      ctx.fillStyle = "#fbbf24";
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < 5; i++) {
         let y = ((i * 100 + state.roadOffset) % 500) - 100;
         ctx.fillRect(195, y, 10, 50);
      }
      ctx.globalAlpha = 1;
    }

    if (state.isUndertaleMode) {
      // Boss
      ctx.font = "80px 'Segoe UI Emoji', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("💀", 200, 50);

      // Battle Box
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.strokeRect(120, 120, 160, 120);

      // HUD
      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("PLAYER   LVL 1", 50, 270);
      
      ctx.fillText("HP", 210, 270);
      ctx.fillStyle = "red";
      ctx.fillRect(240, 270, 50, 16);
      ctx.fillStyle = "yellow";
      const hpWidth = Math.max(0, (state.hp / 100) * 50); 
      ctx.fillRect(240, 270, hpWidth, 16);
    }

    if (!state.visible) {
      ctx.restore();
      return;
    }

    ctx.save();
    
    // حساب المركز (40 هو حجم الكائن بناء على الكود الأصلي)
    ctx.translate(state.x + 20, state.y + 20); 
    ctx.rotate(state.rotation * Math.PI / 180);
    ctx.scale(state.scale, state.scale);
    
    if (state.shape === 'square') {
      // رسم الكائن المربع
      ctx.fillStyle = state.color;
      ctx.beginPath();
      // تقريب المربع ذو الحواف الدائرية مركزه 0,0
      const radius = 8;
      const size = 40;
      const cx = -20;
      const cy = -20;
      ctx.moveTo(cx + radius, cy);
      ctx.lineTo(cx + size - radius, cy);
      ctx.quadraticCurveTo(cx + size, cy, cx + size, cy + radius);
      ctx.lineTo(cx + size, cy + size - radius);
      ctx.quadraticCurveTo(cx + size, cy + size, cx + size - radius, cy + size);
      ctx.lineTo(cx + radius, cy + size);
      ctx.quadraticCurveTo(cx, cy + size, cx, cy + size - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.quadraticCurveTo(cx, cy, cx + radius, cy);
      ctx.closePath();
      ctx.fill();

      // إضافة حدود خفيفة
      ctx.strokeStyle = '#ffffff40';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // إيموجي كشكل للكائن
      ctx.font = "40px 'Segoe UI Emoji', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(state.shape, 0, 0);
    }
    ctx.restore();

    // رسم الرصاصات
    ctx.fillStyle = '#facc15';
    state.bullets.forEach(b => {
      if (!b.active) return;
      ctx.beginPath();
      ctx.arc(b.x + 20, b.y + 20, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // رسم الأعداء
    state.enemies.forEach(e => {
      if (!e.active) return;
      ctx.font = (state.isCarGame ? "40px" : "30px") + " 'Segoe UI Emoji', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(state.enemyShape || '🧟', e.x + 20, e.y + 20);
    });

    // رسم الغبار والجسيمات
    if (state.particles) {
      state.particles.forEach(p => {
        if (p.life <= 0) return;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    // رسم النص إذا وجد
    if (state.text) {
      ctx.fillStyle = "white";
      ctx.font = "bold 14px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      ctx.textAlign = "center";
      
      // خلفية للنص
      const textWidth = ctx.measureText(state.text).width;
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.roundRect(state.x + 20 - textWidth/2 - 8, state.y - 35, textWidth + 16, 24, 12);
      ctx.fill();
      
      ctx.fillStyle = "white";
      ctx.fillText(state.text, state.x + 20, state.y - 18);
    }

    // رسم النقاط
    if (state.score > 0 || state.round > 1) {
      ctx.fillStyle = "white";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(`النقاط: ${state.score}`, 10, 10);
      ctx.fillText(`الجولة: ${state.round}`, 10, 35);
    }

    // رسم شريط الغشاوة والشاشة
    if (state.overlayActive) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = "white";
      ctx.font = "bold 26px 'Segoe UI Emoji', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(state.overlayText, 400 / 2, 300 / 2 - 20);
      ctx.font = "18px 'Segoe UI Emoji', sans-serif";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(state.overlaySub, 400 / 2, 300 / 2 + 20);
    }

    ctx.restore();
  };

  const resetGame = () => {
    gameStateRef.current = { ...defaultGameState, bullets: [], enemies: [], particles: [] };
    draw();
  };

  const handleStopCode = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    keysPressedRef.current = {};
    resetGame();
  };

  const loadTemplate = (xmlString: string) => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      const dom = Blockly.utils.xml.textToDom(xmlString);
      Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
      resetGame();
    }
  };

  const handleRunCode = async () => {
    if (!workspaceRef.current) return;
    
    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      await new Promise(resolve => setTimeout(resolve, 60)); // Wait for previous loops to throw STOPPED
    }
    
    setIsPlaying(true);
    isPlayingRef.current = true;
    resetGame(); // العودة للبداية قبل كل تشغيل

    // توليد الكود من اللبنات
    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);

    // تعريف دوال التحكم المتوفرة للمترجم لكي تستدعى عبر الكود المولد
    const moveX = (dx: number) => {
      gameStateRef.current.x += dx;
      draw();
    };
    
    const moveY = (dy: number) => {
      gameStateRef.current.y += dy;
      draw();
    };
    
    const changeColor = (color: string) => {
      gameStateRef.current.color = color;
      draw();
    };

    const turn = (degrees: number) => {
      gameStateRef.current.rotation += degrees;
      draw();
    };

    const pointDirection = (degrees: number) => {
      gameStateRef.current.rotation = degrees;
      draw();
    };

    const changeBg = (color: string) => {
      gameStateRef.current.bg = color;
      draw();
    };

    const setVisible = (isVisible: boolean) => {
      gameStateRef.current.visible = isVisible;
      draw();
    };

    const setPosition = (x: number | null, y: number | null) => {
      if (x !== null) gameStateRef.current.x = x;
      if (y !== null) gameStateRef.current.y = y;
      draw();
    };

    const moveSteps = (steps: number) => {
      // حرك بناءً على الاتجاه (rotation)
      const rad = gameStateRef.current.rotation * Math.PI / 180;
      gameStateRef.current.x += Math.cos(rad) * steps;
      gameStateRef.current.y += Math.sin(rad) * steps;
      draw();
    };

    const bounceEdge = () => {
      const state = gameStateRef.current;
      
      let bounced = false;
      const margin = 20; // 20 is half size 40
      
      if (state.x < 0) { state.x = 0; bounced = true; }
      if (state.x > 400 - 40) { state.x = 400 - 40; bounced = true; }
      if (state.y < 0) { state.y = 0; bounced = true; }
      if (state.y > 300 - 40) { state.y = 300 - 40; bounced = true; }
      
      if (bounced) {
        state.rotation += 180;
        draw();
      }
    };

    const setShape = (shape: string) => {
      gameStateRef.current.shape = shape;
      draw();
    };

    const changeSize = (ds: number) => {
      gameStateRef.current.scale = Math.max(0.1, gameStateRef.current.scale + ds / 100);
      draw();
    };

    const say = (text: string) => {
      gameStateRef.current.text = text;
      draw();
    };

    const checkStop = () => {
      if (!isPlayingRef.current) throw new Error("STOPPED");
    };

    const isKeyPressed = (key: string) => {
      return !!keysPressedRef.current[key];
    };

    const getX = () => gameStateRef.current.x;
    const getY = () => gameStateRef.current.y;
    const getDir = () => gameStateRef.current.rotation;

    const getMouseX = () => mousePosRef.current.x;
    const getMouseY = () => mousePosRef.current.y;
    const isMouseDown = () => mousePosRef.current.isDown;
    
    const pointTowardsMouse = () => {
      const dx = mousePosRef.current.x - (gameStateRef.current.x + 20);
      const dy = mousePosRef.current.y - (gameStateRef.current.y + 20);
      gameStateRef.current.rotation = Math.atan2(dy, dx) * 180 / Math.PI;
      draw();
    };

    const shootBullet = () => {
      gameStateRef.current.bullets.push({
        x: gameStateRef.current.x,
        y: gameStateRef.current.y,
        dir: gameStateRef.current.rotation,
        active: true
      });
      draw();
    };

    const spawnEnemy = (speed: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      let x = 0, y = 0;
      if (Math.random() > 0.5) {
        x = Math.random() > 0.5 ? 0 : 400 - 40;
        y = Math.random() * (300 - 40);
      } else {
        x = Math.random() * (400 - 40);
        y = Math.random() > 0.5 ? 0 : 300 - 40;
      }
      gameStateRef.current.enemies.push({ x, y, speed, active: true });
      draw();
    };

    const updateGameObjects = (bulletSpeed: number) => {
      const state = gameStateRef.current;
      const cvs = canvasRef.current;
      if (!cvs) return;

      // حركة الجسيمات (Particles)
      if (state.particles) {
        state.particles.forEach(p => {
           p.x += p.vx;
           p.y += p.vy;
           p.life -= 0.05;
        });
        state.particles = state.particles.filter(p => p.life > 0);
      }

      // Move bullets
      state.bullets.forEach(b => {
        if (!b.active) return;
        b.x += Math.cos(b.dir * Math.PI / 180) * bulletSpeed;
        b.y += Math.sin(b.dir * Math.PI / 180) * bulletSpeed;
        if (b.x < -20 || b.x > 400 + 20 || b.y < -20 || b.y > 300 + 20) {
          b.active = false;
        }
      });

      // Move enemies & Check collisions
      state.enemies.forEach(e => {
        if (!e.active) return;
        const dx = state.x - e.x;
        const dy = state.y - e.y;
        const distToPlayer = Math.sqrt(dx*dx + dy*dy);
        
        if (distToPlayer > 0 && isPlayingRef.current) {
          e.x += (dx / distToPlayer) * e.speed;
          e.y += (dy / distToPlayer) * e.speed;
        }

        // Bullet collision
        state.bullets.forEach(b => {
          if (!b.active) return;
          const bdist = Math.sqrt(Math.pow(b.x - e.x, 2) + Math.pow(b.y - e.y, 2));
          if (bdist < 30) {
            b.active = false;
            e.active = false;
            state.score += 10;
            if (state.particles) {
              for (let i = 0; i < 8; i++) {
                state.particles.push({
                  x: e.x + 20, y: e.y + 20,
                  vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
                  life: 1, color: '#22c55e', size: Math.random() * 4 + 2
                });
              }
            }
          }
        });

        // Player collision
        if (distToPlayer < 30 && isPlayingRef.current) {
           state.shape = '💀';
           state.overlayActive = true;
           state.overlayText = "لقد خسرت! 💀";
           state.overlaySub = "النقاط: " + state.score + " | الجولة: " + state.round;
           state.gameOver = true;
           isPlayingRef.current = false;
        }
      });

      state.bullets = state.bullets.filter(b => b.active);
      state.enemies = state.enemies.filter(e => e.active);

      draw();
    };

    const getScore = () => gameStateRef.current.score;
    const getRound = () => gameStateRef.current.round;
    const setRound = (r: number) => { gameStateRef.current.round = r; draw(); };
    const getEnemiesCount = () => gameStateRef.current.enemies.filter(e => e.active).length;
    const getSmoothSpeed = () => 2.2 + ((gameStateRef.current.ticks || 0) * 0.0012);

    const enableCarGame = () => {
      gameStateRef.current.isCarGame = true;
      gameStateRef.current.enemyShape = '🚓';
      gameStateRef.current.shape = '🚗';
      gameStateRef.current.bg = '#a3e635';
      draw();
    };

    const enableUndertaleGame = () => {
      gameStateRef.current.isUndertaleMode = true;
      gameStateRef.current.shape = '❤️';
      gameStateRef.current.bg = '#000000';
      gameStateRef.current.x = 180;
      gameStateRef.current.y = 160;
      draw();
    };

    const spawnBoneAttack = (side: number, speed: number) => {
      // side: 1=left, 2=right, 3=top
      let x = 0, y = 0, vx = 0, vy = 0;
      if (side === 1) { x = 0; y = 125 + Math.random() * 100; vx = speed * 0.8; vy = 0; }
      else if (side === 2) { x = 400; y = 125 + Math.random() * 100; vx = -speed * 0.8; vy = 0; }
      else { x = 125 + Math.random() * 150; y = 0; vx = 0; vy = speed * 0.8; }
      
      // Store in enemies array but we will interpret speed differently in undertale update
      gameStateRef.current.enemies.push({ x, y, speed: vx, active: true, vy } as any);
      draw();
    };

    const updateUndertaleObjects = () => {
      const state = gameStateRef.current;
      state.ticks++;
      
      state.enemies.forEach((e: any) => {
        if (!e.active) return;
        e.x += e.speed; // speed acts as vx
        if (e.vy) e.y += e.vy;
        
        if (e.x < -40 || e.x > 440 || e.y > 340) {
           e.active = false;
           state.score += 5; // survive score
        }

        const dx = state.x - e.x;
        const dy = state.y - e.y;
        const distToPlayer = Math.sqrt(dx*dx + dy*dy);
        
        // Better collision for heart (it's actually small)
        if (distToPlayer < 20 && isPlayingRef.current) {
           e.active = false; // consume bone
           state.hp -= 20; // lose HP
           
           if (state.hp <= 0) {
             state.hp = 0;
             state.shape = '💔';
             state.overlayActive = true;
             state.overlayText = "GAME OVER";
             state.overlaySub = "النقاط: " + state.score + " | Stay DETERMINED... ❤️";
             state.gameOver = true;
             isPlayingRef.current = false;
           }
        }
      });
      state.enemies = state.enemies.filter(e => e.active);
      
      state.enemyShape = '🦴';
      draw();
    };

    const handleAdMovement = (speed: number) => {
      const state = gameStateRef.current;
      const keys = keysPressedRef.current;
      if (keys['a'] || keys['A'] || keys['KeyA'] || keys['ArrowLeft']) state.x -= speed;
      if (keys['d'] || keys['D'] || keys['KeyD'] || keys['ArrowRight']) state.x += speed;
      if (state.isCarGame) {
        if (state.x < 80) state.x = 80;
        if (state.x > 320 - 40) state.x = 320 - 40;
      } else {
        if (state.x < 0) state.x = 0;
        if (state.x > 400 - 40) state.x = 400 - 40;
      }
      draw();
    };

    const spawnEnemyCar = (speed: number) => {
      const x = 80 + Math.random() * (240 - 40);
      const y = -40;
      gameStateRef.current.enemies.push({ x, y, speed, active: true });
      draw();
    };

    const spawnEnemyCarLane = (lane: number, speed: number) => {
      const validLane = Math.max(1, Math.min(3, Math.round(lane))); // 1, 2, 3
      const x = 20 + validLane * 80; // 1: 100, 2: 180, 3: 260
      const y = -60;
      
      const state = gameStateRef.current;
      // التأكد من أن المسار فارغ تماما، وأنه لا توجد سيارات قريبة في القمة لضمان عدم انسداد الطريق
      const isLaneClear = !state.enemies.some(e => e.active && Math.abs(e.x - x) < 20);
      const isTopClear = !state.enemies.some(e => e.active && e.y < 80);
      
      if (isLaneClear && isTopClear) {
        state.enemies.push({ x, y, speed, active: true });
        draw();
      }
    };

    const updateCarGameObjects = (roadSpeed: number) => {
      const state = gameStateRef.current;
      state.ticks++;
      state.roadOffset += roadSpeed;
      if (state.particles) {
        state.particles.forEach(p => {
           p.x += p.vx;
           p.y += p.vy;
           p.life -= 0.05;
        });
        state.particles = state.particles.filter(p => p.life > 0);
      }
      state.enemies.forEach(e => {
        if (!e.active) return;
        e.y += e.speed;
        
        if (e.y > 340) {
           e.active = false;
           state.score += 10;
        }

        const dx = state.x - e.x;
        const dy = state.y - e.y;
        const distToPlayer = Math.sqrt(dx*dx + dy*dy);
        if (distToPlayer < 35 && isPlayingRef.current) {
           state.shape = '💥';
           state.overlayActive = true;
           state.overlayText = "لقد اصطدمت! 💥";
           state.overlaySub = "النقاط: " + state.score + " | الجولة: " + state.round;
           state.gameOver = true;
           isPlayingRef.current = false;
        }
      });
      state.enemies = state.enemies.filter(e => e.active);
      draw();
    };

    const showTitleScreen = (title: string, sub: string) => {
      gameStateRef.current.overlayActive = true;
      gameStateRef.current.overlayText = title;
      gameStateRef.current.overlaySub = sub;
      draw();
    };

    const hideTitleScreen = () => {
      gameStateRef.current.overlayActive = false;
      draw();
    };

    const waitForClick = async () => {
      let interacted = false;
      const handleInteract = () => { interacted = true; };
      
      window.addEventListener('mousedown', handleInteract);
      window.addEventListener('keydown', handleInteract);
      
      const startWait = Date.now();
      while (!interacted && isPlayingRef.current) {
        checkStop();
        if (Date.now() - startWait > 3000) break; // Auto dismiss after 3s
        await new Promise(r => setTimeout(r, 50));
      }
      
      window.removeEventListener('mousedown', handleInteract);
      window.removeEventListener('keydown', handleInteract);
    };

    const handleWasdMovement = (speed: number) => {
      const state = gameStateRef.current;
      const keys = keysPressedRef.current;
      
      if (keys['w'] || keys['W'] || keys['KeyW'] || keys['ArrowUp']) state.y -= speed;
      if (keys['s'] || keys['S'] || keys['KeyS'] || keys['ArrowDown']) state.y += speed;
      if (keys['a'] || keys['A'] || keys['KeyA'] || keys['ArrowLeft']) state.x -= speed;
      if (keys['d'] || keys['D'] || keys['KeyD'] || keys['ArrowRight']) state.x += speed;
      
      if (state.isUndertaleMode) {
        // Box is at 120, 120 size 160, 120. Heart visible portion is ~30px.
        // Center is x+20, y+20.
        if (state.x < 112) state.x = 112; 
        if (state.y < 112) state.y = 112;
        if (state.x > 248) state.x = 248;
        if (state.y > 208) state.y = 208;
      } else {
        if (state.x < 0) state.x = 0;
        if (state.y < 0) state.y = 0;
        if (state.x > 400 - 40) state.x = 400 - 40;
        if (state.y > 300 - 40) state.y = 300 - 40;
      }
      
      draw();
    };

    const delay = async (ms: number) => {
      let waited = 0;
      while (waited < ms) {
        checkStop();
        await new Promise(res => setTimeout(res, Math.min(ms - waited, 50)));
        waited += 50;
      }
    };

    try {
      // إنشاء الدالة ببيئة معزولة
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const executableFunc = new AsyncFunction(
        'moveX', 'moveY', 'changeColor', 'delay', 'turn', 'pointDirection', 'setPosition', 'changeSize', 'say', 'changeBg', 'setVisible', 'setShape', 'moveSteps', 'bounceEdge', 'isKeyPressed', 'getX', 'getY', 'getDir', 'getMouseX', 'getMouseY', 'isMouseDown', 'pointTowardsMouse', 'shootBullet', 'spawnEnemy', 'updateGameObjects', 'getScore', 'getRound', 'setRound', 'getEnemiesCount', 'checkStop', 'showTitleScreen', 'hideTitleScreen', 'waitForClick', 'handleWasdMovement', 'enableCarGame', 'handleAdMovement', 'spawnEnemyCar', 'updateCarGameObjects', 'spawnEnemyCarLane', 'getSmoothSpeed', 'enableUndertaleGame', 'spawnBoneAttack', 'updateUndertaleObjects',
        code
      );
      
      // تنفيذ الكود
      await executableFunc(moveX, moveY, changeColor, delay, turn, pointDirection, setPosition, changeSize, say, changeBg, setVisible, setShape, moveSteps, bounceEdge, isKeyPressed, getX, getY, getDir, getMouseX, getMouseY, isMouseDown, pointTowardsMouse, shootBullet, spawnEnemy, updateGameObjects, getScore, getRound, setRound, getEnemiesCount, checkStop, showTitleScreen, hideTitleScreen, waitForClick, handleWasdMovement, enableCarGame, handleAdMovement, spawnEnemyCar, updateCarGameObjects, spawnEnemyCarLane, getSmoothSpeed, enableUndertaleGame, spawnBoneAttack, updateUndertaleObjects);
      
    } catch (error: any) {
      if (error.message !== "STOPPED") {
        console.error("حدث خطأ أثناء تشغيل الكود:", error);
        alert("خطأ في تنفيذ الكود. تأكد من ترتيب اللبنات بشكل صحيح.");
      }
    } finally {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  return (
    <div dir="rtl" className="flex flex-col h-screen w-full bg-[#f3f4f6] text-gray-800 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white flex items-center justify-between px-6 shrink-0 z-20 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="font-extrabold text-2xl tracking-tight cursor-pointer flex items-center gap-3 text-gray-900">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 mb-1">
              <Code size={22} className="text-white" />
            </div>
            <span>برو<span className="text-indigo-600">بلوك</span></span>
          </div>
          
          <div className="flex gap-2 text-sm font-medium">
            <div className="cursor-pointer hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 group relative transition-colors">
              <FolderOpen size={18} className="text-indigo-500" /> المشاريع الجاهزة
              {/* قائمة المشاريع الجاهزة */}
              <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block z-50 overflow-hidden transform origin-top-right transition-all">
                <div className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">نماذج ألعاب</div>
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => loadTemplate(tpl.xml)}
                    className="p-3 hover:bg-indigo-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <span className="text-2xl">{tpl.icon}</span> 
                    <span className="text-gray-700 font-medium">{tpl.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="cursor-pointer hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Settings size={18} className="text-gray-500" /> الإعدادات
            </div>

            <div className="cursor-pointer hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 group relative transition-colors">
              <Users size={18} className="text-indigo-500" /> المنشئون
              <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block z-50 overflow-hidden transform origin-top-right transition-all p-3">
                <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">فريق العمل</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs">م</div>
                    <span>مؤيد عصام</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">ع</div>
                    <span>عبدالله محمود</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            defaultValue="لعبتي_الجديدة" 
            className="bg-gray-100 border border-transparent px-4 py-2 rounded-lg text-sm font-medium text-gray-700 outline-none text-center focus:border-indigo-300 focus:bg-white transition-all w-48"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-6 py-2 rounded-lg shadow-md shadow-indigo-200 transition-all active:scale-95">
            حفظ ومشاركة
          </button>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden p-2 lg:p-4 gap-4">
        {/* مساحة العمل (Blockly) - على اليمين */}
        <div className={`flex-1 flex flex-col relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] ${isFullscreen ? 'hidden' : ''}`}>
          <div className="h-12 border-b border-gray-100 flex items-center px-4 justify-between bg-gray-50/50 shrink-0">
             <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
               <Blocks size={18} className="text-indigo-500" /> مساحة البرمجة
             </div>
          </div>
          <div className="flex-1 relative">
            <div ref={blocklyDiv} className="absolute inset-0" />
          </div>
        </div>

        {/* القسم الأيسر: شاشة اللعبة والخصائص */}
        <div className="w-full lg:w-[440px] flex flex-col shrink-0 gap-4 overflow-hidden overflow-y-auto lg:overflow-visible">
          
          {/* Main Canvas Panel */}
          <div className={`${isFullscreen ? 'fixed inset-0 z-50 p-8 flex flex-col bg-gray-900/95 backdrop-blur-sm justify-center items-center' : 'bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden shrink-0'}`}>
            
            {/* Controls */}
            {!isFullscreen && (
              <div className="flex items-center justify-between px-4 h-12 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                  <Play size={16} className="text-green-500" />
                  شاشة العرض
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleRunCode}
                    disabled={isPlaying}
                    className={`h-8 px-4 rounded-md flex items-center gap-1.5 font-bold text-xs transition-all ${isPlaying ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    <Play fill="currentColor" size={14} /> تشغيل
                  </button>
                  <button 
                    onClick={handleStopCode}
                    className="h-8 px-4 rounded-md flex items-center gap-1.5 font-bold text-xs transition-all bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <Square fill="currentColor" size={12} /> إيقاف
                  </button>
                  <button onClick={() => setIsFullscreen(true)} className="ml-2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors" title="ملء الشاشة">
                    <Maximize size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Canvas Container */}
            <div className={`relative flex items-center justify-center bg-gray-50 ${isFullscreen ? 'w-full max-w-5xl aspect-[4/3] p-0 shadow-2xl rounded-2xl overflow-hidden border border-gray-700' : 'p-3'}`}>
              <div className={`w-full aspect-[4/3] bg-white rounded-xl overflow-hidden border border-gray-200 relative flex items-center justify-center shadow-inner ${isFullscreen ? 'h-full border-none rounded-none' : ''}`}>
                <canvas 
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className={`max-w-full h-full w-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
                  onMouseMove={(e) => {
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (rect) {
                      mousePosRef.current.x = (e.clientX - rect.left) * (400 / rect.width);
                      mousePosRef.current.y = (e.clientY - rect.top) * (300 / rect.height);
                    }
                  }}
                  onMouseDown={() => mousePosRef.current.isDown = true}
                  onMouseUp={() => mousePosRef.current.isDown = false}
                  onMouseLeave={() => mousePosRef.current.isDown = false}
                />
              </div>

              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-6 right-6 bg-gray-900/50 hover:bg-gray-900/80 backdrop-blur-md text-white p-3 rounded-full transition-colors border border-white/20 z-[60]"
                >
                  <Minimize size={20} />
                </button>
              )}
            </div>

            {isFullscreen && (
               <div className="mt-8 flex items-center gap-4 bg-gray-800/80 p-3 rounded-2xl border border-gray-700 backdrop-blur-md">
                 <button 
                  onClick={handleRunCode}
                  disabled={isPlaying}
                  className="px-8 py-3 rounded-xl text-sm flex items-center gap-2 font-bold transition-all bg-green-500 hover:bg-green-400 text-white disabled:opacity-50"
                 >
                   <Play size={18} fill="currentColor" /> تشغيل اللعبة
                 </button>
                 <button 
                  onClick={handleStopCode}
                  className="px-8 py-3 rounded-xl text-sm flex items-center gap-2 font-bold transition-all bg-red-500 hover:bg-red-400 text-white"
                 >
                   <Square size={16} fill="currentColor" /> إيقاف اللعبة
                 </button>
                 <div className="w-px h-8 bg-gray-600 mx-2"></div>
                 <button 
                  onClick={() => setIsFullscreen(false)}
                  className="px-8 py-3 rounded-xl text-sm flex items-center gap-2 font-bold transition-all bg-gray-700 hover:bg-gray-600 text-white"
                 >
                   <Minimize size={16} /> خروج من وضع ملء الشاشة
                 </button>
               </div>
            )}
          </div>

          {!isFullscreen && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              
              {/* Properties Panel */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 shrink-0 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                  <Settings size={16} className="text-gray-400" /> خصائص الكائن
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <div className="flex flex-col gap-1.5">
                     <label className="text-[11px] font-bold text-gray-500">اسم الكائن</label>
                     <input className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-400 rounded-lg py-1.5 px-3 outline-none text-gray-800 text-sm font-medium transition-colors" defaultValue="الكائن 1" />
                   </div>
                   <div className="flex gap-2">
                     <div className="flex flex-col gap-1.5 w-1/2">
                       <label className="text-[11px] font-bold text-gray-500 text-center">X</label>
                       <input className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 outline-none text-center text-gray-800 font-mono text-sm" value={Math.round(gameStateRef.current.x)} readOnly />
                     </div>
                     <div className="flex flex-col gap-1.5 w-1/2">
                       <label className="text-[11px] font-bold text-gray-500 text-center">Y</label>
                       <input className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 outline-none text-center text-gray-800 font-mono text-sm" value={Math.round(gameStateRef.current.y * -1 + 300)} readOnly />
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                   <div className="flex flex-col gap-1.5">
                     <label className="text-[11px] font-bold text-gray-500">الحجم</label>
                     <input className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 outline-none text-gray-800 font-mono text-sm" value={Math.round(gameStateRef.current.scale * 100)} readOnly />
                   </div>
                   <div className="flex flex-col gap-1.5">
                     <label className="text-[11px] font-bold text-gray-500">الاتجاه</label>
                     <input className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 outline-none text-gray-800 font-mono text-sm" value={Math.round(gameStateRef.current.rotation)} readOnly />
                   </div>
                </div>
              </div>

              {/* Sprites Panel */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="h-10 border-b border-gray-100 flex items-center px-4 justify-between bg-gray-50/50 shrink-0">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <Layers size={16} className="text-purple-500" /> مكتبة الكائنات
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 flex gap-3 content-start flex-wrap relative bg-gray-50/30">
                    
                    {/* Sprite Box */}
                    <div 
                      onClick={() => { gameStateRef.current.shape = 'square'; draw(); }}
                      className={`w-[72px] h-[72px] bg-white rounded-xl border-2 flex flex-col items-center justify-center relative cursor-pointer transition-all shadow-sm ${gameStateRef.current.shape === 'square' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'}`}
                    >
                       <span className="text-3xl filter drop-shadow hover:scale-110 transition-transform">🟩</span>
                    </div>
                    
                    <div 
                      onClick={() => { gameStateRef.current.shape = '⚽'; draw(); }}
                      className={`w-[72px] h-[72px] bg-white rounded-xl border-2 flex flex-col items-center justify-center relative cursor-pointer transition-all shadow-sm ${gameStateRef.current.shape === '⚽' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'}`}
                    >
                       <span className="text-3xl filter drop-shadow hover:scale-110 transition-transform">⚽</span>
                    </div>
                    
                    <div 
                      onClick={() => { gameStateRef.current.shape = '🚗'; draw(); }}
                      className={`w-[72px] h-[72px] bg-white rounded-xl border-2 flex flex-col items-center justify-center relative cursor-pointer transition-all shadow-sm ${gameStateRef.current.shape === '🚗' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'}`}
                    >
                       <span className="text-3xl filter drop-shadow hover:scale-110 transition-transform">🚗</span>
                    </div>

                    <div 
                      onClick={() => { gameStateRef.current.shape = '🚀'; draw(); }}
                      className={`w-[72px] h-[72px] bg-white rounded-xl border-2 flex flex-col items-center justify-center relative cursor-pointer transition-all shadow-sm ${gameStateRef.current.shape === '🚀' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'}`}
                    >
                       <span className="text-3xl filter drop-shadow hover:scale-110 transition-transform">🚀</span>
                    </div>

                    {/* Add Sprite Float Button */}
                    <div className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex justify-center items-center cursor-pointer shadow-lg shadow-indigo-200 absolute bottom-4 left-4 transition-all hover:scale-110 hover:-translate-y-1 z-10">
                       <span className="text-2xl font-light leading-none">+</span>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Prompt Modal */}
      {promptData && (
        <div className="fixed inset-0 z-[100] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] border border-gray-100 flex flex-col gap-4">
            <div className="font-bold text-lg text-gray-800">{promptData.message}</div>
            <input 
              type="text" 
              autoFocus
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 w-full font-medium"
              defaultValue={promptData.defaultValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  promptData.callback(e.currentTarget.value);
                  setPromptData(null);
                }
                if (e.key === 'Escape') {
                  promptData.callback(null);
                  setPromptData(null);
                }
              }}
              ref={(input) => input && setTimeout(() => input.focus(), 10)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => { promptData.callback(null); setPromptData(null); }}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={(e) => { 
                  const target = e.currentTarget.parentElement?.previousSibling as HTMLInputElement;
                  promptData.callback(target.value); 
                  setPromptData(null); 
                }}
                className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-200 transition-all"
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
