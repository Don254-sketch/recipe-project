// SERVING SIZE CALCULATOR

const servingsSelect = document.getElementById("servings");

const ingredientItems = document.querySelectorAll(".ingredient");

function formatQuantity(quantity) {
    // Display common fractions neatly.

    const fractions = {
        0.25: "¼",
        0.33: "⅓",
        0.5: "½",
        0.67: "⅔",
        0.75: "¾"
    };

    const whole = Math.floor(quantity);
    const decimal = quantity - whole;

    const closestFraction = Object.keys(fractions).find(
        fraction => Math.abs(decimal - Number(fraction)) < 0.04
    );

    if (closestFraction) {
        return whole
            ? `${whole} ${fractions[closestFraction]}`
            : fractions[closestFraction];
    }

    return Number(quantity.toFixed(2)).toString();
}

function updateIngredients() {

    if (!servingsSelect) return;

    const servings = Number(servingsSelect.value);

    ingredientItems.forEach(ingredient => {

        const originalQuantity =
            Number(ingredient.dataset.quantity);

        const unit = ingredient.dataset.unit;
        const name = ingredient.dataset.name;

        const quantity = originalQuantity * servings / 2;

        ingredient.textContent =
            `${formatQuantity(quantity)} ${unit ? unit + " " : ""}${name}`;

    });

}

if (servingsSelect) {
    servingsSelect.addEventListener("change", updateIngredients);

    updateIngredients();
}
// INGREDIENT CHECKLIST

const ingredientCheckboxes = document.querySelectorAll(
    ".ingredients input[type='checkbox']"
);

ingredientCheckboxes.forEach(checkbox => {

    checkbox.addEventListener("change", () => {

        const ingredientText = checkbox.closest("label")
            .querySelector(".ingredient");

        ingredientText.classList.toggle(
            "checked",
            checkbox.checked
        );

    });

});

// COOKING TIMER

const timerDisplay = document.getElementById("timer-display");
const timerMinutes = document.getElementById("timer-minutes");

const startTimer = document.getElementById("start-timer");
const pauseTimer = document.getElementById("pause-timer");
const resetTimer = document.getElementById("reset-timer");

let remainingSeconds = 300;
let timerInterval = null;

function displayTime() {

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}

function pauseCountdown() {

    clearInterval(timerInterval);
    timerInterval = null;

}

function startCountdown() {

    if (timerInterval !== null) return;

    if (remainingSeconds <= 0) {
        alert("Please reset the timer before starting again.");
        return;
    }

    timerInterval = setInterval(() => {

        remainingSeconds--;

        displayTime();

        if (remainingSeconds <= 0) {

            pauseCountdown();

            alert("Timer finished! Check your cooking.");

        }

    }, 1000);

}

if (
    timerDisplay &&
    timerMinutes &&
    startTimer &&
    pauseTimer &&
    resetTimer
) {

    displayTime();

    startTimer.addEventListener("click", startCountdown);

    pauseTimer.addEventListener("click", pauseCountdown);

    resetTimer.addEventListener("click", () => {

        pauseCountdown();

        const minutes = Number(timerMinutes.value);

        if (!Number.isFinite(minutes) || minutes < 1 || minutes > 180) {

            alert("Enter a duration between 1 and 180 minutes.");

            return;

        }

        remainingSeconds = minutes * 60;

        displayTime();

    });

    timerMinutes.addEventListener("change", () => {

        if (timerInterval === null) {

            const minutes = Number(timerMinutes.value);

            if (Number.isFinite(minutes) && minutes >= 1 && minutes <= 180) {

                remainingSeconds = minutes * 60;

                displayTime();

            }

        }

    });

}
// RECIPE RATING

const ratingStars = document.querySelectorAll(
    "#rating-stars button"
);

const ratingMessage = document.getElementById("rating-message");

ratingStars.forEach(star => {

    star.addEventListener("click", () => {

        const rating = Number(star.dataset.rating);

        ratingStars.forEach(button => {

            const selected =
                Number(button.dataset.rating) <= rating;

            button.classList.toggle("selected", selected);

        });

        ratingMessage.textContent =
            `You rated this recipe ${rating} out of 5 stars. Thank you!`;

        // Save this visitor's rating in their browser.

        localStorage.setItem("tilapiaRecipeRating", rating);

    });

});

// Restore the previous rating if one exists.

const savedRating = Number(
    localStorage.getItem("tilapiaRecipeRating")
);

if (savedRating >= 1 && savedRating <= 5) {

    ratingStars.forEach(star => {

        star.classList.toggle(
            "selected",
            Number(star.dataset.rating) <= savedRating
        );

    });

    ratingMessage.textContent =
        `Your rating: ${savedRating} out of 5 stars.`;}

        // PRINT RECIPE

const printButton = document.getElementById("print-recipe");

if (printButton) {

    printButton.addEventListener("click", () => {

        window.print();

    });

}
// DARK MODE

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {

    // Restore the saved theme.

    const savedTheme = localStorage.getItem("recipeTheme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent = "☀️ Light Mode";

    }

    themeToggle.addEventListener("click", () => {

        const isDark =
            document.body.classList.toggle("dark-mode");

        themeToggle.textContent = isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";

        localStorage.setItem(
            "recipeTheme",
            isDark ? "dark" : "light"
        );

    });

}