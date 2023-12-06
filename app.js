const firebaseConfig = {
  apiKey: 'AIzaSyChAJwbnvzi3Pau3Wh3PoAozObuVmB79dM',
  authDomain: 'iot-12256.firebaseapp.com',
  databaseURL: 'https://iot-12256-default-rtdb.firebaseio.com',
  projectId: 'iot-12256',
  storageBucket: 'iot-12256.appspot.com',
  messagingSenderId: '180620146317',
  appId: '1:180620146317:web:8438a290057fa7567c94c4',
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var dataRef = database.ref();

dataRef.once('value', function (snapshot) {
  const initialData = snapshot.val();

  document.getElementById('buzzerStatus').textContent =
    initialData.buzzerStatus;
  document.getElementById('humidity').textContent = initialData.humidity;
  document.getElementById('motionDetected').textContent =
    initialData.motionDetected;
  document.getElementById('temperature').textContent = initialData.temperature;
});

dataRef.on('value', function (snapshot) {
  const newData = snapshot.val();
  document.getElementById('buzzerStatus').textContent = newData.buzzerStatus;
  document.getElementById('humidity').textContent = newData.humidity;
  document.getElementById('motionDetected').textContent =
    newData.motionDetected;
  document.getElementById('temperature').textContent = newData.temperature;
});

function updateBuzzerStatus() {
  const buzzerControl = document.getElementById('buzzerControl');

  dataRef.once('value', function (snapshot) {
    const latestData = snapshot.val();

    latestData.buzzerStatus = buzzerControl.checked ? 'active' : 'inactive';

    dataRef.update(latestData);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const smallChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const combinedChartCanvas = document
    .getElementById('combinedChart')
    .getContext('2d');

  const combinedChart = new Chart(combinedChartCanvas, {
    type: 'bar',
    data: {
      labels: ['Data'],
      datasets: [
        {
          label: 'Humidity',
          backgroundColor: '#4CAF50',
          data: [],
        },
        {
          label: 'Temperature',
          backgroundColor: '#FFC107',
          data: [],
        },
      ],
    },
    options: {
      ...smallChartOptions,
      scales: {
        x: {
          stacked: false,
        },
        y: {
          stacked: false,
        },
      },
    },
  });

  const database = firebase.database();
  const dataRef = database.ref();

  dataRef.on('value', function (snapshot) {
    const newData = snapshot.val();

    const humidityValue = newData.humidity;
    const temperatureValue = newData.temperature;

    combinedChart.data.datasets[0].data = [humidityValue];
    combinedChart.data.datasets[1].data = [temperatureValue];
    combinedChart.update();
  });
});
