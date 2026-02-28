let currentMonth = "Janvier";
let data = JSON.parse(localStorage.getItem("heures")) || {};

function changeMonth(month) {
  currentMonth = month;
  displayEntries();
}

function addEntry() {
  const client = document.getElementById("client").value;
  const intervention = document.getElementById("intervention").value;
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value;

  if (!data[currentMonth]) data[currentMonth] = [];

  const entry = { client, intervention, start, end, type, description };
  data[currentMonth].push(entry);

  saveData();
  displayEntries();
}

function displayEntries() {
  const container = document.getElementById("entries");
  container.innerHTML = "";

  let totalSupp = 0;
  let totalAstreinte = 0;

  if (!data[currentMonth]) return;

  data[currentMonth].forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "entry " + entry.type;

    const duration = calculateHours(entry.start, entry.end);

    if (entry.type === "supp") totalSupp += duration;
    else totalAstreinte += duration;

    div.innerHTML = `
      <span class="delete" onclick="deleteEntry(${index})">✖</span>
      <span class="edit" onclick="editEntry(${index})">✏</span>
      <strong>${entry.client}</strong> - ${entry.intervention}<br>
      ${entry.start} - ${entry.end} (${duration} h)<br>
      ${entry.description || ""}
    `;

    container.appendChild(div);
  });

  document.getElementById("totalSupp").innerText = totalSupp;
  document.getElementById("totalAstreinte").innerText = totalAstreinte;
}

function calculateHours(start, end) {
  const s = new Date("1970-01-01T" + start + ":00");
  const e = new Date("1970-01-01T" + end + ":00");
  return (e - s) / 1000 / 60 / 60;
}

function deleteEntry(index) {
  data[currentMonth].splice(index, 1);
  saveData();
  displayEntries();
}

function editEntry(index) {
  const entry = data[currentMonth][index];
  document.getElementById("client").value = entry.client;
  document.getElementById("intervention").value = entry.intervention;
  document.getElementById("start").value = entry.start;
  document.getElementById("end").value = entry.end;
  document.getElementById("type").value = entry.type;
  document.getElementById("description").value = entry.description;

  deleteEntry(index);
}

function saveData() {
  localStorage.setItem("heures", JSON.stringify(data));
}

displayEntries();
