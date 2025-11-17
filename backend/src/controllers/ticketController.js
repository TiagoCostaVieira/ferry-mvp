const Ticket = require('../models/Ticket');
const Ferry = require('../models/Ferry');
const User = require('../models/User');

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const {
      ferryId,
      vehicleType,
      boardingTime,
      boardingDate,
      passengerCount = 1,
      vehiclePlate,
      notes
    } = req.body;

    // 1) Verificar se ferry existe e está ativo
    const ferry = await Ferry.findById(ferryId);
    if (!ferry || ferry.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Embarcação não encontrada ou inativa'
      });
    }

    // 2) Verificar se há capacidade
    if (!ferry.hasCapacity()) {
      return res.status(400).json({
        success: false,
        message: 'Embarcação lotada. Não há vagas disponíveis.'
      });
    }

    // 3) Verificar preço para o tipo de veículo
    const price = ferry.prices[vehicleType];
    if (!price) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de veículo inválido'
      });
    }

    // 4) Verificar se horário é válido
    const isValidTime = ferry.schedule.some(s => 
      s.isActive && s.time === boardingTime
    );
    
    if (!isValidTime) {
      return res.status(400).json({
        success: false,
        message: 'Horário de embarque inválido para esta embarcação'
      });
    }

    // 5) Criar ticket
    const ticket = await Ticket.create({
      user: req.user.id,
      ferry: ferryId,
      vehicleType,
      boardingTime,
      boardingDate: new Date(boardingDate),
      price,
      passengerCount,
      vehiclePlate,
      notes,
      status: 'pending' // Será confirmado após pagamento
    });

    // 6) Popular dados para resposta
    await ticket.populate('ferry', 'name route prices');

    res.status(201).json({
      success: true,
      message: 'Bilhete reservado com sucesso. Aguardando pagamento.',
      data: {
        ticket: {
          ...ticket.toObject(),
          total: price * passengerCount,
          ferry: {
            ...ticket.ferry.toObject(),
            formattedRoute: `${ticket.ferry.route.from} → ${ticket.ferry.route.to}`
          }
        }
      }
    });

  } catch (error) {
    console.error('Erro ao criar bilhete:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dados de entrada inválidos',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao criar bilhete',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
exports.getUserTickets = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Construir query
    const query = { user: req.user.id };
    if (status) query.status = status;

    // Executar query com paginação
    const tickets = await Ticket.find(query)
      .populate('ferry', 'name route prices currentStatus')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Contar total para paginação
    const total = await Ticket.countDocuments(query);

    // Formatar resposta
    const formattedTickets = tickets.map(ticket => ({
      ...ticket,
      ferry: {
        ...ticket.ferry,
        formattedRoute: `${ticket.ferry.route.from} → ${ticket.ferry.route.to}`
      },
      total: ticket.price * ticket.passengerCount,
      isActive: ticket.status === 'confirmed' || ticket.status === 'pending',
      canBeCancelled: ticket.status === 'pending' || ticket.status === 'confirmed'
    }));

    res.status(200).json({
      success: true,
      count: formattedTickets.length,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: formattedTickets
    });

  } catch (error) {
    console.error('Erro ao buscar bilhetes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar bilhetes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('ferry', 'name route prices currentStatus capacity');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Bilhete não encontrado'
      });
    }

    const formattedTicket = {
      ...ticket.toObject(),
      ferry: {
        ...ticket.ferry.toObject(),
        formattedRoute: `${ticket.ferry.route.from} → ${ticket.ferry.route.to}`
      },
      total: ticket.price * ticket.passengerCount,
      isActive: ticket.isActive,
      canBeCancelled: ticket.canBeCancelled,
      minutesUntilBoarding: ticket.minutesUntilBoarding
    };

    res.status(200).json({
      success: true,
      data: formattedTicket
    });

  } catch (error) {
    console.error('Erro ao buscar bilhete:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID do bilhete inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao buscar bilhete'
    });
  }
};

// @desc    Confirm ticket (after payment)
// @route   PATCH /api/tickets/:id/confirm
// @access  Private
exports.confirmTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Bilhete não encontrado'
      });
    }

    await ticket.confirm();

    res.status(200).json({
      success: true,
      message: 'Bilhete confirmado com sucesso',
      data: {
        ticketNumber: ticket.ticketNumber,
        status: ticket.status
      }
    });

  } catch (error) {
    console.error('Erro ao confirmar bilhete:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel ticket
// @route   PATCH /api/tickets/:id/cancel
// @access  Private
exports.cancelTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Bilhete não encontrado'
      });
    }

    await ticket.cancel();

    res.status(200).json({
      success: true,
      message: 'Bilhete cancelado com sucesso',
      data: {
        ticketNumber: ticket.ticketNumber,
        status: ticket.status
      }
    });

  } catch (error) {
    console.error('Erro ao cancelar bilhete:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Validate ticket by QR code (for boarding)
// @route   POST /api/tickets/validate
// @access  Private/Admin
exports.validateTicket = async (req, res) => {
  try {
    const { qrCodeData } = req.body;

    if (!qrCodeData) {
      return res.status(400).json({
        success: false,
        message: 'Dados do QR code são obrigatórios'
      });
    }

    const ticket = await Ticket.findByQRCode(qrCodeData);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Bilhete não encontrado'
      });
    }

    // Verificar se ticket pode ser usado
    if (ticket.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Bilhete não pode ser utilizado. Status: ${ticket.status}`
      });
    }

    // Verificar se não está expirado
    const boardingDateTime = new Date(ticket.boardingDate);
    const [hours, minutes] = ticket.boardingTime.split(':').map(Number);
    boardingDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const timeDiff = (boardingDateTime - now) / (1000 * 60); // diferença em minutos

    if (timeDiff < -30) { // 30 minutos de tolerância após embarque
      return res.status(400).json({
        success: false,
        message: 'Bilhete expirado'
      });
    }

    // Marcar como usado
    await ticket.use();

    // Atualizar ocupação do ferry
    const ferry = await Ferry.findById(ticket.ferry._id);
    if (ferry) {
      ferry.currentOccupancy += 1;
      await ferry.save();
    }

    res.status(200).json({
      success: true,
      message: 'Bilhete validado com sucesso',
      data: {
        ticketNumber: ticket.ticketNumber,
        passengerName: ticket.user.name,
        vehicleType: ticket.vehicleType,
        vehiclePlate: ticket.vehiclePlate,
        boardingTime: ticket.boardingTime,
        ferryName: ticket.ferry.name,
        checkedInAt: ticket.checkedInAt
      }
    });

  } catch (error) {
    console.error('Erro ao validar bilhete:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao validar bilhete'
    });
  }
};

// @desc    Get ticket statistics
// @route   GET /api/tickets/stats
// @access  Private
exports.getTicketStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Ticket.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$passengerCount'] } }
        }
      }
    ]);

    const totalTickets = await Ticket.countDocuments({ user: userId });
    const activeTickets = await Ticket.countDocuments({
      user: userId,
      status: { $in: ['pending', 'confirmed'] }
    });

    const formattedStats = {
      total: totalTickets,
      active: activeTickets,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          totalValue: stat.totalValue
        };
        return acc;
      }, {})
    };

    res.status(200).json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
};