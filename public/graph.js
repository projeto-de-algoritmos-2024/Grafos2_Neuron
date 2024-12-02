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

		const x1 = rect1.x + rect1.width / 2
		const y1 = rect1.y + rect1.height / 2
		const x2 = rect2.x + rect2.width / 2
		const y2 = rect2.y + rect2.height / 2

		/*
		 * Calculate angle.
		 */
		const angle = Math.atan2(y2 - y1, x2 - x1);
		this.style.transform = `rotate(${angle}rad)`

		// Calculate the points on the perimeter of each circle
		const radius1 = rect1.width / 2;
		//const radius2 = rect2.width / 2;

		const perimeter_x1 = x1 + radius1 * Math.cos(angle);
		const perimeter_y1 = y1 + radius1 * Math.sin(angle);
		//const perimeter_x2 = x2 - radius2 * Math.cos(angle);
		//const perimeter_y2 = y2 - radius2 * Math.sin(angle);

		const rect = this.getBoundingClientRect()
		this.style.left = `${perimeter_x1}px`
		this.style.top = `${perimeter_y1}px`


		/*
		 * Calculate width
		 */
		const width = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
		this.style.width = `${width - rect2.width}px`
	}
}

export function stop_picking () {
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
		this.size = size
		this.canvas = canvas

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
	}
}

customElements.define("graph-node", Node);
customElements.define("graph-edge", Edge);
