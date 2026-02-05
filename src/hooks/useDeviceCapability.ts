import { useState, useEffect } from 'react';

interface DeviceCapability {
    canUse3D: boolean;
    isMobile: boolean;
    isTouch: boolean;
    prefersReducedMotion: boolean;
    performanceTier: 'high' | 'medium' | 'low';
}

/**
 * Hook to detect device capabilities for adaptive rendering
 * - High-end devices: Full 3D, custom cursor, all animations
 * - Medium devices: 2D fallback, reduced animations
 * - Low-end devices: Basic animations only
 */
export function useDeviceCapability(): DeviceCapability {
    const [capability, setCapability] = useState<DeviceCapability>({
        canUse3D: true,
        isMobile: false,
        isTouch: false,
        prefersReducedMotion: false,
        performanceTier: 'medium',
    });

    useEffect(() => {
        // Check WebGL support
        const checkWebGL = (): boolean => {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                return !!gl;
            } catch {
                return false;
            }
        };

        // Check if mobile device
        const checkMobile = (): boolean => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) || window.innerWidth < 768;
        };

        // Check touch capability
        const checkTouch = (): boolean => {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        };

        // Check reduced motion preference
        const checkReducedMotion = (): boolean => {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        };

        // Determine performance tier
        const getPerformanceTier = (): 'high' | 'medium' | 'low' => {
            // Check hardware concurrency (CPU cores)
            const cores = navigator.hardwareConcurrency || 4;

            // Check device memory (if available)
            const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;

            // Check if mobile
            const isMobile = checkMobile();

            // High-end: Desktop with good specs or high-end mobile
            if (!isMobile && cores >= 4 && memory >= 4) {
                return 'high';
            }

            // Low-end: Old mobile or limited specs
            if (isMobile && (cores < 4 || memory < 4)) {
                return 'low';
            }

            // Medium: Everything else
            return 'medium';
        };

        const isMobile = checkMobile();
        const prefersReducedMotion = checkReducedMotion();
        const performanceTier = getPerformanceTier();
        const webGLSupported = checkWebGL();

        // Can use 3D only if WebGL supported, not reduced motion, and high/medium performance
        const canUse3D = webGLSupported &&
            !prefersReducedMotion &&
            performanceTier !== 'low';

        setCapability({
            canUse3D,
            isMobile,
            isTouch: checkTouch(),
            prefersReducedMotion,
            performanceTier,
        });

        // Listen for reduced motion changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = (e: MediaQueryListEvent) => {
            setCapability(prev => ({
                ...prev,
                prefersReducedMotion: e.matches,
                canUse3D: webGLSupported && !e.matches && performanceTier !== 'low',
            }));
        };

        mediaQuery.addEventListener('change', handleChange);
        console.log(capability)
        return () => mediaQuery.removeEventListener('change', handleChange);


    }, []);

    return capability;
}

export default useDeviceCapability;
