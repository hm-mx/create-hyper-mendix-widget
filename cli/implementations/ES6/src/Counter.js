export default function (widgetProps, mountingNode) {

    //  Counter Component wrapper
    const counterWrapper = document.createElement("div");
    counterWrapper.className = "es6-counter";

    // Header
    const counterHeader = document.createElement("div");
    counterHeader.className = "counter-header";

    const spanLeft = document.createElement("span");
    spanLeft.innerText = "•••";

    const spanRight = document.createElement("span");
    spanRight.innerText = "•••";

    const headerText = document.createElement("h1");
    headerText.innerText = widgetProps.dummyKey;

    counterHeader.appendChild(spanLeft);
    counterHeader.appendChild(headerText);
    counterHeader.appendChild(spanRight);


    // Counter Count
    const counterCount = document.createElement("h1");
    counterCount.className = "counter-count";
    counterCount.innerText = '0';


    // Controls wrapper
    const controlsWrapper = document.createElement("div");
    controlsWrapper.className = "controls-wrapper";

    const btnDown = document.createElement("button");
    btnDown.className = "counter-btn";
    btnDown.innerText = "-";


    const btnUp = document.createElement("button");
    btnUp.className = "counter-btn";
    btnUp.innerText = "+";


    controlsWrapper.appendChild(btnDown);
    controlsWrapper.appendChild(btnUp);


    counterWrapper.appendChild(counterHeader);
    counterWrapper.appendChild(counterCount);
    counterWrapper.appendChild(controlsWrapper);


    // mount counter to the dom
    mountingNode.appendChild(counterWrapper);


    // set actions
    btnUp.onclick = () => {
        const nextCount = parseInt(counterCount.innerText, 10) + 1;
        counterCount.innerText = nextCount;
    };
    btnDown.onclick = () => {
        const nextCount = parseInt(counterCount.innerText, 10) - 1;
        counterCount.innerText = nextCount;
    };


};