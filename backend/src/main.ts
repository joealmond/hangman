import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend requests
  app.enableCors();

  // Add this before your existing middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[DEBUG] Request received:
      - URL: ${req.url}
      - Original URL: ${req.originalUrl}
      - Path: ${req.path}
      - Method: ${req.method}
      - Headers: ${JSON.stringify(req.headers)}
    `);
    next();
  });

  // This middleware needs to come AFTER all routes are registered
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Don't handle requests that have matched routes
    if (req.route) {
      return next();
    }

    // Extract the path part if a full URL is received
    let rawPath = req.path;

    // Handle full URLs including protocols (https://...)
    if (rawPath.includes('://')) {
      try {
        const urlObj = new URL(
          rawPath.startsWith('http') ? rawPath : `http:${rawPath}`,
        );
        rawPath = urlObj.pathname;
      } catch (error) {
        // If URL parsing fails, return 404
        console.error('Invalid URL format:', error);
        return res.status(404).send('Not Found - Invalid URL format');
      }
    }

    // Sanitize path to avoid path-to-regexp parsing errors
    const path = rawPath.replace(/\/\/+/g, '/');

    // Skip paths with potential parameter syntax issues
    if (path.includes(':')) {
      return res.status(404).send('Not Found');
    }

    // Skip API routes and static assets
    if (
      path.startsWith('/api/') ||
      path === '/health' ||
      path.match(/\.(js|css|ico|png|jpg|svg|json|txt)$/)
    ) {
      return next();
    }

    // Check if this is an Angular route - fix wildcard route matching
    const isAngularRoute =
      path === '/' ||
      path === '/menu' ||
      path === '/game' ||
      path.startsWith('/game/');

    // Return the Angular app with appropriate status
    return res
      .status(isAngularRoute ? 200 : 404)
      .sendFile(
        join(
          __dirname,
          '..',
          '..',
          'frontend',
          'dist',
          '2hangman',
          'browser',
          'index.html',
        ),
      );
  });

  await app.listen(3000);
}

bootstrap().catch((err) =>
  console.error('Failed to bootstrap application:', err),
);
