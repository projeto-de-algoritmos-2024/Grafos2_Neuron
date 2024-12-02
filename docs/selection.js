import { Node } from './graph.js'

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

	/**
	 * @param {MouseEvent} e
	 */
	me(e) {
		if (e.target !== e.currentTarget)
			return false
		return true
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

	/**
	 * @param {MouseEvent} e
	 */
	mousedown(e)
	{
		if (!this.me(e))
			return;

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
		//if (!this.me(e))
		//	return;

		this.x2 = e.clientX
		this.y2 = e.clientY
		this.update()
	}

	mouseup()
	{
		const rect = this.getBoundingClientRect()
		const radius = Math.min(rect.width, rect.height)
		const [x, y] = [rect.x, rect.y]
		this.canvas.appendChild(new Node(this.canvas, radius, x, y))

		this.hidden = true
	}
}

customElements.define("rectangular-selection", RectangularSelection);
