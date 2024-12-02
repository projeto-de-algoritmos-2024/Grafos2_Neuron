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
	map: new Map()
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

		first.addEventListener('mousemove', () => this.update())
		second.addEventListener('mousemove', () => this.update())

		this.label = document.createElement('span')
		this.label.textContent = `${this.size}`

		canvas.append(this, this.label)

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
			return;
		}

		this.style.display = 'block';


		const x1 = center_x1 + radius1 * Math.cos(angle);
		const y1 = center_y1 + radius1 * Math.sin(angle);
		const x2 = center_x2 - radius2 * Math.cos(angle);
		const y2 = center_y2 - radius2 * Math.sin(angle);

		const rect = this.getBoundingClientRect()
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
		picken.style.zIndex = '2'
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

		this.style.width = `${size}px`
		this.style.height = `${size}px`
		this.style.borderRadius = `${size}px`
		this.style.fontSize = `${size / 2}px`
		this.style.left = `${x}px`
		this.style.top = `${y}px`


		this.textContent = size.toString()

		this.addEventListener('mousedown', this.mousedown)

		canvas.appendChild(this)

		graph.map.set(this.vertice, this)
	}

	/**
	 * Connect this node with another
	 * @param {Node} node 
	 */
	async connect(node) {
		new Edge(this.canvas, this, node)
	}

	async mousedown()
	{
		graph.pick = this.vertice
		this.style.zIndex = '3'
	}
}

customElements.define("graph-node", Node);
customElements.define("graph-edge", Edge);
