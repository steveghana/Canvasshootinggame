let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

class Player{
    constructor(x, y, radius, color){
this.x = x
this.y = y
this.radius = radius
this.color = color
    }
    draw(){
        c.save()
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI *2,false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

}

class Projectiles{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
            }
            draw(){
                c.save()
                c.beginPath()
                c.arc(this.x, this.y, this.radius, 0, Math.PI *2,false)
                c.fillStyle = this.color
                c.fill()
                c.restore()
            }
            update(){
                this.draw()
                this.x +=this.velocity.x
this.y +=this.velocity.y
            }
}

class Enemies{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
            }
            draw(){
                c.save()
                c.beginPath()
                c.arc(this.x, this.y, this.radius, 0, Math.PI *2,false)
                c.fillStyle = this.color
                c.fill()
                c.restore()
            }
            update(){
                this.draw()
                this.x +=this.velocity.x
this.y +=this.velocity.y
            }
}

let projectileArray = [];
let player;
let enemiesArray = []
let enemy;
let x, y, particles = []

const initialiseEnemies= ()=>{
    let radius = Math.random() * (20 - 5) + 5
    if(Math.random() > 0.5){
        x = x > 0.5 ? 0 - radius:canvas.width / 2 + radius
        y = Math.random() * canvas.height
    }
    if(Math.random() > 0.5){
        y = y > 0.5 ? 0 - radius:canvas.width / 2 + radius
        x =Math.random() * canvas.width 
    }
    let color = `hsl(${Math.random() * 360}, 50%, 50%)`
    let angle = Math.atan2(canvas.height/ 2 - y, canvas.width / 2 -  x)
    let velocity = {
        x : Math.cos(angle),
        y : Math.sin(angle)
    }
    enemiesArray.push( new Enemies(x, y, radius, color, velocity))
    
    // enemy.update()

}
// setInterval(initialiseEnemies, 1000)
// initialiseEnemies()


const initialisePlayer = ()=>{
    let x = innerWidth / 2
    let y = innerHeight / 2
    let radius = 20
    let color = 'white'
    player = new Player(x, y, radius, color)
    
    player.draw()
};

function shootOnClick(){
   
    canvas.addEventListener('click', (event)=>{
        let x = canvas.width / 2
    let y = canvas.height / 2
    let color = 'white'
    const angle = Math.atan2(event.clientY - y, event.clientX - x)
    let velocity = {
        x:Math.cos(angle) * 8,
        y :Math.sin(angle) * 8
    }
        projectileArray.push(new Projectiles(x, y, 4, color, velocity))
      
        })
        projectileArray.forEach(projectile =>{
            projectile.update()
            if(projectile.x > innerWidth || projectile.y > innerHeight){
                let index = projectileArray.indexOf(projectile)
                projectileArray.splice(index, 1)
                // conso
                console.log(projectileArray)
            }
        })
      
}
 
const distanceFromEnemyAndProjectile = (enemy)=>{
    projectileArray.forEach(projectile=>{
        let distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
        if(distance - projectile.radius < enemy.radius){
            console.log('lhi')
//         for(let i = 0; i < enemy.radius ; i++){
// let x = projectile.x
// let y = projectile.y
// let radius = Math.random() * 3
// let color = enemy.color
// let velocity = {
//     x: (Math.random() - 0.5) * (Math.random() * 8),
//     y: (Math.random() - 0.5) * (Math.random() * 8)
// }
//            particles.push( new Projectiles(x, y, radius,color, velocity ))
//            particles.forEach(particle=>{
//                particle.update()
//            })
//         }

        }


    })
}

function playerAndEnemyDistance (enemy){
    let playerDistanceFromEnemies = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    if(playerDistanceFromEnemies + enemy.radius < player.radius){
        console.log('jj')
    }

}

function animate(){
requestAnimationFrame(animate)
c.fillRect(0, 0, canvas.width, canvas.height)
c.fillStyle ='rgba(0, 0, 0, 0.1)'

initialisePlayer()
shootOnClick()
enemiesArray.forEach(enemy =>{
    enemy.update()
    distanceFromEnemyAndProjectile(enemy)
    playerAndEnemyDistance(enemy)

})


}
  animate()   