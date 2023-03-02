// load spinner
let spinner = isLoad => {
    if (isLoad) document.querySelector("#spinner").classList.replace("d-none", "d-flex");
    else document.querySelector("#spinner").classList.replace("d-flex", "d-none");
}

// sort tools by date
let sortTools = _ => {
    const toolsDate = document.querySelectorAll(".tool-publish");
    const toolsPublish = [];

    toolsDate.forEach(toolDate => {
        let date = new Date(toolDate.innerText);
        toolsPublish.push(date);
    });

    toolsPublish.sort((a, b) => a - b);

    toolsDate.forEach(toolDate => {
        let date = new Date(toolDate.innerText).getTime();

        toolsPublish.forEach( (toolPublish, index) => {
            if (date === toolPublish.getTime()) toolDate.parentElement.parentElement.parentElement.parentElement.style.order = index;
        });
    });
}

// create ai tool card
let createAICard = (obj, endLength = 6) => {
    let objTools = obj.data.tools;
    let newObjTools = objTools.slice(0, endLength);
    let aiArea = document.getElementById("ai-area");

    newObjTools.forEach((tool, index) => {
        let uniqueAId = tool.name.toLowerCase().replaceAll(" ", "").replaceAll(".", "");
        let card = document.createElement("div");

        card.classList.add("card", "p-3");
        card.innerHTML = `
        <img src="${tool.image}" class="card-img-top rounded-bottom" alt="" style="height: 170px;">
        <div class="card-body px-0">
            <h5 class="card-title fw-semibold fs-4">Features</h5>
            <ol class="small text-muted ps-3" id="${uniqueAId}-feature"></ol>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center bg-transparent px-0">
            <div>
                <h5 class="fw-semibold fs-5">${tool.name}</h5>
                <div class="small text-muted">
                    <i class='bx bx-calendar'></i>
                    <span class="tool-publish">${tool["published_in"]}</span>
                </div>
            </div>
            <div id="trigger-modal" class="d-flex justify-content-center align-items-center rounded-circle">
                <i class='bx bx-right-arrow-alt'></i>
            </div>
        </div>
        `;

        if (newObjTools.length === (index + 1)) spinner(false);

        aiArea.appendChild(card);

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
    spinner(true);

    let obj;
    await getData().then(result => obj = result);
    createAICard(obj);
}

// invoke sort tools
document.getElementById("sort-ai").addEventListener("click", _ => {
    sortTools();
});

// initial load
onload = _ => {
    displayAI();
}