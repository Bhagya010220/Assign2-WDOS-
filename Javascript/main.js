

// function for hidden navigation menu 
var navigationLinks = document.getElementById("navigationLinks");

        function showMenu(){
            navigationLinks.style.right = " 0px"
        }

        function hideMenu(){
            navigationLinks.style.right ="-250px"
        }

//function for Take to top button

//Get the button
var mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}


// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// ------------------------Purchase and Donate Page-------------------------------//
//--------------------------------------------------------------------------------//
// cost arrays
// [[foreignadult, foreignchild, foreignannual], [localadult, localchild, localannual]]
let typeCost = [[5000,2500,1500],[1000,500,4500]]

// [foriegn3h, foreign halfday....][local3h, localhalfday,...]]
let durationCost = [[0,500,1000,2000],[0,250,500,1000]]

// --------- Order Data ----------
let region = 0;
let type = 0;
let num = 0;
let duration = "";
let extras = "";
let currenttotal = 0;
let totLoyalty = 0;
let thisOrderPoints = 0;
let totNumOfTickets =0;

function calcLoyalty() {
    if (totNumOfTickets > 3){
        thisOrderPoints = 20 * totNumOfTickets;
        if (localStorage.getItem("loyaltyP")) {
            totLoyalty = parseInt(localStorage.getItem("loyaltyP"));
        } else {
            totLoyalty = 0;
            localStorage.setItem("loyaltyp", 0);
        }
        totLoyalty += thisOrderPoints;
        localStorage.setItem("loyaltyp", totLoyalty);
    }
}


const checkloyaltyBtn = document.querySelector("#checkloyaltybtn");
checkloyaltyBtn.addEventListener("click", checkloyalty);
function checkloyalty() {
    if (localStorage.getItem("loyaltyp")) {
        points = parseInt(localStorage.getItem("loyaltyp"));
        alert(`You have ${points} loyaltty points`);
        }
       else {alert("you dont have loyalty points");}
}


placeorderBtn = document.getElementById("placeorder");
placeorderBtn.addEventListener("click", () => { 
    calcLoyalty();
    outputordertable.innerHTML = "";
    totNumOfTickets = 0;
    
    outputOverallTotal.innerHTML=0;
    alert(`Order placed! You earned ${thisOrderPoints} for this order, You have earnt total of ${totLoyalty}`)
    thisOrderPoints = 0;
});

const outputCurrentTotal = document.getElementById("currenttotal");
const outputOverallTotal =document.getElementById("totaloverall");
const outputordertable = document.getElementById("ordertableoutput");

const activityForm = document.querySelector(".activitiesform");
const regionSelect = document.getElementById("region");
const typeSelect = document.getElementById("pass-type");
const numinput = document.getElementById("num");
const durationSelect = document.getElementsByName("duration-select");
const foodToken = document.getElementById("foodtoken");

regionSelect.addEventListener("change", calcCurrentTotal);
typeSelect.addEventListener("change", calcCurrentTotal);

numinput.addEventListener("change", calcCurrentTotal);
durationSelect.forEach(option => {
    option.addEventListener("change", calcCurrentTotal);
});
foodToken.addEventListener("change", calcCurrentTotal);


const orderFavoriteButton = document.getElementById("orderfavorite");
const addtofavoritebutton = document.getElementById("addtofavorite");
const addtoorderbutton = document.getElementById("addtoorder");

orderFavoriteButton.addEventListener("click", orderfavorite);
addtofavoritebutton.addEventListener("click", addtofavorite);
addtoorderbutton.addEventListener("click", addtoorder);

function getDataFromForm() {
    region = regionSelect.selectedIndex; // 1 Foreign, 2 Local
    type = typeSelect.selectedIndex; // 1 Adult 2 Child 3 Annual
    num = numinput.value;
    durationSelect.forEach(option => {
        option.selected
    })

    durationSelect.forEach(option => {
        if(option.checked){
        duration = option.id;
        }
    });

    if (foodToken.checked == true) {
        extras = "foodtoken";
// 
        
    } else {
        extras = "";
    }
}

function calcCurrentTotal() {
    getDataFromForm();
    if (type === 3) {
        durationSelect.forEach(choice => choice.disabled = true);
        foodToken.disabled = true;

    } else {
        durationSelect.forEach(choice => choice.disabled = false);
        foodToken.disabled = false;
    }

    let totalCost = 0;
    // why -1 ? cuz index 0 is the disabled option in the drop down
    // so in array 0 is foreign but in selectedIndex 1 is foriegn
    // so to access correct value need to -1
    // same logic for type
    if  ((region !== 0) && (type !== 0)) {   
    totalCost += typeCost[region - 1][type - 1];

    switch (duration) {
        case "3h":
            totalCost += durationCost[region - 1][0];
            break;
        case "halfday":
            totalCost += durationCost[region - 1][1];
            break;
        case "fullday":
            totalCost += durationCost[region - 1][2];
            break;
        case "twodays":
            totalCost += durationCost[region - 1][3];
            break;
    
        default:
            break;
    }

    if (extras === "foodtoken") {
        totalCost += 500;
    }

    totalCost = totalCost * num;
    currenttotal = totalCost;
    
    outputCurrentTotal.innerText = `${totalCost}`;
} }

function resetOrderCurrent() {
    // reset the data   
                          
    region = "";
    type = "";
    num = 0;
    duration = "";
    extras = "";
    currenttotal = 0;
   
    

    // Reset the form
    outputCurrentTotal.innerText = 0;    
    regionSelect.selectedIndex = 0;
    typeSelect.selectedIndex = 0;
    numinput.value =0;

    for(let i=0;i<durationSelect.length;i++) {
    durationSelect[i].checked = false;
    }
    foodToken.checked = false;
}

function addtoorder(evnt) {
    evnt.preventDefault();
    if (activityForm.checkValidity() === true) {
        let regionTxt = "";
        let typeTxt = "";
        switch (region) {   
            case 1:
                regionTxt = "Foreign";
                break;
            case 2:
                regionTxt = "Local";
                break;
    
            default:
                break;
        }
    
        switch (type) {   
            case 1:
                typeTxt = "Adult";
                break;
            case 2:
                typeTxt = "Child";
                break;
            case 3:
                typeTxt = "Annual";
                break;
    
            default:
                break;
        }
        outputordertable.innerHTML += `<tr>
                                            <td>${regionTxt}</td>
                                            <td>${typeTxt}</td>
                                            <td>${num}</td>
                                            <td>${duration}</td>
                                            <td>${extras}</td>
                                            <td>${currenttotal}</td>
                                        </tr>`;
        overallOrderTotalNum = parseFloat(outputOverallTotal.innerText);
        overallOrderTotalNum += currenttotal;
        outputOverallTotal.innerText = overallOrderTotalNum;
        totNumOfTickets = totNumOfTickets + num;
        resetOrderCurrent();
    } else {
        alert("Error: Fill all details");
    }
}

// localstorage

function addtofavorite(evt) {
    evt.preventDefault();
    if (activityForm.checkValidity() === true) {         
        order = {
            region: 0,
            type: 0,
            num: 0,
            duration: "",
            extras: "" 
        }

        order.region = region;
        order.type = type;
        order.num = num;
        order.duration = duration;
        order.extras = extras;
        localStorage.setItem("favoriteorder", JSON.stringify(order));

    } else {
        alert("Error: Enter all the details")
    }

}

function orderfavorite(evt) {
    evt.preventDefault();
    if (localStorage.getItem("favoriteorder")){        
        order = JSON.parse(localStorage.getItem("favoriteorder"));
      

        duration = order.duration;
        region = order.region;
        type = order.type;
        num = order.num;
        extras = order.extras;

        formDataChange();
       
    } else {
        alert("No order saved as favorite");
    }
}

function formDataChange() {
    regionSelect.selectedIndex = region;
    typeSelect.selectedIndex = type;
    numinput.value =num;

    for(let i=0;i<durationSelect.length;i++) {
        if (durationSelect[i].id === duration) {
            durationSelect[i].checked = true;
        }
    }
    foodToken.checked = foodToken;
    calcCurrentTotal();
}





//Date validation for javascrpt
//-----------------------------
var todayDate = new Date();
var frmDate = document.getElementById("date");
var month = todayDate.getMonth() + 1; 
var year = todayDate.getUTCFullYear() - 0; 
var tdate = todayDate.getDate(); 
if(month < 10){
  month = "0" + month 
}
if(tdate < 10){
  tdate = "0" + tdate;
}
var maxDate = year + "-" + month  + "-" + tdate;
// Fill in today's date on the form. 
document.getElementById("date").value = maxDate;
//Prevent the user from entering an earlier invalid date.| restrct user to book tickets on a past date
frmDate.setAttribute("min",maxDate)





// Local storage functions to save form data and refil when user click the add to favourite button


const formId = "frmPurchase"; // ID of the form
const formDetector = `${formId}`; // Identifier used to identify the form
const saveButton = document.querySelector("#addFavourite"); // select save button
const retrieveButton = document.querySelector("#retriveFavourite"); // selectretrieve button
const alertBox = document.querySelector(".alert"); // select alert display div
let form = document.querySelector(`#${formId}`); // select form
let formElements = form.elements; // get the elements in the form

/**
 * This function gets the values in the form
 * and returns them as an object with the
 * [formDetector] as the object key
 * 
 */
 const getFormData = () => {
  let data = { [formDetector]: {} }; // create an empty object with the formDetector as the key and an empty object as its value
  for (const element of formElements) {
    if (element.name.length > 0) {
      data[formDetector][element.name] = element.value;
    }
  }
  return data;
};

saveButton.onclick = event => {
  event.preventDefault();
  data = getFormData();
  localStorage.setItem(formDetector, JSON.stringify(data[formDetector]));
  const message = "Your order has been saved as a favorite . Thank you.";
  displayAlert(message);
};

/**
 * This function displays a message
 * on the page for 2 seconds
 *
 * 
 */
const displayAlert = message => {
  alertBox.innerText = message; // add the message into the alert box
  alertBox.style.display = "block"; // make the alert box visible
  setTimeout(function() {
    alertBox.style.display = "none"; // hide the alert box after 2 second
  }, 2000);
};


/**
 * This function refill the favourte order when user clicks order favourite button
 * with data from localStorage
 *
 */
 const formautoRefill = () => {
  if (localStorage.key(formDetector)) {
    const savedData = JSON.parse(localStorage.getItem(formDetector)); // get and parse the saved data from localStorage
    for (const element of formElements) {
      if (element.name in savedData) {
        element.value = savedData[element.name];
      }
    }
    const message = "Form has been refilled with saved data!";
    displayAlert(message);
    document.getElementById("extra_items").style.display = "block"; 
  }
};


// auto refill the form when the retreive favourite button is clicked
retrieveButton.onclick = function(){
    formautoRefill(); 
    calculateCost();

}





//------------------------------------------------------              
//calculate and store loyalty points and save it in the local storage

var grand_loyaltyPoints = 0;
var loyaltyPoints =0;
var totalTicket = 0;

function calcLoyaltyPoints(){
 
  
  totalTicket = totalTicket + ticketApp.no_of_adults + ticketApp.no_of_children;
  if(totalTicket > 3){
      loyaltyPoints = 20 * totalTicket;
      grand_loyaltyPoints = grand_loyaltyPoints + loyaltyPoints; 
      localStorage.setItem("loyality",grand_loyaltyPoints);
  }
}

/*when user clicks on the "Check loyalty points" button,
it shows total loyalty points that have earned by the user so far based on the overall order*/
function showLoyaltyPoints(){
  
  grand_loyaltyPoints = JSON.parse(localStorage.getItem(`loyality`));
 
  if(grand_loyaltyPoints>0){
      alert("Congratulations! You have earned "+  grand_loyaltyPoints + " loyalty points so far");
  }
  else{
      alert("Sorry! You don't have any loyalty points so far");
  }
}




// --------------------------Donate section---------------------------------
//--------------------------------------------------------------------------


//Input validations for the donate form
function inputValidation(){
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var cardNumber = document.getElementById("cardNum").value;
    var pinNumber = document.getElementById("cvv").value;
    var cardholderName = document.getElementById("cardHolder").value;
    var mothInput = document.getElementById("monthInput").value;
    var yearInput = document.getElementById("yearInput").value;
    var fixedDonatons = document.getElementById("fixedDonatons").value;

    var email_pattern = /^[A-Za-z\d\.\_]+\@[A-Za-z\d\.\-]+\.[A-Za-z]{2,5}$/;
    var name_pattern = /^\b(?!.*\.{2})[a-zA-Z.]+(?:\s[a-zA-Z.]+)\b$/;
    var card_pattern = /^[0-9]{16,16}$/;
    var pin_pattern = /^[0-9]{3,3}$/;
    var holder_pattern = /^\b(?!.*\.{2})[a-zA-Z.]+(?:\s[a-zA-Z.]+)\b$/;


    

  if(!name.match(name_pattern)){
     
     alert("Please enter a valid details");
     document.getElementById("txtname").focus();
    return false;
  }


  if(!email.match(email_pattern)){
      alert("Please enter a valid email");
      document.getElementById("txtemail").focus();
      return false;
  }

  if(fixedDonatons == ""){
    alert("Please select the donation amout");
    return;
  }

  if(!cardNumber.match(card_pattern)){
      alert("Please enter a valid cardnumber");
      document.getElementById("cardNum").focus();
      return false;
  }

  if(!cardholderName.match(holder_pattern)){
      
    alert("Please enter a valid cardholder name");
    document.getElementById("card-holder").focus();
    return false;
  }

  if(!pinNumber.match(pin_pattern)){
    alert("Please enter a valid pin number(cvv)");
    document.getElementById("txtadd").focus();
    return false;
  }


  if(mothInput == ""){
    alert("Please select expiration month of your credit/debit card");
    document.getElementById("monthInput").focus();
    return;
  }

  if(yearInput == ""){
    alert("Please select the expiration year of your credit/debit card");
    document.getElementById("yearInput").focus(); 
    return;
  }

  alert("Thank you so much for your contribution! The receipt will be sent to your email address.")

  clearDonatiom();
  
}

// clear form after click the Donate button
function clearDonatiom(){
  const inputs = document.querySelectorAll('#name, #email, #address, #fixedDonatons, #comment, #cardNum, #cardHolder, #monthInput, #yearInput, #cvv');

  inputs.forEach(input => {
    input.value = '';
  });
};




// fixed donation amounts that are customized and multi-selectable.
class CustomSelect {
  constructor(originalSelect) {
    this.originalSelect = originalSelect;
    this.customSelect = document.createElement("div");
    this.customSelect.classList.add("select");

    this.originalSelect.querySelectorAll("option").forEach((optionElement) => {
      const itemElement = document.createElement("div");

      itemElement.classList.add("select__item");
      itemElement.textContent = optionElement.textContent;
      this.customSelect.appendChild(itemElement);

      if (optionElement.selected) {
        this._select(itemElement);
      }

      itemElement.addEventListener("click", () => {
        if (
          this.originalSelect.multiple &&
          itemElement.classList.contains("select__item--selected")
        ) {
          this._deselect(itemElement);
        } else {
          this._select(itemElement);
        }
      });
    });

    this.originalSelect.insertAdjacentElement("afterend", this.customSelect);
    this.originalSelect.style.display = "none";
  }

  _select(itemElement) {
    const index = Array.from(this.customSelect.children).indexOf(itemElement);

    if (!this.originalSelect.multiple) {
      this.customSelect.querySelectorAll(".select__item").forEach((el) => {
        el.classList.remove("select__item--selected");
      });
    }

    this.originalSelect.querySelectorAll("option")[index].selected = true;
    itemElement.classList.add("select__item--selected");
  }

  _deselect(itemElement) {
    const index = Array.from(this.customSelect.children).indexOf(itemElement);

    this.originalSelect.querySelectorAll("option")[index].selected = false;
    itemElement.classList.remove("select__item--selected");
  }
}

document.querySelectorAll(".custom-select").forEach((selectElement) => {
  new CustomSelect(selectElement);
});


