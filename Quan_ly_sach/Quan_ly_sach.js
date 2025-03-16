let books = JSON.parse(localStorage.getItem("books")) || [];

function themSach() {
    let name = prompt("Nhập tên sách:");
    let author = prompt("Nhập tên tác giả:");
    let publisher = prompt("Nhập tên NXB:");
    let category = prompt("Nhập thể loại:");

    if (name && author && publisher && category) {
        books.push({ name, author, publisher, category });
        localStorage.setItem("books", JSON.stringify(books));
        hienThiSach();
    }
}

function xoaSach(name) {
    let index = books.findIndex(book => book.name === name);
    if (index !== -1) {
        books.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(books));
        hienThiSach();
    }
}

function timSach() {
    let keyword = document.getElementById("search").value.toLowerCase();
    let type = document.getElementById("search-type").value;

    let filteredBooks = books.map(book => {
        let value = book[type].toLowerCase();
        return {
            ...book,
            highlight: value.includes(keyword) && keyword !== "" ? keyword : null
        };
    });

    hienThiSach(filteredBooks);
}

function hienThiSach(filteredList = books) {
    let list = document.getElementById("book-list");
    list.innerHTML = filteredList.map(book => {
        let highlightedName = highlightText(book.name, book.highlight);
        let highlightedAuthor = highlightText(book.author, book.highlight);
        let highlightedPublisher = highlightText(book.publisher, book.highlight);
        let highlightedCategory = highlightText(book.category, book.highlight);

        return `
            <tr>
                <td>${highlightedName}</td>
                <td>${highlightedAuthor}</td>
                <td>${highlightedPublisher}</td>
                <td>${highlightedCategory}</td>
                <td><button class="delete-btn" onclick="xoaSach('${book.name}')">Xóa</button></td>
            </tr>
        `;
    }).join("");
}

function highlightText(text, keyword) {
    if (!keyword || !text.toLowerCase().includes(keyword)) return text;
    let regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(regex, `<span class="highlight">$1</span>`);
}

function quayLai() {
    location.href = "../trang_chu.html"; // Adjust the path as necessary
}

// Hiển thị danh sách sách khi tải trang
hienThiSach();