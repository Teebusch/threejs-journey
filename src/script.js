import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as lilgui from 'lil-gui'
import gsap from 'gsap'

// canvas size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let aspectRatio = sizes.width / sizes.height

const parameters = {
    color: 0xE3AC5A,
    spin: () => {
        gsap.to(mesh.rotation, { duration: 2, y:  mesh.rotation.y + 4 * Math.PI })
    }
}

// scene
const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: parameters.color })
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


// interactive controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// debug - press h to hide / unhide, or use gui.hide()
const gui = new lilgui.GUI({ width: 300 })

gui.add(mesh.position, 'y', -3, 3, 0.1).name("elevation")
gui.add(material, 'wireframe')
gui.add(parameters, 'spin')
gui.addColor(parameters, 'color').onChange(() => {
    material.color.set(parameters.color)
})


// animation loop
const Clock = new THREE.Clock()

function tick() {
     const elapsedTime = Clock.getElapsedTime()
     // mesh.rotation.y = 2* Math.PI * (Math.cos(elapsedTime) + 0.5)

    controls.update() // required when using damping with controls

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()