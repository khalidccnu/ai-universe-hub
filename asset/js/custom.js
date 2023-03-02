// fetch data from server
let getData = _ => {
    return fetch(`https://openapi.programming-hero.com/api/ai/tools`).then(response => response.json());
}

// display data in AI
let displayAI = async _ => {
    let obj;
    await getData().then(result => obj = result);
}

// initial load
onload = _ => {
    displayAI();
}