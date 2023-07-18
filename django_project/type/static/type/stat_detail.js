// Combine arrays into an array of dictionaries
const combinedArray = graph_date.map((x, index) => {
  return { x: x, y: graph_wpm[index] };
});

const scatterData = graph_wpm.reverse().map((value, index) => {
    return { x: index, y: value };
});

const sumX = scatterData.reduce((sum, point) => sum + Number(point.x), 0);
const sumY = scatterData.reduce((sum, point) => sum + Number(point.y), 0);
const meanX = sumX / scatterData.length;
const meanY = sumY / scatterData.length;

const numerator = scatterData.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
const denominator = scatterData.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);

const slope = numerator / denominator;
const intercept = meanY - slope * meanX;

const lineData = scatterData.map(point => {
    return {
        x: point.x,
        y: slope * point.x + intercept
    };
});

const wpmData = scatterData;
const wpmLineData = lineData;

const data = {
    datasets: [{
        label: 'wpm_total',
        data: wpmData,
        backgroundColor: 'rgb(13,110,253)'
    },
    {
      label: 'lsrl',
      data: wpmLineData,
      fill: false,
      borderColor: 'rgb(13,110,253,1)',
      borderWidth: 1,
      showLine: true
    }],
    
};

const config = {
    type: 'scatter',
    data: data,
    options: {
        scales: {
        x: {
            type: 'linear',
            position: 'bottom'
        }
        },
        legend: {
            labels: {
                filter: function(label) {
                    if (label.text === 'wpm_total') return true;
                }
            }
        }
    }
};

window.onload = function() {
    var ctx = document.getElementById('pie-chart').getContext('2d');
    window.myPie = new Chart(ctx, config);
};