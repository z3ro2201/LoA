function auctionGemChart(strItemName) {
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로스트아크 차트</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/luxon@1.26.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.0.1/dist/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@1.0.0"></script>
    <script src="https://www.chartjs.org/chartjs-chart-financial/chartjs-chart-financial.js"></script>
</head>
<body>
    <script>
    const body = document.querySelector('body');
    const url = location.href;

    axios.get('/util/getGemstoneChartData/${encodeURI(strItemName)}')
    .then(res => {
        const response = res.data;
        if(response.code === 200) {
            const urlParts = url.split('/');
            const lastPart = decodeURI(urlParts[urlParts.length - 1]);
            const itemName = lastPart.substring(1);
            const itemLevel = lastPart.substring(0,1);
            
            // 보석 데이터 모음
            const gemsRow = document.createElement('div');
            const gemsName = ['멸화', '홍염', '겁화', '작열'];
            const gemsSelector = document.createElement('select');
            gemsName.forEach(item => {
                const elementOption = document.createElement('option');
                elementOption.text = item + '의 보석';
                elementOption.value = item.substring(0,1);
                if(item.substring(0,1) === itemName) elementOption.selected = true;
                gemsSelector.append(elementOption);
            })
            gemsSelector.className = 'gemsName';


            const gemsLevel = document.createElement('select');
            for(let i = 1; i <= 10; i++) {
                const elementOption = document.createElement('option');
                elementOption.text = i + '레벨';
                elementOption.value = i;
                if(i === parseInt(itemLevel)) elementOption.selected = true;
                gemsLevel.append(elementOption)
            }
            gemsLevel.className = 'gemsLevel';

            const btnSubmit = document.createElement('button');
            btnSubmit.innerText = '변경';
            btnSubmit.addEventListener('click', changeUrl);


            gemsRow.append(gemsSelector, gemsLevel, btnSubmit);

            // Chart.js를 사용하여 차트 생성
            const chartData = response.data;

            // canvas 생성
            const eleTitle = document.createElement('h1');
            eleTitle.innerText = '(' + chartData[0].item_name + ') 전일 ~ 오늘까지의 시세차트';

            const eleCanvas = document.createElement('canvas');
            eleCanvas.id = 'gemstoneChart';

            // canvas 생성 후 body에 넣기
            const newRow1 = document.createElement('div');
            newRow1.className = 'row';
            newRow1.append(eleTitle, gemsRow, eleCanvas)
            document.querySelector('body').append(newRow1);

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

    function changeUrl() {
        const gemName = document.querySelector('.gemsName option:checked');
        const gemLevel = document.querySelector('.gemsLevel option:checked');
        const strValue = gemLevel.value + gemName.value;
        window.location.href = '/util/gemstoneChart/' + strValue;
    }
    </script>
</body>
</html>`;
    return html;
}

export default auctionGemChart;
