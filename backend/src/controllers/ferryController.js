const Ferry = require('../models/Ferry');

// @desc    Get all ferries
// @route   GET /api/ferries
// @access  Public
exports.getFerries = async (req, res) => {
  try {
    console.log('🔄 Buscando embarcações...');
    
    // Busca MUITO simples - sem virtual fields problemáticos
    const ferries = await Ferry.find({ status: 'active' })
      .select('name currentStatus capacity currentOccupancy route prices')
      .lean(); // 🔥 CRUCIAL: .lean() para objetos simples

    console.log(`✅ ${ferries.length} embarcações encontradas`);

    res.status(200).json({
      success: true,
      count: ferries.length,
      data: ferries
    });

  } catch (error) {
    console.error('❌ Erro CRÍTICO ao buscar embarcações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar embarcações',
      error: error.message // Mostrar erro completo para debug
    });
  }
};

// @desc    Get single ferry
// @route   GET /api/ferries/:id
// @access  Public
exports.getFerry = async (req, res) => {
  try {
    const ferry = await Ferry.findById(req.params.id);

    if (!ferry) {
      return res.status(404).json({
        success: false,
        message: 'Embarcação não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: ferry
    });
  } catch (error) {
    console.error('Erro ao buscar embarcação:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID da embarcação inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao buscar embarcação'
    });
  }
};

// @desc    Get ferry schedule
// @route   GET /api/ferries/:id/schedule
// @access  Public
exports.getFerrySchedule = async (req, res) => {
  try {
    const ferry = await Ferry.findById(req.params.id).select('schedule name');

    if (!ferry) {
      return res.status(404).json({
        success: false,
        message: 'Embarcação não encontrada'
      });
    }

    // Filter active schedules only
    const activeSchedules = ferry.schedule.filter(s => s.isActive);

    res.status(200).json({
      success: true,
      data: {
        ferry: ferry.name,
        schedules: activeSchedules
      }
    });
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar horários da embarcação'
    });
  }
};

// @desc    Create new ferry
// @route   POST /api/ferries
// @access  Private/Admin
exports.createFerry = async (req, res) => {
  try {
    const ferry = await Ferry.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Embarcação criada com sucesso',
      data: ferry
    });
  } catch (error) {
    console.error('Erro ao criar embarcação:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma embarcação com este nome'
      });
    }

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
      message: 'Erro ao criar embarcação'
    });
  }
};

// @desc    Update ferry
// @route   PUT /api/ferries/:id
// @access  Private/Admin
exports.updateFerry = async (req, res) => {
  try {
    let ferry = await Ferry.findById(req.params.id);

    if (!ferry) {
      return res.status(404).json({
        success: false,
        message: 'Embarcação não encontrada'
      });
    }

    ferry = await Ferry.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Embarcação atualizada com sucesso',
      data: ferry
    });
  } catch (error) {
    console.error('Erro ao atualizar embarcação:', error);
    
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
      message: 'Erro ao atualizar embarcação'
    });
  }
};

// @desc    Update ferry occupancy
// @route   PATCH /api/ferries/:id/occupancy
// @access  Private/Admin
exports.updateOccupancy = async (req, res) => {
  try {
    const { currentOccupancy } = req.body;

    const ferry = await Ferry.findById(req.params.id);

    if (!ferry) {
      return res.status(404).json({
        success: false,
        message: 'Embarcação não encontrada'
      });
    }

    ferry.currentOccupancy = currentOccupancy;
    await ferry.save();

    res.status(200).json({
      success: true,
      message: 'Ocupação atualizada com sucesso',
      data: {
        currentOccupancy: ferry.currentOccupancy,
        availableCapacity: ferry.availableCapacity
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar ocupação:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar ocupação'
    });
  }
};

// @desc    Update ferry status
// @route   PATCH /api/ferries/:id/status
// @access  Private/Admin
exports.updateStatus = async (req, res) => {
  try {
    const { currentStatus } = req.body;

    const ferry = await Ferry.findById(req.params.id);

    if (!ferry) {
      return res.status(404).json({
        success: false,
        message: 'Embarcação não encontrada'
      });
    }

    ferry.currentStatus = currentStatus;
    await ferry.save();

    res.status(200).json({
      success: true,
      message: `Status atualizado para: ${currentStatus}`,
      data: {
        currentStatus: ferry.currentStatus,
        name: ferry.name
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status da embarcação'
    });
  }
};

// @desc    Delete ferry
// @route   DELETE /api/ferries/:id
// @access  Private/Admin
exports.deleteFerry = async (req, res) => {
  try {
    const ferry = await Ferry.findById(req.params.id);

    if (!ferry) {
      return res.status(404).json({
        success: false,
        message: 'Embarcação não encontrada'
      });
    }

    await Ferry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Embarcação removida com sucesso',
      data: {}
    });
  } catch (error) {
    console.error('Erro ao remover embarcação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover embarcação'
    });
  }
};

// @desc    Search ferries by location
// @route   GET /api/ferries/search
// @access  Public
exports.searchFerries = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Origem e destino são obrigatórios'
      });
    }

    const ferries = await Ferry.findByRoute(from, to);

    res.status(200).json({
      success: true,
      count: ferries.length,
      data: ferries
    });
  } catch (error) {
    console.error('Erro na busca de embarcações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro na busca de embarcações'
    });
  }
};