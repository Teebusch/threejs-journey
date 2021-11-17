import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as lilgui from 'lil-gui'
import gsap from 'gsap'
import { MeshBasicMaterial, MeshToonMaterial, ShortType } from 'three'



// settings for debug panel

const parameters = {
    color: 0xE3AC5A,
    spin: () => {
        gsap.to(
            mesh.rotation, { 
                duration: 2, 
                y: mesh.rotation.y + 4 * Math.PI 
            }
        )
    }
}



// canvas size

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let aspectRatio = sizes.width / sizes.height



// scene
const scene = new THREE.Scene()


// textures
const textureLoader = new THREE.TextureLoader()
//const bakedShadow = textureLoader.load('textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('textures/simpleShadow.jpg')

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 5

// directionalLight.shadow.radius = 10 // shadow blur
scene.add(directionalLight)

const dLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
//scene.add(dLightCameraHelper)


// spotLight 
const spotLight = new THREE.SpotLight(0xffffff, 0.2, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)
scene.add(spotLight.target)
scene.add(spotLight)

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 2
spotLight.shadow.camera.far = 6

const sLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(sLightCameraHelper)

sLightCameraHelper.visible = false


// pointLight
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.position.set(1, 3, 1)
pointLight.castShadow = true
scene.add(pointLight)

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 2
pointLight.shadow.camera.far = 4

const pLightHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pLightHelper)
pLightHelper.visible = false



// material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7

// objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

sphere.castShadow = true


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

plane.receiveShadow = true



const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        alphaMap: simpleShadow,
        transparent: true
    })
)

sphereShadow.rotation.x = - Math.PI * 0.5 
sphereShadow.position.y = plane.position.y + 0.01 


scene.add(sphere, plane, sphereShadow)




// camera

const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100)
camera.position.set(1, 4, 4)
scene.add(camera)



// renderer

const canvas = document.querySelector(".webgl")

const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap


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



// debug panel - press h to hide / unhide, or use gui.hide()

const gui = new lilgui.GUI({ width: 300 })

gui.add(sphere.position, 'y', -3, 3, 0.1).name("elevation")
gui.add(material, 'wireframe')
gui.add(parameters, 'spin')

gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

gui.addColor(parameters, 'color').onChange(() => {
    material.color.set(parameters.color)
})



// animation loop

const Clock = new THREE.Clock()

function tick() {
     const elapsedTime = Clock.getElapsedTime()
     // mesh.rotation.y = 2* Math.PI * (Math.cos(elapsedTime) + 0.5)
    sphere.position.x = Math.cos(elapsedTime) * 1.2
    sphere.position.z = Math.sin(elapsedTime) * 1.2
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 4))

    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = 1 - sphere.position.y * 0.7

    controls.update() // required when using damping with controls

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()