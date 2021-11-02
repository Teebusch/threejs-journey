import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as lilgui from 'lil-gui'
import gsap from 'gsap'
import { MeshMatcapMaterial } from 'three'

// canvas size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let aspectRatio = sizes.width / sizes.height


const parameters = {
    color: 0xE3AC5A,
    speed: 0.5,
    spin: () => {
        gsap.to(plane.rotation, { duration: 2, y:  plane.rotation.y + 4 * Math.PI })
    }
}


// textures
const textureLoader = new THREE.TextureLoader()

const mudTextureColor = textureLoader.load('/mud_color.jpg')
const mudTextureHeight = textureLoader.load('/mud_height.png')
const mudTextureRoughness = textureLoader.load('/mud_roughness.jpg')
const mudTextureNormal = textureLoader.load('/mud_normal.jpg')
const mudAmbientOcclusion = textureLoader.load('/mud_ambientOcclusion.jpg')

const textureMatcap = textureLoader.load('/matcaps/8.png')
const textureGradient = textureLoader.load('/gradients/3.jpg')

textureGradient.minFilter = THREE.NearestFilter
textureGradient.magFilter = THREE.NearestFilter
textureGradient.generateMipmaps = false

// environment map
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    '/environmentMaps/0/px.jpg',
    '/environmentMaps/0/nx.jpg',
    '/environmentMaps/0/py.jpg',
    '/environmentMaps/0/ny.jpg',
    '/environmentMaps/0/pz.jpg',
    '/environmentMaps/0/nz.jpg',
])

// scene
const scene = new THREE.Scene()

const material = new THREE.MeshStandardMaterial({ 
    color: parameters.color,
    map: mudTextureColor,
    aoMap: mudAmbientOcclusion,
    aoMapIntensity: 1,
    normalMap: mudTextureNormal,
    roughnessMap: mudTextureRoughness,
    bumpMap: mudTextureHeight,
    displacementMap: mudTextureHeight,
    displacementScale: 0.1
})

const materialPlane = new THREE.MeshStandardMaterial({ 
    side: THREE.DoubleSide,
    metalness: 1,
    roughness: 0,
    envMap: environmentMap
})

const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshMatcapMaterial({
        matcap: textureMatcap
    })
)

const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshDepthMaterial()
)

const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshLambertMaterial()
)

const sphere4 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshPhongMaterial({
        shininess: 100,
        specular: 'yellow'
    })
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 16, 16),
    materialPlane
)

const torus1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    new THREE.MeshNormalMaterial({ 
        flatShading: true
    })
)

const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    new THREE.MeshToonMaterial({
        gradientMap: textureGradient
    })
)

const torus3 = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    new THREE.MeshBasicMaterial({
        color: parameters.color,
        map: mudTextureColor,
        transparent: true,
        opacity: 0.5,
    })
)

const torus4 = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 32),
    material
)

// UV coordinates for ambient occlusion map
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(
    plane.geometry.attributes.uv.array, 2
))

torus4.geometry.setAttribute('uv2', new THREE.BufferAttribute(
    torus4.geometry.attributes.uv.array, 2
))


sphere1.position.x = -1.2

sphere2.position.y = 1.2

sphere3.position.x = 1.2
sphere3.position.y = 1.2

sphere4.position.x = -1.2
sphere4.position.y = 1.2

torus1.position.x = 1.2

torus2.position.y = -1.2

torus3.position.x = 1.2
torus3.position.y = -1.2

torus4.position.x = -1.2
torus4.position.y = -1.2


scene.add(sphere1, sphere2, sphere3, sphere4, plane, 
    torus1, torus2, torus3, torus4)


// lights
const ambientLight = new THREE.AmbientLight(0x0e0e0e, 10)
const pointLight = new THREE.PointLight('magenta', 1)

pointLight.position.z = -10
pointLight.position.x = -5

scene.add(ambientLight, pointLight)

// camera
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100)
camera.position.z = 5
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

// gui.add(sphere.position, 'y', -3, 3, 0.1).name("elevation")
gui.add(material, 'wireframe')
gui.add(material, 'metalness', 0, 1, 0.001)
gui.add(parameters, 'speed', -2, 2, 0.1)
gui.add(material, 'aoMapIntensity', 0, 2, 0.001)
gui.add(material, 'displacementScale', 0, 2, 0.001)
gui.addColor(parameters, 'color').onChange(() => {
    material.color.set(parameters.color)
    materialPlane.color.set(parameters.color)
})


// animation loop
const Clock = new THREE.Clock()

function tick() {
    const elapsedTime = Clock.getElapsedTime()

    material.displacementScale = 0.1 + (0.5+(Math.sin(4*elapsedTime)/2)) / 4

    plane.rotation.x = 0.25 * parameters.speed * Math.PI * elapsedTime
    plane.rotation.y = parameters.speed * Math.PI * elapsedTime

    torus1.rotation.y = parameters.speed * Math.PI * elapsedTime
    torus2.rotation.y = -parameters.speed * Math.PI * elapsedTime
    torus3.rotation.y = -parameters.speed * Math.PI * elapsedTime
    torus4.rotation.y = 0.2 * -parameters.speed * Math.PI * elapsedTime
    torus1.rotation.x = 0.2 * parameters.speed * Math.PI * elapsedTime
    torus2.rotation.x = 0.2 * -parameters.speed * Math.PI * elapsedTime
    torus3.rotation.x = 0.2 * -parameters.speed * Math.PI * elapsedTime
    torus4.rotation.x = 0.01 * -parameters.speed * Math.PI * elapsedTime

    sphere1.rotation.y = parameters.speed * Math.PI * elapsedTime
    sphere2.rotation.y = parameters.speed * Math.PI * elapsedTime
    sphere3.rotation.y = parameters.speed * Math.PI * elapsedTime
    sphere4.rotation.y = parameters.speed * Math.PI * elapsedTime

    controls.update() // required when using damping with controls

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()