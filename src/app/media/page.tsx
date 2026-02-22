'use client';

import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type TabKey = 'PRESS' | 'MEDIA';
type CoverType = 'press' | 'media';

type CoverItem = {
  id: string;
  title: string;
  date: string;
  type: CoverType;
  img: string;
  imageAlt: string;
};

type GlobeController = {
  fadeOut: (duration?: number) => Promise<void>;
  fadeIn: (duration?: number) => Promise<void>;
  pause: () => void;
  resume: () => void;
  resetSelection: () => void;
  updateContent: (items: CoverItem[]) => Promise<void>;
  dispose: () => void;
};

const LOOP_SET_COUNT = 3;
const PRESS_ITEM_COUNT = 120;
const PRESS_GLOBE_RADIUS = 1.25;
const PRESS_TILE_HEIGHT = 0.2;
const PRESS_TILE_WIDTH = (9 / 11) * PRESS_TILE_HEIGHT;
const CAMERA_DISTANCE = 3;
const PRESS_INTERACTION_DELAY_MS = 900;

const FALLBACK_MEDIA_ITEMS: CoverItem[] = [
  {
    id: 'media-1',
    title: 'Represented by KOL Managament / KOLAB Asia',
    date: '',
    type: 'media',
    img: '/assets/images/becky_hero.webp',
    imageAlt: 'Represented by KOL Management / KOLAB Asia',
  },
  {
    id: 'media-2',
    title: "First Muse of Harper's BAZAAR Thailand",
    date: '',
    type: 'media',
    img: '/assets/images/artist_hero.jpg',
    imageAlt: "First Muse of Harper's BAZAAR Thailand",
  },
  {
    id: 'media-3',
    title: "L'Oreal Paris Ambassador",
    date: '',
    type: 'media',
    img: '/assets/images/filmography_hero.jpg',
    imageAlt: "L'Oreal Paris Ambassador",
  },
  {
    id: 'media-4',
    title: 'collaborations',
    date: '',
    type: 'media',
    img: '/assets/images/becky_hero.webp',
    imageAlt: 'Collaborations',
  },
  {
    id: 'media-5',
    title: 'CHANEL House Ambassador',
    date: '',
    type: 'media',
    img: '/assets/images/artist_hero.jpg',
    imageAlt: 'CHANEL House Ambassador',
  },
];

const FALLBACK_PRESS_ITEMS: CoverItem[] = [
  {
    id: 'press-fallback-1',
    title: 'PRESS',
    date: '',
    type: 'press',
    img: '/assets/images/becky_hero.webp',
    imageAlt: 'Press cover',
  },
  {
    id: 'press-fallback-2',
    title: 'PRESS',
    date: '',
    type: 'press',
    img: '/assets/images/artist_hero.jpg',
    imageAlt: 'Press cover',
  },
  {
    id: 'press-fallback-3',
    title: 'PRESS',
    date: '',
    type: 'press',
    img: '/assets/images/filmography_hero.jpg',
    imageAlt: 'Press cover',
  },
];

const textureCache = new Map<string, THREE.Texture>();

function normalizeCover(raw: {
  _id?: string;
  title?: string;
  date?: string;
  type?: string;
  image?: string;
  imageAlt?: string;
}): CoverItem | null {
  if (!raw.image || (raw.type !== 'press' && raw.type !== 'media')) {
    return null;
  }

  return {
    id: raw._id || `${raw.type}-${raw.image}`,
    title: raw.title || '',
    date: raw.date || '',
    type: raw.type,
    img: raw.image,
    imageAlt: raw.imageAlt || raw.title || '',
  };
}

async function fetchCovers(signal: AbortSignal): Promise<CoverItem[]> {
  const response = await fetch('/api/media/covers', { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch covers. Status ${response.status}`);
  }

  const payload = (await response.json()) as {
    result?: Array<{
      _id?: string;
      title?: string;
      date?: string;
      type?: string;
      image?: string;
      imageAlt?: string;
    }>;
  };

  return (payload.result || [])
    .map(normalizeCover)
    .filter((item): item is CoverItem => item !== null);
}

function fitTextureToFrame(texture: THREE.Texture, targetWidth: number, targetHeight: number) {
  const image = texture.image as { width?: number; height?: number } | undefined;
  if (!image?.width || !image?.height) {
    return;
  }

  const imageAspect = image.width / image.height;
  const targetAspect = targetWidth / targetHeight;

  let repeatX = 1;
  let repeatY = 1;
  let offsetX = 0;
  let offsetY = 0;

  if (imageAspect > targetAspect) {
    repeatX = targetAspect / imageAspect;
    offsetX = (1 - repeatX) / 2;
  } else {
    repeatY = imageAspect / targetAspect;
    offsetY = (1 - repeatY) / 2;
  }

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.offset.set(offsetX, offsetY);
}

async function loadTextures(
  renderer: THREE.WebGLRenderer,
  loader: THREE.TextureLoader,
  items: CoverItem[],
): Promise<THREE.Texture[]> {
  const textures = await Promise.all(
    items.map(
      (item) =>
        new Promise<THREE.Texture>((resolve) => {
          if (textureCache.has(item.img)) {
            resolve(textureCache.get(item.img)!);
            return;
          }

          loader.load(
            item.img,
            (texture) => {
              fitTextureToFrame(texture, PRESS_TILE_WIDTH, PRESS_TILE_HEIGHT);
              texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
              texture.generateMipmaps = true;
              texture.minFilter = THREE.LinearMipmapLinearFilter;
              texture.magFilter = THREE.LinearFilter;
              texture.colorSpace = THREE.SRGBColorSpace;
              textureCache.set(item.img, texture);
              resolve(texture);
            },
            undefined,
            () => {
              const fallback = new THREE.Texture();
              resolve(fallback);
            },
          );
        }),
    ),
  );

  return textures;
}

async function createPressGlobe(
  container: HTMLElement,
  sourceItems: CoverItem[],
  onCoverSelect: (item: CoverItem | null) => void,
): Promise<GlobeController> {
  const items = sourceItems.length > 0 ? sourceItems : FALLBACK_PRESS_ITEMS;
  const renderer = new THREE.WebGLRenderer({
    powerPreference: 'high-performance',
    antialias: false,
    alpha: true,
    stencil: false,
    depth: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.classList.add('globe-canvas');
  container.append(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.01,
    1000,
  );
  camera.position.set(0, 0, CAMERA_DISTANCE);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;
  controls.rotateSpeed = 0.3;
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 0.1;
  controls.maxDistance = 4;

  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);

  const tileGeometry = new THREE.PlaneGeometry(PRESS_TILE_WIDTH, PRESS_TILE_HEIGHT);
  const textureLoader = new THREE.TextureLoader();
  let tileMeshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
  let selectedTile: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null;
  let cameraMotion: gsap.core.Timeline | null = null;
  let opacityMotion: gsap.core.Timeline | null = null;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const initialCameraPosition = camera.position.clone();
  const initialTarget = controls.target.clone();

  const clearTiles = () => {
    for (const tile of tileMeshes) {
      group.remove(tile);
      tile.material.dispose();
    }
    tileMeshes = [];
  };

  const createTiles = async (content: CoverItem[]) => {
    clearTiles();
    const textures = await loadTextures(renderer, textureLoader, content);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < PRESS_ITEM_COUNT; index += 1) {
      const theta = goldenAngle * index;
      const y = 1 - (2 * (index + 0.5)) / PRESS_ITEM_COUNT;
      const radial = Math.sqrt(1 - y * y);
      const x = Math.cos(theta) * radial * PRESS_GLOBE_RADIUS;
      const z = Math.sin(theta) * radial * PRESS_GLOBE_RADIUS;
      const tileContentIndex = index % content.length;
      const material = new THREE.MeshBasicMaterial({
        map: textures[tileContentIndex],
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const tile = new THREE.Mesh(tileGeometry, material);
      tile.position.set(x, y * PRESS_GLOBE_RADIUS, z);
      tile.lookAt(new THREE.Vector3(2 * x, 2 * y * PRESS_GLOBE_RADIUS, 2 * z));
      tile.scale.set(0, 0, 0);
      tile.userData.content = content[tileContentIndex];
      group.add(tile);
      tileMeshes.push(tile);
    }
  };

  const animateTileOpacity = (
    activeTile: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null,
    inactiveOpacity: number,
    duration: number,
  ) => {
    opacityMotion?.kill();
    const opacityState = tileMeshes.map((tile) => ({ opacity: tile.material.opacity }));
    opacityMotion = gsap.timeline({
      onUpdate: () => {
        tileMeshes.forEach((tile, index) => {
          tile.material.opacity = opacityState[index].opacity;
        });
      },
      onComplete: () => {
        opacityMotion = null;
      },
    });
    tileMeshes.forEach((tile, index) => {
      const targetOpacity = activeTile && tile !== activeTile ? inactiveOpacity : 1;
      opacityMotion!.to(
        opacityState[index],
        {
          opacity: targetOpacity,
          duration,
          ease: 'power3.inOut',
        },
        0,
      );
    });
  };

  const moveCamera = (position: THREE.Vector3, target: THREE.Vector3, duration = 1.3) => {
    cameraMotion?.kill();
    const cameraState = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const targetState = { x: controls.target.x, y: controls.target.y, z: controls.target.z };
    cameraMotion = gsap.timeline({
      onUpdate: () => {
        camera.position.set(cameraState.x, cameraState.y, cameraState.z);
        controls.target.set(targetState.x, targetState.y, targetState.z);
        controls.update();
      },
      onComplete: () => {
        cameraMotion = null;
      },
    });
    cameraMotion.to(
      cameraState,
      {
        x: position.x,
        y: position.y,
        z: position.z,
        duration,
        ease: 'power3.inOut',
      },
      0,
    );
    cameraMotion.to(
      targetState,
      {
        x: target.x,
        y: target.y,
        z: target.z,
        duration,
        ease: 'power3.inOut',
      },
      0,
    );
  };

  const focusOnTile = (tile: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>) => {
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(tile.quaternion).normalize();
    if (normal.length() < 0.1) {
      normal.copy(tile.position).normalize();
    }

    const focusOffset = window.matchMedia('(max-width: 1024px)').matches ? 0.4 : 0.5;
    const focusedPosition = tile.position.clone().add(normal.multiplyScalar(focusOffset));
    controls.autoRotate = false;
    moveCamera(focusedPosition, tile.position, 1.3);
    animateTileOpacity(tile, 0.1, 1.3);
    selectedTile = tile;
    onCoverSelect((tile.userData.content as CoverItem | undefined) ?? null);
  };

  const resetFocus = () => {
    controls.autoRotate = true;
    moveCamera(initialCameraPosition, initialTarget, 1.3);
    animateTileOpacity(null, 1, 0.5);
    selectedTile = null;
    onCoverSelect(null);
  };

  const onClick = (event: MouseEvent) => {
    if (!canInteract) {
      return;
    }

    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObjects(tileMeshes, false);
    if (intersections.length === 0) {
      if (selectedTile) {
        resetFocus();
      }
      return;
    }

    const clickedTile = intersections[0].object as THREE.Mesh<
      THREE.PlaneGeometry,
      THREE.MeshBasicMaterial
    >;
    if (selectedTile === clickedTile) {
      resetFocus();
      return;
    }

    focusOnTile(clickedTile);
  };

  const playEntranceAnimation = () => {
    tileMeshes.forEach((tile, index) => {
      gsap.to(tile.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.2,
        delay: 0.01 * index,
        ease: 'power2.out',
      });
      gsap.to(tile.material, {
        opacity: 1,
        duration: 0.8,
        delay: 0.01 * index,
        ease: 'power2.inOut',
      });
    });
  };

  const onResize = () => {
    if (!container.clientWidth || !container.clientHeight) {
      return;
    }
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  let frameId = 0;
  let paused = false;
  let disposed = false;
  let canInteract = false;
  const interactionTimer = window.setTimeout(() => {
    canInteract = true;
  }, PRESS_INTERACTION_DELAY_MS);

  const renderLoop = () => {
    if (disposed || paused) {
      return;
    }
    controls.update();
    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(renderLoop);
  };

  await createTiles(items);
  playEntranceAnimation();
  renderer.domElement.addEventListener('click', onClick);
  window.addEventListener('resize', onResize);
  renderLoop();

  return {
    fadeOut(duration = 0.8) {
      return new Promise<void>((resolve) => {
        if (tileMeshes.length === 0) {
          resolve();
          return;
        }
        tileMeshes.forEach((tile, index) => {
          gsap.to(tile.material, {
            opacity: 0,
            duration,
            delay: 0.005 * index,
            ease: 'power2.inOut',
            onComplete: index === tileMeshes.length - 1 ? resolve : undefined,
          });
        });
      });
    },
    fadeIn(duration = 0.8) {
      return new Promise<void>((resolve) => {
        if (tileMeshes.length === 0) {
          resolve();
          return;
        }
        tileMeshes.forEach((tile) => {
          tile.material.opacity = 0;
        });
        tileMeshes.forEach((tile, index) => {
          gsap.to(tile.material, {
            opacity: 1,
            duration,
            delay: 0.01 * index,
            ease: 'power2.inOut',
            onComplete: index === tileMeshes.length - 1 ? resolve : undefined,
          });
        });
      });
    },
    pause() {
      paused = true;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    },
    resume() {
      if (disposed || !paused) {
        return;
      }
      paused = false;
      renderLoop();
    },
    resetSelection() {
      if (selectedTile) {
        resetFocus();
        return;
      }
      onCoverSelect(null);
    },
    async updateContent(nextItems: CoverItem[]) {
      const updateItems = nextItems.length > 0 ? nextItems : FALLBACK_PRESS_ITEMS;
      await createTiles(updateItems);
      selectedTile = null;
      onCoverSelect(null);
      playEntranceAnimation();
    },
    dispose() {
      disposed = true;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(interactionTimer);
      controls.dispose();
      cameraMotion?.kill();
      opacityMotion?.kill();
      clearTiles();
      tileGeometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

function animateTextContent(
  titleRef: RefObject<HTMLHeadingElement | null>,
  dateRef: RefObject<HTMLHeadingElement | null>,
  setText: Dispatch<SetStateAction<{ title: string; date: string }>>,
  item: CoverItem | null,
) {
  const targets = [titleRef.current, dateRef.current].filter(
    (element): element is HTMLHeadingElement => Boolean(element),
  );

  if (targets.length === 0) {
    setText({
      title: item?.title || '',
      date: item?.date || '',
    });
    return;
  }

  gsap.to(targets, {
    opacity: 0,
    filter: 'blur(10px)',
    duration: 0.6,
    ease: 'power2.in',
    onComplete: () => {
      setText({
        title: item?.title || '',
        date: item?.date || '',
      });
      gsap.to(targets, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
      });
    },
  });
}

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('PRESS');
  const [sliderActive, setSliderActive] = useState(false);
  const [pressItems, setPressItems] = useState<CoverItem[]>(FALLBACK_PRESS_ITEMS);
  const [mediaItems, setMediaItems] = useState<CoverItem[]>(FALLBACK_MEDIA_ITEMS);
  const [content, setContent] = useState<{ title: string; date: string }>({
    title: '',
    date: '',
  });

  const globeContainerRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const contentTitleRef = useRef<HTMLHeadingElement>(null);
  const contentDateRef = useRef<HTMLHeadingElement>(null);
  const globeControllerRef = useRef<GlobeController | null>(null);
  const transitionInFlightRef = useRef(false);

  const sliderItems = useMemo(
    () => (mediaItems.length > 0 ? Array(LOOP_SET_COUNT).fill(mediaItems).flat() : []),
    [mediaItems],
  );

  const handleCoverSelect = useCallback(
    (item: CoverItem | null) => {
      animateTextContent(contentTitleRef, contentDateRef, setContent, item);
    },
    [setContent],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCovers(controller.signal)
      .then((covers) => {
        const press = covers.filter((cover) => cover.type === 'press');
        const media = covers.filter((cover) => cover.type === 'media');
        if (press.length > 0) {
          setPressItems(press);
        }
        if (media.length > 0) {
          setMediaItems(media);
        }
      })
      .catch(() => {
        // Fallback data keeps the page functional when Sanity is unavailable.
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const container = globeContainerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;
    if (!globeControllerRef.current) {
      createPressGlobe(container, pressItems, handleCoverSelect)
        .then((controller) => {
          if (cancelled) {
            controller.dispose();
            return;
          }
          globeControllerRef.current = controller;
        })
        .catch(() => {
          // Keep page interactive if WebGL is unavailable.
        });
    } else {
      void globeControllerRef.current.updateContent(pressItems);
    }

    return () => {
      cancelled = true;
    };
  }, [pressItems, handleCoverSelect]);

  useEffect(() => {
    return () => {
      globeControllerRef.current?.dispose();
      globeControllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || mediaItems.length === 0) {
      return;
    }

    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let inertiaFrame: number | null = null;

    const readX = (event: MouseEvent | TouchEvent) =>
      event instanceof MouseEvent ? event.pageX : event.touches[0]?.pageX ?? 0;

    const getLoopWidth = () => {
      const slides = Array.from(slider.querySelectorAll<HTMLElement>('.media-slide'));
      if (slides.length === 0) {
        return 0;
      }

      const gap = Number.parseFloat(window.getComputedStyle(slider).gap || '0') || 0;
      let width = 0;
      for (let index = 0; index < mediaItems.length; index += 1) {
        if (!slides[index]) {
          continue;
        }
        width += slides[index].getBoundingClientRect().width + gap;
      }

      return width;
    };

    const wrapScroll = () => {
      const loopWidth = getLoopWidth();
      if (!loopWidth) {
        return;
      }

      const scrollLeft = slider.scrollLeft;
      if (scrollLeft >= loopWidth * 2) {
        slider.scrollLeft = scrollLeft - loopWidth;
      } else if (scrollLeft <= 0) {
        slider.scrollLeft = scrollLeft + loopWidth;
      }
    };

    const setInitialScroll = () => {
      const loopWidth = getLoopWidth();
      if (loopWidth > 0) {
        slider.scrollLeft = loopWidth;
      } else {
        window.requestAnimationFrame(setInitialScroll);
      }
    };

    const stopInertia = () => {
      if (inertiaFrame) {
        window.cancelAnimationFrame(inertiaFrame);
        inertiaFrame = null;
      }
    };

    const applyInertia = () => {
      if (Math.abs(velocity) < 0.01) {
        velocity = 0;
        inertiaFrame = null;
        return;
      }

      velocity *= 0.95;
      slider.scrollLeft -= velocity * 16;
      wrapScroll();
      inertiaFrame = window.requestAnimationFrame(applyInertia);
    };

    const onDragStart = (event: MouseEvent | TouchEvent) => {
      dragging = true;
      startX = readX(event);
      startScrollLeft = slider.scrollLeft;
      velocity = 0;
      lastX = startX;
      lastTime = Date.now();
      stopInertia();
      slider.style.cursor = 'grabbing';
      slider.style.userSelect = 'none';
    };

    const onDragMove = (event: MouseEvent | TouchEvent) => {
      if (!dragging) {
        return;
      }
      if (event.cancelable) {
        event.preventDefault();
      }

      const currentX = readX(event);
      const dragDistance = (currentX - startX) * 1.5;
      slider.scrollLeft = startScrollLeft - dragDistance;

      const now = Date.now();
      const deltaTime = now - lastTime;
      if (deltaTime > 0) {
        velocity = (currentX - lastX) / deltaTime;
      }
      lastX = currentX;
      lastTime = now;
    };

    const onDragEnd = () => {
      if (!dragging) {
        return;
      }

      dragging = false;
      slider.style.cursor = 'grab';
      slider.style.removeProperty('user-select');
      applyInertia();
    };

    slider.addEventListener('scroll', wrapScroll, { passive: true });
    slider.addEventListener('mousedown', onDragStart);
    slider.addEventListener('touchstart', onDragStart, { passive: true });
    window.addEventListener('resize', setInitialScroll);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
    window.requestAnimationFrame(setInitialScroll);

    return () => {
      stopInertia();
      slider.removeEventListener('scroll', wrapScroll);
      slider.removeEventListener('mousedown', onDragStart);
      slider.removeEventListener('touchstart', onDragStart);
      window.removeEventListener('resize', setInitialScroll);
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchmove', onDragMove);
      document.removeEventListener('touchend', onDragEnd);
    };
  }, [mediaItems]);

  const showMedia = useCallback(async () => {
    if (transitionInFlightRef.current || activeTab === 'MEDIA') {
      return;
    }

    transitionInFlightRef.current = true;
    setActiveTab('MEDIA');
    setSliderActive(true);

    const controller = globeControllerRef.current;
    if (controller) {
      await controller.fadeOut(0.8);
      controller.pause();
    }

    if (sliderContainerRef.current) {
      await new Promise<void>((resolve) => {
        gsap.fromTo(
          sliderContainerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.inOut', onComplete: resolve },
        );
      });
    }

    transitionInFlightRef.current = false;
  }, [activeTab]);

  const showPress = useCallback(async () => {
    if (transitionInFlightRef.current || activeTab === 'PRESS') {
      return;
    }

    transitionInFlightRef.current = true;
    setActiveTab('PRESS');

    if (sliderContainerRef.current) {
      await new Promise<void>((resolve) => {
        gsap.to(sliderContainerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: resolve,
        });
      });
    }
    setSliderActive(false);

    const controller = globeControllerRef.current;
    if (controller) {
      controller.resetSelection();
      controller.resume();
      await controller.fadeIn(0.8);
    }

    transitionInFlightRef.current = false;
  }, [activeTab]);

  return (
    <main className="media-page">
      <section>
        <div ref={globeContainerRef} className="globe-container" aria-hidden="true" />

        <div
          ref={sliderContainerRef}
          className={`slider-overlay ${sliderActive ? 'active' : ''}`}
          aria-hidden={!sliderActive}
        >
          <div className="media-slider-container">
            <div ref={sliderRef} className="media-slider">
              {sliderItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="media-slide">
                  <div className="media-slide-image-wrapper">
                    <img
                      src={item.img}
                      alt={item.imageAlt || item.title}
                      className="media-slide-image"
                      draggable={false}
                    />
                  </div>
                  <div className="media-slide-content">
                    <h3 className="media-slide-title">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Media section navigation" className="toggle-container">
        <button
          type="button"
          className={`toggle-btn font-alfabet text-base ${activeTab === 'PRESS' ? 'isActive' : ''}`}
          aria-current={activeTab === 'PRESS' ? 'page' : undefined}
          aria-label="Show Press releases"
          onClick={showPress}
        >
          PRESS
        </button>
        <button
          type="button"
          className={`toggle-btn text-base w-max ${activeTab === 'MEDIA' ? 'isActive' : ''}`}
          aria-current={activeTab === 'MEDIA' ? 'page' : undefined}
          aria-label="Show Media coverage"
          onClick={showMedia}
        >
          MEDIA
        </button>
      </nav>

      <div
        className="content fixed z-10 mix-blend-difference lg:top-1/2 top-[78%] md:top-[85%] lg:left-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 max-md:w-full text-center md:text-left flex flex-col items-center md:items-start justify-center"
        style={{ opacity: activeTab === 'MEDIA' ? 0 : 1 }}
      >
        <h1
          ref={contentTitleRef}
          className="content-title font-termina-black uppercase lg:text-4xl text-2xl leading-none w-fit text-white"
        >
          {content.title}
        </h1>
        <h2
          ref={contentDateRef}
          className="content-date lg:text-2xl text-lg font-alfabet uppercase w-full text-white"
        >
          {content.date}
        </h2>
      </div>
    </main>
  );
}
