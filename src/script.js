import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as lilgui from 'lil-gui'
import gsap from 'gsap'



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


// debug panel - press h to hide / unhide, or use gui.hide()
const gui = new lilgui.GUI({ width: 300 })


// canvas size

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let aspectRatio = sizes.width / sizes.height



// Textures
const textureLoader = new THREE.TextureLoader()



// scene
const scene = new THREE.Scene()



// camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
camera.position.set(4, 2, 5)
scene.add(camera)



// Floor
const floor = new THREE.Mesh(
    new THREE.CircleGeometry(20, 32),
    new THREE.MeshStandardMaterial({ color: '#3F9FB3' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)


//house
const house = new THREE.Group()
scene.add(house)

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({color: 0xE0E0E0})
)


const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 3, 4),
    new THREE.MeshStandardMaterial({ color: 0xFB6B99 })
)
    
roof.position.y = 2.5
roof.rotateY(Math.PI * 0.25)

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 2),
    new THREE.MeshStandardMaterial({ color: 0xECAB48 })
)

door.position.z = 2.0001
door.position.y = 0.5 / -2
    
house.position.y = 2.5 / 2

house.add(walls)
house.add(roof)
house.add(door)
scene.add(house)


// bushes

const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })

for (let [x, z] of [[2, 2], [-2, 2], [3, 2.5], [-2, 4]]) {
    let bush = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        bushMaterial
    )
    bush.position.set(x, -1, z)
    bush.position.z = z
    house.add(bush)
}



// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


// renderer

const canvas = document.querySelector(".webgl")

const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true 
})

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