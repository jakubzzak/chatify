import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as os from 'os';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule, { cors: true });

  const port = 3000;
  await app.listen(port, '0.0.0.0', () => {
    const networkInterfaces = os.networkInterfaces();
    let localIp: string | undefined;

    for (const interfaceName in networkInterfaces) {
      const interfaceInfo = networkInterfaces[interfaceName];
      if (interfaceInfo) {
        for (const net of interfaceInfo) {
          if (net.family === 'IPv4' && !net.internal) {
            localIp = net.address;
            break;
          }
        }
      }
      if (localIp) break;
    }

    logger.log(`Server running at http://localhost:${port}`);
    logger.log(`Server running at http://${localIp}:${port}`);
  });
}

bootstrap();