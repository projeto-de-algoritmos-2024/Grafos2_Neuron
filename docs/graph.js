import { prim } from './prim.js'

/**
 * Graph information.
 * @global
 * */
globalThis.graph = {
	pick: 0,
	ids: 0,
	/**
	 * @type {Map<Number, Node>}
	 */
	vertices: new Map(),
}

/**
 * @param {Number} x 
 */
function edge_smooth_size (x)
{
	const min = 1
	const max = Math.max(0, x - 55)
	const exp = Math.exp(-0.1 * (x - 50))
	return min + 5 / (1 + exp) + 0.5 * Math.log(1 + max)
}

/**
 * @param {Number} a 
 * @param {Number} b 
 */
export function find_edge (a, b)
{
	const min = Math.min(a, b)
	const max = Math.max(a, b)

	const edge = document.querySelector(`#edge-${min}-to-${max}`);
	if (edge instanceof Edge)
		return edge

	return undefined
}

export class Edge extends HTMLElement {
	/**
	 * @param {HTMLElement} canvas Where the node will be renderized.
	 * @param {Node} first
	 * @param {Node} second
	 */
	constructor(canvas, first, second) {
		super()
		this.first = first
		this.second = second
		this.size = first.size + second.size
		this.id = `edge-${Math.min(first.vertice, second.vertice)}-to-${Math.max(first.vertice, second.vertice)}`

		const height = Math.round(edge_smooth_size(this.size))
		this.style.height = `${height}px`

		first.addEventListener('mousemove', () => this.update())
		second.addEventListener('mousemove', () => this.update())

		this.label = document.createElement('span')
		this.label.textContent = `${this.size}`

		canvas.append(this, this.label)

		first.edges.set(second.vertice, this.size)
		second.edges.set(first.vertice, this.size)

		this.update()
	}

	/**
	 * Update how the edge is renderized in the graph.
	 */
	async update() {
		/*
		 * Calculate position
		 */
		const rect1 = this.first.getBoundingClientRect()
		const rect2 = this.second.getBoundingClientRect()

		const center_x1 = rect1.x + rect1.width / 2
		const center_y1 = rect1.y + rect1.height / 2
		const center_x2 = rect2.x + rect2.width / 2
		const center_y2 = rect2.y + rect2.height / 2

		/*
		 * Calculate angle.
		 */
		const angle = Math.atan2(center_y2 - center_y1, center_x2 - center_x1);
		this.style.transform = `rotate(${angle}rad)`
		this.label.style.transform = `rotate(${0}rad)`

		const radius1 = rect1.width / 2;
		const radius2 = rect2.width / 2;

		const dx = center_x2 - center_x1;
		const dy = center_y2 - center_y1;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance <= radius1 + radius2) {
			this.style.display = 'none';
			this.label.style.display = 'none';
			return;
		}

		this.style.display = 'block';
		this.label.style.display = 'block';

		const x1 = center_x1 + radius1 * Math.cos(angle);
		const y1 = center_y1 + radius1 * Math.sin(angle);
		const x2 = center_x2 - radius2 * Math.cos(angle);
		const y2 = center_y2 - radius2 * Math.sin(angle);

		this.style.left = `${x1}px`
		this.style.top = `${y1}px`

		this.label.style.left = `${(x1 + x2) / 2}px`
		this.label.style.top = `${(y1 + y2) / 2}px`


		/*
		 * Calculate width
		 */
		const width = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
		this.style.width = `${width}px`
	}
}

/**
 * @param {Number} id ID of the node.
 * @returns {Promise<Node | undefined>}
 */
export async function find_node (id) {
	const picken = document.querySelector(`#node-${id}`)
	if (picken instanceof Node)
		return picken;
	return undefined;
}

export async function stop_picking () {
	const picken = await find_node(graph.pick)
	if (picken)
		picken.style.zIndex = '3'
	graph.pick = 0
}

/**
 * @param {Node} node
 * @param {MouseEvent} e 
 */
export async function move_node(node, e) {
	if (graph.pick !== node.vertice)
		return;

	const x = e.clientX - node.clientWidth / 2
	const y = e.clientY - node.clientHeight / 2
	node.style.left = `${x}px`
	node.style.top = `${y}px`
}

/**
 * @param {Number} x 
 */
function node_smooth_size (x)
{
	const min = 25
	const max = Math.max(0, x - 100)
	const exp = Math.exp(-0.05 * (x - 70))
	return min + 100 / (1 + exp) + 0.5 * Math.log(1 + max)
}

export class Node extends HTMLElement {

	/**
	 * @param {HTMLElement} canvas Where the node will be renderized.
	 * @param {Number} size Size of node in the graph.
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(canvas, size, x = 0, y = 0) {
		super()
		this.vertice = ++graph.ids
		this.id = `node-${this.vertice}`
		this.size = size
		this.canvas = canvas

		const radius = Math.round(node_smooth_size(size))
		this.style.width = `${radius}px`
		this.style.height = `${radius}px`
		this.style.borderRadius = `${radius}px`
		this.style.fontSize = `${radius / 2}px`

		this.style.left = `${x}px`
		this.style.top = `${y}px`


		// this.textContent = `${size}`
		this.textContent = `${this.vertice}`

		this.addEventListener('mousedown', this.mousedown)

		canvas.appendChild(this)

		graph.vertices.set(this.vertice, this)

		this.addEventListener('click', () => {
			if (window.mode === 'prim')
			{
				window.mode = 'pencil';
				prim(this);
			}
			else if (mode === 'eraser')
			{
				this.erase()
			}

		})

		/**
		 * Edge to ID with WEIGHT.
		 * @type {Map<Number, Number>}
		 */
		this.edges = new Map()
	}

	/**
	 * Connect this node with another
	 * @param {Node} node 
	 */
	async connect(node) {
		new Edge(this.canvas, this, node)
	}

	async erase() {
		for (const [v, _] of this.edges)
		{
			const adj = /** @type {Node} */ (await find_node(v))
			adj.edges.delete(this.vertice)

			const edge = /** @type {Edge} */ (find_edge(this.vertice, v))
			edge.remove()
			edge.label.remove()
		}

		this.edges.clear()
		this.remove()
	}

	async mousedown()
	{
		graph.pick = this.vertice
		this.style.zIndex = '4'
	}
}

customElements.define("graph-node", Node);
customElements.define("graph-edge", Edge);
