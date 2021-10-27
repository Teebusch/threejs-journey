import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


// canvas size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let aspectRatio = sizes.width / sizes.height


// scene
const scene = new THREE.Scene()

// create particles
const geometry = new THREE.BufferGeometry()

const count = 300 // number of particles

const positionsArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 7
}

const positionsAttr = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute("position", positionsAttr)

const material = new THREE.MeshBasicMaterial({ color: 0xE3AC5A, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


// camera
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100)
camera.position.y = 5
scene.add(camera)


// renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// interactive controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// resize render when window size changes
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    aspectRatio = sizes.width / sizes.height

    camera.aspect = aspectRatio
    
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// animation loop
const Clock = new THREE.Clock()

function tick() {
    mesh.rotation.y = Clock.getElapsedTime() * 0.1

    controls.update() // required when using damping with controls

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()