let reports = JSON.parse(localStorage.getItem("reports")) || [];

function taoBaoCao() {
    let date = prompt("Nhập ngày báo cáo (DD-MM-YYYY):");
    let revenue = parseFloat(prompt("Nhập doanh thu:"));
    let details = prompt("Nhập chi tiết báo cáo:");

    if (date && !isNaN(revenue) && details) {
        let formattedDate = formatDateToISO(date);
        let existingReport = reports.find(report => report.date === formattedDate);

        if (existingReport) {
            existingReport.revenue = parseFloat(existingReport.revenue) + revenue;
            existingReport.details += `, ${details}`;
        } else {
            reports.push({ date: formattedDate, revenue, details });
        }

        localStorage.setItem("reports", JSON.stringify(reports));
        hienThiBaoCao();
    }
}

function xoaBaoCao(date) {
    let index = reports.findIndex(report => report.date === date);
    if (index !== -1) {
        reports.splice(index, 1);
        localStorage.setItem("reports", JSON.stringify(reports));
        hienThiBaoCao();
    }
}

function timBaoCao() {
    let keyword = document.getElementById("search").value.toLowerCase();
    let type = document.getElementById("search-type").value;

    let filteredReports = reports.map(report => {
        let value = report[type].toLowerCase();
        return {
            ...report,
            highlight: value.includes(keyword) && keyword !== "" ? keyword : null
        };
    });

    hienThiBaoCao(filteredReports);
}

function hienThiBaoCao(filteredList = reports) {
    let list = document.getElementById("report-list");
    list.innerHTML = filteredList.map(report => {
        let displayDate = formatDateToDisplay(report.date);
        let highlightedDate = highlightText(displayDate, report.highlight);
        let highlightedRevenue = highlightText(report.revenue, report.highlight);
        let highlightedDetails = highlightText(report.details, report.highlight);

        return `
            <tr>
                <td>${highlightedDate}</td>
                <td>${highlightedRevenue}</td>
                <td>${highlightedDetails}</td>
                <td><button class="delete-btn" onclick="xoaBaoCao('${report.date}')">Xóa</button></td>
            </tr>
        `;
    }).join("");

    // Tính tổng doanh thu theo tháng và năm
    let totalRevenueByMonth = {};
    let totalRevenueByYear = {};

    filteredList.forEach(report => {
        let [year, month] = report.date.split("-");
        if (!totalRevenueByMonth[year]) totalRevenueByMonth[year] = {};
        if (!totalRevenueByMonth[year][month]) totalRevenueByMonth[year][month] = 0;
        if (!totalRevenueByYear[year]) totalRevenueByYear[year] = 0;

        totalRevenueByMonth[year][month] += report.revenue;
        totalRevenueByYear[year] += report.revenue;
    });

    // Hiển thị tổng doanh thu
    let totalRevenueHtml = '<h3>Tổng Doanh Thu</h3>';
    for (let year in totalRevenueByMonth) {
        totalRevenueHtml += `<h4>Năm ${year}</h4>`;
        for (let month in totalRevenueByMonth[year]) {
            totalRevenueHtml += `<p>Tháng ${month}: ${new Intl.NumberFormat('vi-VN').format(totalRevenueByMonth[year][month])} VNĐ</p>`;
        }
        totalRevenueHtml += `<p><strong>Tổng năm ${year}: ${new Intl.NumberFormat('vi-VN').format(totalRevenueByYear[year])} VNĐ</strong></p>`;
    }

    document.getElementById("total-revenue").innerHTML = totalRevenueHtml;
}

function highlightText(text, keyword) {
    if (!keyword || !text.toLowerCase().includes(keyword)) return text;
    let regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(regex, `<span class="highlight">$1</span>`);
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

// Hiển thị danh sách báo cáo khi tải trang
hienThiBaoCao();