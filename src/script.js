import './style.css'
import * as THREE from 'three'

// cursor

let cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes. width - 0.5
    cursor.y = - (event.clientY / sizes. height - 0.5)
})


const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xE3AC5A })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


const sizes = {
    width: 800,
    height: 600
}


const aspectRatio = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100)
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, -1, 1, 0.1, 100)

scene.add(camera)


const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)

const Clock = new THREE.Clock()

function tick() {
    // update scene
    // mesh.rotation.y = Clock.getElapsedTime()
    
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 5
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 5
    camera.position.y = cursor.y * 6
    camera.lookAt(mesh.position)

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()