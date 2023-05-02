import app from '@/server';
import router from './user.routes';

app.use('/user-example', router);
