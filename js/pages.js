// pages.js
// pages.js
export function addPage(pagesContainer) {
    const page = document.createElement('div');
    page.classList.add('page');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'drawing-svg');
    page.appendChild(svg);
    pagesContainer.appendChild(page);
}


export function nextPage() {
    const pagesContainer = document.getElementById('pagesContainer');
    pagesContainer.scrollTop += pagesContainer.clientHeight; // Scroll to the next page
    addPage(); // Add a new page
}

export function checkAddNewPage(y) {
    const pagesContainer = document.getElementById('pagesContainer');
    const pageHeight = pagesContainer.querySelector('.page').offsetHeight;
    if (y > (currentPageIndex + 1) * pageHeight - 50) {
        nextPage(); // Add a new page if drawing reaches the bottom of the current page
    }
}
