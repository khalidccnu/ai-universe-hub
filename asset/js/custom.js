let aiArea = document.getElementById("ai-area");

// show tool detail in modal
let toolDetail = async toolID => {
    toolID < 10 ? toolID = "0" + toolID : toolID;

    let obj;
    await getData(toolID).then(result => obj = result);

    document.getElementById("tool-img").src = obj.data["image_link"][0];
    document.getElementById("tool-ex-ip").innerText = obj.data["input_output_examples"][0].input;
    document.getElementById("tool-ex-op").innerText = obj.data["input_output_examples"][0].output;
    document.getElementById("tool-accuracy").innerText = obj.data.accuracy.score * 100 + "% accuracy";

    document.getElementById("tool-description").innerText = obj.data.description;
    document.getElementById("tool-price").firstElementChild.firstElementChild.innerText = obj.data.pricing[0].plan;
    document.getElementById("tool-price").firstElementChild.lastElementChild.innerText = obj.data.pricing[0].price;
    document.getElementById("tool-price").firstElementChild.nextElementSibling.firstElementChild.innerText = obj.data.pricing[1].plan;
    document.getElementById("tool-price").firstElementChild.nextElementSibling.lastElementChild.innerText = obj.data.pricing[1].price;
    document.getElementById("tool-price").lastElementChild.firstElementChild.innerText = obj.data.pricing[2].plan;
    document.getElementById("tool-price").lastElementChild.lastElementChild.innerText = obj.data.pricing[2].price;

    let toolFeatures = document.getElementById("tool-features");
    let toolIntegrations = document.getElementById("tool-integrations");

    toolFeatures.innerHTML = "";
    toolIntegrations.innerHTML = "";

    for(let feature in obj.data.features) {
        let list = document.createElement("li");
        list.innerText = obj.data.features[feature]["feature_name"];

        document.getElementById("tool-features").appendChild(list);
    }

    obj.data.integrations.forEach(integration => {
        let list = document.createElement("li");
        list.innerText = integration;

        toolIntegrations.appendChild(list);
    });
}

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
            <div id="trigger-modal" class="d-flex justify-content-center align-items-center rounded-circle" onclick="toolDetail(${tool.id});" data-bs-toggle="modal" data-bs-target="#ai-tool-modal">
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

    document.getElementById("sort-ai").classList.remove("d-none");

    if (endLength === 6) aiArea.nextElementSibling.classList.remove("d-none");
}

// fetch data from server
let getData = target => {
    let keyword;

    if (target === "multiple") keyword = "tools";
    else keyword = "tool/" + target;

    return fetch(`https://openapi.programming-hero.com/api/ai/${keyword}`).then(response => response.json());
}

// display data in AI
let displayAI = async isMore => {
    spinner(true);

    let obj;
    await getData("multiple").then(result => obj = result);
    isMore === undefined ? createAICard(obj) : createAICard(obj, obj.data.tools.length);
}

// display more tool
document.getElementById("see-more").addEventListener("click", _ => {
    aiArea.innerHTML = "";
    aiArea.nextElementSibling.classList.add("d-none");

    displayAI(true);
});

// invoke sort tools
document.getElementById("sort-ai").addEventListener("click", _ => {
    sortTools();
});

// initial load
onload = _ => {
    displayAI();
}