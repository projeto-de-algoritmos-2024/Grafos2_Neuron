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

	max_size: 0
}

/**
 * @param {Number} x 
 */
function edge_smooth_size (x)
{
	const min = 3
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
		if (first.size < second.size)
		{
			this.first = first
			this.second = second
		} else {
			this.first = second
			this.second = first
		}
		this.size = first.size + second.size
		this.id = `edge-${Math.min(first.vertice, second.vertice)}-to-${Math.max(first.vertice, second.vertice)}`

		const height = Math.round(edge_smooth_size(this.size))
		this.style.height = `${height}px`

		this.addEventListener('click', () => {
			if (window.mode === 'eraser')
				this.erase()
		})

		first.addEventListener('mousemove', () => {
			if (!graph.pick)
				return

			this.update()
		})
		second.addEventListener('mousemove', () => {
			if (!graph.pick)
				return

			this.update()
		})

		this.label = document.createElement('span')
		this.label.textContent = `${this.size}`

		canvas.append(this, this.label)

		first.edges.set(second.vertice, this.size)
		second.edges.set(first.vertice, this.size)

		this.update()
		this.update_colour()
	}

	async erase() {
		this.first.edges.delete(this.second.vertice)
		this.second.edges.delete(this.first.vertice)
		this.label.remove()
		this.remove()
	}

	async update_colour() {
		const first = await this.first.update_colour()
		const second = await this.second.update_colour()

		const a = `rgb(${first.red}, ${first.green}, ${first.blue})`
		const b = `rgb(${second.red}, ${second.green}, ${second.blue})`
		console.log(`linear-gradient(${this.angle()}rad, ${a}, ${b})`)
		this.style.background = `linear-gradient(${this.angle()}rad, ${a}, ${b})`

	}

	angle() {
		const rect1 = this.first.getBoundingClientRect()
		const rect2 = this.second.getBoundingClientRect()

		const center_x1 = rect1.x + rect1.width / 2
		const center_y1 = rect1.y + rect1.height / 2
		const center_x2 = rect2.x + rect2.width / 2
		const center_y2 = rect2.y + rect2.height / 2

		const angle = Math.atan2(center_y2 - center_y1, center_x2 - center_x1);
		return angle
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

		const center_x1 = rect1.x + this.first.radius / 2
		const center_y1 = rect1.y + this.first.radius / 2
		const center_x2 = rect2.x + this.second.radius  / 2
		const center_y2 = rect2.y + this.second.radius / 2

		/*
		 * Calculate angle.
		 */
		const angle = Math.atan2(center_y2 - center_y1, center_x2 - center_x1);
		this.style.transform = `rotate(${angle}rad)`
		// this.label.style.transform = `rotate(${0}rad)`

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

		const x1_u = center_x1;
		const y1_u = center_y1;
		const x2_u = center_x2;
		const y2_u = center_y2;

		this.style.left = `${x1}px`
		this.style.top = `${y1}px`

		this.label.style.left = `${(x1 + x2) / 2}px`
		this.label.style.top = `${(y1 + y2) / 2}px`


		/*
		 * Calculate width
		 */
		const width = Math.sqrt((x2_u - x1_u) ** 2 + (y2_u - y1_u) ** 2)
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
	const max = Math.exp(x)
	const exp = Math.exp(-0.05 * (x - 125))
	return min + 100 / (1 + exp) + 0.3 * Math.log(1 + max)
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
		this.radius = radius
		this.style.width = `${radius}px`
		this.style.height = `${radius}px`
		this.style.borderRadius = `${radius}px`
		this.style.fontSize = `${radius / 2}px`

		this.style.left = `${x}px`
		this.style.top = `${y}px`


		// this.textContent = `${size}`
		this.textContent = `${size}`

		this.addEventListener('mousedown', this.mousedown)

		canvas.appendChild(this)

		graph.vertices.set(this.vertice, this)

		this.addEventListener('click', () => {
			if (window.mode === 'prim')
				prim(this);
			else if (mode === 'eraser')
				this.erase();

		})

		if (graph.max_size < this.size)
		{
			graph.max_size = Math.max(this.size, graph.max_size)
			for (const node of document.querySelectorAll('graph-node'))
				if (node instanceof Node)
					node.update_colour()
			for (const edge of document.querySelectorAll('graph-edge'))
				if (edge instanceof Edge)
					edge.update_colour()
		}

		this.update_colour()

		/**
		 * Edge to ID with WEIGHT.
		 * @type {Map<Number, Number>}
		 */
		this.edges = new Map()
	}

	async update_colour() {
		const [a, b] = [
			{red: 0, green: 0, blue: 255},
			{red: 255, green: 0, blue: 0},
		]

		const percentage = this.size / graph.max_size

		const red = a.red + percentage * (b.red - a.red)
		const green = a.green + percentage * (b.green - a.green)
		const blue = a.blue + percentage * (b.blue - a.blue)
		this.style.background = `rgb(${red}, ${green}, ${blue}, 1)`

		return {red, green, blue}
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
