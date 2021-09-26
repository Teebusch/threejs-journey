import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


const scene = new THREE.Scene()


const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xE3AC5A })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let aspectRatio = sizes.width / sizes.height

const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100)
camera.position.y = 5
scene.add(camera)

const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const Clock = new THREE.Clock()

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



window.addEventListener('dblclick', (event) => {

    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if (!fullscreenElement) 
    {
        if (canvas.requestFullscreen) 
        {
            canvas.requestFullscreen()
        } 
        else if (canvas.webkitRequestFullscreen) 
        {
            canvas.webkitRequestFullscreen()
        }
    } 
    else 
    {
        if (document.exitFullscreen) 
        {
            document.exitFullscreen()
        } 
        else if (document.webkitExitFullscreen) 
        {
            document.webkitExitFullscreen()
        }
    }
})

window.addEventListener('resize', (event) => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    aspectRatio = sizes.width / sizes.height
    camera.aspect = aspectRatio
    
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

function tick() {
    // update scene
    mesh.rotation.y = Clock.getElapsedTime()

    controls.update() // needed if using damping with controls

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()