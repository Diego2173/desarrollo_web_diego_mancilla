document.querySelectorAll("tr.clickable-row").forEach(row => {
    row.addEventListener("click", () => {
        window.location.href = row.dataset.href;
    });
});