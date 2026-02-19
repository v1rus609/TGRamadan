const ramadanData = [
{roza:1,date:"19 Feb",sehri:"5:12",iftar:"5:58"},
{roza:2,date:"20 Feb",sehri:"5:11",iftar:"5:58"},
{roza:3,date:"21 Feb",sehri:"5:11",iftar:"5:59"},
{roza:4,date:"22 Feb",sehri:"5:10",iftar:"5:59"},
{roza:5,date:"23 Feb",sehri:"5:09",iftar:"6:00"},
{roza:6,date:"24 Feb",sehri:"5:08",iftar:"6:00"},
{roza:7,date:"25 Feb",sehri:"5:08",iftar:"6:01"},
{roza:8,date:"26 Feb",sehri:"5:07",iftar:"6:01"},
{roza:9,date:"27 Feb",sehri:"5:06",iftar:"6:02"},
{roza:10,date:"28 Feb",sehri:"5:05",iftar:"6:02"},
{roza:11,date:"01 Mar",sehri:"5:05",iftar:"6:03"},
{roza:12,date:"02 Mar",sehri:"5:04",iftar:"6:03"},
{roza:13,date:"03 Mar",sehri:"5:03",iftar:"6:04"},
{roza:14,date:"04 Mar",sehri:"5:02",iftar:"6:04"},
{roza:15,date:"05 Mar",sehri:"5:01",iftar:"6:05"},
{roza:16,date:"06 Mar",sehri:"5:00",iftar:"6:05"},
{roza:17,date:"07 Mar",sehri:"4:59",iftar:"6:06"},
{roza:18,date:"08 Mar",sehri:"4:58",iftar:"6:06"},
{roza:19,date:"09 Mar",sehri:"4:57",iftar:"6:07"},
{roza:20,date:"10 Mar",sehri:"4:57",iftar:"6:07"},
{roza:21,date:"11 Mar",sehri:"4:56",iftar:"6:07"},
{roza:22,date:"12 Mar",sehri:"4:55",iftar:"6:08"},
{roza:23,date:"13 Mar",sehri:"4:54",iftar:"6:08"},
{roza:24,date:"14 Mar",sehri:"4:53",iftar:"6:09"},
{roza:25,date:"15 Mar",sehri:"4:52",iftar:"6:09"},
{roza:26,date:"16 Mar",sehri:"4:51",iftar:"6:10"},
{roza:27,date:"17 Mar",sehri:"4:50",iftar:"6:10"},
{roza:28,date:"18 Mar",sehri:"4:49",iftar:"6:10"},
{roza:29,date:"19 Mar",sehri:"4:48",iftar:"6:11"},
{roza:30,date:"20 Mar",sehri:"4:47",iftar:"6:11"}
];

const tableBody = document.getElementById("tableBody");

// ================= TABLE GENERATION =================
ramadanData.forEach(day => {
    tableBody.innerHTML += `
        <tr id="row-${day.date}">
            <td>${day.roza}</td>
            <td>${day.date}</td>
            <td>${day.iftar} PM</td>
            <td>${day.sehri} AM</td>
        </tr>
    `;
});

// ================= LOAD TODAY =================
function loadToday() {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-GB', { day:'2-digit', month:'short' });

    const match = ramadanData.find(d => d.date === formatted);

    if (match) {
        document.getElementById("todayDate").innerText = match.date;
        document.getElementById("todaySehri").innerText = match.sehri;
        document.getElementById("todayIftar").innerText = match.iftar;

        highlightTodayRow(match.date);
        updateActiveTime(match);
    } else {
        document.getElementById("todayDate").innerText = "Not Ramadan";
        document.getElementById("todaySehri").innerText = "-";
        document.getElementById("todayIftar").innerText = "-";
    }
}

// ================= ACTIVE / INACTIVE LOGIC =================
let countdownInterval;

function updateActiveTime(todayData) {

    const sehriBlock = document.getElementById("sehriBlock");
    const iftarBlock = document.getElementById("iftarBlock");
    const sehriCountdown = document.getElementById("sehriCountdown");
    const iftarCountdown = document.getElementById("iftarCountdown");

    function calculate() {

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [sehriH, sehriM] = todayData.sehri.split(":").map(Number);
        const sehriTime = new Date();
        sehriTime.setHours(sehriH, sehriM, 0);

        const [iftarH, iftarM] = todayData.iftar.split(":").map(Number);
        const iftarTime = new Date();
        iftarTime.setHours(iftarH + 12, iftarM, 0);

        // Reset classes
        sehriBlock.classList.remove("inactive");
        iftarBlock.classList.remove("inactive");

        let targetTime;
        let targetBlock;
        let targetCountdown;

        if (now < sehriTime) {
            targetTime = sehriTime;
            targetBlock = sehriBlock;
            targetCountdown = sehriCountdown;
            iftarBlock.classList.add("inactive");
            iftarCountdown.innerText = "";
        }
        else if (now >= sehriTime && now < iftarTime) {
            targetTime = iftarTime;
            targetBlock = iftarBlock;
            targetCountdown = iftarCountdown;
            sehriBlock.classList.add("inactive");
            sehriCountdown.innerText = "";
        }
        else {
            // After Iftar → next Sehri tomorrow
            const tomorrowSehri = new Date(sehriTime);
            tomorrowSehri.setDate(tomorrowSehri.getDate() + 1);
            targetTime = tomorrowSehri;
            targetBlock = sehriBlock;
            targetCountdown = sehriCountdown;
            iftarBlock.classList.add("inactive");
            iftarCountdown.innerText = "";
        }

        const diff = targetTime - now;

        if (diff <= 0) return;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        targetCountdown.innerText =
            `${hours.toString().padStart(2,'0')}h ` +
            `${minutes.toString().padStart(2,'0')}m ` +
            `${seconds.toString().padStart(2,'0')}s`;
    }

    clearInterval(countdownInterval);
    calculate();
    countdownInterval = setInterval(calculate, 1000);
}


// ================= HIGHLIGHT TODAY ROW =================
function highlightTodayRow(date) {
    const row = document.getElementById(`row-${date}`);
    if (row) {
        row.style.background = "rgba(0, 255, 213, 0.25)";
        row.style.fontWeight = "600";
    }
}

// ================= NAVIGATION =================
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function showHome() {
    document.getElementById("homeSection").classList.remove("hidden");
    document.getElementById("fullSection").classList.add("hidden");
    toggleMenu();
}

function showFull() {
    document.getElementById("homeSection").classList.add("hidden");
    document.getElementById("fullSection").classList.remove("hidden");
    toggleMenu();
}

// ================= AUTO REFRESH =================
loadToday();
setInterval(loadToday, 60000);
