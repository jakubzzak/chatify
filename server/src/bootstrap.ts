import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createServer } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as process from 'node:process';
import * as os from 'os';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './core/middlewares/logger';

export async function bootstrapMain() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  });
  app.use(new LoggerMiddleware().use);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Chatify')
    .setDescription('The Chatify API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Input your JWT token',
    })
    .addSecurityRequirements('bearer')
    .addTag('room')
    .addTag('chat')
    .addTag('message')
    .addTag('profile')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT;
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

export async function bootstrapLambda() {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  });
  app.use(eventContext());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  // Only set up Swagger in development
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Chatify')
      .setDescription('The Chatify API description')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Input your JWT token',
      })
      .addSecurityRequirements('bearer')
      .addTag('room')
      .addTag('chat')
      .addTag('message')
      .addTag('profile')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.init();

  return createServer(expressApp);
}
