var battle = new Phaser.Scene('Battle');

var Matter = Phaser.Physics.Matter.Matter;

battle.preload = function()
{
    this.load.image('asteroid', 'img/asteroid.png');
    this.load.image('ship', 'img/ship.png');
},

battle.create = function()
{
    //this.matter.world.setBounds();

    //this.cursors = this.input.keyboard.createCursorKeys();
    //this.cursors = this.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,down:Phaser.Input.Keyboard.KeyCodes.S,left:Phaser.Input.Keyboard.KeyCodes.A,right:Phaser.Input.Keyboard.KeyCodes.S});

    this.asteroids = [];

    this.attractorActive = false;

    this.ship = this.matter.add.image(400, 200, 'ship', null, {
        shape: {
            type: 'circle',
            radius: 48
        },
        mass: 100,
        label: "ship",

        plugin: {
            attractors: [
                function (bodyA, bodyB) {
                    if(!battle.attractorActive)
                        return;

                    if(bodyB.label != "asteroid")
                        return;

                    var gravityConstant = 0.7;
                    var a = new Phaser.Math.Vector2(bodyA.position.x, bodyA.position.y);
                    var b = new Phaser.Math.Vector2(bodyB.position.x, bodyB.position.y);
                    var bToA = a.subtract(b);
                    distanceSq = bToA.lengthSq() || 0.0001;
                    normal = bToA.normalize();
                    magnitude = gravityConstant * (bodyA.mass * bodyB.mass / distanceSq) * 5000/bodyB.mass;
                    force = new Phaser.Math.Vector2({x: normal.x * magnitude, y: normal.y * magnitude});
                    console.log(force);
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

    this.opponent = this.matter.add.image(1800, 400, 'ship', null, {
        shape: {
            type: 'circle',
            radius: 48
        },
        mass: 100,
        label: "opponent",
    });

    
  /* this.asteroid = this.matter.add.imageStack('asteroid', null, 0, 500, 1, 1, 0, 0, {
        mass: 3,
        shape: {
            type: 'circle',
        },
        label: "list asteroid"
    });*/

    this.asteroids.push(
        this.matter.add.image(100, 100, 'asteroid', null, {
        density: 3,
        shape: {
            type: 'circle',
            radius: 24,
        },
        label: "asteroid"
    }));

    this.asteroids.push(
        this.matter.add.image(100, 100, 'asteroid', null, {
        density: 1,
        shape: {
            type: 'circle',
            radius: 36,
        },
        label: "asteroid"
    }));
    this.asteroids[1].setScale(2);

    this.matter.world.on('collisionstart', function(event, bodyA, bodyB) {

        console.log(bodyA.label);
        if(bodyA.label == "opponent" && bodyB.label == "asteroid")
        {
            console.log("HIT!");
        }

    })

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

   for(i=0; i < this.asteroids.length; i++)
    if(this.attractorActive)
        this.asteroids[i].body.frictionAir = 0.01;
    else
        this.asteroids[i].body.frictionAir = 0;

}
