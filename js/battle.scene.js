var battle = new Phaser.Scene('Battle');

var Matter = Phaser.Physics.Matter.Matter;

battle.preload = function()
{
    this.load.image('asteroid', 'img/asteroid.png');
    this.load.image('ship', 'img/ship.png');
},

battle.create = function()
{
    this.matter.world.setBounds();

    this.cursors = this.input.keyboard.createCursorKeys();
    //this.cursors = this.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,down:Phaser.Input.Keyboard.KeyCodes.S,left:Phaser.Input.Keyboard.KeyCodes.A,right:Phaser.Input.Keyboard.KeyCodes.S});

    this.asteroid = this.matter.add.imageStack('asteroid', null, 0, 500, 1, 1, 0, 0, {
        mass: 3,
        shape: {
            type: 'circle',
        }
    });

    this.attractorActive = false;

    this.ship = this.matter.add.image(400, 200, 'ship', null, {
        shape: {
            type: 'circle',
            radius: 48
        },
        mass: 10,

        plugin: {
            attractors: [
                function (bodyA, bodyB) {

                    if(!battle.attractorActive)
                        return;

                    var gravityConstant = 0.5;
                    var a = new Phaser.Math.Vector2(bodyA.position.x, bodyA.position.y);
                    var b = new Phaser.Math.Vector2(bodyB.position.x, bodyB.position.y);
                    var bToA = a.subtract(b);
                    distanceSq = bToA.lengthSq() || 0.0001;
                    normal = bToA.normalize();
                    magnitude = gravityConstant * (bodyA.mass * bodyB.mass / distanceSq);
                    force = new Phaser.Math.Vector2({x: normal.x * magnitude, y: normal.y * magnitude});
                    return force;

                    /* old and terrible
                    var distance = Phaser.Math.Distance.Between(bodyA.position.x, bodyA.position.y, bodyB.position.x, bodyB.position.y);
                    if(battle.attractorActive)// && distance < 500)
                        return {
                            x: (bodyA.position.x - bodyB.position.x) * (1/(distance * 1000)),
                            y: (bodyA.position.y - bodyB.position.y) * (1/(distance * 1000))
                        };
                    */
                }
            ]
        }
    });


},

battle.update = function() 
{
    this.attractorActive = this.input.activePointer.isDown;

   theship = this.ship.body;
   Matter.Body.translate(
       theship, 
       {
           x: (battle.input.activePointer.x - theship.position.x) * 0.05, 
           y: (battle.input.activePointer.y - theship.position.y) * 0.05
       }
   );

    if(this.attractorActive)
        this.asteroid.bodies[0].frictionAir = 0.01;
    else
        this.asteroid.bodies[0].frictionAir = 0;

}
