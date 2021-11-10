import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as lilgui from 'lil-gui'
import gsap from 'gsap'


// canvas size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let aspectRatio = sizes.width / sizes.height


const parameters = {
    color: 0x660022,
    spin: () => {
        gsap.to(mesh.rotation, { duration: 2, y:  mesh.rotation.y + 4 * Math.PI })
    }
}



// scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(parameters.color, 5, 7);

// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

// textures

const textureLoader = new THREE.TextureLoader()
const textTexture = textureLoader.load('matcap1.png')
const donutTexture = textureLoader.load('matcap2.png')

// fonts

const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: textTexture,
})

const fontLoader = new FontLoader()
//fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
fontLoader.load('fonts/Bebas Neue_Regular.json', (font) => {

    const textGeometry = new TextGeometry('Hello\nWorld!', 
    {
        font,
        size: 0.6,
        height: 0.1,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 2,
        bevelOffset: 0
    })
    
    textGeometry.center()
    
    const text = new THREE.Mesh(textGeometry, textMaterial)
    text.rotateY(-0.1)
    scene.add(text)
})



// donuts

const donutGeometry = new THREE.TorusGeometry(0.1, 0.05, 20, 25)
const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: donutTexture,
    transparent: true,
    opacity: 0.5
})

donutMaterial.blending = THREE.AdditiveBlending

console.time('donuts')

const donuts = new THREE.Group()

for(let i = 0; i < 300; i++)
{
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)

    donut.position.x = (Math.random()-0.5) * 5
    donut.position.y = (Math.random()-0.5) * 5
    donut.position.z = (Math.random()-0.5) * 5

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.max(0.2, Math.random())
    donut.scale.set(scale, scale, scale)
    donuts.add(donut)
}

scene.add(donuts) 

console.timeEnd('donuts')


// camera

const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100)
camera.position.z = 5
scene.add(camera)


// renderer

const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
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

gui.add(parameters, 'spin')
gui.addColor(parameters, 'color').onChange(() => {
    scene.fog.color.set(parameters.color)
})


// animation loop
const Clock = new THREE.Clock()

function tick() {
     const elapsedTime = Clock.getElapsedTime()
     donuts.rotation.y = 0.01 * Math.PI * (elapsedTime)

    controls.update() // required when using damping with controls

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}


tick()