import { Node, find_node } from './graph.js'

export class RectangularSelection extends HTMLElement {
	/**
	 * @param {HTMLElement} canvas
	 */
	constructor(canvas) {
		super()
		this.x1 = 0
		this.y1 = 0
		this.x2 = 0
		this.y2 = 0
		this.canvas = canvas

		canvas.appendChild(this)
	}

	update()
	{
		let x3 = Math.min(this.x1, this.x2);
		let y3 = Math.min(this.y1, this.y2);

		const size = Math.min(Math.abs(this.x2 - this.x1), Math.abs(this.y2 - this.y1));

		// Adjust position to maintain square alignment based on initial direction
		if (this.x2 < this.x1)
			x3 = this.x1 - size; // Dragging left
		if (this.y2 < this.y1)
			y3 = this.y1 - size; // Dragging up

		this.style.left = `${x3}px`
		this.style.top = `${y3}px`
		this.style.width = `${size}px`
		this.style.height = `${size}px`
	}

	click()
	{
		this.hidden = true
	}

	/**
	 * @param {MouseEvent} e
	 */
	mousedown(e)
	{
		if (e.target !== e.currentTarget)
			return

		this.hidden = false
		this.x1 = e.clientX
		this.y1 = e.clientY
		this.update()
	}

	/**
	 * @param {MouseEvent} e
	 */
	mousemove(e)
	{
		this.x2 = e.clientX
		this.y2 = e.clientY
		this.update()
	}

	/**
	 * @param {MouseEvent} e
	 */
	mouseup(e)
	{
		if (this.hidden)
			return

		const rect = this.getBoundingClientRect()
		const radius = Math.min(rect.width, rect.height) - 1
		this.create_node(radius, rect.x, rect.y)
		this.hidden = true
	}

	/**
	 * @param {Number} radius
	 * @param {Number} x
	 * @param {Number} y
	 */
	async create_node(radius, x, y)
	{
		function random() {
			return Math.floor(Math.random() * graph.ids) + 1
		}

		/**
		 * @type {Set<Number>}
		 */
		const set = new Set()
		for (let i = 1; i <= 1; ++i)
			set.add(random())

		const node = new Node(this.canvas, radius, x, y)
		this.canvas.appendChild(node)

		for (const id of set)
		{
			console.log(id)
			const to = /** @type {Node} */ (await find_node(id))
			node.connect(to)
		}
	}
}

customElements.define("rectangular-selection", RectangularSelection);
