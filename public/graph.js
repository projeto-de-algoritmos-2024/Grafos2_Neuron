/**
 * Graph information.
 * @global
 * */
globalThis.graph = {
	pick: 0,
	ids: 0
}

export function stop_picking () {
	graph.pick = 0
}

export class Node extends HTMLElement {

	constructor() {
		super()
		this.vertice = ++graph.ids
		this.size = 10

		this.addEventListener('mousemove', this.mousemove)
		this.addEventListener('mousedown', this.mousedown)
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
		console.log(graph.pick)
	}
}

customElements.define("graph-node", Node);
