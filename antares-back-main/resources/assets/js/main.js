import Chart from "chart.js/auto";
import DnD from "./drop";
import './bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  window.DnD = DnD;
  const dataTable = document.querySelectorAll('.data-table');
  if (dataTable.length) {
    initDataTable();
  }
  chartInit();
  customSelect();
  handleImport();
  DnDCatalog();
  DnDProductsImage();
  DnDForm();
  dateRangeInit();
  deleteImage();
  handleFaq();
});

function initDataTable() {
  const table = $('table.data-table');
  const searchForm = $('.search-form #search');
  const perPage = $('.showing-form #showing');
  const pagination = $('.pagination');
  let dataTable = table.DataTable({
    "dom": 'rt',
    columnDefs: [
      {
        orderable: false,
        targets: 'no-sort'
      },
      // {
      //   render: DataTable.render.select(),
      //   targets: 'selectable'
      // }
    ],
    select: {
      style: 'multi',
      selector: 'td:first-child',
    },
    order: [[0, 'desc']],
    autoWidth: false
  });
}

function chartInit() {
  const chartLine = document.getElementById("lineChart");
  const chartBar = document.getElementById("barChart");
  const chartBar2 = document.getElementById("barChart2");
  const pieChart = document.getElementById("pieChart");
  
  const chartLineOptions = {
    type: 'line',
    data: {
      labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUB', 'JUL'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [14, 47, 50, 15, 49, 76, 66],
          borderColor: "#4318FF",
        },
        {
          label: 'My Second Dataset',
          data: [10, 24, 37, 42, 32, 23, 34],
          borderColor: "#6AD2FF",
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      fill: false,
      tension: 0.4,
      backgroundColor: 'transparent',
      pointBorderWidth: 1,
      pointBackgroundColor: '#ffffff',
      pointRadius: 4,
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          max: 100
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    },
  }

  const chartBarOptions = {
    type: 'bar',
    data: {
      labels: ['17', '16', '18', '19', '20', '21', '22', '23'],
      datasets: [
        {
          data: [81, 121, 40, 52, 164, 113, 26, 68],
          backgroundColor: "#775FFC",
        },
        {
          data: [135, 182, 76, 112, 199, 168, 49, 120],
          backgroundColor: "#84D9FD"
        },
        {
          data: [135, 182, 76, 112, 199, 168, 49, 120],
          backgroundColor: "#E6EDF9"
        }
      ],
    },
    options: {
      responsive: true,
      barPercentage: 0.3,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          }
        },
        y: {
          stacked: true,
          display: false,
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    },
  }

  const chartBarOptions2 = {
    type: 'bar',
    data: {
      labels: ['17', '16', '18', '19', '20', '21', '22'],
      datasets: [
        {
          data: [81, 121, 40, 52, 164, 113, 26],
          backgroundColor: "#775FFC",
        }
      ],
    },
    options: {
      responsive: true,
      barPercentage: 0.5,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          }
        },
        y: {
          stacked: true,
          display: false,
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    },
  }

  const chartPieOptions = {
    type: 'pie',
    data: {
      labels: [
        'First',
        'Second',
        'Third'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          "#4318FF",
          '#6AD2FF',
          '#EFF4FB'
        ],
        hoverOffset: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
          }
        }
      }
    },
  }

  if (chartLine) {
    new Chart(chartLine, chartLineOptions);
  }

  if (chartBar) {
    new Chart(chartBar, chartBarOptions);
  }

  if (chartBar2) {
    new Chart(chartBar2, chartBarOptions2);
  }

  if (pieChart) {
    new Chart(pieChart, chartPieOptions);
  }
}

function customSelect() {
  const select = $('.custom-select');

  if (select.length > 0) {
      select.select2({
          theme: 'custom'
      });
  }
}

function handleImport() {
  const btn = document.querySelector('#excel');
  const form = document.querySelector('form.import-form');
  if (btn) {
    btn.addEventListener('change', (e) => {
      form.submit();
    })
  }
}

function handleFaq(){
  const btn = document.querySelector('#addFaq');
  const container = $("#accordionFAQ");
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const idx = btn.dataset.row*1+1;
    let params = new URLSearchParams({
      count: idx
    });
    let url = `${btn.dataset.url}?${params}`;
    fetch(url).then(res => {
      return res.text();
    }).then(html => {
      btn.dataset.row = idx;
      container.append(html);
    });
  })
}

function DnDCatalog() {
  const Drop = new DnD(".catalogForm", {
    csrf: true,
    allowedTypes: ["application/pdf"],
    inputName: 'files[]'
  });
}

function DnDProductsImage() {
  const Drop = new DnD(".productForm", {
    csrf: true,
    inputName: 'images[]'
  });
}

function DnDForm() {
  const Drop = new DnD(".dropForm", {
    csrf: true,
  });
}

function dateRangeInit() {
  if (typeof easepick !== 'undefined') {
    const picker = new easepick.create({
      element: '#datepicker',
      css: [
        'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
      ],
      zIndex: 10,
      format: "YYYY-MM-DD HH:mm:ss",
      plugins: [
        "RangePlugin",
        "TimePlugin"
      ]
    });
  }
}

function deleteImage() {
  const btns = document.querySelectorAll('.uploadedFileDelete');
  const csrf = document.querySelector('meta[name=csrf-token]').getAttribute('content');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      fetch(btn.dataset.url, {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrf,
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          product_id: btn.dataset.product,
          image_id: btn.dataset.image
        })
      }).then(res => res.json())
      .then(json => {
        alert(json.message);
        btn.parentNode.remove();
      })
    })
  })
}