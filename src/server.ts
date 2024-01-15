import express, { Application } from 'express'
import characterRouter from './routes/characterRoutes'
import checkRouter from './routes/checkRoutes'
import raidRouter from './routes/raidRoutes'
import helpRouter from './routes/helpRoutes'
import procyonTimeRouter from './routes/procyonRoutes'
import utilRouter from './routes/utilRoutes'
import path from 'path';

const app: Application = express();
const port:Number = 5000;

app.disable('x-powered-by');

// 새로운 헤더로 변경
app.use((req, res, next) => {
    res.setHeader('Server', 'Lostark API is Freedom!');
    next();
})

app.use('/character', characterRouter);
app.use('/check', checkRouter);
app.use('/reward', raidRouter);
app.use('/procyons', procyonTimeRouter);
app.use('/util', utilRouter);
app.use('/help', helpRouter);
app.use('/assets', express.static(path.join(__dirname, 'assets')));

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