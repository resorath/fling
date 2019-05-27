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

    // divider
    dividerpoly = '0 0 20 0 20 5000 0 5000';
    this.divider = this.add.polygon(globals.width / 2, 0, dividerpoly, 0xffffff, 1.0);
    this.matter.add.gameObject(this.divider, { shape: { type: 'fromVerts', verts: dividerpoly, flagInternal: true, isStatic: true } }).setStatic(true);
   // divider.gameObject.setTint(0xffffff);

    this.asteroidCollisionCategory = this.matter.world.nextCategory();
    this.shipCollisionCategory = this.matter.world.nextCategory();

    this.ship = this.matter.add.image(400, 200, 'ship', null, {
        shape: {
            type: 'circle',
            radius: 90 // actually 48
        },
        density: 1000,
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
                    distanceSq = Math.pow(distanceSq, 1/1.1); // screw with this number some more
                    normal = bToA.normalize();
                    //magnitude = gravityConstant * (bodyA.mass * bodyB.mass / distanceSq)
                    magnitude = gravityConstant * (30 * bodyB.mass / distanceSq );
                    //magnitude = gravityConstant * (10000 * Math.sqrt(bodyB.mass, 2) / (distanceSq ) );
                    force = new Phaser.Math.Vector2({x: normal.x * magnitude, y: normal.y * magnitude});
                   // console.log(force);
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
    this.ship.setScale(0.5);

    this.ship.setCollisionCategory(this.shipCollisionCategory);

    this.opponent = this.matter.add.image(globals.width - 50, globals.height / 2, 'ship', null, {
        shape: {
            type: 'circle',
            radius: 90
        },
        label: "opponent",
        density: 1000
    });

    this.opponent.setCollisionCategory(this.shipCollisionCategory);
    this.opponent.setScale(0.5);

    // generate some asteroids
    for(i=0; i<20; i++)
    {
        var size = randInRange(1, 1.5);

        this.asteroids.push(
            this.matter.add.image(Phaser.Math.Between(200, globals.width - 200), Phaser.Math.Between(50,globals.height - 50), 'asteroid', null, {
            density: 1,
            shape: {
                type: 'circle',
                radius: 20 * (size * 0.6),
            },
            label: "asteroid",
            frictionAir: 0
        }));
        this.asteroids[i].setScale(size / 2);
        this.asteroids[i].setVelocity(randInRange(-1, 1), randInRange(-1,1));
        this.asteroids[i].setCollisionCategory(this.asteroidCollisionCategory);

    }

    this.divider.setCollidesWith(this.shipCollisionCategory);
    

    this.matter.world.on('collisionstart', function(event, bodyA, bodyB) {

        if(bodyA.label == "opponent" && bodyB.label == "asteroid")
        {
            battle.asteroidCollide(bodyA, bodyB);
        }

        if(bodyA.label == "asteroid" && bodyB.label == "opponent")
        {
            battle.asteroidCollide(bodyB, bodyA);
        }

    })

},

battle.asteroidCollide = function(opponent, asteroid)
{
    //bodies = Matter.Composite.allBodies(battle.matter.world.engine.world);

    var splicetarget = -1;
    for(i=0; i<battle.asteroids.length;i++)
    {
        if(asteroid == battle.asteroids[i].body)
        {
            console.log(battle.asteroids[i].body.mass);
            console.log(battle.asteroids[i].body.speed);


            battle.asteroids[i].destroy();
            battle.asteroids.splice(i, 1);
            break;
        }
    }

    // asteroid.destroy();
    //this.asteroids[asteroid.id].destroy();
    //this.asteroids[asteroid.id] = null;
}

battle.update = function() 
{
    this.attractorActive = this.input.activePointer.isDown;

   theship = this.ship.body;

   directionmod = 1;
   if(theship.position.x > 1940)
    directionmod = -3;

   Matter.Body.translate(
       theship, 
       {
           x: (battle.input.activePointer.x - theship.position.x) * 0.05 * directionmod, 
           y: (battle.input.activePointer.y - theship.position.y) * 0.05
       }
   );

   for(i=0; i < this.asteroids.length; i++)
   {
        if(this.attractorActive)
            this.asteroids[i].body.frictionAir = 0.01;
        else
            this.asteroids[i].body.frictionAir = 0;
   }

}
