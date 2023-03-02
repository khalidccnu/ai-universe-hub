// create ai tool card
let createAICard = obj => {
    let objTools = obj.data.tools;
    let aiArea = document.getElementById("ai-area");

    objTools.forEach(tool => {
        let uniqueAId = tool.name.toLowerCase().replaceAll(" ", "").replaceAll(".", "");
        let cardCol = document.createElement("div");

        cardCol.classList.add("col-12", "col-md-6", "col-lg-4");
        cardCol.innerHTML = `
        <div class="card p-3">
            <img src="${tool.image}" class="card-img-top rounded-bottom" alt="" style="width: 322px; height: 170px;">
            <div class="card-body px-0">
                <h5 class="card-title fw-semibold fs-4">Features</h5>
                <ol class="small text-muted ps-3" id="${uniqueAId}-feature"></ol>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center bg-transparent px-0">
                <div>
                    <h5 class="fw-semibold fs-5">${tool.name}</h5>
                    <div class="small text-muted">
                        <i class='bx bx-calendar'></i>
                        <span>${tool["published_in"]}</span>
                    </div>
                </div>
                <div id="trigger-modal" class="d-flex justify-content-center align-items-center rounded-circle">
                    <i class='bx bx-right-arrow-alt'></i>
                </div>
            </div>
        </div>
        `;

        aiArea.appendChild(cardCol);

        tool.features.forEach(feature => {
            let list = document.createElement("li");
            list.innerText = feature;

            document.getElementById(uniqueAId + "-feature").appendChild(list);
        });
    });
}

// fetch data from server
let getData = _ => {
    return fetch(`https://openapi.programming-hero.com/api/ai/tools`).then(response => response.json());
}

// display data in AI
let displayAI = async _ => {
    let obj;
    await getData().then(result => obj = result);
    createAICard(obj);
}

// initial load
onload = _ => {
    displayAI();
}