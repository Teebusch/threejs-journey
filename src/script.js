import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import gsap from 'gsap'

// Load assets
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    console.log("start");
}
loadingManager.onLoad = () => {
    console.log("loaded");
}
loadingManager.onProgress = () => {
    console.log("progress");
}
loadingManager.onError = () => {
    console.log("error");
}

loadingManager.onS
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/minecraft.png')
const alphaTexture = textureLoader.load('/alpha.jpg')
const heightTexture = textureLoader.load('/height.jpg')
const normalTexture = textureLoader.load('/normal.jpg')
const metalnessTexture = textureLoader.load('/metalness.jpg')
const roughnessTexture = textureLoader.load('/roughness.jpg')
const ambientOcclusionTexture = textureLoader.load('/ambientOcclusion.jpg')

colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter // min mapping
colorTexture.magFilter = THREE.NearestFilter
//colorTexture.repeat.x = 2
//colorTexture.repeat.y = 2
//colorTexture.offset.x = 0.5
//colorTexture.offset.y = 0.5
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5
// colorTexture.rotation = Math.PI / 4
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

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
const material = new THREE.MeshBasicMaterial({ 
    //color: parameters.color,
    map: colorTexture
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


// debug gui (press h to hide / unhide) or gui.hide()

const gui = new dat.GUI({ width: 300 })
gui.add(mesh.position, 'y', -3, 3, 0.1).name("elevation")
gui.add(material, 'wireframe')
gui.add(parameters, 'spin')

gui.addColor(parameters, 'color').onChange(() => {
    material.color.set(parameters.color)
})

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
     const elapsedTime = Clock.getElapsedTime()
     // mesh.rotation.y = 2* Math.PI * (Math.cos(elapsedTime) + 0.5)

    controls.update() // required when using damping with controls

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()