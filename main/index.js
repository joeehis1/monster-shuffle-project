import { monsters } from "./collection.js";
let sockSelected;
let monsterCount;
let container;
let countDisplay;
let shuffled;
let notificationText;
let restartButton;
let heading;
let announcement;
window.addEventListener("DOMContentLoaded", (e) => {
    sockSelected = false;
    container = document.querySelector(".app");
    countDisplay = document.querySelector(".count");
    restartButton = document.querySelector(".restart-button");
    notificationText = document.querySelector(".notificationText");
    announcement = document.querySelector("#announcement");
    heading = document.querySelector("h1");
    // monsterCount = monsters.filter(({ name }) =>
    //     name.startsWith("monster")
    // ).length;
    // updateCount(monsterCount);
    // shuffled = shuffle(monsters);
    // const imageRender = getImageRender(shuffled);
    // container.innerHTML = `<p>Clicking on a door will reaveal a monster hidden beneath. If a sock is revealed, the game is over and you will need to start again</p><ul class="image-display">${imageRender}</ul>`;
    // document.addEventListener("click", handleImageClick);
    initialiseGame();
    updateAnnouncement();
});
function initialiseGame() {
    monsterCount = monsters.filter(({ name }) => name.startsWith("monster")).length;
    updateCount(monsterCount);
    shuffled = shuffle(monsters);
    const imageRender = getImageRender(shuffled);
    container.innerHTML = `<p>Clicking on a door will reaveal a monster hidden beneath. If a sock is revealed, the game is over and you will need to start again</p><ul class="image-display">${imageRender}</ul>`;
    document.addEventListener("click", handleImageClick);
}
function updateCount(count) {
    if (count === 0) {
        endGame(true);
    }
    countDisplay.textContent = `Remaining Monsters:${count}`;
}
function endGame(succeeded) {
    if (!succeeded) {
        notificationText.innerHTML = `You did not find all the monsters this time. Click on the play again button to play again`;
    }
    else {
        notificationText.innerHTML = `Congratulations you found all the monsters. Click on the play again button to play again`;
    }
    const remainingButtons = container.querySelectorAll("button[data-click-reveal]");
    remainingButtons.forEach((button) => {
        replaceButton(button, "door", "Image of a door");
    });
    restartButton.classList.add("shown");
    restartButton.addEventListener("click", resetGame);
}
function resetGame() {
    initialiseGame();
    heading.focus();
    notificationText.innerHTML = "";
    restartButton.classList.remove("shown");
    restartButton.removeEventListener("click", resetGame);
    updateAnnouncement();
}
function handleImageClick(e) {
    if (sockSelected)
        return;
    const target = e.target;
    if (target.closest("button[data-click-reveal]")) {
        // console.log("clicked");
        const button = target.closest("button[data-click-reveal]");
        const imageIndex = button.getAttribute("data-click-reveal");
        const image = shuffled.find((monster, index) => index === Number(imageIndex));
        const { name, alt } = image;
        // const img = document.createElement("img");
        // const placeholder = document.createElement("figure");
        // placeholder.className = "box";
        // img.src = getImgUrl(name);
        // img.alt = alt;
        // placeholder.append(img);
        // button.replaceWith(placeholder);
        replaceButton(button, name, alt);
        updateAnnouncement(alt);
        if (name.startsWith("sock")) {
            sockSelected = true;
            endGame(false);
        }
        else {
            monsterCount--;
            updateCount(monsterCount);
        }
    }
}
function updateAnnouncement(text = undefined) {
    if (!text) {
        announcement.innerHTML = `12 doors shown.`;
    }
    else {
        announcement.innerHTML = `Displaying ${text}`;
    }
}
function replaceButton(button, imageName, altText) {
    const img = document.createElement("img");
    const placeholder = document.createElement("figure");
    placeholder.className = "box";
    img.src = getImgUrl(imageName);
    img.alt = altText;
    placeholder.append(img);
    button.replaceWith(placeholder);
}
function getImgUrl(image) {
    return `main/images/${image}.svg`;
}
function shuffle(data) {
    const copy = Array.from(data);
    for (let i = copy.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * i);
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
function getImageRender(collection) {
    return collection
        .map((image, index) => {
        return `
            <li >
                <button data-click-reveal="${index}">
                    <img src="${getImgUrl("door")}" alt="Image of door ${index + 1}"/>
                </button>
            </li>
        `;
    })
        .join("");
}
