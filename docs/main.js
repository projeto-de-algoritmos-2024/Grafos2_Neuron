import { RectangularSelection } from './selection.js';
import { Node, move_node, stop_picking } from './graph.js'

const canvas = /** @type {HTMLDivElement} */ (document.querySelector('.canvas'));
const selection = new RectangularSelection(canvas)

selection.hidden = true

canvas.addEventListener('click', async () => selection.click())
canvas.addEventListener('mouseup', async e => selection.mouseup(e))
canvas.addEventListener('mousedown', async e => selection.mousedown(e))
canvas.addEventListener('mousemove', async e => selection.mousemove(e))

canvas.addEventListener('mouseup', stop_picking)

canvas.addEventListener('mousemove', async e => {
	if (!graph.pick)
		return

	const node = /** @type {Node} */ (graph.map.get(graph.pick))
	move_node(node, e)
})

const a = new Node(canvas, 10, 400, 400)
const b = new Node(canvas, 5, 500, 100)
const c = new Node(canvas, 15, 250, 500)
a.connect(b)
b.connect(c)
a.connect(c)
