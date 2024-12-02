/**
 * @typedef {import('./selection.js').default} RectangularSelection
 */

import { Node, move_node, stop_picking } from './graph.js'

const canvas = /** @type {HTMLDivElement} */ (document.querySelector('.canvas'));
const selection = /** @type {RectangularSelection} */ (document.createElement('rectangular-selection'));

canvas.append(selection)
selection.hidden = true

canvas.addEventListener('mouseup', async () => selection.mouseup())
canvas.addEventListener('mousedown', async e => selection.mousedown(e))
canvas.addEventListener('mousemove', async e => selection.mousemove(e))

canvas.addEventListener('mouseup', stop_picking)

canvas.addEventListener('mousemove', async e => {
	if (!graph.pick)
		return

	const node = /** @type {Node} */ (graph.map.get(graph.pick))
	move_node(node, e)
})

const a = new Node(canvas, 10)
const b = new Node(canvas, 5)
const c = new Node(canvas, 15)
a.connect(b)
b.connect(c)
a.connect(c)
