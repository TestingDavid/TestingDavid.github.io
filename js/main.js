var artChips = ["Chips (Lay's Classic)", "1.99"];
var artBier = ["Bier (Heineken)", "0.85"];
var artApfel = ["Apfel (Pink Lady)", "0.57"];
var artSchoko = ["Schokolade (Kinder)", "1.59"];
var artPizza = ["Pizza (Steinofen Salami)", "1.79"];
var artWasser = ["Wasser (Volvic)", "4.79"];
var articles = [];
articles.push(artChips, artBier, artApfel, artSchoko, artPizza, artWasser);

function addArticleTbl() {
    var tableBody = document.getElementById('articleTblBody');
    var article = document.getElementById('field').value;

    if(checkArticle(article)) {
        var tr = document.createElement('tr');
        var tdName = document.createElement('td');
        var tdAmount = createTDAmount();
        var tdPrice = document.createElement('td');

        var artName = document.createTextNode(article);
        var deleteBtn = createDeleteButton();
        var priceText = getPriceForArticle(article);
        var artPrice = document.createTextNode(priceText);

        tdName.appendChild(artName);
        tdName.appendChild(deleteBtn);
        tdPrice.appendChild(artPrice);

        tr.appendChild(tdName);
        tr.appendChild(tdAmount);
        tr.appendChild(tdPrice);

        tableBody.appendChild(tr);
        calculateOverallPrice();
    }
}

function getPriceForArticle(article) {
    for(var i = 0; i < articles.length; i++) {
        var art = articles[i];
        if(article === art[0]) {
            return art[1];
        }
    }
}

function checkArticle(article) {
   for(var i = 0; i < articles.length; i++) {
       var art = articles[i];
       if(article === art[0]) {
           return true;
       }
   }
   alert("Artikel: '" + article + "' nicht vorhanden");
   return false;
}

function deleteRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    calculateOverallPrice();
}

function calculateOverallPrice() {
    var overallPrice = 0;

    var rows = document.getElementById('articleTblBody').getElementsByTagName("tr");

    for(var i = 0; i < rows.length; i++) {
        var amount = parseInt(rows[i].childNodes[1].childNodes[1].value);
        var price = parseFloat(rows[i].childNodes[2].firstChild.data);
        overallPrice += (amount * price);

    }

    var td = document.getElementById('overallPrice');
    td.removeChild(td.firstChild);
    td.appendChild(document.createTextNode(overallPrice.toFixed(2)))
}

function changeAmount(button) {
    var input = button.parentNode.childNodes[1];
    if(button.value === "-"){
        if(input.value > 1) {
            input.stepDown(1);
        }
    } else if(button.value === "+") {
        input.stepUp(1);
    }
    calculateOverallPrice();
}

function createDeleteButton() {
    var deleteBtn = document.createElement('button');
    deleteBtn.setAttribute("id","deleteRow");
    deleteBtn.setAttribute("value", "Delete");
    deleteBtn.setAttribute("onclick","deleteRow(this)");
    deleteBtn.innerHTML = "Löschen";
    return deleteBtn;
}

function createTDAmount() {
    var td = document.createElement('td');

    var down = document.createElement('button');
    down.setAttribute("id","decAmount");
    down.setAttribute("value", "-");
    down.setAttribute("onclick","changeAmount(this)");
    down.innerHTML = "-";

    var up = document.createElement('button');
    up.setAttribute("id","incAmount");
    up.setAttribute("value", "+");
    up.setAttribute("onclick","changeAmount(this)");
    up.innerHTML = "+";

    var input = document.createElement('input');
    input.setAttribute("type", "number");
    input.value = "1";

    td.appendChild(down);
    td.appendChild(input);
    td.appendChild(up);

    return td;
}

function addArticleScan() {
    var scanner = new Instascan.Scanner({video: document.getElementById('preview')});
    scanner.addListener('scan', function(content){
        document.getElementById('field').value = content;
        addArticleTbl();
        scanner.stop();
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
    }});
}