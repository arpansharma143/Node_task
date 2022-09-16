const addMoreBtn = document.getElementById("add_adress");
const remvoeadressBtn = document.getElementById("remove_adress");

let addMoreBtncounting = 1;
// adding the addres more
addMoreBtn.addEventListener("click", () => {
  addMoreBtncounting++;
  const addres = document.getElementById("addressmain");
  const div = document.createElement("div");
  div.classList = "adress";
  div.innerHTML = ` <label for="">adress ${addMoreBtncounting}</label>
    <input type="text" name="city" placeholder="add your city" required id="city"/>
    <input type="text" name="state" placeholder="add your state" required id="state"/>
    <input type="text" name="zip" placeholder="add your zip code" required id="zip"/>`;
  addres.append(div);
});
// removeing the adress
remvoeadressBtn.addEventListener("click", () => {
  const mainAdressDiv = document.getElementById("addressmain");
  if (addMoreBtncounting === 1) {
    alert("you have to add alleat one adress");
    return;
  }
  mainAdressDiv.removeChild(mainAdressDiv.lastChild);
  addMoreBtncounting--;
});
// geting the dropdown country data form backend
async function getAdress() {
  const countrySelect = document.getElementById("country");
  const res = await fetch("http://localhost:3000/getAddress");
  const parsedRes = await res.json();

  for (let key of parsedRes.countryList) {
    const option = document.createElement("option");
    option.textContent = key;
    option.value = key;
    countrySelect.append(option);
  }
}
getAdress();

// submit start
const form = document.getElementById("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const country = document.getElementById("country");
  const email = document.getElementById("eMail");
  const file = document.getElementById("file");

  let gender;
  if (document.getElementById("male").checked) {
    gender = document.getElementById("male").value;
  } else if (document.getElementById("female").checked) {
    gender = document.getElementById("female").value;
  }

  const adressCity = document.querySelectorAll("#city");
  const adressState = document.querySelectorAll("#city");
  const adressZip = document.querySelectorAll("#city");

  //getting the all adress  feids data from input and string in object
  const adressInfo = {};
  function creatingAdressInfoObj(adress, adressName) {
    let adressCounting = 1;
    for (let key of adress) {
      let adressObjNo = `address${adressCounting}`;
      adressInfo[adressObjNo] = {
        ...adressInfo[adressObjNo],
        [adressName]: key.value,
      };
      adressCounting++;
    }
  }
  creatingAdressInfoObj(adressCity, "city");
  creatingAdressInfoObj(adressState, "state");
  creatingAdressInfoObj(adressZip, "zip");

  let fd = new FormData();

  fd.append("firstName", firstName.value);
  fd.append("lastName", lastName.value);
  fd.append("city", country.value);
  fd.append("gender", gender);
  fd.append("avtar", file.files[0]);
  fd.append("eMail", email.value);
  let stringifyAdressInfo = JSON.stringify(adressInfo);
  fd.append("addressInfo", stringifyAdressInfo);

  //first cheking the user exists or not that
  const res = await fetch("http://localhost:3000/checkEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value }),
  });

  const resEmail = await res.json();

  // if user is not exists
  if (resEmail.status === true) {
    const res = await fetch("http://localhost:3000/savePost", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    data;
    alert(data.msg);
  } else {
    alert(resEmail.msg);
  }
});
