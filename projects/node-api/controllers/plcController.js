const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /gateway:
 *   post:
 *     summary: Processa dados de um gateway PLC
 *     description: Recebe um JSON com informações de um gateway PLC e retorna uma confirmação de recebimento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gatewayId:
 *                 type: string
 *                 description: Identificador único do gateway
 *               status:
 *                 type: string
 *                 enum: [online, offline, error]
 *                 description: Status atual do gateway
 *               data:
 *                 type: object
 *                 description: Dados adicionais enviados pelo gateway
 *                 additionalProperties: true
 *             required:
 *               - gatewayId
 *               - status
 *             example:
 *               gatewayId: "PLC-001"
 *               status: "online"
 *               data:
 *                 temperature: 25.5
 *                 pressure: 1013
 *     responses:
 *       200:
 *         description: Dados do gateway recebidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 receivedData:
 *                   type: object
 *                   additionalProperties: true
 *               example:
 *                 message: "Dados recebidos com sucesso"
 *                 receivedData:
 *                   gatewayId: "PLC-001"
 *                   status: "online"
 *                   data:
 *                     temperature: 25.5
 *                     pressure: 1013
 *       400:
 *         description: Erro na validação dos dados enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/gateway', (req, res) => {
  try {
    const { gatewayId, status, data } = req.body;

    if (!gatewayId || !status) {
      return res.status(400).json({ error: 'gatewayId and status i mandatory' });
    }

    const receivedData = {
      gatewayId,
      status,
      data: data || {},
    };

    res.status(200).json({
      message: 'Receive data',
      receivedData,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;