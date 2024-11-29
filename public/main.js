globalThis.div = document.createElement('div')

window.addEventListener('load', () => {
	window.div = /** @type {HTMLDivElement} */ (document.querySelector('.selection'))
})

let x1 = 0
let y1 = 0
let x2 = 0
let y2 = 0

function update()
{
	const x3 = Math.min(x1, x2)
	const x4 = Math.max(x1, x2)
	const y3 = Math.min(y1, y2)
	const y4 = Math.max(y1, y2)
	window.div.style.left = `${x3}px`
	window.div.style.top = `${y3}px`
	window.div.style.width = `${x4 - x3}px`
	window.div.style.height = `${y4 - y3}px`
}

window.addEventListener('mousedown', e => {
	window.div.hidden = false
	x1 = e.clientX
	y1 = e.clientY
	update()
})

window.addEventListener('mousemove', e => {
	x2 = e.clientX
	y2 = e.clientY
	update()
})

window.addEventListener('mouseup', () => {
	div.hidden = true
})
