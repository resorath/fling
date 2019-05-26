var config = {
    type: Phaser.AUTO,
    debug: true,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 4000,
        height: 2250
    },
    backgroundColor: '#000000',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                scale: 0
            },
            plugins: {
                attractors: true
            },
            debug: true,
            debugShowInternalEdges: true,
            debugShowConvexHulls: true
        }
    },
    scene: [battle]
};

var game = new Phaser.Game(config);


var rng = new Phaser.Math.RandomDataGenerator();
function randInRange(f, c)
{
    return rng.frac() * (c - f + 1) + f;
}

