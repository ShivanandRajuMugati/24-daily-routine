// ======================================================
// 24-HOUR ROUTINE - COMPLETE VERSION 1
// ======================================================


// ======================================================
// DEFAULT ACTIVITIES
// ======================================================

const defaultActivities = [
    "Sleep",
    "Study",
    "Exercise",
    "Food",
    "Travel",
    "Family",
    "Friends",
    "Mobile/Internet",
    "Entertainment",
    "Personal Time",
    "Work",
    "Hobbies",
    "Other"
];


// ======================================================
// DOM ELEMENTS
// ======================================================

const setupScreen = document.getElementById("setupScreen");

const nameStep = document.getElementById("nameStep");

const activityStep = document.getElementById("activityStep");

const nameInput = document.getElementById("nameInput");

const nameNextButton =
    document.getElementById("nameNextButton");

const regularActivityOptions =
    document.getElementById("regularActivityOptions");

const holidayActivityOptions =
    document.getElementById("holidayActivityOptions");

const customActivityInput =
    document.getElementById("customActivityInput");

const addCustomActivityButton =
    document.getElementById("addCustomActivityButton");

const customActivitiesContainer =
    document.getElementById("customActivities");

const startChallengeButton =
    document.getElementById("startChallengeButton");

const mainApp =
    document.getElementById("mainApp");


// ======================================================
// DATA
// ======================================================

let customActivities =
    JSON.parse(
        localStorage.getItem("customActivities") || "[]"
    );

let dailyData =
    JSON.parse(
        localStorage.getItem("dailyData") || "{}"
    );

let holidaySettings =
    JSON.parse(
        localStorage.getItem("holidaySettings") || "{}"
    );


// ======================================================
// DATE FUNCTIONS
// ======================================================

function formatDate(date) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function parseDate(dateString) {

    const parts = dateString.split("-");

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );
}


function getToday() {

    return new Date();

}


function getDayName(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long"
        }
    );

}


function getFullDate(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ======================================================
// CHALLENGE DAY
// ======================================================

function getChallengeDay() {

    const start =
        localStorage.getItem("challengeStartDate");

    if (!start) {
        return 0;
    }

    const startDate = parseDate(start);

    const today = getToday();

    const difference =
        today.getTime() - startDate.getTime();

    const days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        ) + 1;

    return days;

}


// ======================================================
// ACTIVITY OPTIONS
// ======================================================

function getAllActivities() {

    return [
        ...defaultActivities,
        ...customActivities
    ];

}


function createActivityOptions() {

    regularActivityOptions.innerHTML = "";

    holidayActivityOptions.innerHTML = "";


    const allActivities =
        getAllActivities();


    allActivities.forEach(function(activity) {

        addCheckbox(
            regularActivityOptions,
            activity,
            "regular"
        );


        addCheckbox(
            holidayActivityOptions,
            activity,
            "holiday"
        );

    });


    loadExistingActivitySelections();

}


function addCheckbox(
    container,
    activity,
    type
) {

    const label =
        document.createElement("label");

    label.className =
        "activity-option";


    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.dataset.activity = activity;

    checkbox.dataset.type = type;


    const span =
        document.createElement("span");

    span.textContent = activity;


    label.appendChild(checkbox);

    label.appendChild(span);

    container.appendChild(label);

}


function loadExistingActivitySelections() {

    const regular =
        JSON.parse(
            localStorage.getItem(
                "regularActivities"
            ) || "[]"
        );


    const holiday =
        JSON.parse(
            localStorage.getItem(
                "holidayActivities"
            ) || "[]"
        );


    document
        .querySelectorAll(
            '#regularActivityOptions input'
        )
        .forEach(function(input) {

            input.checked =
                regular.includes(
                    input.dataset.activity
                );

        });


    document
        .querySelectorAll(
            '#holidayActivityOptions input'
        )
        .forEach(function(input) {

            input.checked =
                holiday.includes(
                    input.dataset.activity
                );

        });

}


// ======================================================
// NAME STEP
// ======================================================

nameNextButton.addEventListener(
    "click",
    function() {

        const name =
            nameInput.value.trim();


        if (!name) {

            alert("Please enter your name.");

            nameInput.focus();

            return;
        }


        localStorage.setItem(
            "userName",
            name
        );


        nameStep.classList.add("hidden");

        activityStep.classList.remove("hidden");


        createActivityOptions();

    }
);


// ======================================================
// CUSTOM ACTIVITY
// ======================================================

addCustomActivityButton.addEventListener(
    "click",
    function() {

        const activity =
            customActivityInput.value.trim();


        if (!activity) {

            alert(
                "Please enter an activity name."
            );

            return;
        }


        if (
            getAllActivities()
                .some(
                    item =>
                        item.toLowerCase() ===
                        activity.toLowerCase()
                )
        ) {

            alert(
                "This activity already exists."
            );

            return;
        }


        customActivities.push(activity);


        localStorage.setItem(
            "customActivities",
            JSON.stringify(
                customActivities
            )
        );


        customActivityInput.value = "";


        showCustomActivities();

        createActivityOptions();

    }
);


function showCustomActivities() {

    customActivitiesContainer.innerHTML = "";


    customActivities.forEach(
        function(activity, index) {

            const div =
                document.createElement("div");

            div.className =
                "custom-item";


            const span =
                document.createElement("span");

            span.textContent =
                activity;


            const button =
                document.createElement("button");

            button.className =
                "remove-custom";

            button.textContent =
                "Remove";


            button.onclick =
                function() {

                    customActivities.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "customActivities",
                        JSON.stringify(
                            customActivities
                        )
                    );


                    showCustomActivities();

                    createActivityOptions();

                };


            div.appendChild(span);

            div.appendChild(button);

            customActivitiesContainer.appendChild(
                div
            );

        }
    );

}


// ======================================================
// START CHALLENGE
// ======================================================

startChallengeButton.addEventListener(
    "click",
    function() {

        const regular =
            getSelectedActivities(
                "regular"
            );


        const holiday =
            getSelectedActivities(
                "holiday"
            );


        if (
            regular.length === 0 &&
            holiday.length === 0
        ) {

            alert(
                "Please select at least one activity."
            );

            return;
        }


        localStorage.setItem(
            "regularActivities",
            JSON.stringify(regular)
        );


        localStorage.setItem(
            "holidayActivities",
            JSON.stringify(holiday)
        );


        if (
            !localStorage.getItem(
                "challengeStartDate"
            )
        ) {

            localStorage.setItem(
                "challengeStartDate",
                formatDate(getToday())
            );

        }


        localStorage.setItem(
            "challengeStarted",
            "true"
        );


        setupScreen.classList.add(
            "hidden"
        );


        mainApp.classList.remove(
            "hidden"
        );


        initializeApp();

    }
);


function getSelectedActivities(type) {

    const selector =
        type === "regular"
            ? "#regularActivityOptions input"
            : "#holidayActivityOptions input";


    const selected = [];


    document
        .querySelectorAll(selector)
        .forEach(function(input) {

            if (input.checked) {

                selected.push(
                    input.dataset.activity
                );

            }

        });


    return selected;

}


// ======================================================
// DAY TYPE
// ======================================================

function getWeekKey(date) {

    const day =
        date.getDay();


    const difference =
        day === 0
            ? -6
            : 1 - day;


    const monday =
        new Date(date);


    monday.setDate(
        date.getDate() + difference
    );


    return formatDate(monday);

}


function getDayType(date) {

    // Sunday automatically holiday

    if (date.getDay() === 0) {

        return "holiday";

    }


    const week =
        getWeekKey(date);


    const holidays =
        holidaySettings[week] || [];


    const dateString =
        formatDate(date);


    if (
        holidays.includes(
            dateString
        )
    ) {

        return "holiday";

    }


    return "regular";

}


// ======================================================
// TODAY ACTIVITIES
// ======================================================

function getActivitiesForDate(date) {

    const type =
        getDayType(date);


    const regular =
        JSON.parse(
            localStorage.getItem(
                "regularActivities"
            ) || "[]"
        );


    const holiday =
        JSON.parse(
            localStorage.getItem(
                "holidayActivities"
            ) || "[]"
        );


    return type === "holiday"
        ? holiday
        : regular;

}


// ======================================================
// DAILY RECORD
// ======================================================

function getDayRecord(dateString) {

    if (!dailyData[dateString]) {

        dailyData[dateString] = {
            activities: {},
            note: "",
            rating: 0,
            completed: false
        };

    }


    return dailyData[dateString];

}


// ======================================================
// RENDER TODAY
// ======================================================

function renderToday() {

    const today =
        getToday();


    const todayString =
        formatDate(today);


    const type =
        getDayType(today);


    const challengeDay =
        getChallengeDay();


    document.getElementById(
        "todayDate"
    ).textContent =
        getFullDate(today);


    const badge =
        document.getElementById(
            "dayTypeBadge"
        );


    if (type === "holiday") {

        badge.textContent =
            "🏖️ Holiday";

        badge.className =
            "badge holiday";

    } else {

        badge.textContent =
            "🟢 Regular Day";

        badge.className =
            "badge regular";

    }


    document.getElementById(
        "challengeDay"
    ).textContent =
        `Day ${Math.max(
            1,
            Math.min(
                challengeDay,
                21
            )
        )} / 21`;


    const name =
        localStorage.getItem(
            "userName"
        ) || "there";


    document.getElementById(
        "todayGreeting"
    ).textContent =
        `Hello ${name} 👋`;


    renderActivities(
        todayString
    );


    renderNoteAndRating(
        todayString
    );


    updateBalance();


    updateStreak();


    updateCompletedDays();

}


// ======================================================
// RENDER ACTIVITIES
// ======================================================

function renderActivities(
    dateString
) {

    const container =
        document.getElementById(
            "todayActivities"
        );


    container.innerHTML = "";


    const activities =
        getActivitiesForDate(
            parseDate(dateString)
        );


    const record =
        getDayRecord(
            dateString
        );


    activities.forEach(
        function(activity) {

            if (
                record.activities[activity] ===
                undefined
            ) {

                record.activities[activity] = {
                    minutes: 0,
                    approximate: false
                };

            }


            createActivityEntry(
                container,
                activity,
                record.activities[activity]
            );

        }
    );


    saveData();

}


// ======================================================
// CREATE ACTIVITY ENTRY
// ======================================================

function createActivityEntry(
    container,
    activity,
    data
) {

    const div =
        document.createElement("div");


    div.className =
        "activity-entry";


    const top =
        document.createElement("div");


    top.className =
        "activity-top";


    const title =
        document.createElement("span");


    title.className =
        "activity-title";


    title.textContent =
        activity;


    if (data.approximate) {

        const approx =
            document.createElement("span");

        approx.className =
            "approx-label";

        approx.textContent =
            "≈ Approximate";

        title.appendChild(
            approx
        );

    }


    const deleteButton =
        document.createElement("button");


    deleteButton.className =
        "delete-activity";


    deleteButton.textContent =
        "Edit";


    deleteButton.onclick =
        function() {

            alert(
                `${activity} can be edited using the hours/minutes below.`
            );

        };


    top.appendChild(title);

    top.appendChild(deleteButton);


    const controls =
        document.createElement("div");


    controls.className =
        "time-controls";


    const minus =
        document.createElement("button");


    minus.textContent =
        "−";


    const hoursInput =
        document.createElement("input");


    hoursInput.type =
        "number";

    hoursInput.min =
        "0";

    hoursInput.value =
        Math.floor(
            data.minutes / 60
        );


    const plus =
        document.createElement("button");


    plus.textContent =
        "+";


    const minutesInput =
        document.createElement("input");


    minutesInput.type =
        "number";

    minutesInput.min =
        "0";

    minutesInput.max =
        "59";

    minutesInput.value =
        data.minutes % 60;


    controls.appendChild(
        minus
    );

    controls.appendChild(
        hoursInput
    );

    controls.appendChild(
        minutesInput
    );

    controls.appendChild(
        plus
    );


    const label =
        document.createElement("div");


    label.className =
        "time-label";


    label.textContent =
        "Hours     Minutes";


    const approximateButton =
        document.createElement("button");


    approximateButton.className =
        "approximate-button";


    approximateButton.textContent =
        "≈ I don't know the exact time";


    const approximateOptions =
        document.createElement("div");


    approximateOptions.className =
        "approximate-options hidden";


    const ranges = [
        ["< 30 minutes", 15],
        ["30–60 minutes", 45],
        ["1–2 hours", 90],
        ["2–3 hours", 150],
        ["3–4 hours", 210],
        ["> 4 hours", 270]
    ];


    ranges.forEach(
        function(range) {

            const button =
                document.createElement("button");


            button.textContent =
                range[0];


            button.onclick =
                function() {

                    data.minutes =
                        range[1];

                    data.approximate =
                        true;


                    hoursInput.value =
                        Math.floor(
                            range[1] / 60
                        );


                    minutesInput.value =
                        range[1] % 60;


                    approximateOptions.classList.add(
                        "hidden"
                    );


                    saveData();

                    renderActivities(
                        formatDate(
                            getToday()
                        )
                    );

                    updateBalance();

                };


            approximateOptions.appendChild(
                button
            );

        }
    );


    approximateButton.onclick =
        function() {

            approximateOptions.classList.toggle(
                "hidden"
            );

        };


    function updateTime() {

        let hours =
            Number(
                hoursInput.value
            ) || 0;


        let minutes =
            Number(
                minutesInput.value
            ) || 0;


        if (minutes > 59) {

            hours +=
                Math.floor(
                    minutes / 60
                );

            minutes =
                minutes % 60;

        }


        if (hours < 0) {
            hours = 0;
        }

        if (minutes < 0) {
            minutes = 0;
        }


        data.minutes =
            hours * 60 + minutes;


        data.approximate =
            false;


        saveData();

        updateBalance();

    }


    minus.onclick =
        function() {

            data.minutes =
                Math.max(
                    0,
                    data.minutes - 30
                );


            hoursInput.value =
                Math.floor(
                    data.minutes / 60
                );


            minutesInput.value =
                data.minutes % 60;


            data.approximate =
                false;


            saveData();

            renderActivities(
                formatDate(
                    getToday()
                )
            );

            updateBalance();

        };


    plus.onclick =
        function() {

            data.minutes += 30;


            if (
                getTotalMinutes() >
                24 * 60
            ) {

                data.minutes -= 30;

                alert(
                    "You cannot enter more than 24 hours."
                );

                return;

            }


            hoursInput.value =
                Math.floor(
                    data.minutes / 60
                );


            minutesInput.value =
                data.minutes % 60;


            data.approximate =
                false;


            saveData();

            renderActivities(
                formatDate(
                    getToday()
                )
            );

            updateBalance();

        };


    hoursInput.addEventListener(
        "change",
        updateTime
    );


    minutesInput.addEventListener(
        "change",
        updateTime
    );


    div.appendChild(top);

    div.appendChild(controls);

    div.appendChild(label);

    div.appendChild(
        approximateButton
    );

    div.appendChild(
        approximateOptions
    );


    container.appendChild(div);

}


// ======================================================
// TOTAL TIME
// ======================================================

function getTotalMinutes() {

    const todayString =
        formatDate(
            getToday()
        );


    const record =
        getDayRecord(
            todayString
        );


    let total = 0;


    Object.values(
        record.activities
    ).forEach(
        function(activity) {

            total +=
                Number(
                    activity.minutes
                ) || 0;

        }
    );


    return total;

}


// ======================================================
// FORMAT MINUTES
// ======================================================

function formatMinutes(totalMinutes) {

    const hours =
        Math.floor(
            totalMinutes / 60
        );


    const minutes =
        totalMinutes % 60;


    return `${hours}h ${String(
        minutes
    ).padStart(2, "0")}m`;

}


// ======================================================
// BALANCE
// ======================================================

function updateBalance() {

    const total =
        getTotalMinutes();


    const dayMinutes =
        24 * 60;


    const remaining =
        dayMinutes - total;


    document.getElementById(
        "usedTime"
    ).textContent =
        formatMinutes(
            total
        );


    document.getElementById(
        "remainingTimeSmall"
    ).textContent =
        formatMinutes(
            Math.max(
                0,
                remaining
            )
        );


    document.getElementById(
        "remainingTime"
    ).textContent =
        formatMinutes(
            Math.max(
                0,
                remaining
            )
        );


    const percentage =
        Math.min(
            100,
            (total / dayMinutes) * 100
        );


    document.getElementById(
        "timeProgress"
    ).style.width =
        percentage + "%";


    const message =
        document.getElementById(
            "balanceMessage"
        );


    const warning =
        document.getElementById(
            "timeWarning"
        );


    if (total < dayMinutes) {

        message.textContent =
            `${formatMinutes(
                remaining
            )} remaining.`;


        warning.classList.add(
            "hidden"
        );

    }
    else if (total === dayMinutes) {

        message.textContent =
            "Your complete 24 hours are accounted for!";


        warning.classList.add(
            "hidden"
        );

    }
    else {

        message.textContent =
            "Please check your entries.";


        warning.textContent =
            `You've entered ${formatMinutes(
                total - dayMinutes
            )} more than 24 hours.`;


        warning.classList.remove(
            "hidden"
        );

    }

}


// ======================================================
// NOTE AND RATING
// ======================================================

function renderNoteAndRating(
    dateString
) {

    const record =
        getDayRecord(
            dateString
        );


    document.getElementById(
        "todayNote"
    ).value =
        record.note || "";


    document
        .querySelectorAll(
            "#ratingStars button"
        )
        .forEach(
            function(button) {

                const rating =
                    Number(
                        button.dataset.rating
                    );


                button.classList.toggle(
                    "active",
                    rating <=
                    record.rating
                );

            }
        );

}


// ======================================================
// NOTE INPUT
// ======================================================

document.getElementById(
    "todayNote"
).addEventListener(
    "input",
    function() {

        const date =
            formatDate(
                getToday()
            );


        const record =
            getDayRecord(
                date
            );


        record.note =
            this.value;


        saveData();

    }
);


// ======================================================
// RATING
// ======================================================

document
    .querySelectorAll(
        "#ratingStars button"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const rating =
                        Number(
                            this.dataset.rating
                        );


                    const date =
                        formatDate(
                            getToday()
                        );


                    const record =
                        getDayRecord(
                            date
                        );


                    record.rating =
                        rating;


                    saveData();


                    renderNoteAndRating(
                        date
                    );

                }
            );

        }
    );


// ======================================================
// SAVE TODAY
// ======================================================

document.getElementById(
    "saveDayButton"
).addEventListener(
    "click",
    function() {

        const total =
            getTotalMinutes();


        if (total > 24 * 60) {

            alert(
                "You have entered more than 24 hours. Please correct the entries."
            );

            return;

        }


        const date =
            formatDate(
                getToday()
            );


        const record =
            getDayRecord(
                date
            );


        record.completed =
            total > 0;


        saveData();


        updateCompletedDays();

        updateStreak();


        alert(
            "Today's routine has been saved! ✅"
        );

    }
);


// ======================================================
// ADD TODAY ACTIVITY
// ======================================================

document.getElementById(
    "addTodayActivityButton"
).addEventListener(
    "click",
    function() {

        const name =
            prompt(
                "Enter the activity name:"
            );


        if (!name) {
            return;
        }


        const clean =
            name.trim();


        if (!clean) {
            return;
        }


        const date =
            formatDate(
                getToday()
            );


        const record =
            getDayRecord(
                date
            );


        if (
            record.activities[clean]
        ) {

            alert(
                "This activity already exists today."
            );

            return;

        }


        record.activities[clean] = {
            minutes: 0,
            approximate: false
        };


        saveData();


        renderActivities(
            date
        );


        updateBalance();

    }
);


// ======================================================
// COMPLETED DAYS
// ======================================================

function updateCompletedDays() {

    let completed = 0;


    Object.values(
        dailyData
    ).forEach(
        function(day) {

            if (day.completed) {
                completed++;
            }

        }
    );


    document.getElementById(
        "completedDays"
    ).textContent =
        `${Math.min(
            completed,
            21
        )}/21`;

}


// ======================================================
// STREAK
// ======================================================

function updateStreak() {

    const startString =
        localStorage.getItem(
            "challengeStartDate"
        );


    if (!startString) {
        return;
    }


    const start =
        parseDate(
            startString
        );


    let streak = 0;


    for (
        let i = 0;
        i < 21;
        i++
    ) {

        const date =
            new Date(start);


        date.setDate(
            start.getDate() + i
        );


        const key =
            formatDate(date);


        if (
            dailyData[key] &&
            dailyData[key].completed
        ) {

            streak++;

        }
        else if (
            key <
            formatDate(getToday())
        ) {

            streak = 0;

        }

    }


    document.getElementById(
        "streakValue"
    ).textContent =
        streak;

}


// ======================================================
// SAVE DATA
// ======================================================

function saveData() {

    localStorage.setItem(
        "dailyData",
        JSON.stringify(
            dailyData
        )
    );


    localStorage.setItem(
        "holidaySettings",
        JSON.stringify(
            holidaySettings
        )
    );

}


// ======================================================
// NAVIGATION
// ======================================================

document
    .querySelectorAll(
        ".nav-button"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const pageId =
                        this.dataset.page;


                    document
                        .querySelectorAll(
                            ".page"
                        )
                        .forEach(
                            page =>
                                page.classList.add(
                                    "hidden"
                                )
                        );


                    document
                        .getElementById(
                            pageId
                        )
                        .classList.remove(
                            "hidden"
                        );


                    document
                        .querySelectorAll(
                            ".nav-button"
                        )
                        .forEach(
                            btn =>
                                btn.classList.remove(
                                    "active"
                                )
                        );


                    this.classList.add(
                        "active"
                    );


                    if (
                        pageId ===
                        "calendarPage"
                    ) {

                        renderCalendar();

                    }


                    if (
                        pageId ===
                        "progressPage"
                    ) {

                        renderProgress();

                    }


                    if (
                        pageId ===
                        "settingsPage"
                    ) {

                        renderSettings();

                    }

                }
            );

        }
    );


// ======================================================
// CALENDAR
// ======================================================

function renderCalendar() {

    const grid =
        document.getElementById(
            "calendarGrid"
        );


    grid.innerHTML = "";


    const startString =
        localStorage.getItem(
            "challengeStartDate"
        );


    if (!startString) {
        return;
    }


    const start =
        parseDate(
            startString
        );


    for (
        let i = 0;
        i < 21;
        i++
    ) {

        const date =
            new Date(start);


        date.setDate(
            start.getDate() + i
        );


        const key =
            formatDate(date);


        const div =
            document.createElement(
                "div"
            );


        div.className =
            "calendar-day";


        const type =
            getDayType(date);


        if (
            type === "holiday"
        ) {

            div.classList.add(
                "holiday"
            );

        }


        if (
            dailyData[key] &&
            dailyData[key].completed
        ) {

            div.classList.add(
                "completed"
            );

        }


        if (
            key ===
            formatDate(getToday())
        ) {

            div.classList.add(
                "current"
            );

        }


        div.innerHTML = `
            <div class="day-number">
                ${date.getDate()}
            </div>

            <small>
                ${getDayName(date).slice(0, 3)}
            </small>

            <small>
                ${
                    dailyData[key] &&
                    dailyData[key].completed
                        ? "✅ Done"
                        : type === "holiday"
                            ? "🏖️ Holiday"
                            : "—"
                }
            </small>
        `;


        grid.appendChild(div);

    }

}


// ======================================================
// PROGRESS
// ======================================================

function renderProgress() {

    const summary =
        document.getElementById(
            "progressSummary"
        );


    const comparison =
        document.getElementById(
            "comparison"
        );


    summary.innerHTML = "";

    comparison.innerHTML = "";


    const startString =
        localStorage.getItem(
            "challengeStartDate"
        );


    if (!startString) {
        return;
    }


    const start =
        parseDate(
            startString
        );


    let totalMinutes = 0;

    let completed = 0;


    Object.values(
        dailyData
    ).forEach(
        function(day) {

            if (day.completed) {
                completed++;
            }


            Object.values(
                day.activities || {}
            ).forEach(
                activity => {

                    totalMinutes +=
                        Number(
                            activity.minutes
                        ) || 0;

                }
            );

        }
    );


    summary.innerHTML = `
        <div class="progress-item">
            <strong>Days Completed</strong>
            ${Math.min(completed, 21)} / 21
        </div>

        <div class="progress-item">
            <strong>Total Tracked Time</strong>
            ${formatMinutes(totalMinutes)}
        </div>

        <div class="progress-item">
            <strong>Current Streak</strong>
            ${document.getElementById("streakValue").textContent} days
        </div>
    `;


    // Week 1 vs Week 3

    const week1 =
        getWeekActivityTotals(
            start,
            0,
            7
        );


    const week3 =
        getWeekActivityTotals(
            start,
            14,
            21
        );


    const activities =
        getAllActivities();


    comparison.innerHTML = `
        <div class="comparison-row">
            <strong>Activity</strong>
            <strong>Week 1</strong>
            <strong>Week 3</strong>
        </div>
    `;


    activities.forEach(
        function(activity) {

            const first =
                week1[activity] || 0;

            const third =
                week3[activity] || 0;


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "comparison-row";


            row.innerHTML = `
                <span>${activity}</span>
                <span>${formatMinutes(first)}</span>
                <span>${formatMinutes(third)}</span>
            `;


            comparison.appendChild(
                row
            );

        }
    );

}


function getWeekActivityTotals(
    start,
    from,
    to
) {

    const result = {};


    for (
        let i = from;
        i < to;
        i++
    ) {

        const date =
            new Date(start);


        date.setDate(
            start.getDate() + i
        );


        const key =
            formatDate(date);


        const record =
            dailyData[key];


        if (!record) {
            continue;
        }


        Object.entries(
            record.activities || {}
        ).forEach(
            function([
                activity,
                data
            ]) {

                if (
                    !result[activity]
                ) {

                    result[activity] = 0;

                }


                result[activity] +=
                    Number(
                        data.minutes
                    ) || 0;

            }
        );

    }


    return result;

}


// ======================================================
// SETTINGS
// ======================================================

function renderSettings() {

    const name =
        localStorage.getItem(
            "userName"
        ) || "";


    document.getElementById(
        "settingsName"
    ).value =
        name;


    const start =
        localStorage.getItem(
            "challengeStartDate"
        );


    document.getElementById(
        "challengeInfo"
    ).textContent =
        start
            ? `Challenge started on ${start}. Your challenge covers 21 calendar days.`
            : "No challenge started.";


    renderHolidaySettings();

}


function renderHolidaySettings() {

    const container =
        document.getElementById(
            "holidaySettings"
        );


    container.innerHTML = "";


    const today =
        getToday();


    const day =
        today.getDay();


    const monday =
        new Date(today);


    monday.setDate(
        today.getDate() -
        (day === 0 ? 6 : day - 1)
    );


    const weekKey =
        formatDate(monday);


    const selected =
        holidaySettings[weekKey] || [];


    const names = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];


    names.forEach(
        function(name, index) {

            const date =
                new Date(monday);


            date.setDate(
                monday.getDate() + index
            );


            const key =
                formatDate(date);


            const label =
                document.createElement(
                    "label"
                );


            label.className =
                "holiday-setting";


            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.dataset.date =
                key;


            checkbox.checked =
                selected.includes(key);


            const span =
                document.createElement(
                    "span"
                );


            span.textContent =
                `${name} (${date.getDate()}/${date.getMonth() + 1})`;


            label.appendChild(
                checkbox
            );

            label.appendChild(
                span
            );


            container.appendChild(
                label
            );

        }
    );


    const sunday =
        document.createElement(
            "div"
        );


    sunday.className =
        "holiday-setting";


    sunday.textContent =
        "🏖️ Sunday is automatically a Holiday";


    container.appendChild(
        sunday
    );

}


// ======================================================
// SAVE HOLIDAYS
// ======================================================

document.getElementById(
    "saveHolidaysButton"
).addEventListener(
    "click",
    function() {

        const today =
            getToday();


        const day =
            today.getDay();


        const monday =
            new Date(today);


        monday.setDate(
            today.getDate() -
            (day === 0 ? 6 : day - 1)
        );


        const weekKey =
            formatDate(monday);


        const selected = [];


        document
            .querySelectorAll(
                "#holidaySettings input"
            )
            .forEach(
                function(input) {

                    if (input.checked) {

                        selected.push(
                            input.dataset.date
                        );

                    }

                }
            );


        holidaySettings[weekKey] =
            selected;


        saveData();


        renderToday();


        alert(
            "Holiday settings saved! 🏖️"
        );

    }
);


// ======================================================
// SAVE NAME
// ======================================================

document.getElementById(
    "saveNameButton"
).addEventListener(
    "click",
    function() {

        const name =
            document.getElementById(
                "settingsName"
            ).value.trim();


        if (!name) {

            alert(
                "Please enter your name."
            );

            return;

        }


        localStorage.setItem(
            "userName",
            name
        );


        renderToday();


        alert(
            "Name updated successfully."
        );

    }
);


// ======================================================
// RESET
// ======================================================

document.getElementById(
    "resetButton"
).addEventListener(
    "click",
    function() {

        const confirmReset =
            confirm(
                "Are you sure? All routine data will be deleted."
            );


        if (!confirmReset) {
            return;
        }


        localStorage.clear();


        location.reload();

    }
);


// ======================================================
// INITIALIZE APP
// ======================================================

function initializeApp() {

    setupScreen.classList.add(
        "hidden"
    );


    mainApp.classList.remove(
        "hidden"
    );


    renderToday();

    renderSettings();

}


// ======================================================
// LOAD EXISTING APP
// ======================================================

function loadApplication() {

    showCustomActivities();


    const savedName =
        localStorage.getItem(
            "userName"
        );


    const challengeStarted =
        localStorage.getItem(
            "challengeStarted"
        );


    if (
        savedName &&
        challengeStarted === "true"
    ) {

        setupScreen.classList.add(
            "hidden"
        );


        mainApp.classList.remove(
            "hidden"
        );


        initializeApp();

    }
    else if (savedName) {

        nameInput.value =
            savedName;

    }

}


// ======================================================
// RUN
// ======================================================

loadApplication();