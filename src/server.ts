import express, { Application } from 'express'
import characterRouter from './routes/characterRoutes'
import checkRouter from './routes/checkRoutes'

const app: Application = express();
const port:Number = 3000;

app.disable('x-powered-by');

// 새로운 헤더로 변경
app.use((req, res, next) => {
    res.setHeader('Server', 'Lostark API is Freedom!');
    next();
})

app.use('/character', characterRouter);
app.use('/check', checkRouter);

app.get('/', (req, res) => {
    res.json({
        error: {
            code: 403,
            message: "잘못된 접근입니다."
        }
    })
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중 입니다.`);
})