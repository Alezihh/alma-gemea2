import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Flask backend URL
  const flaskUrl = process.env.FLASK_URL || 'http://localhost:8000';
  
  // Add JSON body parser for API routes
  app.use('/api', express.json());
  app.use('/api', express.urlencoded({ extended: false }));
  
  // Manual proxy to Flask using fetch
  app.post('/api/submit', async (req, res) => {
    try {
      console.log('[Proxy] POST /api/submit -> Flask /submit');
      console.log('[Proxy] Body:', JSON.stringify(req.body).slice(0, 100));
      
      const response = await fetch(`${flaskUrl}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });
      
      const data = await response.json();
      console.log('[Proxy] Flask response status:', response.status);
      res.status(response.status).json(data);
    } catch (error) {
      console.error('[Proxy] Error:', error);
      res.status(500).json({ 
        error: 'Backend service unavailable',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  app.post('/api/track-conversion/:token', async (req, res) => {
    console.log('[DEBUG] track-conversion route HIT - token:', req.params.token);
    try {
      const { token } = req.params;
      console.log(`[Proxy] POST /api/track-conversion/${token} -> Flask /track-conversion/${token}`);
      
      const response = await fetch(`${flaskUrl}/track-conversion/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      console.log('[DEBUG] Flask response received:', data);
      console.log('[DEBUG] Sending JSON response');
      res.setHeader('Content-Type', 'application/json');
      return res.status(response.status).json(data);
    } catch (error) {
      console.error('[Proxy] Error:', error);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ 
        error: 'Backend service unavailable',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  app.get('/api/result/:token', async (req, res) => {
    try {
      const { token } = req.params;
      console.log(`[Proxy] GET /api/result/${token} -> Flask /result/${token}`);
      
      const response = await fetch(`${flaskUrl}/result/${token}`);
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error('[Proxy] Error:', error);
      res.status(500).json({ 
        error: 'Backend service unavailable',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      time: new Date().toISOString(),
      service: 'alma-gemea-frontend'
    });
  });

  // Test endpoint to check Flask connectivity
  app.get('/test-flask', async (req, res) => {
    try {
      const response = await fetch(`${flaskUrl}/health`);
      const data = await response.json();
      res.json({ 
        status: 'ok', 
        flask_response: data,
        flask_url: flaskUrl
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        flask_url: flaskUrl
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
