let customers = JSON.parse(localStorage.getItem("customers")) || [];

function themKhachHang() {
    let name = prompt("Nhập tên khách hàng:");
    let phone = prompt("Nhập số điện thoại:");
    let email = prompt("Nhập email:");
    let address = prompt("Nhập địa chỉ:");

    if (name && phone && email && address) {
        customers.push({ name, phone, email, address });
        localStorage.setItem("customers", JSON.stringify(customers));
        hienThiKhachHang();
    }
}

function xoaKhachHang(name) {
    let index = customers.findIndex(customer => customer.name === name);
    if (index !== -1) {
        customers.splice(index, 1);
        localStorage.setItem("customers", JSON.stringify(customers));
        hienThiKhachHang();
    }
}

function timKhachHang() {
    let keyword = document.getElementById("search").value.toLowerCase();
    let type = document.getElementById("search-type").value;

    let filteredCustomers = customers.map(customer => {
        let value = customer[type].toLowerCase();
        return {
            ...customer,
            highlight: value.includes(keyword) && keyword !== "" ? keyword : null
        };
    });

    hienThiKhachHang(filteredCustomers);
}

function hienThiKhachHang(filteredList = customers) {
    let list = document.getElementById("customer-list");
    list.innerHTML = filteredList.map(customer => {
        let highlightedName = highlightText(customer.name, customer.highlight);
        let highlightedPhone = highlightText(customer.phone, customer.highlight);
        let highlightedEmail = highlightText(customer.email, customer.highlight);

        return `
            <tr>
                <td>${highlightedName}</td>
                <td>${highlightedPhone}</td>
                <td>${highlightedEmail}</td>
                <td>${customer.address}</td>
                <td><button class="delete-btn" onclick="xoaKhachHang('${customer.name}')">Xóa</button></td>
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
    location.href = "../index.html"; // Adjust the path as necessary
}

// Hiển thị danh sách khách hàng khi tải trang
hienThiKhachHang();