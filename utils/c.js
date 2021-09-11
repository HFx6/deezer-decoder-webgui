const btn = document.querySelector("#track");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

const currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
    btn.innerHTML = "<i class='fas fa-sun' style='color: rgb(255, 242, 99);'>";
    document.body.classList.toggle("dark-theme");
} else if (currentTheme == "light") {
    btn.innerHTML = "<i class='fas fa-moon' style='color: rgb(126, 87, 194)'></i>";
    document.body.classList.toggle("light-theme");
}

btn.addEventListener("click", function () {
    var theme = document.body.classList.contains("light-theme")
        ? "dark"
        : "light";
    if (theme == "light") {
        btn.innerHTML = "<i class='fas fa-moon' style='color: rgb(126, 87, 194)'></i>";
        document.body.classList.toggle("light-theme");
        document.body.classList.toggle("dark-theme");
        var theme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";
    } else {
        btn.innerHTML = "<i class='fas fa-sun' style='color: rgb(255, 242, 99);'>";
        document.body.classList.toggle("dark-theme");
        document.body.classList.toggle("light-theme");
        var theme = document.body.classList.contains("dark-theme")
        ? "dark"
        : "light";
    }
    localStorage.setItem("theme", theme);
});