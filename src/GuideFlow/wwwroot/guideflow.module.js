/**
 * GuideFlow - Blazor Guided Tour JS Interop Module
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
 * @param {number} offset - Distance between popover and target
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
 * @param {number} offset - Popover offset
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
            step.style.right = 'auto';
            step.style.left = `${x}px`;
            step.style.top = `${y}px`;
            updateArrow(step, target, actualPlacement || placement);

            // Re-sync the fixed overlay cutout/stage panels to the target's new position,
            // otherwise the highlight stays frozen on screen and "drifts" away on scroll.
            repositionOverlay();

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
 * @param {number} offset - Popover offset
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
            step.style.right = 'auto';
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
 * @param {number} offset - Popover offset
 * @param {string} scrollBehavior - 'smooth' | 'instant' | 'none'
 * @param {string} scrollBlock - 'center' | 'start' | 'end' | 'nearest'
 */
export function positionStepWithScrollConfig(selector, stepElement, placement, padding, offset, scrollBehavior, scrollBlock) {
    const step = resolveElement(stepElement);
    const target = document.querySelector(selector);
    if (!target) throw new Error(`GuideFlow: Target element not found: "${selector}"`);
    if (!step) throw new Error('GuideFlow: Step element not resolved');

    // Scroll to the correct block position (always instant for reliable positioning)
    if (scrollBehavior !== 'none') {
        target.scrollIntoView({ behavior: 'instant', block: scrollBlock || 'center', inline: 'nearest' });
    }

    return new Promise((resolve) => {
        const doPosition = () => {
            const { x, y, reference, actualPlacement } = computePositionWithFlip(target, step, placement, padding, offset);
            step.style.right = 'auto';
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

    // Reset all inline positioning so CSS defaults can apply
    arrow.style.left = '';
    arrow.style.right = '';
    arrow.style.top = '';
    arrow.style.bottom = '';

    const isVertical = placement.startsWith('top') || placement.startsWith('bottom');

    if (isVertical) {
        // Horizontal position depends on start/end variant
        if (placement.endsWith('-start')) {
            // Point at target's start (left) edge
            arrow.style.left = `${Math.max(16, Math.min(targetRect.left - stepRect.left + 4, stepRect.width - 16))}px`;
        } else if (placement.endsWith('-end')) {
            // Point at target's end (right) edge
            arrow.style.left = 'auto';
            arrow.style.right = `${Math.max(16, Math.min(stepRect.right - targetRect.right + 4, stepRect.width - 16))}px`;
        } else {
            // Center: point at target center
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const arrowX = targetCenterX - stepRect.left;
            arrow.style.left = `${Math.max(16, Math.min(arrowX, stepRect.width - 16))}px`;
        }
    } else {
        // Vertical position depends on start/end variant
        if (placement.endsWith('-start')) {
            // Point at target's start (top) edge
            arrow.style.top = `${Math.max(16, Math.min(targetRect.top - stepRect.top + 4, stepRect.height - 16))}px`;
        } else if (placement.endsWith('-end')) {
            // Point at target's end (bottom) edge
            arrow.style.top = 'auto';
            arrow.style.bottom = `${Math.max(16, Math.min(stepRect.bottom - targetRect.bottom + 4, stepRect.height - 16))}px`;
        } else {
            // Center: point at target center
            const targetCenterY = targetRect.top + targetRect.height / 2;
            const arrowY = targetCenterY - stepRect.top;
            arrow.style.top = `${Math.max(16, Math.min(arrowY, stepRect.height - 16))}px`;
        }
    }
}

// ============================================================
// Animated Overlay
// ============================================================

const SVG_NS = 'http://www.w3.org/2000/svg';
let _overlaySvg = null;
let _overlayCutoutEl = null;
let _overlayShape = 'RoundedRect';
let _overlayDotNetRef = null;
let _overlayAnimFrame = null;
// Last cutout target config, so scroll/resize can re-sync the fixed overlay to the moving target.
let _overlayTargetConfig = null;

// Stage panels (4 divs around cutout)
let _stagePanels = [];
let _stageHandler = null;

/**
 * Create the persistent SVG overlay with animated cutout.
 * Called once when the tour starts; animateCutoutTo() moves the cutout.
 */
export function createOverlay(zIndex, opacity, dotNetRef, color) {
    removeOverlay();
    _overlayDotNetRef = dotNetRef;

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'gf-overlay');
    svg.setAttribute('xmlns', SVG_NS);
    svg.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;z-index:${zIndex};`;

    // Defs + mask
    const defs = document.createElementNS(SVG_NS, 'defs');
    const mask = document.createElementNS(SVG_NS, 'mask');
    mask.setAttribute('id', 'gf-cutout');

    // White = fully visible overlay
    const maskBg = document.createElementNS(SVG_NS, 'rect');
    maskBg.setAttribute('width', '100%');
    maskBg.setAttribute('height', '100%');
    maskBg.setAttribute('fill', 'white');

    // Black = transparent cutout hole
    const cutoutRect = document.createElementNS(SVG_NS, 'rect');
    cutoutRect.setAttribute('x', '0');
    cutoutRect.setAttribute('y', '0');
    cutoutRect.setAttribute('width', '0');
    cutoutRect.setAttribute('height', '0');
    cutoutRect.setAttribute('rx', '0');
    cutoutRect.setAttribute('fill', 'black');

    mask.appendChild(maskBg);
    mask.appendChild(cutoutRect);
    defs.appendChild(mask);
    svg.appendChild(defs);

    // Semi-transparent overlay rect with mask applied
    const overlayRect = document.createElementNS(SVG_NS, 'rect');
    overlayRect.setAttribute('width', '100%');
    overlayRect.setAttribute('height', '100%');
    const overlayColor = color || `rgba(0,0,0,${opacity})`;
    overlayRect.setAttribute('fill', overlayColor);
    overlayRect.setAttribute('mask', 'url(#gf-cutout)');
    svg.appendChild(overlayRect);

    // Transparent full-viewport rect to capture clicks everywhere,
    // including the cutout area where the mask makes the overlay invisible.
    const clickCatcher = document.createElementNS(SVG_NS, 'rect');
    clickCatcher.setAttribute('width', '100%');
    clickCatcher.setAttribute('height', '100%');
    clickCatcher.setAttribute('fill', 'transparent');
    clickCatcher.setAttribute('pointer-events', 'all');
    svg.appendChild(clickCatcher);

    // Click handler directly on the click catcher for reliable event capture
    clickCatcher.addEventListener('click', (e) => {
        if (_overlayDotNetRef) _overlayDotNetRef.invokeMethodAsync('OnOverlayClick');
    });

    document.body.appendChild(svg);
    _overlaySvg = svg;
    _overlayCutoutEl = cutoutRect;
    _overlayShape = 'RoundedRect';
}

/**
 * Ensure the mask cutout element matches the requested shape.
 * Swaps <rect> ↔ <ellipse> in the SVG mask when the shape changes.
 */
function ensureCutoutElement(shape) {
    if (shape === _overlayShape && _overlayCutoutEl) return;
    _overlayShape = shape;
    const mask = _overlaySvg?.querySelector('#gf-cutout');
    if (!mask) return;
    if (_overlayCutoutEl) _overlayCutoutEl.remove();

    if (shape === 'Circle' || shape === 'Ellipse') {
        const el = document.createElementNS(SVG_NS, 'ellipse');
        el.setAttribute('fill', 'black');
        mask.appendChild(el);
        _overlayCutoutEl = el;
    } else {
        const el = document.createElementNS(SVG_NS, 'rect');
        el.setAttribute('fill', 'black');
        mask.appendChild(el);
        _overlayCutoutEl = el;
    }
}

/**
 * Read the current bounding box from the cutout element (rect or ellipse).
 * Returns { x, y, w, h, r } where r is the rect rx or 0 for ellipses.
 */
function readCutoutBounds() {
    const el = _overlayCutoutEl;
    if (!el) return { x: 0, y: 0, w: 0, h: 0, r: 0 };
    const tag = el.tagName;
    if (tag === 'ellipse') {
        const cx = parseFloat(el.getAttribute('cx')) || 0;
        const cy = parseFloat(el.getAttribute('cy')) || 0;
        const rx = parseFloat(el.getAttribute('rx')) || 0;
        const ry = parseFloat(el.getAttribute('ry')) || 0;
        return { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2, r: 0 };
    }
    return {
        x: parseFloat(el.getAttribute('x')) || 0,
        y: parseFloat(el.getAttribute('y')) || 0,
        w: parseFloat(el.getAttribute('width')) || 0,
        h: parseFloat(el.getAttribute('height')) || 0,
        r: parseFloat(el.getAttribute('rx')) || 0,
    };
}

/**
 * Animate the cutout to a new target element.
 * Uses requestAnimationFrame with easeInOutCubic.
 *
 * @param {string} selector - CSS selector for target
 * @param {number} padding - Padding around target
 * @param {number} radius - Border radius
 * @param {number} duration - Animation duration in ms (0 = instant)
 * @param {boolean} stageMode - Also create/update 4 stage panels
 * @param {number} stageOpacity - Background opacity for stage panels
 * @param {string} shape - HighlightShape: 'RoundedRect', 'Rectangle', 'Circle', 'Ellipse'
 */
export function animateCutoutTo(selector, padding, radius, duration, stageMode, stageOpacity, shape) {
    if (!_overlaySvg) return;

    const target = document.querySelector(selector);
    if (!target) return;

    // Swap mask element if shape changed
    ensureCutoutElement(shape || 'RoundedRect');

    if (!_overlayCutoutEl) return;

    // Remember this target so scroll/resize can re-sync the fixed overlay to the moving element.
    _overlayTargetConfig = { selector, padding, radius, stageMode, stageOpacity, shape: shape || 'RoundedRect' };

    const targetRect = target.getBoundingClientRect();
    const toRect = {
        x: targetRect.left - padding,
        y: targetRect.top - padding,
        w: targetRect.width + padding * 2,
        h: targetRect.height + padding * 2,
        r: radius,
    };

    // Cancel any in-flight animation
    if (_overlayAnimFrame) {
        cancelAnimationFrame(_overlayAnimFrame);
        _overlayAnimFrame = null;
    }

    const fromRect = readCutoutBounds();

    // First cutout (w=0) or no animation requested → jump instantly
    if (duration <= 0 || fromRect.w === 0) {
        applyCutoutShape(toRect);
        if (stageMode) createStagePanels(toRect, stageOpacity);
        return;
    }

    // Animate with requestAnimationFrame + easing
    const startTime = performance.now();
    function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const e = easeInOutCubic(t);

        const current = {
            x: fromRect.x + (toRect.x - fromRect.x) * e,
            y: fromRect.y + (toRect.y - fromRect.y) * e,
            w: fromRect.w + (toRect.w - fromRect.w) * e,
            h: fromRect.h + (toRect.h - fromRect.h) * e,
            r: fromRect.r + (toRect.r - fromRect.r) * e,
        };
        applyCutoutShape(current);
        if (stageMode) createStagePanels(current, stageOpacity);

        if (t < 1) {
            _overlayAnimFrame = requestAnimationFrame(step);
        } else {
            _overlayAnimFrame = null;
        }
    }
    _overlayAnimFrame = requestAnimationFrame(step);
}

/**
 * Re-sync the overlay cutout (and stage panels) to the current target position.
 * Called on scroll/resize so the fixed overlay follows the moving target instead of
 * leaving a stale "ghost" highlight frozen on screen. Always instant (no animation).
 */
export function repositionOverlay() {
    if (!_overlayCutoutEl || !_overlayTargetConfig) return;

    const { selector, padding, radius, stageMode, stageOpacity, shape } = _overlayTargetConfig;
    const target = document.querySelector(selector);
    if (!target) return;

    // Ensure correct shape element
    if (shape) ensureCutoutElement(shape);

    // Cancel any in-flight step-transition animation so it doesn't fight the scroll sync.
    if (_overlayAnimFrame) {
        cancelAnimationFrame(_overlayAnimFrame);
        _overlayAnimFrame = null;
    }

    const targetRect = target.getBoundingClientRect();
    const toRect = {
        x: targetRect.left - padding,
        y: targetRect.top - padding,
        w: targetRect.width + padding * 2,
        h: targetRect.height + padding * 2,
        r: radius,
    };
    applyCutoutShape(toRect);
    if (stageMode) createStagePanels(toRect, stageOpacity);
}

function applyCutoutShape(r) {
    if (!_overlayCutoutEl) return;
    const shape = _overlayShape;
    if (shape === 'Circle') {
        const radius = Math.max(r.w, r.h) / 2;
        _overlayCutoutEl.setAttribute('cx', r.x + r.w / 2);
        _overlayCutoutEl.setAttribute('cy', r.y + r.h / 2);
        _overlayCutoutEl.setAttribute('rx', radius);
        _overlayCutoutEl.setAttribute('ry', radius);
    } else if (shape === 'Ellipse') {
        _overlayCutoutEl.setAttribute('cx', r.x + r.w / 2);
        _overlayCutoutEl.setAttribute('cy', r.y + r.h / 2);
        _overlayCutoutEl.setAttribute('rx', r.w / 2);
        _overlayCutoutEl.setAttribute('ry', r.h / 2);
    } else {
        // RoundedRect or Rectangle
        _overlayCutoutEl.setAttribute('x', r.x);
        _overlayCutoutEl.setAttribute('y', r.y);
        _overlayCutoutEl.setAttribute('width', Math.max(0, r.w));
        _overlayCutoutEl.setAttribute('height', Math.max(0, r.h));
        _overlayCutoutEl.setAttribute('rx', shape === 'Rectangle' ? 0 : r.r);
    }
}

// easeInOutCubic
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Create 4 stage panels around the cutout rect (animated together with cutout).
 */
function createStagePanels(cutout, opacity) {
    // Remove old panels
    _stagePanels.forEach(p => p.remove());
    _stagePanels = [];

    const vp = { w: window.innerWidth, h: window.innerHeight };
    const baseStyle = `position:fixed;background:rgba(0,0,0,${opacity});pointer-events:auto;`;

    // Top
    const top = document.createElement('div');
    top.className = 'gf-stage-panel';
    top.style.cssText = `${baseStyle}left:0;top:0;width:100%;height:${Math.max(0, cutout.y)}px;`;
    _stagePanels.push(top);

    // Bottom
    const bottom = document.createElement('div');
    bottom.className = 'gf-stage-panel';
    bottom.style.cssText = `${baseStyle}left:0;top:${cutout.y + cutout.h}px;width:100%;height:${Math.max(0, vp.h - cutout.y - cutout.h)}px;`;
    _stagePanels.push(bottom);

    // Left
    const left = document.createElement('div');
    left.className = 'gf-stage-panel';
    left.style.cssText = `${baseStyle}left:0;top:${Math.max(0, cutout.y)}px;width:${Math.max(0, cutout.x)}px;height:${cutout.h}px;`;
    _stagePanels.push(left);

    // Right
    const right = document.createElement('div');
    right.className = 'gf-stage-panel';
    right.style.cssText = `${baseStyle}left:${cutout.x + cutout.w}px;top:${Math.max(0, cutout.y)}px;width:${Math.max(0, vp.w - cutout.x - cutout.w)}px;height:${cutout.h}px;`;
    _stagePanels.push(right);

    _stagePanels.forEach(p => {
        p.style.zIndex = _overlaySvg ? (parseInt(_overlaySvg.style.zIndex) || 10000) - 1 : 9999;
        p.addEventListener('click', () => {
            if (_overlayDotNetRef) _overlayDotNetRef.invokeMethodAsync('OnOverlayClick');
        });
        document.body.appendChild(p);
    });
}

/**
 * Check whether the overlay SVG is currently active.
 */
export function overlayExists() {
    return !!_overlaySvg;
}

/**
 * Remove the overlay and all stage panels.
 */
export function removeOverlay() {
    if (_overlayAnimFrame) {
        cancelAnimationFrame(_overlayAnimFrame);
        _overlayAnimFrame = null;
    }
    if (_overlaySvg) {
        _overlaySvg.remove();
        _overlaySvg = null;
        _overlayCutoutEl = null;
    }
    _overlayDotNetRef = null;
    _overlayTargetConfig = null;
    _overlayShape = 'RoundedRect';
    removeStagePanels();
}

function removeStagePanels() {
    _stagePanels.forEach(p => p.remove());
    _stagePanels = [];
}

// Legacy aliases for backward compatibility
export function createStageOverlay(selector, zIndex, opacity, borderRadius, padding, dotNetRef, color) {
    createOverlay(zIndex, opacity, dotNetRef, color);
    animateCutoutTo(selector, padding, borderRadius, 0, true, opacity, 'RoundedRect');
}

export function removeStageOverlay(selector) {
    removeOverlay();
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
            case 'ArrowDown':
            case 'Enter':
                if (document.activeElement?.tagName !== 'BUTTON') {
                    e.preventDefault();
                    dotNetRef.invokeMethodAsync('OnKeyboardNext');
                }
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
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
    removeOverlay();

    for (const [key, cleanup] of _autoUpdateCleanups) cleanup();
    _autoUpdateCleanups.clear();

    document.querySelectorAll('.gf-highlight-active').forEach(el => {
        el.classList.remove('gf-highlight-active');
    });
}

// ============================================================
// Single Element Highlight
// ============================================================

export function highlightElement(selector, zIndex, opacity, padding, radius, color) {
    const target = document.querySelector(selector);
    if (!target) return;

    // Use the same animated overlay system
    createOverlay(zIndex, opacity, null, color);
    animateCutoutTo(selector, padding, radius, 0, false, 0, 'RoundedRect');

    // Click overlay to dismiss
    if (_overlaySvg) {
        _overlaySvg.addEventListener('click', () => {
            removeOverlay();
        }, { once: true });
    }

    return _overlaySvg;
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
// Body Classes
// ============================================================

export function addBodyClass(className) {
    document.body.classList.add(className);
}

export function removeBodyClass(className) {
    document.body.classList.remove(className);
}
