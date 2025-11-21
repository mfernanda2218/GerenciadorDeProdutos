// server.ts

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { json } from 'body-parser';
import cors from 'cors';
import { createContext, Context } from '@/server/graphql/context'; 
import { typeDefs } from '@/server/graphql/typeDefs'; 
import { resolvers } from '@/server/graphql/resolvers';
// 💡 NOTA: Não precisamos mais importar 'express' ou 'expressMiddleware' aqui.

// --- Configurações ---
const PORT = process.env.PORT || 4000;
const GRAPHQL_PATH = '/graphql';

/**
 * Interface que representa a resposta do handler do Apollo Server,
 * útil para ambientes serverless ou handlers HTTP diretos.
 */
interface ApolloServerResponse {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
}

/**
 * Handler genérico para tratar a requisição HTTP.
 * Esta função substitui a necessidade do expressMiddleware.
 * * @param server O objeto ApolloServer inicializado.
 * @param req A requisição HTTP (incoming message).
 * @param res A resposta HTTP (server response).
 */
const apolloServerHandler = async (
    server: ApolloServer<Context>, 
    req: http.IncomingMessage, 
    res: http.ServerResponse
) => {
    // 1. Processa Middlewares de Segurança/Parsing (simulação)
    // Em um setup Express, isso seria feito com app.use().
    // Aqui, vamos simular o mínimo necessário para POST/JSON.
    const url = req.url?.split('?')[0];

    if (req.method === 'POST' && url === GRAPHQL_PATH) {
        
        // 2. Garante o Contexto
        const context = await createContext({ req });

        // 3. Processa o corpo da requisição
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
            chunks.push(chunk as Buffer);
        }
        const body = JSON.parse(Buffer.concat(chunks).toString());

        // 4. Executa a requisição GraphQL
        const response: ApolloServerResponse = await server.executeOperation(
            {
                query: body.query,
                variables: body.variables,
                operationName: body.operationName,
            },
            { contextValue: context }
        ) as any; // 'as any' para simplificar o tipo de retorno

        // 5. Envia a resposta HTTP
        res.writeHead(response.statusCode, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // CORS Básico
            ...response.headers
        });
        res.end(response.body);

    } else if (req.method === 'GET' && url === '/') {
        // Endpoint simples de GET para checagem de saúde
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'GraphQL API está online. Use POST /graphql' }));

    } else {
        // Método ou caminho não permitido
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};

/**
 * Inicializa e configura o servidor HTTP e o Apollo Server.
 */
async function startServer() {
    // Cria um servidor HTTP padrão
    const httpServer = http.createServer();

    // Configura o Apollo Server
    const apolloServer = new ApolloServer<Context>({
        typeDefs,
        resolvers,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            // Você pode adicionar mais plugins aqui (ex: logging, tracing)
        ],
        formatError: (formattedError, error) => {
            console.error('⚠️ GraphQL Error:', error);
            return formattedError;
        },
    });

    // Inicia o Apollo Server
    await apolloServer.start();

    // Conecta o handler do Apollo Server ao servidor HTTP
    httpServer.on('request', (req, res) => {
        // Envolve a lógica do Apollo Server e tratamento de erro
        apolloServerHandler(apolloServer, req, res).catch(err => {
            console.error('❌ HTTP Handler Error:', err);
            // Resposta de erro genérica para o cliente
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    });

    // Inicia a escuta na porta
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

    console.log(`✅ Servidor Apollo GraphQL rodando em http://localhost:${PORT}${GRAPHQL_PATH}`);
}

// Inicia o servidor
startServer().catch(err => {
    console.error('❌ Falha catastrófica ao iniciar o servidor:', err);
    process.exit(1);
});