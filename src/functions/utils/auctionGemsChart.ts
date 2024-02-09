function auctionGemChart(strItemName) {
    const html = `
    <!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로스트아크 차트</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <script>
    const body = document.querySelector('body');

    axios.get('/util/getGemstoneChartData/${encodeURI(strItemName)}')
    .then(res => {
        const response = res.data;
        if(response.code === 200) {
            // Chart.js를 사용하여 차트 생성
            const chartData = response.data;

            // canvas 생성
            const eleTitle = document.createElement('h1');
            eleTitle.innerText = '(' + chartData[0].item_name + ') 전일 ~ 오늘까지의 시세차트';

            const eleCanvas = document.createElement('canvas');
            eleCanvas.id = 'gemstoneChart';

            // canvas 생성 후 body에 넣기
            document.querySelector('body').append(eleTitle, eleCanvas);

            const labels = [];
            chartData.forEach(item => {
                const dateTimeString = item.hourly_registDateTime;
                const dateTime = new Date(dateTimeString);

                // 월, 일, 시간, 분 정보를 추출합니다.
                const month = dateTime.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
                const day = dateTime.getDate();
                const hour = dateTime.getHours();
                const minute = dateTime.getMinutes();

                // 변환된 정보를 원하는 형식으로 조합합니다.
                const formattedDateTime = month.toString().padStart(2, '0') + '월 ' + day.toString().padStart(2, '0') + '일 ' +  hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0');

                labels.push(formattedDateTime);
            })

            const ctx = document.getElementById('gemstoneChart');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '아이템 가격',
                        data: chartData.map(item=>item.item_amount),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                }
            });
        } else {
            const errMsg = document.createElement('span');
            errMsg.innerText = '문제가 발생했어요';
            body.append(errMsg);
        }
    })
    .catch( error => {
        const errMsg = document.createElement('span');
        errMsg.innerText = '문제가 발생했어요';
        body.append(errMsg);
    })
    </script>
</body>
</html>`;
    return html;
}

export default auctionGemChart;
