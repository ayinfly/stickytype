// Combine arrays into an array of dictionaries
function dataMaker(dataPoints) {
    const scatterData = dataPoints.reverse().map((value, index) => {
        return { x: index, y: value };
    });
    return scatterData
}

function lineMaker(dataPoints) {
    const scatterData = dataMaker(dataPoints.reverse());
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
    return lineData;
}

const data = {
    datasets: [{
        label: 'wpm_total',
        data: dataMaker(graph_wpm),
        backgroundColor: 'rgb(13,110,253)'
    },
    {
      label: 'lsrl_wpm',
      data: lineMaker(graph_wpm),
      fill: false,
      borderColor: 'rgb(13,110,253,1)',
      borderWidth: 1,
      showLine: true
    },
    {
        label: 'wpm_raw',
        data: dataMaker(graph_raw),
        backgroundColor: 'rgb(220,53,69)'
    },
    {
      label: 'lsrl_raw',
      data: lineMaker(graph_raw),
      fill: false,
      borderColor: 'rgb(220,53,69,1)',
      borderWidth: 1,
      showLine: true
    },
    {
        label: 'accuracy',
        data: dataMaker(accuracy),
        backgroundColor: 'rgb(25,135,84)'
    },
    {
      label: 'lsrl_acc',
      data: lineMaker(accuracy),
      fill: false,
      borderColor: 'rgb(25,135,84,1)',
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
                    if (label.text === 'wpm_tortal') return true;
                    if (label.text === 'wpm_raw') return true;
                    if (label.text === 'accuracy') return true;
                }
            }
        }
    }
};

window.onload = function() {
    var ctx = document.getElementById('pie-chart').getContext('2d');
    window.myPie = new Chart(ctx, config);
};