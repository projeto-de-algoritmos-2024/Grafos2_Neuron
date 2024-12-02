/**
 * @type {'random' | 'pencil' | 'eraser' | 'prim'}
 */
globalThis.mode = 'pencil'

import { RectangularSelection } from './selection.js';
import { Node, move_node, stop_picking } from './graph.js'

const canvas = /** @type {HTMLDivElement} */ (document.querySelector('.canvas'));
const selection = new RectangularSelection(canvas)

selection.hidden = true

canvas.addEventListener('click', async () => {
	if (mode === 'pencil')
		selection.click()
})
canvas.addEventListener('mouseup', async e => {
	if (mode === 'pencil')
		selection.mouseup(e)
})
canvas.addEventListener('mousedown', async e => {
	if (mode === 'pencil')
		selection.mousedown(e)
})
canvas.addEventListener('mousemove', async e => {
	if (mode === 'pencil')
		selection.mousemove(e)
})

canvas.addEventListener('mouseup', stop_picking)

canvas.addEventListener('mousemove', async e => {
	if (!graph.pick || mode !== 'pencil')
		return

	const node = /** @type {Node} */ (graph.vertices.get(graph.pick))
	move_node(node, e)
})

const eraser = /** @type {HTMLDivElement} */ (document.querySelector('.eraser'))
eraser.addEventListener('click', () => {
	window.mode = 'eraser'
})

const pencil = /** @type {HTMLDivElement} */ (document.querySelector('.pencil'))
pencil.addEventListener('click', () => {
	window.mode = 'pencil'
})

const prim = /** @type {HTMLDivElement} */ (document.querySelector('.prim'))
prim.addEventListener('click', () => {
	window.mode = 'prim'
})
