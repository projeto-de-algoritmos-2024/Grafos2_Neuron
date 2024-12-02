import { Node, find_node } from "./graph.js";
import { PriorityQueue } from './priority_queue.js'

/**
 * @param {Node} source
 */
export async function prim (source) {

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

	while (C.size < graph.ids)
	{
		let [w, v, f] = [-1, -1, -1]

		do {
			const top = pq.pop();
			[w, v, f] = [top.weight, top.vertice, top.from]
		} while (C.has(v));

		if (w === -1)
			alert("problema ocorreu")

		minmax = Math.max(minmax, w)
		C.add(v)

		console.log(`from ${f} to ${v} with ${w} of weight`)
		const to = /** @type {Node} */ (await find_node(v));

		for (const [s, p] of to.edges)
			pq.push({weight: p, vertice: s, from: to.vertice})
	}
}
