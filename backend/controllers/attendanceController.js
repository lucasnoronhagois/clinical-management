import AttendanceService from '../services/attendanceService.js';

const attendanceService = new AttendanceService();

export default class AttendanceController {
  async find(req, res) {
    try {
      const attendance = await attendanceService.find(req.params.id);
      res.json(attendance);
    } catch (error) {
      if (error.message === 'Atendimento não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      const filters = {
        company_id: req.query.company_id
      };
      
      const attendances = await attendanceService.list(filters);
      res.json(attendances);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      let attendance;
      
      if (Array.isArray(req.body)) {
        attendance = await attendanceService.createMultiple(req.body, req.user);
      } else {
        attendance = await attendanceService.create(req.body, req.user);
      }
      
      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const attendance = await attendanceService.update(req.params.id, req.body);
      res.json(attendance);
    } catch (error) {
      if (error.message === 'Atendimento não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async confirm(req, res) {
    try {
      const attendance = await attendanceService.confirm(req.params.id, req.user);
      res.json(attendance);
    } catch (error) {
      if (error.message === 'Atendimento não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async finish(req, res) {
    try {
      const attendance = await attendanceService.finish(req.params.id, req.user);
      res.json(attendance);
    } catch (error) {
      if (error.message === 'Atendimento não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await attendanceService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Atendimento não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
} 