/**
 * GuideFlow - Blazor Guided Tour JS Interop Module
 * API aligned with Driver.js
 */

// ============================================================
// Positioning Engine with Auto-Placement
// ============================================================

const PLACEMENTS = ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end',
                    'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'];

/**
 * Compute position of floating element relative to reference.
 * @param {HTMLElement} reference - Target element
 * @param {HTMLElement} floating - Popover element
 * @param {string} placement - Placement string (e.g., 'bottom-start')
 * @param {number} padding - Stage padding around target
 * @param {number} offset - Distance between popover and target (Driver.js: popoverOffset)
 */
function computePosition(reference, floating, placement, padding = 0, offset = 10) {
    const refRect = reference.getBoundingClientRect();
    const floatRect = floating.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    let x = 0, y = 0;

    // All coords are viewport-relative (for position:fixed)
    switch (placement) {
        case 'top':        x = refRect.left + refRect.width / 2 - floatRect.width / 2; y = refRect.top - floatRect.height - offset; break;
        case 'top-start':  x = refRect.left; y = refRect.top - floatRect.height - offset; break;
        case 'top-end':    x = refRect.right - floatRect.width; y = refRect.top - floatRect.height - offset; break;
        case 'bottom':     x = refRect.left + refRect.width / 2 - floatRect.width / 2; y = refRect.bottom + offset; break;
        case 'bottom-start': x = refRect.left; y = refRect.bottom + offset; break;
        case 'bottom-end': x = refRect.right - floatRect.width; y = refRect.bottom + offset; break;
        case 'left':       x = refRect.left - floatRect.width - offset; y = refRect.top + refRect.height / 2 - floatRect.height / 2; break;
        case 'left-start': x = refRect.left - floatRect.width - offset; y = refRect.top; break;
        case 'left-end':   x = refRect.left - floatRect.width - offset; y = refRect.bottom - floatRect.height; break;
        case 'right':      x = refRect.right + offset; y = refRect.top + refRect.height / 2 - floatRect.height / 2; break;
        case 'right-start': x = refRect.right + offset; y = refRect.top; break;
        case 'right-end':  x = refRect.right + offset; y = refRect.bottom - floatRect.height; break;
        case 'auto':
        default:
            if (refRect.bottom + offset + floatRect.height < viewport.height) {
                x = refRect.left + refRect.width / 2 - floatRect.width / 2;
                y = refRect.bottom + offset;
            } else if (refRect.top - offset - floatRect.height > 0) {
                x = refRect.left + refRect.width / 2 - floatRect.width / 2;
                y = refRect.top - floatRect.height - offset;
            } else if (refRect.right + offset + floatRect.width < viewport.width) {
                x = refRect.right + offset;
                y = refRect.top + refRect.height / 2 - floatRect.height / 2;
            } else {
                x = refRect.left - floatRect.width - offset;
                y = refRect.top + refRect.height / 2 - floatRect.height / 2;
            }
            break;
    }

    // Clamp to viewport
    x = Math.max(8, Math.min(x, viewport.width - floatRect.width - 8));
    y = Math.max(8, Math.min(y, viewport.height - floatRect.height - 8));

    return {
        x: Math.round(x), y: Math.round(y), placement,
        reference: { left: refRect.left, top: refRect.top, width: refRect.width, height: refRect.height },
    };
}

/**
 * Auto-flip: try preferred placement, if overflows try alternatives.
 * Returns { x, y, actualPlacement, reference }
 */
function computePositionWithFlip(reference, floating, preferredPlacement, padding = 0, offset = 10) {
    if (preferredPlacement === 'auto') {
        return { ...computePosition(reference, floating, 'auto', padding, offset), actualPlacement: 'auto' };
    }

    const refRect = reference.getBoundingClientRect();
    const floatRect = floating.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    // Check if preferred placement fits
    const fits = (pl) => {
        switch (pl) {
            case 'top': case 'top-start': case 'top-end':
                return refRect.top - offset - floatRect.height > 0;
            case 'bottom': case 'bottom-start': case 'bottom-end':
                return refRect.bottom + offset + floatRect.height < viewport.height;
            case 'left': case 'left-start': case 'left-end':
                return refRect.left - offset - floatRect.width > 0;
            case 'right': case 'right-start': case 'right-end':
                return refRect.right + offset + floatRect.width < viewport.width;
            default: return true;
        }
    };

    // Try preferred, then flip to opposite, then try others
    const flipMap = {
        'top': 'bottom', 'top-start': 'bottom-start', 'top-end': 'bottom-end',
        'bottom': 'top', 'bottom-start': 'top-start', 'bottom-end': 'top-end',
        'left': 'right', 'left-start': 'right-start', 'left-end': 'right-end',
        'right': 'left', 'right-start': 'left-start', 'right-end': 'left-end',
    };

    let actualPlacement = preferredPlacement;
    if (!fits(preferredPlacement)) {
        const flipped = flipMap[preferredPlacement];
        if (flipped && fits(flipped)) {
            actualPlacement = flipped;
        } else {
            // Try all placements
            for (const pl of PLACEMENTS) {
                if (fits(pl)) { actualPlacement = pl; break; }
            }
        }
    }

    const result = computePosition(reference, floating, actualPlacement, padding, offset);
    return { ...result, actualPlacement };
}

// ============================================================
// Auto-Update (Responsive Reposition)
// ============================================================

const _autoUpdateCleanups = new Map();

/**
 * Start auto-updating position on resize/scroll.
 * @param {string} selector - CSS selector for target
 * @param {HTMLElement} stepElement - Popover element
 * @param {string} placement - Preferred placement
 * @param {number} padding - Stage padding
 * @param {number} offset - Popover offset (Driver.js: popoverOffset)
 * @param {object} dotNetRef - Blazor .NET reference
 */
export function startAutoUpdate(selector, stepElement, placement, padding, offset, dotNetRef) {
    const step = resolveElement(stepElement);
    if (!step) return;
    const key = selector + step.getAttribute('data-gf-step-id');
    stopAutoUpdate(selector, step);

    let rafId = null;
    const reposition = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            rafId = null;
            const target = document.querySelector(selector);
            if (!target || !step.isConnected) return;

            const { x, y, reference, actualPlacement } = computePositionWithFlip(target, step, placement, padding, offset);
            step.style.left = `${x}px`;
            step.style.top = `${y}px`;
            updateArrow(step, target, actualPlacement || placement);

            if (dotNetRef) {
                // reference already has document coords from computePositionWithFlip
                dotNetRef.invokeMethodAsync('OnReposition',
                    reference.left, reference.top,
                    reference.width, reference.height);
            }
        });
    };

    window.addEventListener('resize', reposition, { passive: true });
    document.addEventListener('scroll', reposition, { passive: true });

    _autoUpdateCleanups.set(key, () => {
        window.removeEventListener('resize', reposition);
        document.removeEventListener('scroll', reposition);
        if (rafId) cancelAnimationFrame(rafId);
    });
}

export function stopAutoUpdate(selector, stepElement) {
    const step = resolveElement(stepElement);
    if (!step) return;
    const key = selector + (step.getAttribute('data-gf-step-id') || '');
    const cleanup = _autoUpdateCleanups.get(key);
    if (cleanup) { cleanup(); _autoUpdateCleanups.delete(key); }
}

// ============================================================
// Position Step (with auto-flip)
// ============================================================

/**
 * Position a step popover relative to its target.
 * @param {string} selector - CSS selector for target
 * @param {HTMLElement} stepElement - Popover element
 * @param {string} placement - Preferred placement
 * @param {number} padding - Stage padding
 * @param {number} offset - Popover offset (Driver.js: popoverOffset)
 * @param {boolean} smoothScroll - Whether to smooth scroll
 */
export function positionStep(selector, stepElement, placement, padding, offset, smoothScroll) {
    const step = resolveElement(stepElement);
    const target = document.querySelector(selector);
    if (!target) throw new Error(`GuideFlow: Target element not found: "${selector}"`);
    if (!step) throw new Error('GuideFlow: Step element not resolved');

    if (smoothScroll) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }

    return new Promise((resolve) => {
        const doPosition = () => {
            const { x, y, reference, actualPlacement } = computePositionWithFlip(target, step, placement, padding, offset);
            step.style.left = `${x}px`;
            step.style.top = `${y}px`;
            updateArrow(step, target, actualPlacement || placement);

            resolve({
                targetLeft: reference.left,
                targetTop: reference.top,
                targetWidth: reference.width,
                targetHeight: reference.height,
                actualPlacement: actualPlacement || placement,
            });
        };

        requestAnimationFrame(() => {
            step.style.visibility = 'hidden';
            step.style.display = 'block';
            requestAnimationFrame(() => {
                doPosition();
                step.style.visibility = '';
            });
        });
    });
}

/**
 * Position step with explicit scroll behavior config.
 * @param {string} selector - CSS selector for target
 * @param {HTMLElement} stepElement - Popover element
 * @param {string} placement - Preferred placement
 * @param {number} padding - Stage padding
 * @param {number} offset - Popover offset (Driver.js: popoverOffset)
 * @param {string} scrollBehavior - 'smooth' | 'instant' | 'none'
 * @param {string} scrollBlock - 'center' | 'start' | 'end' | 'nearest'
 */
export function positionStepWithScrollConfig(selector, stepElement, placement, padding, offset, scrollBehavior, scrollBlock) {
    const step = resolveElement(stepElement);
    const target = document.querySelector(selector);
    if (!target) throw new Error(`GuideFlow: Target element not found: "${selector}"`);
    if (!step) throw new Error('GuideFlow: Step element not resolved');

    if (scrollBehavior !== 'none') {
        target.scrollIntoView({
            behavior: scrollBehavior || 'smooth',
            block: scrollBlock || 'center',
            inline: 'nearest'
        });
    }

    return new Promise((resolve) => {
        const doPosition = () => {
            const { x, y, reference, actualPlacement } = computePositionWithFlip(target, step, placement, padding, offset);
            step.style.left = `${x}px`;
            step.style.top = `${y}px`;
            updateArrow(step, target, actualPlacement || placement);

            resolve({
                targetLeft: reference.left,
                targetTop: reference.top,
                targetWidth: reference.width,
                targetHeight: reference.height,
                actualPlacement: actualPlacement || placement,
            });
        };

        requestAnimationFrame(() => {
            step.style.visibility = 'hidden';
            step.style.display = 'block';
            requestAnimationFrame(() => {
                doPosition();
                step.style.visibility = '';
            });
        });
    });
}

function updateArrow(stepElement, target, placement) {
    const step = resolveElement(stepElement);
    if (!step) return;
    const arrow = step.querySelector('.gf-arrow');
    if (!arrow) return;

    const stepRect = step.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    // Remove old placement classes
    arrow.className = arrow.className.replace(/gf-arrow--\S+/g, '');
    arrow.classList.add('gf-arrow', `gf-arrow--${placement}`);

    arrow.style.left = '';
    arrow.style.top = '';

    const isVertical = placement.startsWith('top') || placement.startsWith('bottom');

    if (isVertical) {
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const arrowX = targetCenterX - stepRect.left;
        arrow.style.left = `${Math.max(16, Math.min(arrowX, stepRect.width - 16))}px`;
    } else {
        const targetCenterY = targetRect.top + targetRect.height / 2;
        const arrowY = targetCenterY - stepRect.top;
        arrow.style.top = `${Math.max(16, Math.min(arrowY, stepRect.height - 16))}px`;
    }
}

// ============================================================
// Stage Mode Overlay
// ============================================================

const _stageOverlays = new Map();

/**
 * Create 4 overlay panels around the target element (stage mode).
 */
export function createStageOverlay(selector, zIndex, opacity, borderRadius, padding, dotNetRef) {
    removeStageOverlay(selector);

    const target = document.querySelector(selector);
    if (!target) return;

    const update = () => {
        const rect = target.getBoundingClientRect();
        const vp = { w: window.innerWidth, h: window.innerHeight };

        removeStagePanels(selector);

        const baseStyle = `position:fixed;z-index:${zIndex};background:rgba(0,0,0,${opacity});pointer-events:auto;`;
        const panels = [];

        // Top panel
        const top = document.createElement('div');
        top.className = 'gf-stage-panel gf-stage-top';
        top.style.cssText = `${baseStyle}left:0;top:0;width:100%;height:${Math.max(0, rect.top - padding)}px;`;
        panels.push(top);

        // Bottom panel
        const bottom = document.createElement('div');
        bottom.className = 'gf-stage-panel gf-stage-bottom';
        bottom.style.cssText = `${baseStyle}left:0;top:${rect.bottom + padding}px;width:100%;height:${Math.max(0, vp.h - rect.bottom - padding)}px;`;
        panels.push(bottom);

        // Left panel
        const left = document.createElement('div');
        left.className = 'gf-stage-panel gf-stage-left';
        left.style.cssText = `${baseStyle}left:0;top:${Math.max(0, rect.top - padding)}px;width:${Math.max(0, rect.left - padding)}px;height:${rect.height + padding * 2}px;`;
        panels.push(left);

        // Right panel
        const right = document.createElement('div');
        right.className = 'gf-stage-panel gf-stage-right';
        right.style.cssText = `${baseStyle}left:${rect.right + padding}px;top:${Math.max(0, rect.top - padding)}px;width:${Math.max(0, vp.w - rect.right - padding)}px;height:${rect.height + padding * 2}px;`;
        panels.push(right);

        panels.forEach(p => {
            p.addEventListener('click', (e) => {
                if (dotNetRef) dotNetRef.invokeMethodAsync('OnOverlayClick');
            });
            document.body.appendChild(p);
        });

        _stageOverlays.set(selector, panels);
    };

    update();

    // Auto-update on resize/scroll
    const handler = () => requestAnimationFrame(update);
    window.addEventListener('resize', handler, { passive: true });
    document.addEventListener('scroll', handler, { passive: true });

    const existing = _stageOverlays.get('__handler_' + selector);
    if (existing) existing();
    _stageOverlays.set('__handler_' + selector, () => {
        window.removeEventListener('resize', handler);
        document.removeEventListener('scroll', handler);
    });
}

function removeStagePanels(selector) {
    document.querySelectorAll('.gf-stage-panel').forEach(p => p.remove());
}

export function removeStageOverlay(selector) {
    removeStagePanels(selector);
    const handlerCleanup = _stageOverlays.get('__handler_' + selector);
    if (handlerCleanup) { handlerCleanup(); _stageOverlays.delete('__handler_' + selector); }
    _stageOverlays.delete(selector);
}

// ============================================================
// Overlay Click-Through
// ============================================================

const _passthroughElements = new Map();

export function enableClickThrough(selector, zIndex) {
    disableClickThrough(selector);
    const target = document.querySelector(selector);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const passthrough = document.createElement('div');
    passthrough.className = 'gf-click-through';
    passthrough.style.cssText = `
        position:fixed;left:${rect.left}px;top:${rect.top}px;
        width:${rect.width}px;height:${rect.height}px;
        z-index:${zIndex};pointer-events:auto;cursor:pointer;
    `;

    passthrough.addEventListener('click', (e) => {
        e.stopPropagation();
        target.click();
        const evt = new MouseEvent('click', { bubbles: true, cancelable: true, clientX: e.clientX, clientY: e.clientY });
        target.dispatchEvent(evt);
    });

    document.body.appendChild(passthrough);
    _passthroughElements.set(selector, passthrough);
}

export function disableClickThrough(selector) {
    const el = _passthroughElements.get(selector);
    if (el) { el.remove(); _passthroughElements.delete(selector); }
}

export function disableAllClickThrough() {
    for (const [, el] of _passthroughElements) el.remove();
    _passthroughElements.clear();
}

// ============================================================
// Highlight Styles
// ============================================================

export function addHighlightClass(selector, className) {
    const target = document.querySelector(selector);
    if (target) target.classList.add(className || 'gf-highlight-active');
}

export function removeHighlightClass(selector, className) {
    const target = document.querySelector(selector);
    if (target) target.classList.remove(className || 'gf-highlight-active');
}

// ============================================================
// Keyboard Navigation & Focus Trapping
// ============================================================

let _activeKeyHandler = null;

/**
 * Resolve a Blazor ElementReference to an actual DOM element.
 */
function resolveElement(el) {
    if (!el) return null;
    if (el instanceof HTMLElement) return el;
    if (el.element) return el.element;
    if (typeof el === 'string') return document.querySelector(el);
    return null;
}

export function setupStep(stepElement, dotNetRef, trapFocus) {
    cleanupStep();
    const el = resolveElement(stepElement);
    if (el && typeof el.focus === 'function') {
        el.focus();
    }

    _activeKeyHandler = (e) => {
        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                dotNetRef.invokeMethodAsync('OnEscapePressed');
                break;
            case 'ArrowRight':
            case 'Enter':
                if (document.activeElement?.tagName !== 'BUTTON') {
                    e.preventDefault();
                    dotNetRef.invokeMethodAsync('OnKeyboardNext');
                }
                break;
            case 'ArrowLeft':
                if (document.activeElement?.tagName !== 'BUTTON') {
                    e.preventDefault();
                    dotNetRef.invokeMethodAsync('OnKeyboardBack');
                }
                break;
        }
    };

    document.addEventListener('keydown', _activeKeyHandler);

    if (trapFocus && el) createFocusTrap(el);
}

function createFocusTrap(container) {
    const handler = (e) => {
        if (e.key !== 'Tab') return;
        const focusable = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) { e.preventDefault(); return; }
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    };
    container.addEventListener('keydown', handler);
}

function cleanupStep() {
    if (_activeKeyHandler) {
        document.removeEventListener('keydown', _activeKeyHandler);
        _activeKeyHandler = null;
    }
}

// ============================================================
// Destroy / Cleanup
// ============================================================

export function destroy() {
    cleanupStep();
    disableAllClickThrough();

    for (const [key, cleanup] of _autoUpdateCleanups) cleanup();
    _autoUpdateCleanups.clear();

    // Clean up stage overlays
    for (const [key, val] of _stageOverlays) {
        if (typeof val === 'function') val(); // handler cleanup
        else if (Array.isArray(val)) val.forEach(p => p.remove());
    }
    _stageOverlays.clear();

    document.querySelectorAll('.gf-highlight-active').forEach(el => {
        el.classList.remove('gf-highlight-active');
    });
}

// ============================================================
// Single Element Highlight (Driver.js-style)
// ============================================================

export function highlightElement(selector, zIndex, opacity, padding, radius) {
    const target = document.querySelector(selector);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const overlay = document.createElement('div');
    overlay.className = 'gf-single-highlight-overlay';
    overlay.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        z-index:${zIndex};background:rgba(0,0,0,${opacity});
        pointer-events:none;
    `;

    // SVG mask with cutout
    const l = rect.left + window.scrollX - padding;
    const t = rect.top + window.scrollY - padding;
    const w = rect.width + padding * 2;
    const h = rect.height + padding * 2;
    const svgMask = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cmask id='cutout'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3Crect x='${l}px' y='${t}px' width='${w}px' height='${h}px' rx='${radius}px' fill='black'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='black' mask='url(%23cutout)'/%3E%3C/svg%3E")`;
    overlay.style.maskImage = svgMask;
    overlay.style.webkitMaskImage = svgMask;
    overlay.style.maskSize = '100% 100%';
    overlay.style.webkitMaskSize = '100% 100%';

    document.body.appendChild(overlay);

    // Click overlay to dismiss
    overlay.style.pointerEvents = 'auto';
    overlay.addEventListener('click', () => {
        overlay.remove();
    }, { once: true });

    return overlay;
}

// ============================================================
// Utility
// ============================================================

export function scrollToElement(selector, behavior = 'smooth') {
    const element = document.querySelector(selector);
    if (element) element.scrollIntoView({ behavior, block: 'center', inline: 'nearest' });
}

export function getElementRect(selector) {
    const el = document.querySelector(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
}

// ============================================================
// Data Attributes Scan
// ============================================================

/**
 * Scan DOM for elements with [data-gf-step] and return step definitions.
 */
export function scanDataSteps() {
    const elements = document.querySelectorAll('[data-gf-step]');
    const steps = [];

    elements.forEach(el => {
        const stepNum = parseInt(el.getAttribute('data-gf-step'), 10);
        if (isNaN(stepNum)) return;

        steps.push({
            step: stepNum,
            selector: el.getAttribute('data-gf-selector') || `[data-gf-step="${stepNum}"]`,
            title: el.getAttribute('data-gf-title') || '',
            text: el.getAttribute('data-gf-text') || null,
            placement: el.getAttribute('data-gf-placement') || 'bottom',
        });
    });

    steps.sort((a, b) => a.step - b.step);
    return steps;
}

// ============================================================
// Body Classes (Driver.js: .driver-active, .driver-fade, .driver-simple)
// ============================================================

export function addBodyClass(className) {
    document.body.classList.add(className);
}

export function removeBodyClass(className) {
    document.body.classList.remove(className);
}
