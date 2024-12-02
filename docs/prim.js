import { Node, Edge, find_node, find_edge } from "./graph.js";
import { PriorityQueue } from './priority_queue.js'

/**
 * @param {Number} to 
 * @param {Number} from 
 */
export async function process_edge (from, to)
{
	const edge = /** @type {Edge} */ (find_edge(from, to))
	edge.style.background = 'pink'
	console.log(from, to, edge)
}

async function clean_edges() {
	for (const edge of document.querySelectorAll('graph-edge'))
		if (edge instanceof Edge)
		{
			edge.style.background = 'red'
		}
}

/**
 * @param {Node} source
 */
export async function prim (source) {

	clean_edges()

	/**
	 * @param {{weight: Number, vertice: Number, from: Number}} a
	 * @param {{weight: Number, vertice: Number, from: Number}} b 
	 */
	function compare (a, b) {
		if (a.weight < b.weight)
			return true;
		if (a.weight > b.weight)
			return false;
		if (a.vertice < b.vertice)
			return true;
		return false;
	}

	const pq = new PriorityQueue(compare)
	for (const [s, p] of source.edges)
		pq.push({weight: p, vertice: s, from: source.vertice})

	let minmax = -1

	console.log('heap', pq._heap)

	/**
	 * @type {Set<Number>}
	 */
	const C = new Set()
	C.add(source.vertice)

	const quantity = document.querySelectorAll('graph-node').length

	while (C.size < quantity)
	{
		let [w, v, f] = [-1, -1, -1]

		do {
			const top = pq.pop();
			[w, v, f] = [top.weight, top.vertice, top.from]
		} while (C.has(v));

		if (w === -1)
			return;
			//alert("problema ocorreu")

		minmax = Math.max(minmax, w)
		C.add(v)

		process_edge(f, v)
		const to = /** @type {Node} */ (await find_node(v));

		for (const [s, p] of to.edges)
			pq.push({weight: p, vertice: s, from: to.vertice})
	}

	console.log(minmax)
}
