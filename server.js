const io = require("socket.io");
const server = io.listen(3000);

var games = []

server.on("connection", function(socket) {
    console.log("user connected");

    if(games.length == 0 || games[games.length -1].sockets.length == 2)
    {
        game = new Game();
        game.sockets.push(socket);
        socket.game = game;
        socket.player = 1;
        games.push(game);
        console.log("Adding user to new game... waiting" + game.sockets[0].player);

        socket.emit("player", 1);
    }
    else
    {
        game = games[games.length - 1];
        game.sockets.push(socket);
        socket.game = game;
        socket.player = 2;

        game.started = true;
        
        console.log("Game made!");

        socket.emit("player", 2);
    }


    socket.on("position", function(p) {
        if(!socket.game.started)
            return;

        socket.position = p;
        
        opsocket = getOppositeSocket(socket.game, socket.player);

        opsocket.emit("opponent.position", p);
    });

});


function getOppositeSocket(game, player)
{
    oppositeplayer = player == 1 ? 2 : 1;

    return game.sockets[oppositeplayer - 1];
}




function Game() {
    this.sockets = [];
    this.started = false;
}