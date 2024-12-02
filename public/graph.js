/**
 * Graph information.
 * @global
 * */
globalThis.graph = {
	pick: 0,
	ids: 0
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

		canvas.appendChild(this)

		this.update()
	}

	/**
	 * Update how the edge is renderized in the graph.
	 */
	update() {
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


		/*
		 * Calculate width
		 */
		const width = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
		this.style.width = `${width}px`
	}
}

export function stop_picking () {
	const picken = document.querySelector(`#node-${graph.pick}`)
	if (picken instanceof Node)
		picken.style.zIndex = '2'
	graph.pick = 0
}

export class Node extends HTMLElement {

	/**
	 * @param {HTMLElement} canvas Where the node will be renderized.
	 * @param {Number} size Size of node in the graph.
	 */
	constructor(canvas, size) {
		super()
		this.vertice = ++graph.ids
		this.id = `node-${this.vertice}`
		this.size = size
		this.canvas = canvas

		const dimension = size * 0.25
		this.style.width = `${dimension}rem`
		this.style.height = `${dimension}rem`
		this.style.borderRadius = `${dimension}rem`
		this.style.fontSize = `${dimension / 2}rem`


		this.textContent = size.toString()

		this.addEventListener('mousemove', this.mousemove)
		this.addEventListener('mousedown', this.mousedown)

		canvas.appendChild(this)
	}

	/**
	 * Connect this node with another
	 * @param {Node} node 
	 */
	connect(node) {
		new Edge(this.canvas, this, node)
	}

	/**
	 * @param {MouseEvent} e
	 */
	mousemove(e)
	{
		if (graph.pick !== this.vertice)
			return;

		const x = e.clientX - this.clientWidth / 2
		const y = e.clientY - this.clientHeight / 2
		this.style.left = `${x}px`
		this.style.top = `${y}px`
	}

	mousedown()
	{
		graph.pick = this.vertice
		this.style.zIndex = '3'
	}
}

customElements.define("graph-node", Node);
customElements.define("graph-edge", Edge);
