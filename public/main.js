/**
 * @typedef {import('./selection.js').default} RectangularSelection
 */

import { Node, stop_picking } from './graph.js'

const canvas = /** @type {HTMLDivElement} */ (document.querySelector('.canvas'));
const selection = /** @type {RectangularSelection} */ (document.createElement('rectangular-selection'));

canvas.append(selection)
selection.hidden = true

canvas.addEventListener('mouseup', () => selection.mouseup())
canvas.addEventListener('mousedown', e => selection.mousedown(e))
canvas.addEventListener('mousemove', e => selection.mousemove(e))

canvas.addEventListener('mouseup', stop_picking )

canvas.append(new Node())
canvas.append(new Node())
