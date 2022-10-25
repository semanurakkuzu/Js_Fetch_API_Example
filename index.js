
gameList = document.querySelector("#gameList")
let gameArray = []
let createCard = function (id, image, title, savings, discountedPrice, price) {
    let divCard = document.createElement('div')
    divCard.className = "col-12 col-md-3 mb-3"
    divCard.innerHTML = `
        <div class="card">
        <img src="${image}" class="card-img-top" alt="...">
        <div class="card-body">
            <div class="row mb-2">
                <div class="col">
                    <h6 class="card-title">${title}</h6>
                </div>
                <div id="game-${id}-savings" class="${savings === 0 ? 'd-none' : ''} col-auto align-self-center text-end">
                    <h6 class="discountRate text-danger">${savings}% <i class="bi bi-fire text-danger"></i></h6>
                </div>
            </div>
            <span class="salePrice card-text fs-4">$${discountedPrice}</span>
            <span class="${savings === 0 ? 'd-none' : ''} normalPrice fs-6 text-danger text-decoration-line-through"> $${price} </span>
        </div>
    </div>`
    /*
    if (savings === 0) {
        divCard.querySelector(`#game-${id}-savings`).style.display = "none"
        divCard.querySelector(`.normalPrice`).style.display = "none"
    }
    */
    gameList.append(divCard)
}

fetch("https://www.cheapshark.com/api/1.0/games?title=batman&limit=8&exact=0")
    .then(response => response.json())
    .then(games => {
        games.forEach(game => {
            fetch("https://www.cheapshark.com/api/1.0/games?id=" + game.gameID)
                .then(response => response.json())
                .then(gameDetails => {
                    gameArray.push(
                        {
                            id: game.gameID,
                            image: game.thumb,
                            title: game.external,
                            savings: Math.floor(gameDetails.deals[0].savings),
                            salePrice: gameDetails.deals[0].price,
                            normalPrice: gameDetails.deals[0].retailPrice
                        }
                    )
                    createCard(
                        game.gameID,
                        game.thumb,
                        game.external,
                        Math.floor(gameDetails.deals[0].savings),
                        gameDetails.deals[0].price,
                        gameDetails.deals[0].retailPrice,
                    )
                })
        })
    })


function selectFunction(selectObject) {
    let value = selectObject.value
    gameList.innerHTML = ""
    if (value == "1") {
        gameArray = gameArray.sort((a, b) => {
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();
            if (titleA > titleB) {
                return 1
            }

            if (titleB > titleA) {
                return -1
            }

            return 0;

        })
    }
    else if (value == "2") {
        gameArray = gameArray.sort((a, b) => {
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();
            if (titleB > titleA) {
                return 1
            }

            if (titleA > titleB) {
                return -1
            }
            return 0;
        })


    }
    else if (value == "3") {
        gameArray.sort((a, b) => b.salePrice - a.salePrice)

    }
    else if (value == "4") {
        gameArray.sort((a, b) => a.salePrice - b.salePrice)

    }

    gameArray.forEach(game => {
        createCard(
            game.id,
            game.image,
            game.title,
            Math.floor(game.savings),
            game.salePrice,
            game.normalPrice,
        )

    })
}
function searchFunction(event) {
    event.preventDefault();
    let searchText = document.getElementById("search").value
    searchText = searchText.toLowerCase()
    const filteredGameArray = gameArray.filter(game => game.title.toLowerCase().includes(searchText))
    gameList.innerHTML = ""
    filteredGameArray.forEach(filtergame => {
        createCard(
            filtergame.id,
            filtergame.image,
            filtergame.title,
            Math.floor(filtergame.savings),
            filtergame.salePrice,
            filtergame.normalPrice,
        )

    })

}