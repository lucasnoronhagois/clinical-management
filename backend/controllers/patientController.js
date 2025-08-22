import PatientService from '../services/patientService.js';

const patientService = new PatientService();

export default class PatientController {

  async find(req, res) {
    try {
      const patient = await patientService.find(req.params.id);
      res.json(patient);
    } catch (error) {
      if (error.message === 'Paciente não encontrado.') {
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
      
      const patients = await patientService.list(filters);
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      let patient;
      
      if (Array.isArray(req.body)) {
        patient = await patientService.createMultiple(req.body);
      } else {
        patient = await patientService.create(req.body);
      }
      
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const patient = await patientService.update(req.params.id, req.body);
      res.json(patient);
    } catch (error) {
      if (error.message === 'Paciente não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await patientService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Paciente não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
} 