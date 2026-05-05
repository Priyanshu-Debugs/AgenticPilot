"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref">;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points[];
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();

    const getSize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      return { width, height };
    };

    const { width, height } = getSize();
    const camera = new THREE.PerspectiveCamera(54, width / height, 1, 5000);
    camera.position.set(0, 150, 860);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const ringGeometry = new THREE.BufferGeometry();
    const ambientGeometry = new THREE.BufferGeometry();

    const createDotTexture = () => {
      const canvas = document.createElement("canvas");
      const size = 64;
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) return null;

      const center = size / 2;
      const radius = size * 0.32;
      context.clearRect(0, 0, size, size);

      const gradient = context.createRadialGradient(
        center,
        center,
        radius * 0.2,
        center,
        center,
        radius,
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(center, center, radius, 0, Math.PI * 2);
      context.fill();

      return canvas;
    };

    const dotCanvas = createDotTexture();
    const dotTexture = dotCanvas ? new THREE.CanvasTexture(dotCanvas) : null;
    if (dotTexture) {
      dotTexture.minFilter = THREE.LinearFilter;
      dotTexture.magFilter = THREE.LinearFilter;
      dotTexture.generateMipmaps = false;
    }

    const ringPointCount = 2200;
    const ambientPointCount = 1100;
    const ringPositions = new Float32Array(ringPointCount * 3);
    const ringColors = new Float32Array(ringPointCount * 3);
    const ambientPositions = new Float32Array(ambientPointCount * 3);
    const ambientColors = new Float32Array(ambientPointCount * 3);

    const span = Math.min(width, height);
    const innerRadius = span * 0.24;
    const outerRadius = span * 1.08;

    for (let i = 0; i < ringPointCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = THREE.MathUtils.lerp(
        innerRadius,
        outerRadius,
        Math.pow(Math.random(), 0.86),
      );
      const radialJitter = (Math.random() - 0.5) * 24;
      const x = Math.cos(angle) * (radius + radialJitter);
      const z = Math.sin(angle) * (radius + radialJitter);
      const y = (Math.random() - 0.5) * 42;

      ringPositions[i * 3] = x;
      ringPositions[i * 3 + 1] = y;
      ringPositions[i * 3 + 2] = z;

      const shade = 0.76 + Math.random() * 0.24;
      ringColors[i * 3] = shade;
      ringColors[i * 3 + 1] = shade;
      ringColors[i * 3 + 2] = shade;
    }

    const ambientSpreadX = width * 1.5;
    const ambientSpreadZ = height * 1.45;
    for (let i = 0; i < ambientPointCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * ambientSpreadX;
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * ambientSpreadZ;

      const tint = 0.45 + Math.random() * 0.35;
      ambientColors[i * 3] = tint;
      ambientColors[i * 3 + 1] = tint;
      ambientColors[i * 3 + 2] = tint;
    }

    ringGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(ringPositions, 3),
    );
    ringGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(ringColors, 3),
    );
    ambientGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(ambientPositions, 3),
    );
    ambientGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(ambientColors, 3),
    );

    const ringMaterial = new THREE.PointsMaterial({
      size: 5.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
      map: dotTexture || undefined,
      alphaTest: 0.05,
    });
    const ambientMaterial = new THREE.PointsMaterial({
      size: 3.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      depthWrite: false,
      map: dotTexture || undefined,
      alphaTest: 0.05,
    });

    const ringPoints = new THREE.Points(ringGeometry, ringMaterial);
    const ambientPoints = new THREE.Points(ambientGeometry, ambientMaterial);
    scene.add(ringPoints);
    scene.add(ambientPoints);

    const clock = new THREE.Clock();
    let animationId = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      ringPoints.rotation.y = elapsed * 0.035;
      ringPoints.rotation.x = Math.sin(elapsed * 0.25) * 0.07;
      ambientPoints.rotation.y = -elapsed * 0.012;
      ambientPoints.rotation.x = Math.cos(elapsed * 0.18) * 0.02;

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const { width: nextWidth, height: nextHeight } = getSize();
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles: [ringPoints, ambientPoints],
      animationId,
    };

    return () => {
      window.removeEventListener("resize", handleResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((currentMaterial) => currentMaterial.dispose());
            } else {
              object.material.dispose();
            }
          }
        });

        sceneRef.current.renderer.dispose();

        if (sceneRef.current.renderer.domElement.parentElement === container) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      {...props}
    />
  );
}
