'use client';

import { useEffect, useRef, useState } from 'react';
import { Sofa, Utensils, Bed, MapPin, Loader2, Orbit, Pencil, Save, X, Eye, Camera, Plus, Trash2, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { veronaConfig, Scene360 } from '@/config/verona';

const ALL_IMAGES = Array.from({ length: 16 }, (_, i) => `/images/360/pano-${String(i + 1).padStart(2, '0')}.jpg`);

const renderCategoryIcon = (iconName: string, className?: string) => {
  switch (iconName) {
    case 'sofa':
      return <Sofa className={className} />;
    case 'utensils':
      return <Utensils className={className} />;
    case 'bed':
      return <Bed className={className} />;
    case 'home':
      return <Home className={className} />;
    case 'mappin':
      return <MapPin className={className} />;
    default:
      return <MapPin className={className} />;
  }
};

export default function Viewer360() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  
  const [inViewport, setInViewport] = useState(false);
  const [imageExists, setImageExists] = useState<boolean | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [viewerInitialized, setViewerInitialized] = useState(false);
  
  // Editor mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [rebuildTrigger, setRebuildTrigger] = useState(0);
  
  // New typology creation states
  const [showNewTypologyForm, setShowNewTypologyForm] = useState(false);
  const [newTypologyName, setNewTypologyName] = useState('');

  // React state synchronized with viewer360.json
  const { scenes: configScenes, categories: configCategories, typologies: configTypologies } = veronaConfig.viewer360;
  const [scenesState, setScenesState] = useState<Scene360[]>(configScenes);
  const [categoriesState, setCategoriesState] = useState<Record<string, { label: string; icon: 'sofa' | 'utensils' | 'bed' | 'mappin' }>>(configCategories as any);
  const [typologiesState, setTypologiesState] = useState<Record<string, { label: string }>>(configTypologies as any);

  // Active navigation states
  const firstTypologyKey = Object.keys(configTypologies)[0] || 'depto-a';
  const initialScene = configScenes.find(s => s.typology === firstTypologyKey) || configScenes[0];

  const [selectedPano, setSelectedPano] = useState<Scene360>(initialScene);
  const [activeTypology, setActiveTypology] = useState<string>(firstTypologyKey);
  const [activeCategory, setActiveCategory] = useState<'social' | 'cocina' | 'dormitorios' | 'exteriores' | null>(null);
  const [coords, setCoords] = useState({ pitch: 0, yaw: 0 });
  
  // Editor focused typology state
  const [editingTypology, setEditingTypology] = useState<string>(firstTypologyKey);

  // Validate panorama image existence (using default)
  useEffect(() => {
    const img = new Image();
    img.src = configScenes[0].src;
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
  }, [configScenes]);

  // Intersection observer to trigger script injection only when section is in viewport
  useEffect(() => {
    if (imageExists === false) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInViewport(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [imageExists]);

  // Inject Pannellum scripts dynamically
  useEffect(() => {
    if (!inViewport || imageExists !== true) return;

    // Inject CSS
    if (!document.getElementById('pannellum-css')) {
      const link = document.createElement('link');
      link.id = 'pannellum-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    }

    // Inject JS
    if (!document.getElementById('pannellum-js')) {
      const script = document.createElement('script');
      script.id = 'pannellum-js';
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      const checkPannellum = setInterval(() => {
        if ((window as any).pannellum) {
          setScriptLoaded(true);
          clearInterval(checkPannellum);
        }
      }, 100);
      return () => clearInterval(checkPannellum);
    }
  }, [inViewport, imageExists]);

  // Sync editing typology when opening the editor
  useEffect(() => {
    if (isEditMode) {
      setEditingTypology(activeTypology);
    }
  }, [isEditMode, activeTypology]);

  // Initialize Pannellum Viewer (ONCE or on config scenes list change)
  useEffect(() => {
    if (!scriptLoaded || !inViewport || imageExists !== true) return;

    const pnl = (window as any).pannellum;
    if (!pnl) return;

    // Compile scenes config for Pannellum
    const scenesConfig: Record<string, any> = {};
    scenesState.forEach((s) => {
      scenesConfig[s.id] = {
        type: 'equirectangular',
        panorama: s.src,
        pitch: s.pitch ?? 0,
        yaw: s.yaw ?? 0,
        autoLoad: true,
        autoRotate: -1,
        hfov: 100,
        showZoomCtrl: false,
        showFullscreenCtrl: false,
        compass: false,
        mouseZoom: false,
        keyboardZoom: false,
        hotSpots: []
      };
    });

    let viewer: any = null;
    try {
      setViewerInitialized(false);
      viewer = pnl.viewer('pannellum-container', {
        default: {
          firstScene: selectedPano.id,
          sceneFadeDuration: 800,
          autoLoad: true,
          autoRotate: -1,
          hfov: 100,
          showZoomCtrl: false,
          showFullscreenCtrl: false,
          compass: false,
          mouseZoom: false,
          keyboardZoom: false,
        },
        scenes: scenesConfig
      });

      viewerRef.current = viewer;

      // Event: Loaded
      viewer.on('load', () => {
        setViewerInitialized(true);
        if (viewerRef.current) {
          setCoords({
            pitch: Math.round(viewerRef.current.getPitch()),
            yaw: Math.round(viewerRef.current.getYaw())
          });
        }
      });

      // Event: View Change (for coordinates indicator)
      viewer.on('viewchange', () => {
        if (viewerRef.current) {
          setCoords({
            pitch: Math.round(viewerRef.current.getPitch()),
            yaw: Math.round(viewerRef.current.getYaw())
          });
        }
      });

      // Event: Scene Change (updates React state when navigating internally)
      viewer.on('scenechange', (sceneId: string) => {
        const currentScene = scenesState.find((s) => s.id === sceneId);
        if (currentScene) {
          setSelectedPano(currentScene);
          // Sync active typology filter when jumping between scenes internally
          if (currentScene.typology && currentScene.typology !== activeTypology) {
            setActiveTypology(currentScene.typology);
          }
        }
      });

      // Safety timeout
      const safetyTimeout = setTimeout(() => {
        setViewerInitialized(true);
      }, 2000);

      return () => {
        clearTimeout(safetyTimeout);
        if (viewer) {
          try {
            viewer.destroy();
          } catch (e) {
            // silent catch
          }
        }
        viewerRef.current = null;
        setViewerInitialized(false);
      };
    } catch (err) {
      console.error('Failed to initialize Pannellum:', err);
      setViewerInitialized(true);
    }
  }, [scriptLoaded, inViewport, imageExists, rebuildTrigger]);

  // Handle scene change via React state
  useEffect(() => {
    if (viewerRef.current && selectedPano) {
      const currentScene = viewerRef.current.getScene();
      if (currentScene !== selectedPano.id) {
        setViewerInitialized(false);
        viewerRef.current.loadScene(
          selectedPano.id,
          selectedPano.pitch ?? 0,
          selectedPano.yaw ?? 0
        );
      }
    }
  }, [selectedPano]);

  const handlePanoSelect = (scene: Scene360) => {
    setSelectedPano(scene);
    setActiveCategory(null); // Close dropdown
  };

  const handleCategoryIconClick = (category: 'social' | 'cocina' | 'dormitorios' | 'exteriores') => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  const handleTypologyClick = (typKey: string) => {
    setActiveTypology(typKey);
    setActiveCategory(null);
    
    // Switch immediately to the first scene of this typology
    const firstSceneOfTyp = scenesState.find((s) => s.typology === typKey);
    if (firstSceneOfTyp) {
      setSelectedPano(firstSceneOfTyp);
    }
  };

  // --- EDITOR HANDLERS ---

  // Add a new typology
  const handleCreateTypology = () => {
    if (!newTypologyName.trim()) return;

    const newKey = `depto-${Date.now().toString().slice(-4)}`;
    setTypologiesState((prev) => ({
      ...prev,
      [newKey]: { label: newTypologyName.trim() },
    }));

    setEditingTypology(newKey);
    setNewTypologyName('');
    setShowNewTypologyForm(false);
  };

  // Delete a typology safely
  const handleDeleteTypology = (typKey: string) => {
    if (Object.keys(typologiesState).length <= 1) {
      alert('Debe existir al menos una tipología.');
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar la tipología "${typologiesState[typKey]?.label}"? Las secciones pertenecientes serán asignadas a Áreas Comunes.`)) {
      return;
    }

    // Remove key
    const nextTypologies = { ...typologiesState };
    delete nextTypologies[typKey];
    setTypologiesState(nextTypologies);

    // Reassign scenes to social-areas
    const updatedScenes = scenesState.map((s) => {
      if (s.typology === typKey) {
        return { ...s, typology: 'social-areas' };
      }
      return s;
    });
    setScenesState(updatedScenes);

    // Re-focus editor typology
    const fallbackKey = Object.keys(nextTypologies)[0];
    setEditingTypology(fallbackKey);
    setActiveTypology(fallbackKey);

    const fallbackScene = updatedScenes.find((s) => s.typology === fallbackKey);
    if (fallbackScene) {
      setSelectedPano(fallbackScene);
    }
  };

  // Add a new scene / section inside editingTypology
  const handleAddNewScene = () => {
    // Find first image not used by any scene
    const firstUnused = ALL_IMAGES.find((img) => !scenesState.some((s) => s.src === img)) || '/images/360/pano-01.jpg';

    const newId = `vista-${Date.now().toString().slice(-4)}`;
    const newScene: Scene360 = {
      id: newId,
      label: 'Nueva Sección',
      src: firstUnused,
      category: 'social',
      typology: editingTypology,
      pitch: 0,
      yaw: 0,
    };

    setScenesState((prev) => [...prev, newScene]);
    setSelectedPano(newScene);
  };

  // Delete a scene/section safely
  const handleDeleteScene = (sceneId: string) => {
    if (scenesState.length <= 1) {
      alert('Debe existir al menos una sección en el recorrido.');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar esta sección de forma permanente?')) {
      return;
    }

    const updatedScenes = scenesState.filter((s) => s.id !== sceneId);
    setScenesState(updatedScenes);

    // If active scene is deleted, fallback to another scene
    if (selectedPano.id === sceneId) {
      const fallback = updatedScenes.find((s) => s.typology === editingTypology) || updatedScenes[0];
      if (fallback) {
        setSelectedPano(fallback);
      }
    }
  };

  // Rename a scene label
  const handleSceneLabelChange = (sceneId: string, newLabel: string) => {
    const updatedScenes = scenesState.map((s) => {
      if (s.id === sceneId) {
        if (selectedPano.id === sceneId) {
          setSelectedPano((prev) => ({ ...prev, label: newLabel }));
        }
        return { ...s, label: newLabel };
      }
      return s;
    });
    setScenesState(updatedScenes);
  };

  // Change scene image src path
  const handleSceneSrcChange = (sceneId: string, newSrc: string) => {
    const updatedScenes = scenesState.map((s) => {
      if (s.id === sceneId) {
        if (selectedPano.id === sceneId) {
          setSelectedPano((prev) => ({ ...prev, src: newSrc }));
        }
        return { ...s, src: newSrc };
      }
      return s;
    });
    setScenesState(updatedScenes);
  };

  // Change scene category
  const handleSceneCategoryChange = (sceneId: string, newCategory: 'social' | 'cocina' | 'dormitorios' | 'exteriores') => {
    const updatedScenes = scenesState.map((s) => {
      if (s.id === sceneId) {
        if (selectedPano.id === sceneId) {
          setSelectedPano((prev) => ({ ...prev, category: newCategory }));
        }
        return { ...s, category: newCategory };
      }
      return s;
    });
    setScenesState(updatedScenes);
  };

  // Change scene typology assignment
  const handleSceneTypologyChange = (sceneId: string, newTypology: string) => {
    const updatedScenes = scenesState.map((s) => {
      if (s.id === sceneId) {
        if (selectedPano.id === sceneId) {
          setSelectedPano((prev) => ({ ...prev, typology: newTypology }));
          setActiveTypology(newTypology);
        }
        return { ...s, typology: newTypology };
      }
      return s;
    });
    setScenesState(updatedScenes);
  };

  // Set the current view angles (pitch/yaw) as starting coordinates
  const handleSetInitialView = (sceneId: string) => {
    if (!viewerRef.current) return;
    
    const currentPitch = Math.round(viewerRef.current.getPitch());
    const currentYaw = Math.round(viewerRef.current.getYaw());
    
    const updatedScenes = scenesState.map((s) => {
      if (s.id === sceneId) {
        if (selectedPano.id === sceneId) {
          setSelectedPano((prev) => ({ ...prev, pitch: currentPitch, yaw: currentYaw }));
        }
        return { ...s, pitch: currentPitch, yaw: currentYaw };
      }
      return s;
    });
    
    setScenesState(updatedScenes);
  };

  // Edit pitch start value manually
  const handleScenePitchChange = (sceneId: string, value: number) => {
    const updatedScenes = scenesState.map((s) => {
      if (s.id === sceneId) {
        if (selectedPano.id === sceneId) {
          setSelectedPano((prev) => ({ ...prev, pitch: value }));
          if (viewerRef.current) {
            viewerRef.current.setPitch(value);
          }
        }
        return { ...s, pitch: value };
      }
      return s;
    });
    setScenesState(updatedScenes);
  };

  // Edit yaw start value manually
  const handleSceneYawChange = (sceneId: string, value: number) => {
    const updatedScenes = scenesState.map((s) => {
      if (s.id === sceneId) {
        if (selectedPano.id === sceneId) {
          setSelectedPano((prev) => ({ ...prev, yaw: value }));
          if (viewerRef.current) {
            viewerRef.current.setYaw(value);
          }
        }
        return { ...s, yaw: value };
      }
      return s;
    });
    setScenesState(updatedScenes);
  };

  // Edit category labels
  const handleCategoryLabelChange = (catKey: string, newLabel: string) => {
    setCategoriesState((prev) => ({
      ...prev,
      [catKey]: {
        ...prev[catKey],
        label: newLabel,
      },
    }));
  };

  // Edit typology labels
  const handleTypologyLabelChange = (typKey: string, newLabel: string) => {
    setTypologiesState((prev) => ({
      ...prev,
      [typKey]: {
        ...prev[typKey],
        label: newLabel,
      },
    }));
  };

  // Save changes back to viewer360.json on disk
  const handleSaveConfig = async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          src: configScenes[0].src,
          autoLoad: true,
          autoRotate: -1,
          hfov: 100,
          categories: categoriesState,
          typologies: typologiesState,
          scenes: scenesState,
        }),
      });

      const res = await response.json();
      if (res.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error(res.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Filter scenes for bottom category dropdowns (only show scenes in active category and active typology)
  const activeCategoryScenes = scenesState.filter(
    (s) => s.category === activeCategory && s.typology === activeTypology
  );

  // Filter scenes belonging to the typology currently selected in the editor
  const editingTypologyScenes = scenesState.filter((s) => s.typology === editingTypology);

  return (
    <section
      ref={sectionRef}
      id="360"
      className="w-full h-screen relative bg-verona-bg border-t border-border-subtle overflow-hidden"
    >
      {/* Top subtle dark gradient overlay for text readability */}
      <div className="absolute top-0 left-0 w-full h-44 bg-gradient-to-b from-[#071125]/85 to-transparent z-15 pointer-events-none" />

      {/* Absolute Overlay Heading */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-25 text-center w-full px-6 pointer-events-none [text-shadow:0_2px_10px_rgba(7,17,37,0.95)]">
        <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold font-semibold mb-3 block">
          Experiencia 360°
        </span>
        <h3 className="font-display text-4xl md:text-5xl font-light text-text-primary leading-tight">
          Ingresá a Verona <br className="hidden md:block" />
          antes de que exista.
        </h3>
      </div>

      {/* Top HUD Typologies Bar (Departamento Tipología A, B, C, etc.) */}
      {imageExists === true && !isEditMode && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-35 flex items-center bg-[#071125]/85 backdrop-blur-md px-5 py-2 border border-border-subtle rounded-full shadow-lg shadow-black/40 select-none">
          <div className="flex gap-2.5 items-center font-sans text-text-primary">
            {Object.keys(typologiesState).map((typKey) => {
              const typ = typologiesState[typKey];
              const isActive = activeTypology === typKey;
              return (
                <button
                  key={typKey}
                  onClick={() => handleTypologyClick(typKey)}
                  className={`font-sans text-[9px] uppercase tracking-extreme px-4 py-1.5 rounded-full border transition-all duration-300 cursor-none shrink-0 ${
                    isActive
                      ? 'border-verona-gold text-verona-gold bg-verona-gold/10 font-bold'
                      : 'border-white/5 text-text-secondary hover:text-text-primary hover:border-white/10'
                  }`}
                >
                  {typ.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-time HUD Coordinates (ONLY in Edit Mode to guide camera starting targets setting) */}
      {isEditMode && imageExists === true && viewerInitialized && (
        <div className="absolute top-24 left-6 z-25 bg-[#071125]/85 backdrop-blur-md px-3 py-1.5 border border-verona-gold/30 rounded font-mono text-[9px] text-verona-gold pointer-events-none flex items-center gap-2 tracking-widest shadow-lg shadow-black/20 select-none">
          <Camera size={10} className="text-verona-gold/75" />
          <span>SYS CAM · PITCH {coords.pitch}° · YAW {coords.yaw}°</span>
        </div>
      )}

      {/* Toggle Editor Mode Button */}
      {imageExists === true && (
        <button
          onClick={() => setIsEditMode((prev) => !prev)}
          className={`absolute top-24 right-6 z-35 font-sans text-[10px] font-bold uppercase tracking-extreme px-4 py-2.5 rounded-full border transition-all duration-300 cursor-none flex items-center gap-2 shadow-lg ${
            isEditMode
              ? 'bg-verona-gold text-verona-bg border-verona-gold hover:bg-verona-gold/90'
              : 'bg-[#071125]/80 text-text-secondary border-white/10 hover:text-text-primary hover:border-white/20'
          }`}
        >
          <Pencil size={11} />
          <span>{isEditMode ? 'Cerrar Editor' : 'Editar Tour'}</span>
        </button>
      )}

      {/* Interactive Tour Editor Sidebar Overlay */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-6 top-36 bottom-24 w-80 bg-[#071125]/95 backdrop-blur-md border border-verona-gold/30 rounded-2xl shadow-2xl p-5 z-40 overflow-y-auto no-scrollbar flex flex-col gap-5 select-none"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base text-text-primary font-bold tracking-wide">
                Editor de Tour 360°
              </h3>
              <button
                onClick={() => setIsEditMode(false)}
                className="text-text-secondary hover:text-text-primary cursor-none p-1 rounded-full hover:bg-white/5 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Save Config & Rebuild Buttons Row */}
            <div className="flex gap-2">
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className={`flex-1 font-sans font-bold uppercase tracking-extreme py-2.5 rounded-xl cursor-none text-[10px] flex items-center justify-center gap-2 transition-all border ${
                  saveStatus === 'success'
                    ? 'bg-green-700/20 border-green-500 text-green-400'
                    : saveStatus === 'error'
                    ? 'bg-red-700/20 border-red-500 text-red-400'
                    : 'bg-verona-gold text-verona-bg border-verona-gold hover:bg-verona-gold/90'
                }`}
              >
                {saving ? (
                  <Loader2 className="animate-spin w-3 h-3" />
                ) : saveStatus === 'success' ? (
                  '¡Guardado!'
                ) : saveStatus === 'error' ? (
                  'Error'
                ) : (
                  <>
                    <Save size={12} />
                    <span>Guardar</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setRebuildTrigger((prev) => prev + 1)}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-text-primary px-3 rounded-xl cursor-none flex items-center justify-center transition-all duration-200"
                title="Recargar Visor (Aplica cambios de imagen/coordenadas)"
              >
                <Orbit className="w-4 h-4 text-verona-gold" />
              </button>
            </div>

            {/* Selector: Choose Typology to edit */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[8px] text-text-secondary uppercase font-mono tracking-wider">
                Seleccionar Tipología a Editar
              </label>
              <select
                value={editingTypology}
                onChange={(e) => setEditingTypology(e.target.value)}
                className="bg-verona-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-verona-gold/40 cursor-none"
              >
                {Object.keys(typologiesState).map((key) => (
                  <option key={key} value={key}>
                    {typologiesState[key].label}
                  </option>
                ))}
              </select>
              
              {/* Toggle new typology form link */}
              {!showNewTypologyForm ? (
                <button
                  onClick={() => setShowNewTypologyForm(true)}
                  className="text-[9px] text-verona-gold hover:underline cursor-none mt-1 text-left flex items-center gap-1 font-bold"
                >
                  <Plus size={10} />
                  <span>Crear Nueva Tipología</span>
                </button>
              ) : (
                <div className="bg-white/5 border border-verona-gold/20 p-3 rounded-xl mt-2 flex flex-col gap-2.5 animate-fadeIn">
                  <span className="text-[8px] uppercase font-bold text-verona-gold">Nueva Tipología</span>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] text-text-secondary">Nombre descriptivo</label>
                    <input
                      type="text"
                      placeholder="Ej. Tipología D"
                      value={newTypologyName}
                      onChange={(e) => setNewTypologyName(e.target.value)}
                      className="bg-verona-bg border border-white/10 rounded px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-verona-gold/40 cursor-none"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setShowNewTypologyForm(false);
                        setNewTypologyName('');
                      }}
                      className="px-2 py-1 text-[8.5px] border border-white/10 text-text-secondary rounded hover:text-text-primary cursor-none"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateTypology}
                      disabled={!newTypologyName.trim()}
                      className="px-2.5 py-1 text-[8.5px] bg-verona-gold text-verona-bg font-bold rounded hover:bg-verona-gold/90 disabled:opacity-40 cursor-none"
                    >
                      Crear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section: Edit Typology Label & Deletion */}
            <div className="flex flex-col gap-1.5 bg-white/5 border border-white/5 p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <label className="text-[8px] text-text-secondary uppercase font-mono tracking-wider">
                  Nombre de esta Tipología
                </label>
                {editingTypology !== 'social-areas' && (
                  <button
                    onClick={() => handleDeleteTypology(editingTypology)}
                    className="text-red-400 hover:text-red-300 font-bold text-[8.5px] cursor-none flex items-center gap-0.5"
                    title="Eliminar esta tipología"
                  >
                    <Trash2 size={10} />
                    <span>Borrar</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={typologiesState[editingTypology]?.label || ''}
                onChange={(e) => handleTypologyLabelChange(editingTypology, e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-verona-gold/40 cursor-none"
              />
            </div>

            {/* Section: Scenes inside this Typology */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-verona-gold/15 pb-1">
                <h4 className="text-[9px] text-verona-gold uppercase tracking-extreme font-bold">
                  Secciones en esta Tipología
                </h4>
                <button
                  onClick={handleAddNewScene}
                  className="text-[9px] text-verona-gold hover:underline cursor-none flex items-center gap-0.5 font-bold"
                >
                  <Plus size={10} />
                  <span>Añadir Sección</span>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {editingTypologyScenes.length === 0 ? (
                  <span className="text-[9.5px] text-text-secondary italic pl-1">
                    No hay secciones asignadas a esta tipología.
                  </span>
                ) : (
                  editingTypologyScenes.map((s) => {
                    const isCurrent = selectedPano.id === s.id;
                    return (
                      <div key={s.id} className="bg-white/5 border border-white/5 p-3.5 rounded-xl flex flex-col gap-3">
                        {/* Scene Header */}
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-verona-gold uppercase font-bold">
                            {s.id}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePanoSelect(s)}
                              className={`text-[9px] font-bold px-2 py-1 rounded border transition-all cursor-none flex items-center gap-1 ${
                                isCurrent
                                  ? 'bg-verona-gold/20 border-verona-gold text-verona-gold font-bold'
                                  : 'border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20'
                              }`}
                            >
                              <Eye size={10} />
                              <span>{isCurrent ? 'Sección Activa' : 'Ver'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteScene(s.id)}
                              className="text-red-400 hover:text-red-300 font-bold text-[9px] cursor-none pl-2 border-l border-white/10"
                            >
                              Borrar
                            </button>
                          </div>
                        </div>

                        {/* Interactive Set Starting View Button (only visible for active scene) */}
                        {isCurrent && (
                          <button
                            onClick={() => handleSetInitialView(s.id)}
                            className="w-full bg-[#c5a880]/20 hover:bg-[#c5a880]/30 text-verona-gold border border-verona-gold/30 font-bold py-2 rounded-lg text-[9px] cursor-none flex items-center justify-center gap-1.5 transition-all mt-0.5"
                          >
                            <Camera size={11} />
                            <span>Fijar Cámara Actual como Inicio</span>
                          </button>
                        )}

                        {/* Start View coordinates inputs */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] text-text-secondary uppercase font-mono">Pitch de Inicio</label>
                            <input
                              type="number"
                              value={s.pitch ?? 0}
                              onChange={(e) => handleScenePitchChange(s.id, parseInt(e.target.value) || 0)}
                              className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-verona-gold/40 cursor-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] text-text-secondary uppercase font-mono">Yaw de Inicio</label>
                            <input
                              type="number"
                              value={s.yaw ?? 0}
                              onChange={(e) => handleSceneYawChange(s.id, parseInt(e.target.value) || 0)}
                              className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-verona-gold/40 cursor-none"
                            />
                          </div>
                        </div>

                        {/* Edit Label */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-text-secondary uppercase font-mono">
                            Nombre de la Sección
                          </label>
                          <input
                            type="text"
                            value={s.label}
                            onChange={(e) => handleSceneLabelChange(s.id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-verona-gold/40 cursor-none"
                          />
                        </div>

                        {/* Dropdown Selector for Image Path (src) - selectable but labeled if used */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-text-secondary uppercase font-mono">
                            Seleccionar Imagen (Archivo)
                          </label>
                          <select
                            value={s.src}
                            onChange={(e) => handleSceneSrcChange(s.id, e.target.value)}
                            className="bg-verona-bg border border-white/10 rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-verona-gold/40 cursor-none"
                          >
                            {ALL_IMAGES.map((img) => {
                              const isUsed = scenesState.some((other) => other.src === img && other.id !== s.id);
                              const imgName = img.split('/').pop() || img;
                              return (
                                <option key={img} value={img}>
                                  {imgName} {isUsed ? '(En uso)' : ''}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* Edit Category */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-text-secondary uppercase font-mono">
                            Sector / Categoría
                          </label>
                          <select
                            value={s.category}
                            onChange={(e) => handleSceneCategoryChange(s.id, e.target.value as any)}
                            className="bg-verona-bg border border-white/10 rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-verona-gold/40 cursor-none"
                          >
                            {Object.keys(categoriesState).map((key) => (
                              <option key={key} value={key}>
                                {categoriesState[key].label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Re-assign Typology */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-text-secondary uppercase font-mono">
                            Mover a Tipología
                          </label>
                          <select
                            value={s.typology || 'social-areas'}
                            onChange={(e) => handleSceneTypologyChange(s.id, e.target.value)}
                            className="bg-verona-bg border border-white/10 rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-verona-gold/40 cursor-none"
                          >
                            {Object.keys(typologiesState).map((key) => (
                              <option key={key} value={key}>
                                {typologiesState[key].label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Section: Global Categories Names */}
            <div className="flex flex-col gap-2">
              <h4 className="text-[9px] text-verona-gold uppercase tracking-extreme font-bold border-b border-verona-gold/15 pb-1">
                Nombres de Sectores
              </h4>
              <div className="flex flex-col gap-2">
                {Object.keys(categoriesState).map((key) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-[8px] text-text-secondary uppercase font-mono tracking-wider">
                      Sector: {key}
                    </label>
                    <input
                      type="text"
                      value={categoriesState[key].label}
                      onChange={(e) => handleCategoryLabelChange(key, e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-verona-gold/40 cursor-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating HUD Category Dropdown Selector */}
      <AnimatePresence>
        {!isEditMode && activeCategory && activeCategoryScenes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-24 left-1/2 z-35 w-72 max-w-[90vw] bg-[#071125]/90 backdrop-blur-lg border border-verona-gold/30 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 origin-bottom overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              {renderCategoryIcon(categoriesState[activeCategory].icon, "w-3.5 h-3.5 text-verona-gold/80")}
              <span className="font-sans text-[10px] uppercase tracking-extreme text-verona-gold font-bold">
                {categoriesState[activeCategory].label}
              </span>
            </div>
            
            <div className="h-[1px] bg-verona-gold/15 mb-1" />

            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar">
              {activeCategoryScenes.map((scene) => {
                const isCurrent = selectedPano.id === scene.id;
                return (
                  <button
                    key={scene.id}
                    onClick={() => handlePanoSelect(scene)}
                    className={`font-sans text-[11px] text-left px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-none flex items-center justify-between ${
                      isCurrent
                        ? 'border-verona-gold/30 text-verona-gold bg-verona-gold/5 font-semibold'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    <span>{scene.label}</span>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-verona-gold" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom HUD Sectors Bar (Sofa, Utensils, Bed, Home/Facade) */}
      {imageExists === true && !isEditMode && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-35 flex items-center bg-[#071125]/80 backdrop-blur-md px-6 py-3 border border-border-subtle rounded-full shadow-2xl shadow-black/60 select-none">
          <div className="flex gap-6 items-center font-sans">
            {(['exteriores', 'social', 'cocina', 'dormitorios'] as const).map((catKey) => {
              const cat = categoriesState[catKey];
              const isActive = activeCategory === catKey;
              const isSceneInThisCat = selectedPano.category === catKey;
              
              // Find scenes in this category belonging to the current active typology
              const catScenes = scenesState.filter(
                (s) => s.category === catKey && s.typology === activeTypology
              );
              const scenesCount = catScenes.length;
              const hasScenes = scenesCount > 0;

              const handleButtonClick = () => {
                if (scenesCount === 1) {
                  // Direct transition for single scene categories
                  handlePanoSelect(catScenes[0]);
                } else if (scenesCount > 1) {
                  // Toggle dropdown for multiple scene categories
                  handleCategoryIconClick(catKey);
                }
              };
              
              return (
                <button
                  key={catKey}
                  onClick={handleButtonClick}
                  disabled={!hasScenes}
                  className={`relative p-2.5 rounded-full transition-all duration-300 group ${
                    isActive
                      ? 'text-verona-gold scale-110 bg-verona-gold/10 cursor-none'
                      : !hasScenes
                      ? 'text-text-secondary/20 cursor-not-allowed opacity-20'
                      : isSceneInThisCat
                      ? 'text-text-primary hover:text-verona-gold bg-white/5 cursor-none'
                      : 'text-text-secondary hover:text-text-primary cursor-none'
                  }`}
                  aria-label={cat.label}
                >
                  {renderCategoryIcon(cat.icon, "w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-105")}
                  
                  {/* Subtle active category dot indicator */}
                  {isSceneInThisCat && !isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-verona-gold/60" />
                  )}
                  
                  {/* Tooltip on hover */}
                  {hasScenes && (
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[#071125] border border-border-subtle text-[8.5px] uppercase tracking-wider px-2 py-1 rounded font-sans text-text-secondary opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 shadow-lg whitespace-nowrap">
                      {cat.label}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Vertical Divider */}
            <div className="w-[1px] h-6 bg-white/10 self-center" />

            {/* Google Maps Location Button */}
            <div className="relative group/map flex items-center justify-center">
              <a
                href="https://www.google.com/maps/place/Italia+944,+B1712JZH+Castelar,+Provincia+de+Buenos+Aires/@-34.6497956,-58.6468091,174a,35y,282h/data=!3m1!1e3!4m6!3m5!1s0x95bcbf54bf42839b:0x9e3e3ea474920429!8m2!3d-34.6497333!4d-58.6469445!16s%2Fg%2F11ky7ld8xm?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full text-text-secondary hover:text-verona-gold bg-white/0 hover:bg-white/5 cursor-none flex items-center justify-center transition-all duration-300"
                aria-label="Ver ubicación en Google Maps"
              >
                <MapPin className="w-4.5 h-4.5 transition-transform duration-300 hover:scale-105" />
              </a>

              {/* Floating Miniature Window (Map Popup) */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-[#071125]/95 backdrop-blur-md border border-verona-gold/30 rounded-2xl shadow-2xl p-3.5 opacity-0 pointer-events-none group-hover/map:opacity-100 group-hover/map:pointer-events-auto transition-all duration-300 transform scale-95 origin-bottom translate-y-2 group-hover/map:translate-y-0 group-hover/map:scale-100 z-50 flex flex-col gap-2.5">
                {/* Map Header */}
                <div className="flex justify-between items-center text-[9px] uppercase font-mono tracking-wider text-verona-gold font-bold">
                  <span>Ubicación Verona</span>
                  <span className="text-text-secondary">Italia 944, Castelar</span>
                </div>
                
                {/* Google Maps iFrame Widget */}
                <div className="w-full h-32 rounded-lg overflow-hidden border border-white/10 relative bg-verona-bg select-none">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.721453303666!2d-58.64951942425838!3d-34.64972887293883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcbf54bf42839b%3A0x9e3e3ea474920429!2sItalia%20944%2C%20B1712JZH%20Castelar%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1717800000000!5m2!1ses-419!2sar"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  />
                </div>
                
                {/* Link Option */}
                <a
                  href="https://www.google.com/maps/place/Italia+944,+B1712JZH+Castelar,+Provincia+de+Buenos+Aires/@-34.6497956,-58.6468091,174a,35y,282h/data=!3m1!1e3!4m6!3m5!1s0x95bcbf54bf42839b:0x9e3e3ea474920429!8m2!3d-34.6497333!4d-58.6469445!16s%2Fg%2F11ky7ld8xm?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2 bg-verona-gold/15 hover:bg-verona-gold/25 text-verona-gold font-sans font-bold text-[9px] uppercase tracking-wider rounded-lg transition-all cursor-none border border-verona-gold/30"
                >
                  Abrir en Google Maps
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Full Screen Viewer Container */}
      <div 
        className="w-full h-full bg-[#050d1a] relative flex items-center justify-center overflow-hidden"
      >
        
        {/* Main Viewer Render Container */}
        {imageExists === true ? (
          <>
            <div id="pannellum-container" className="w-full h-full relative z-10" />
            
            {/* Smooth Transition Overlay Cover */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: viewerInitialized ? 0 : 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 bg-[#071125] z-20 flex flex-col items-center justify-center gap-3"
              style={{ pointerEvents: viewerInitialized ? 'none' : 'auto' }}
            >
              <Loader2 className="w-6 h-6 animate-spin text-verona-gold" />
              <span className="font-sans text-[10px] uppercase tracking-extreme text-verona-gold">
                Cargando espacio interactivo
              </span>
            </motion.div>
          </>
        ) : (
          // Placeholder Fallback
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 bg-[#050d1a]">
            <div className="w-16 h-16 rounded-full border border-verona-gold/10 flex items-center justify-center mb-6 relative">
              <Orbit className="w-6 h-6 text-verona-gold/40 animate-pulse" />
              <div className="absolute inset-0 border border-verona-gold/5 rounded-full animate-ping [animation-duration:3s]" />
            </div>
            <span className="font-sans text-[11px] tracking-extreme text-verona-gold/30 uppercase font-semibold mb-2">
              Experiencia Inmersiva 360°
            </span>
            <span className="font-sans text-xs tracking-widest text-text-secondary">
              Vista 360° próximamente
            </span>
          </div>
        )}

        {/* Bounding HUD Corner Indicators */}
        <div className="absolute top-4 left-4 w-4 h-[1px] bg-verona-gold/30 z-25" />
        <div className="absolute top-4 left-4 w-[1px] h-4 bg-verona-gold/30 z-25" />
        <div className="absolute top-4 right-4 w-4 h-[1px] bg-verona-gold/30 z-25" />
        <div className="absolute top-4 right-4 w-[1px] h-4 bg-verona-gold/30 z-25" />
        <div className="absolute bottom-4 left-4 w-4 h-[1px] bg-verona-gold/30 z-25" />
        <div className="absolute bottom-4 left-4 w-[1px] h-4 bg-verona-gold/30 z-25" />
        <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-verona-gold/30 z-25" />
        <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-verona-gold/30 z-25" />
      </div>
    </section>
  );
}
