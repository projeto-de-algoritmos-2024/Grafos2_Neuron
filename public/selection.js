export default class RectangularSelection extends HTMLElement {
	x1 = 0
	y1 = 0
	x2 = 0
	y2 = 0

	constructor() {
		super()
		this.x1 = 0
		this.y1 = 0
		this.x2 = 0
		this.y2 = 0
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
		const x3 = Math.min(this.x1, this.x2)
		const x4 = Math.max(this.x1, this.x2)
		const y3 = Math.min(this.y1, this.y2)
		const y4 = Math.max(this.y1, this.y2)
		this.style.left = `${x3}px`
		this.style.top = `${y3}px`
		this.style.width = `${x4 - x3}px`
		this.style.height = `${y4 - y3}px`
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
		if (!this.me(e))
			return;

		this.x2 = e.clientX
		this.y2 = e.clientY
		this.update()
	}

	mouseup()
	{
		this.hidden = true
	}
}

customElements.define("rectangular-selection", RectangularSelection);
