const express = require('express');
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const port = 8080;
const prisma = new PrismaClient();

app.use(express.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Industrial Interface API',
      version: '1.0.0',
      description: 'API for connect industry and cloud',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'local server',
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// CREATE
/**
 * @swagger
 * /gateway:
 *   post:
 *     summary: Cria um novo registro de gateway PLC
 *     tags: [Gateway]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gatewayID:
 *                 type: string
 *               state:
 *                 type: string
 *             required:
 *               - gatewayID
 *               - state
 *             example:
 *               gatewayID: "PLC-001"
 *               state: "online"
 *     responses:
 *       201:
 *         description: Registro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       400:
 *         description: Erro na requisição
 */
app.post('/gateway', async (req, res) => {
  try {
    const { gatewayID, state } = req.body;

    if (!gatewayID || !state) {
      return res.status(400).json({ error: 'gatewayID e state são obrigatórios' });
    }

    const plcData = await prisma.plc_data.create({
      data: {
        gateway_id: gatewayID,
        data: state,
      },
    });

    res.status(201).json(plcData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ (todos)
/**
 * @swagger
 * /gateway:
 *   get:
 *     summary: Lista todos os registros de gateway
 *     tags: [Gateway]
 *     responses:
 *       200:
 *         description: Lista de registros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gateway'
 *       500:
 *         description: Erro no servidor
 */
app.get('/gateway', async (req, res) => {
  try {
    const gateways = await prisma.plc_data.findMany();
    res.status(200).json(gateways);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ (por ID)
/**
 * @swagger
 * /gateway/{id}:
 *   get:
 *     summary: Obtém um registro específico por ID
 *     tags: [Gateway]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       404:
 *         description: Registro não encontrado
 *       500:
 *         description: Erro no servidor
 */
app.get('/gateway/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const gateway = await prisma.plc_data.findUnique({
      where: { id: Number(id) },
    });
    
    if (!gateway) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    
    res.status(200).json(gateway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
/**
 * @swagger
 * /gateway/{id}:
 *   put:
 *     summary: Atualiza um registro existente
 *     tags: [Gateway]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gatewayID:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registro atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       404:
 *         description: Registro não encontrado
 *       400:
 *         description: Erro na requisição
 */
app.put('/gateway/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { gatewayID, state } = req.body;

    const gateway = await prisma.plc_data.update({
      where: { id: Number(id) },
      data: {
        gateway_id: gatewayID,
        data: state,
      },
    });

    res.status(200).json(gateway);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE
/**
 * @swagger
 * /gateway/{id}:
 *   delete:
 *     summary: Deleta um registro existente
 *     tags: [Gateway]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Registro deletado com sucesso
 *       404:
 *         description: Registro não encontrado
 *       400:
 *         description: Erro na requisição
 */
app.delete('/gateway/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.plc_data.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Gateway:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         gateway_id:
 *           type: string
 *         data:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - gateway_id
 *         - data
 */

const PORT = process.env.PORT || port;
app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});