import './style.css'
import * as THREE from 'three'

const sizes = {
    width: 800,
    height: 600
}


const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xE3AC5A })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Position
mesh.position.y = 1
mesh.position.z = -1
console.log(mesh.position.length())
console.log(mesh.position.distanceTo(camera.position))
mesh.position.normalize() // reduces lenght of vector to 1
mesh.position.set(0.3,-0.2,0)

// Scale
mesh.scale.y = 2
mesh.scale.set(0.9, 0.8, 2)

// rotation
// rotation is an Euler (fewer methods)
// full rotation =  2 * Math.PI
// NB: gimbal lock
mesh.rotation.reorder('YXZ')
mesh.rotation.y = Math.PI/4

// face position
camera.lookAt(mesh.position)  // needs vector3

// group 
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x3F9FB3 })
)
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x3F9FB3 })
)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x3F9FB3 })
    )
    
cube2.position.x = -1.5
cube3.position.x = 1.5

group.add(cube1)
group.add(cube2)
group.add(cube3)

group.position.y = 1
group.rotation.x = 1


// add axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)