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



// canvas size

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let aspectRatio = sizes.width / sizes.height



// scene

const scene = new THREE.Scene()



// objects

const material = new THREE.MeshStandardMaterial({ 
    color: 0xefefef,
    roughness: 0.2
})


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.7
scene.add(plane)


const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    material
)
box.rotateY(2)
scene.add(box)


const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 16, 16),
    material
)
sphere.position.set(-2, 0, 0)
scene.add(sphere)


const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.2, 16, 16),
    material
)
torus.position.set(2, 0, 0)
scene.add(torus)


// lights

const ambientLight = new THREE.AmbientLight(0xefefef, 0.1)

scene.add(ambientLight)


const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.1)
directionalLight.position.set(5, 7, 0)
scene.add(directionalLight)


const hemisphereLight = new THREE.HemisphereLight(0xAD4133, 0x3F9FB3, 0.3)
scene.add(hemisphereLight)


const pointLight = new THREE.PointLight(0xECAB48, 0.3)
pointLight.position.set(0, 3, 2)
scene.add(pointLight)


const rectAreaLight = new THREE.RectAreaLight(0xFB6B99, 4, 2, 5, 1)
rectAreaLight.position.set(0, 2, -1)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)


const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.4, 0.25)
scene.add(spotLight)
spotLight.position.set(0, 2, 3)
scene.add(spotLight.target)
spotLight.target.position.set(0, 2, 0)

window.requestAnimationFrame(() =>
{
    spotLightHelper.update()
})


// helpers

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1)
// scene.add(hemisphereLightHelper)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
// scene.add(directionalLightHelper)

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
// scene.add(pointLightHelper, 1)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 2)
// scene.add(spotLightHelper)


// camera

const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100)
camera.position.set(0, 2, 10)
scene.add(camera)



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



// debug panel - press h to hide / unhide, or use gui.hide()

const gui = new lilgui.GUI({ width: 300 })

//gui.add(mesh.position, 'y', -3, 3, 0.1).name("elevation")
gui.add(material, 'wireframe')
gui.add(ambientLight, 'intensity', 0, 1)
gui.add(parameters, 'spin')
gui.addColor(parameters, 'color').onChange(() => {
    ///material.color.set(parameters.color)
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