var dfsSolution = [];

function dfs() {
    dfsSolution = [];    // Reiniciar la solución DFS
    visitedStates = [];    // Limpiar el array de estados visitados
    dfsRecursive(game_state).then((foundSolution) => {
        if (foundSolution) {
            executeDFSSolution(); // Ejecutar la solución encontrada
        } else {
            console.log("No se encontró ninguna solución.");
        }
    });
}
function dfsRecursive(state) {
    return new Promise((resolve, reject) => {
        if (won(state)) { // Verificar si el estado actual es una solución
            resolve(true);
            return;
        }
        // Verificar si el estado actual ya ha sido visitado
        if (visitedStates.some(s => JSON.stringify(s) === JSON.stringify(state))) {
            resolve(false); // Evitar volver a visitar el mismo estado
            return;
        }
        visitedStates.push(state); // Registrar el estado actual como visitado

        // Expandir los posibles movimientos desde el estado actual
        var possibleMoves = generateMoves(state);

        // Iterar sobre los movimientos posibles de forma asíncrona
        (async function loop() {
            for (let i = 0; i < possibleMoves.length; i++) {
                // Aplicar el movimiento
                var nextState = applyMove(state, possibleMoves[i]);

                // Verificar si se alcanzó una solución desde el nuevo estado
                if (await dfsRecursive(nextState)) {
                    // Agregar el movimiento a la solución
                    dfsSolution.push(possibleMoves[i]);
                    resolve(true);
                    return;
                }
            }
            resolve(false);
        })();
    });
}
function generateMoves(state) {
    var moves = [];
    // PASAR 1 CANIBAL
    if (boat_val(state)) {
        moves.push(1);
    }
    // PASAR 1 MISIONERO
    if (boat_val(state)) {
        moves.push(2);
    }
    // PASAR 2 CANIBALES
    if (boat_val(state) && (state.boat_position === "right" ? state.right_side.filter(x => x.startsWith("c")).length >= 2 : state.left_side.filter(x => x.startsWith("c")).length >= 2)) {
        moves.push(3);
    }
    // PASAR 2 MISIONEROS
    if (boat_val(state) && (state.boat_position === "right" ? state.right_side.filter(x => x.startsWith("m")).length >= 2 : state.left_side.filter(x => x.startsWith("m")).length >= 2)) {
        moves.push(4);
    }
    // PASAR 1 MISIONERO Y 1 CANIBAL
    if (boat_val(state) && (state.boat_position === "right" ? state.right_side.some(x => x.startsWith("m")) && state.right_side.some(x => x.startsWith("c")) : state.left_side.some(x => x.startsWith("m")) && state.left_side.some(x => x.startsWith("c")))) {
        moves.push(5);
    }
    return moves;
}
function applyMove(state, move) {
    // Aplicar el movimiento al estado actual y devolver el nuevo estado
    var newState = JSON.parse(JSON.stringify(state)); // Clonar el estado para evitar modificar el original

    // PASAR 1 CANIBAL
    if (move === 1) {
        if (newState.boat_position === "right" && newState.right_side.some(x => x.startsWith("c"))) {
            var idx = newState.right_side.findIndex(x => x.startsWith("c"));
            newState.right_side.splice(idx, 1);
            newState.left_side.push("c" + (newState.left_side.filter(x => x.startsWith("c")).length + 1));
        } else if (newState.boat_position === "left" && newState.left_side.some(x => x.startsWith("c"))) {
            var idx = newState.left_side.findIndex(x => x.startsWith("c"));
            newState.left_side.splice(idx, 1);
            newState.right_side.push("c" + (newState.right_side.filter(x => x.startsWith("c")).length + 1));
        }
    }
    // PASAR 1 MISIONERO
    if (move === 2) {
        if (newState.boat_position === "right" && newState.right_side.some(x => x.startsWith("m"))) {
            var idx = newState.right_side.findIndex(x => x.startsWith("m"));
            newState.right_side.splice(idx, 1);
            newState.left_side.push("m" + (newState.left_side.filter(x => x.startsWith("m")).length + 1));
        } else if (newState.boat_position === "left" && newState.left_side.some(x => x.startsWith("m"))) {
            var idx = newState.left_side.findIndex(x => x.startsWith("m"));
            newState.left_side.splice(idx, 1);
            newState.right_side.push("m" + (newState.right_side.filter(x => x.startsWith("m")).length + 1));
        }
    }
    // PASAR 2 CANIBALES
    if (move === 3) {
        if (newState.boat_position === "right" && newState.right_side.filter(x => x.startsWith("c")).length >= 2) {
            var idx1 = newState.right_side.findIndex(x => x.startsWith("c"));
            var idx2 = newState.right_side.findIndex((x, i) => i !== idx1 && x.startsWith("c"));
            newState.right_side.splice(idx1, 1);
            newState.right_side.splice(idx2, 1);
            newState.left_side.push("c" + (newState.left_side.filter(x => x.startsWith("c")).length + 1));
            newState.left_side.push("c" + (newState.left_side.filter(x => x.startsWith("c")).length + 2));
        } else if (newState.boat_position === "left" && newState.left_side.filter(x => x.startsWith("c")).length >= 2) {
            var idx1 = newState.left_side.findIndex(x => x.startsWith("c"));
            var idx2 = newState.left_side.findIndex((x, i) => i !== idx1 && x.startsWith("c"));
            newState.left_side.splice(idx1, 1);
            newState.left_side.splice(idx2, 1);
            newState.right_side.push("c" + (newState.right_side.filter(x => x.startsWith("c")).length + 1));
            newState.right_side.push("c" + (newState.right_side.filter(x => x.startsWith("c")).length + 2));
        }
    }
    // PASAR 2 MISIONEROS
    if (move === 4) {
        if (newState.boat_position === "right" && newState.right_side.filter(x => x.startsWith("m")).length >= 2) {
            var idx1 = newState.right_side.findIndex(x => x.startsWith("m"));
            var idx2 = newState.right_side.findIndex((x, i) => i !== idx1 && x.startsWith("m"));
            newState.right_side.splice(idx1, 1);
            newState.right_side.splice(idx2, 1);
            newState.left_side.push("m" + (newState.left_side.filter(x => x.startsWith("m")).length + 1));
            newState.left_side.push("m" + (newState.left_side.filter(x => x.startsWith("m")).length + 2));
        } else if (newState.boat_position === "left" && newState.left_side.filter(x => x.startsWith("m")).length >= 2) {
            var idx1 = newState.left_side.findIndex(x => x.startsWith("m"));
            var idx2 = newState.left_side.findIndex((x, i) => i !== idx1 && x.startsWith("m"));
            newState.left_side.splice(idx1, 1);
            newState.left_side.splice(idx2, 1);
            newState.right_side.push("m" + (newState.right_side.filter(x => x.startsWith("m")).length + 1));
            newState.right_side.push("m" + (newState.right_side.filter(x => x.startsWith("m")).length + 2));
        }
    }
    // PASAR 1 MISIONERO Y 1 CANIBAL
    if (move === 5) {
        if (newState.boat_position === "right" && newState.right_side.some(x => x.startsWith("m")) && newState.right_side.some(x => x.startsWith("c"))) {
            var idx_m = newState.right_side.findIndex(x => x.startsWith("m"));
            var idx_c = newState.right_side.findIndex(x => x.startsWith("c"));
            newState.right_side.splice(idx_m, 1);
            newState.right_side.splice(idx_c, 1);
            newState.left_side.push("m" + (newState.left_side.filter(x => x.startsWith("m")).length + 1));
            newState.left_side.push("c" + (newState.left_side.filter(x => x.startsWith("c")).length + 1));
        } else if (newState.boat_position === "left" && newState.left_side.some(x => x.startsWith("m")) && newState.left_side.some(x => x.startsWith("c"))) {
            var idx_m = newState.left_side.findIndex(x => x.startsWith("m"));
            var idx_c = newState.left_side.findIndex(x => x.startsWith("c"));
            newState.left_side.splice(idx_m, 1);
            newState.left_side.splice(idx_c, 1);
            newState.right_side.push("m" + (newState.right_side.filter(x => x.startsWith("m")).length + 1));
            newState.right_side.push("c" + (newState.right_side.filter(x => x.startsWith("c")).length + 1));
        }
    }
    // Cambiar la posición del bote
    newState.boat_position = newState.boat_position === "right" ? "left" : "right";

    return newState;
}
function executeDFSSolution() {
    (async function () {
        for (let i = 0; i < dfsSolution.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    on_click(dfsSolution[i]);
                    resolve();
                }, 1000); // Intervalo de tiempo entre movimientos (1 segundo en este ejemplo)
            });
        }
    })();
}