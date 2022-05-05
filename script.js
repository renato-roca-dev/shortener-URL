let input = document.getElementById("input-url");
let divResult = document.getElementById("shortener-results");
let divShortened = divResult.getElementsByClassName("shortened-result");
let clearHistoryBtn = document.getElementById("btn-clearHistory");

async function apiLink(){
    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${input.value}`);
    const links = await response.json();
    if(links.error_code == 1){
        document.getElementById("form-error").style.display = "block";
        document.getElementById("input-error").textContent = "Please add a URL";
        input.classList.add("errorHolder");
        input.style.border = "2px solid #f46262";
        input.value = "";
        input.focus();
    } else if (links.error_code == 2){
        document.getElementById("form-error").style.display = "block";
        document.getElementById("input-error").textContent = "Please add a valid URL";
        input.classList.add("errorHolder");
        input.style.border = "2px solid #f46262";
        input.value = "";
        input.focus();
    } else if (links.error_code == 3){
        document.getElementById("form-error").style.display = "block";
        document.getElementById("input-error").textContent = "Please wait a second and try again.";
        input.classList.add("errorHolder");
        input.style.border = "2px solid #f46262";
        input.focus();
    } else if (links.error_code == 10){
        document.getElementById("form-error").style.display = "block";
        document.getElementById("input-error").textContent = "This URL is desabilited.";
        input.classList.add("errorHolder");
        input.style.border = "2px solid #f46262";
        input.value = "";
        input.focus();
    }
    var originalLink = links.result.original_link;
    var shortenedLink = links.result.short_link;
    var shortenedLinkAnchor = links.result.full_short_link;
    const essentialLinks = {
        originalLink: originalLink,
        shortenedLink: shortenedLink,
        shortenedLinkAnchor: shortenedLinkAnchor
    }
    return essentialLinks;
}

let submitUrl = document.getElementById("btn-submit");
submitUrl.addEventListener("click", async (e) =>{
    e.preventDefault();
    let links = [];
    
    try {
        links = await apiLink();
        var result = Object.keys(links).map((key) => ([links[key]]));

        createElement();

        localStorage.setItem('links', divResult.innerHTML);
        
        checkButton()

        document.getElementById("form-error").style.display = "none"
        input.style.border = "none"
        input.classList.remove("errorHolder");
        input.value = "";
        input.focus();

    } catch (e){}
    
    function createElement(){
        let shortenedResult = document.createElement("div");
        let firstAnchor = document.createElement("a");
        let shortenedBtnResult = document.createElement("div");
        let shortenedUrl = document.createElement("a");
        var btnCopy = document.createElement("button");
        let originalLink = result[0];
        let shortenedLink = result[1];
        let shortenedLinkAnchor = result[2];
    
        shortenedResult.className = ("shortened-result flex");
    
        firstAnchor.setAttribute("href", originalLink);
        firstAnchor.setAttribute("target", "blank");
        firstAnchor.className = "original-url";
        firstAnchor.textContent = originalLink;
        shortenedResult.appendChild(firstAnchor);
    
        shortenedBtnResult.className = "shortened-btn-result flex";
        shortenedResult.appendChild(shortenedBtnResult);
        
        shortenedUrl.setAttribute("href", shortenedLinkAnchor);
        shortenedUrl.setAttribute("target", "blank");
        shortenedUrl.className = "shortened-url";   
        shortenedUrl.textContent = shortenedLink;
        shortenedBtnResult.appendChild(shortenedUrl);
    
        btnCopy.setAttribute("type", "button");
        btnCopy.setAttribute("id", shortenedLinkAnchor);
        btnCopy.className = "btn-copy";
        btnCopy.textContent = "Copy";
        shortenedBtnResult.appendChild(btnCopy);

        divResult.appendChild(shortenedResult);
        return shortenedResult;
    }
})

var copyBtn = document.getElementsByClassName("btn-copy");
divResult.addEventListener("click", function(i){
    let arr = i.target;
    if (arr.tagName == "BUTTON"){
        navigator.clipboard.writeText(arr.id);
        arr.textContent = "Copied!";
        arr.style.backgroundColor = "#3b3054";
        setTimeout(function(){
            arr.textContent = "Copy!";
            arr.style.backgroundColor = "";
        }, 1500);
    }
})

function checkButton(){
    if(localStorage.getItem('links') === null){
        clearHistoryBtn.style.display = "none"
    } else {
        clearHistoryBtn.style.display = "block"
    }
    return
}

function getData(){
    return divResult.innerHTML = localStorage.getItem('links')
}
getData();

clearHistoryBtn.addEventListener("click", function(){
    divResult.innerHTML = "";
    localStorage.removeItem('links');
    clearHistoryBtn.style.display = "none"
})

checkButton();