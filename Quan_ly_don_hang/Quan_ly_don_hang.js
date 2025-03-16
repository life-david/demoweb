let orders = JSON.parse(localStorage.getItem("orders")) || [];

function taoDonHang() {
    let id = prompt("Nhập mã đơn hàng:");
    let date = prompt("Nhập ngày đơn hàng (DD-MM-YYYY):");
    let customer = prompt("Nhập tên khách hàng:");
    let details = prompt("Nhập chi tiết đơn hàng:");
    let tongTien = parseFloat(prompt("Nhập tổng tiền đơn hàng (VNĐ):"));

    if (id && date && customer && details && !isNaN(tongTien)) {
        let formattedDate = formatDateToISO(date);
        orders.push({ id, date: formattedDate, customer, details, tongTien });
        localStorage.setItem("orders", JSON.stringify(orders));
        hienThiDonHang();
        capNhatBaoCaoDoanhThu(formattedDate, tongTien, id);
    }
}

function capNhatBaoCaoDoanhThu(date, revenue, orderId) {
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    let existingReport = reports.find(report => report.date === date);

    if (existingReport) {
        existingReport.revenue = parseFloat(existingReport.revenue) + revenue;
        existingReport.details += `, Doanh thu từ đơn hàng ${orderId}`;
    } else {
        reports.push({ date, revenue, details: `Doanh thu từ đơn hàng ${orderId}` });
    }

    localStorage.setItem("reports", JSON.stringify(reports));
}

function xoaDonHangTheoMa(id) {
    let index = orders.findIndex(order => order.id === id);
    if (index !== -1) {
        orders.splice(index, 1);
        localStorage.setItem("orders", JSON.stringify(orders));
        hienThiDonHang();
    }
}

function xoaHetMa() {
    if (confirm("Bạn có chắc chắn muốn xóa hết mã đơn hàng không?")) {
        orders = [];
        localStorage.setItem("orders", JSON.stringify(orders));
        hienThiDonHang();
    }
}

function lietKeDonCungNgay() {
    let date = prompt("Nhập ngày cần liệt kê (DD-MM-YYYY):");
    let formattedDate = formatDateToISO(date);
    let filteredOrders = orders.filter(order => order.date === formattedDate);
    hienThiDonHang(filteredOrders);
}

function lietKeDonCungKhachHang() {
    let customer = prompt("Nhập tên khách hàng cần liệt kê:");
    let filteredOrders = orders.filter(order => order.customer === customer);
    hienThiDonHang(filteredOrders);
}

function sortOrdersByDate(orderList) {
    return orderList.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function hienThiDonHang(filteredList = orders) {
    let sortedOrders = sortOrdersByDate(filteredList);
    let list = document.getElementById("order-list");
    list.innerHTML = sortedOrders.map(order => {
        let displayDate = formatDateToDisplay(order.date);
        let formattedTongTien = new Intl.NumberFormat('vi-VN').format(order.tongTien);
        return `
            <tr>
                <td>${order.id}</td>
                <td>${displayDate}</td>
                <td>${order.customer}</td>
                <td>${order.details}</td>
                <td>${formattedTongTien} VNĐ</td>
                <td><button class="delete-btn" onclick="xoaDonHangTheoMa('${order.id}')">Xóa</button></td>
            </tr>
        `;
    }).join("");
}

function quayLai() {
    location.href = "../index.html"; // Adjust the path as necessary
}

function formatDateToISO(date) {
    let [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
}

function formatDateToDisplay(date) {
    let [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
}

function xemDoanhThu() {
    let thang = prompt("Nhập tháng cần xem doanh thu (1-12):");
    if (thang < 1 || thang > 12 || isNaN(thang)) {
        alert("Tháng không hợp lệ. Vui lòng nhập từ 1 đến 12.");
        return;
    }

    let doanhThu = 0;
    orders.forEach(order => {
        let orderMonth = new Date(order.date).getMonth() + 1;
        if (orderMonth == thang) {
            doanhThu += order.tongTien;
        }
    });

    let formattedDoanhThu = new Intl.NumberFormat('vi-VN').format(doanhThu);
    alert(`Tổng doanh thu tháng ${thang}: ${formattedDoanhThu} VNĐ`);
}

// Hiển thị danh sách đơn hàng khi tải trang
hienThiDonHang();