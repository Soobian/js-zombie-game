class Zombie {
    constructor(scale, speed, position) {
        this.scale = scale;
        this.speed = speed;
        this.position = position;
        this.container = document.createElement('div');
        this.zombieStyle();
    }

    zombieStyle() {
        this.container.classList.add('zombie');
        this.container.style.transform = "scale(" + this.scale + ")";
        this.container.style.bottom = this.position + 'px';
        this.container.style.animationDuration = "0.5s," + 20 / this.speed + "s";
        this.container.style.zIndex = 360 - this.position;
    }
}

class ScoreBoard {
    constructor(nickname) {
        this.score = 0;
        this.lives = 3;
        this.nickname = nickname;
        this.container = document.createElement('div');
        this.container.style.display = 'none';
        this.container.classList.add('scoreboard');
        this.nickContainer = document.createElement('p');
        this.scoreContainer = document.createElement('p');
        this.livesContainer = document.createElement('p');
        this.nickContainer.innerHTML = nickname;
        this.scoreContainer.innerHTML = "Your score: " + this.score;
        this.livesContainer.innerHTML = "Lives left: " + this.lives;
        this.container.appendChild(this.nickContainer);
        this.container.appendChild(this.scoreContainer);
        this.container.appendChild(this.livesContainer);
    }

    addPoints(points) {
        this.score += points;
        this.scoreContainer.innerHTML = "Your score: " + this.score;
    }

    substractLife(){
        this.lives -= 1;
        this.livesContainer.innerHTML = "Lives left: " + this.lives;
    }
}

class Results {
    constructor() {
        this.container = document.createElement('div');
        this.container.classList.add('resultsboard');
        this.data = [];
        this.dataURL = 'https://jsonblob.com/api/jsonBlob/1050366298407845888'
    }

    async getResults() {
        const response = await fetch(this.dataURL, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        )

        const data = await response.json();

        this.data = data.results;
        this.data.forEach(result => {
            var resultContainer = document.createElement('div');
            var playersName = document.createElement('p');
            playersName.innerHTML = result.nickname;
            var playersScore = document.createElement('p');
            playersScore.innerHTML = result.points + " points";
            resultContainer.appendChild(playersName);
            resultContainer.appendChild(playersScore);
            this.container.appendChild(resultContainer);
        })
        this.sendResults(this.data[0]);
    }

    async sendResults(result) {
        this.data.push(result);
        this.data.sort((a, b) => b.points - a.points);
        console.log(this.data.slice(0, 7));
        const response = await fetch("https://jsonblob.com/api/jsonBlob/", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': 'https:://jsonblob.com',
                'Access-Control-Allow-Methods': 'POST, PUT, DELETE, HEAD, PATCH, OPTIONS',
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "results": this.data.slice(0, 7),
            })
        });
        this.dataURL = response.headers.get('Location');        
    }

    showResults() {
        this.container.style.display = 'auto';
    };

    hideResults() {
        this.container.style.display = 'none';
    };
}

class Board {
    constructor() {
        this.cover = "board-bg.jpg";
        this.container = document.querySelector('.plansza');
        this.boardStyle();
    }

    boardStyle() {
        this.container.style.backgroundImage = "url(" + this.cover + ")";
    }

}

class Game {
    constructor() {
        this.board = new Board();
        this.results = new Results();
        this.scoreBoard = new ScoreBoard("Sobjan");
        this.board.container.appendChild(this.scoreBoard.container);
        this.board.container.appendChild(this.results.container);
        this.board.container.addEventListener("click", this.shot.bind(this), false)
    }

    addZombie(zombie) {
        this.board.container.appendChild(zombie);
    }

    shot(e) {
        if (e.target.classList.contains('zombie')) {
            this.scoreBoard.addPoints(12);
            e.target.remove();
        } else {
            this.scoreBoard.addPoints(-6);
        }
    }

    loseLife(e, interval) {
        if(e.animationName === "zombieWalk") {
            this.scoreBoard.substractLife()
            e.target.remove();
        }
        if(this.scoreBoard.lives === 0) {
            clearInterval(interval);
            const zombies = document.querySelectorAll('.zombie');
            zombies.forEach(zombie => {
                zombie.remove();
            });
        }
    }

    getResults() {
        this.results.getResults();
    }

    startGame() {
        var play = setInterval(() => {
            var zombie = new Zombie(
                0.5 + Math.random() * 1,
                Math.floor(1 + Math.random() * 4),
                Math.floor(10 + Math.random() * 350)
            );

            this.addZombie(zombie.container);
            zombie.container.addEventListener('animationend', (e) => this.loseLife(e, play))
        }, 100 * Math.floor(5 + Math.random() * 5))
    }

    finishGame() {

    }
}

document.addEventListener('DOMContentLoaded', new Game().getResults());