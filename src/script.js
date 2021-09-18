import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xE3AC5A })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


const sizes = {
    width: 800,
    height: 600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)


const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

gsap.to(mesh.position, { duration: 1, delay: 0.1, x: 2 })

function tick( ) {

    // const elapsedTime = clock.getElapsedTime()
    // mesh.position.x = Math.sin(elapsedTime)
    // mesh.position.y = Math.cos(elapsedTime)
    // camera.lookAt(mesh.position)

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()